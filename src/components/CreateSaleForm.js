// The "Create a sale" form on the /create page. Checks the fields, then saves the sale
// (and its items) to Supabase and shows a success box with a link to the new sale.
"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./CreateSaleForm.module.css";
import pageStyles from "@/styles/page.module.css";
import buttonStyles from "@/styles/buttons.module.css";
import { createClient } from "@/lib/supabase/client";
import { uniqueTags } from "@/lib/formatSale";

// Starting value for every field: all empty
const emptyForm = {
  title: "",
  address: "",
  date: "",
  startTime: "",
  endTime: "",
  description: "",
  tags: "",
  items: "",
};

// The order fields appear on the page. Used to jump to the first field with an error.
const fieldOrder = ["title", "address", "date", "startTime", "endTime"];

// Splits text into a clean list, e.g. "a, b,, c" -> ["a", "b", "c"].
// Takes: the text and what separates the pieces ("," or a new line). Returns: an array of trimmed, non-empty strings.
function parseList(text, separator) {
  return text
    .split(separator)
    .map((value) => value.trim())
    .filter(Boolean);
}

// Checks the required fields and the time order.
// Takes: the form values. Returns: an object of error messages by field name (empty object = no errors).
function validateSale(values) {
  const errors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required.";
  }

  if (!values.address.trim()) {
    errors.address = "Address is required.";
  }

  if (!values.date) {
    errors.date = "Date is required.";
  }

  if (!values.startTime) {
    errors.startTime = "Start time is required.";
  }

  if (!values.endTime) {
    errors.endTime = "End time is required.";
  }

  // Times are "HH:MM" strings, so comparing them as text works ("09:00" < "13:00")
  if (values.startTime && values.endTime && values.endTime <= values.startTime) {
    errors.endTime = "End time must be after start time.";
  }

  return errors;
}

// Turns the raw form text into a clean sale object, ready to save.
// Takes: the form values. Returns: the sale with trimmed text, a tags array and an items array.
function buildSaleDraft(values) {
  return {
    title: values.title.trim(),
    address: values.address.trim(),
    date: values.date,
    startTime: values.startTime,
    endTime: values.endTime,
    description: values.description.trim(),
    // Tags are lowercased and repeats removed, so "Clothes, clothes" saves as just ["clothes"]
    tags: uniqueTags(parseList(values.tags, ",")),
    items: parseList(values.items, "\n"),
  };
}

// Builds the accessibility attributes that connect a field to its hint and error text,
// so screen readers read them out when the field is focused.
// Takes: the field name, whether it has a hint, and the current errors.
// Returns: { "aria-describedby", "aria-invalid" } to spread onto the input.
function describe(name, hasHint, errors) {
  const ids = [];
  if (hasHint) ids.push(`${name}-hint`);
  if (errors[name]) ids.push(`${name}-error`);
  return {
    "aria-describedby": ids.length > 0 ? ids.join(" ") : undefined,
    "aria-invalid": errors[name] ? true : undefined,
  };
}

// The whole Create a sale form, grouped into three sections, plus the result message after saving.
// Takes no inputs. Shows the form, and a success or error box after Save is pressed.
export default function CreateSaleForm() {
  const supabase = createClient();
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  // After saving: { type: "success" | "error", text, saleId? }. null = nothing to show yet.
  const [status, setStatus] = useState(null);

  // Live previews under the Tags and Items boxes, worked out from what the seller has typed so far
  const tagPreview = uniqueTags(parseList(values.tags, ","));
  const itemCount = parseList(values.items, "\n").length;

  // Updates one field as the seller types. The input's `name` says which field it is.
  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  // Runs when Save is pressed: checks the form, then saves the sale and its items.
  async function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateSale(values);
    setErrors(nextErrors);
    setStatus(null);

    if (Object.keys(nextErrors).length > 0) {
      // Move the cursor to the first field with a problem so the seller sees what to fix
      const firstBad = fieldOrder.find((name) => nextErrors[name]);
      document.getElementById(firstBad)?.focus();
      return;
    }

    const sale = buildSaleDraft(values);
    setSaving(true);

    // BACKEND: save the sale to the `sales` table and get its new id back.
    // Form names are camelCase (startTime); database columns are snake_case (start_time).
    const { data: savedSale, error: saleError } = await supabase
      .from("sales")
      .insert({
        title: sale.title,
        address: sale.address,
        sale_date: sale.date,
        start_time: sale.startTime,
        end_time: sale.endTime,
        description: sale.description || null,
        tags: sale.tags,
      })
      .select()
      .single();

    if (saleError) {
      setSaving(false);
      setStatus({ type: "error", text: "Could not save sale: " + saleError.message });
      return;
    }

    // BACKEND: save each item to the `sale_items` table, linked to the new sale by its id
    if (sale.items.length > 0) {
      const { error: itemsError } = await supabase
        .from("sale_items")
        .insert(sale.items.map((name) => ({ sale_id: savedSale.id, name })));
      if (itemsError) {
        setSaving(false);
        // The sale itself did save, so still offer the link to it
        setStatus({
          type: "error",
          text: "Sale saved, but items failed: " + itemsError.message,
          saleId: savedSale.id,
        });
        setValues(emptyForm);
        return;
      }
    }

    setSaving(false);
    setStatus({ type: "success", text: "Your sale is live. Buyers can now find it on Browse.", saleId: savedSale.id });
    setValues(emptyForm);
  }

  return (
    <div className={styles.wrapper}>
      {/* noValidate turns off the browser's own pop-up errors so ours show instead */}
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <p className={styles.requiredNote}>
          Fields marked <span className={styles.required}>*</span> are required.
        </p>

        {/* Section 1. <fieldset> groups related fields and <legend> is the group's title */}
        <fieldset className={styles.section}>
          <legend className={styles.legend}>The basics</legend>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="title">
              Title <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              id="title"
              name="title"
              type="text"
              value={values.title}
              onChange={handleChange}
              placeholder="e.g. Big family garage sale"
              {...describe("title", false, errors)}
            />
            {errors.title ? <p className={styles.error} id="title-error">{errors.title}</p> : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="address">
              Address <span className={styles.required}>*</span>
            </label>
            <p className={styles.hint} id="address-hint">
              Street, city and state, so buyers can find you.
            </p>
            <input
              className={styles.input}
              id="address"
              name="address"
              type="text"
              value={values.address}
              onChange={handleChange}
              placeholder="123 Main St, San Angelo, TX"
              {...describe("address", true, errors)}
            />
            {errors.address ? <p className={styles.error} id="address-error">{errors.address}</p> : null}
          </div>
        </fieldset>

        {/* Section 2: date and hours */}
        <fieldset className={styles.section}>
          <legend className={styles.legend}>When</legend>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="date">
              Date <span className={styles.required}>*</span>
            </label>
            <input
              className={styles.input}
              id="date"
              name="date"
              type="date"
              value={values.date}
              onChange={handleChange}
              {...describe("date", false, errors)}
            />
            {errors.date ? <p className={styles.error} id="date-error">{errors.date}</p> : null}
          </div>

          <div className={styles.timeGrid}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="startTime">
                Start time <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                id="startTime"
                name="startTime"
                type="time"
                value={values.startTime}
                onChange={handleChange}
                {...describe("startTime", false, errors)}
              />
              {errors.startTime ? (
                <p className={styles.error} id="startTime-error">{errors.startTime}</p>
              ) : null}
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="endTime">
                End time <span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                id="endTime"
                name="endTime"
                type="time"
                value={values.endTime}
                onChange={handleChange}
                {...describe("endTime", false, errors)}
              />
              {errors.endTime ? <p className={styles.error} id="endTime-error">{errors.endTime}</p> : null}
            </div>
          </div>
        </fieldset>

        {/* Section 3: optional details */}
        <fieldset className={styles.section}>
          <legend className={styles.legend}>What&apos;s for sale</legend>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="description">
              Description
            </label>
            <textarea
              className={styles.textarea}
              id="description"
              name="description"
              value={values.description}
              onChange={handleChange}
              rows={4}
              placeholder="Anything buyers should know: parking, cash only, early birds welcome..."
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="tags">
              Tags
            </label>
            <p className={styles.hint} id="tags-hint">
              Separate categories with commas, like furniture, clothes, tools.
            </p>
            <input
              className={styles.input}
              id="tags"
              name="tags"
              type="text"
              value={values.tags}
              onChange={handleChange}
              {...describe("tags", true, errors)}
            />
            {/* Shows the tags exactly as they will be saved (lowercase, no repeats) */}
            {tagPreview.length > 0 ? (
              <div className={styles.preview}>
                <span className={styles.previewLabel}>Will show as:</span>
                <div className={pageStyles.tags}>
                  {tagPreview.map((tag) => (
                    <span className={pageStyles.tag} key={tag}>{tag}</span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className={styles.field}>
            <label className={styles.label} htmlFor="items">
              Items
            </label>
            <p className={styles.hint} id="items-hint">Enter one item per line.</p>
            <textarea
              className={styles.textarea}
              id="items"
              name="items"
              value={values.items}
              onChange={handleChange}
              rows={4}
              placeholder={"Oak dining table\nKids' bikes\nBox of paperbacks"}
              {...describe("items", true, errors)}
            />
            {/* Live count so sellers can check each item is on its own line */}
            {itemCount > 0 ? (
              <p className={styles.hint}>
                {itemCount} {itemCount === 1 ? "item" : "items"} will be listed.
              </p>
            ) : null}
          </div>
        </fieldset>

        <button
          className={`${buttonStyles.button} ${buttonStyles.primary} ${styles.submit}`}
          type="submit"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save sale"}
        </button>
      </form>

      {/* Result box after saving. aria-live makes screen readers announce it when it appears */}
      <div aria-live="polite">
        {status ? (
          <div className={status.type === "error" ? pageStyles.errorState : styles.successState}>
            <p className={pageStyles.stateTitle}>
              {status.type === "error" ? "Something went wrong" : "Sale saved!"}
            </p>
            <p className={pageStyles.meta}>{status.text}</p>
            {status.saleId ? (
              <div className={pageStyles.actions}>
                <Link
                  className={`${buttonStyles.button} ${buttonStyles.primary}`}
                  href={`/sales/${status.saleId}`}
                >
                  View your sale
                </Link>
                <Link className={`${buttonStyles.button} ${buttonStyles.secondary}`} href="/browse">
                  Browse all sales
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

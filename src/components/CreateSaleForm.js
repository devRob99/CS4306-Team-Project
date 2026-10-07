"use client";

import { useState } from "react";
import styles from "./CreateSaleForm.module.css";

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

function parseList(text, separator) {
  return text
    .split(separator)
    .map((value) => value.trim())
    .filter(Boolean);
}

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

  if (values.startTime && values.endTime && values.endTime <= values.startTime) {
    errors.endTime = "End time must be after start time.";
  }

  return errors;
}

function buildSaleDraft(values) {
  return {
    title: values.title.trim(),
    address: values.address.trim(),
    date: values.date,
    startTime: values.startTime,
    endTime: values.endTime,
    description: values.description.trim(),
    tags: parseList(values.tags, ","),
    items: parseList(values.items, "\n"),
  };
}

export default function CreateSaleForm() {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saleDraft, setSaleDraft] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validateSale(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSaleDraft(null);
      return;
    }

    setSaleDraft(buildSaleDraft(values));
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit} noValidate>
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
          />
          {errors.title ? <p className={styles.error}>{errors.title}</p> : null}
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="address">
            Address <span className={styles.required}>*</span>
          </label>
          <input
            className={styles.input}
            id="address"
            name="address"
            type="text"
            value={values.address}
            onChange={handleChange}
            placeholder="Street, city, state"
          />
          {errors.address ? <p className={styles.error}>{errors.address}</p> : null}
        </div>

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
          />
          {errors.date ? <p className={styles.error}>{errors.date}</p> : null}
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
            />
            {errors.startTime ? (
              <p className={styles.error}>{errors.startTime}</p>
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
            />
            {errors.endTime ? <p className={styles.error}>{errors.endTime}</p> : null}
          </div>
        </div>

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
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="tags">
            Tags
          </label>
          <p className={styles.hint}>
            Separate categories with commas, like furniture, clothes, tools.
          </p>
          <input
            className={styles.input}
            id="tags"
            name="tags"
            type="text"
            value={values.tags}
            onChange={handleChange}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label} htmlFor="items">
            Items
          </label>
          <p className={styles.hint}>Enter one item per line.</p>
          <textarea
            className={styles.textarea}
            id="items"
            name="items"
            value={values.items}
            onChange={handleChange}
            rows={4}
          />
        </div>

        <button className={styles.submit} type="submit">
          Preview sale
        </button>
      </form>

      {saleDraft ? (
        <section className={styles.preview} aria-live="polite">
          <h2 className={styles.previewTitle}>Sale draft looks valid</h2>
          <p className={styles.previewText}>
            This is only a frontend preview. The sale has not been saved.
          </p>
          <pre className={styles.previewCode}>{JSON.stringify(saleDraft, null, 2)}</pre>
        </section>
      ) : null}
    </div>
  );
}

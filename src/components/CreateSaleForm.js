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

function parseTags(text) {
  return text
    .split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
}

function parseItems(text) {
  return text
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function validate(values) {
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

export default function CreateSaleForm() {
  const [values, setValues] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [submittedSale, setSubmittedSale] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = validate(values);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmittedSale(null);
      return;
    }

    // This object is the frontend "sale" shape.
    // A backend/database will later store it and add id + created_at.
    setSubmittedSale({
      title: values.title.trim(),
      address: values.address.trim(),
      date: values.date,
      startTime: values.startTime,
      endTime: values.endTime,
      description: values.description.trim(),
      tags: parseTags(values.tags),
      items: parseItems(values.items),
    });
  }

  return (
    <div className={styles.page}>
      <a className={styles.backLink} href="/">
        Back to home
      </a>
      <h1 className={styles.title}>Create a sale</h1>
      <p className={styles.intro}>
        Fill in the listing details. Required fields are marked with an asterisk.
        Posting only checks the form for now — nothing is saved to a database yet.
      </p>

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
          {errors.address ? (
            <p className={styles.error}>{errors.address}</p>
          ) : null}
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

        <div className={styles.timeRow}>
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
            {errors.endTime ? (
              <p className={styles.error}>{errors.endTime}</p>
            ) : null}
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
            Categories for the whole sale, separated by commas. Example: furniture,
            clothes, tools
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
          <p className={styles.hint}>One item per line. Example: lawn mower</p>
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
          Post Sale
        </button>
      </form>

      {submittedSale ? (
        <div className={styles.success}>
          <h2 className={styles.successTitle}>Form looks valid</h2>
          <p>
            This is the data a backend would receive later. ID and created date
            are not included because the database will generate those.
          </p>
          <pre className={styles.preview}>
            {JSON.stringify(submittedSale, null, 2)}
          </pre>
        </div>
      ) : null}
    </div>
  );
}

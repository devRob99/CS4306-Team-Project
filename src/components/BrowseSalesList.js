// Search, filters and the grid of sale cards on the Browse page (src/app/browse/page.js).
// "use client" is needed because the filters react to typing. The server page loads the
// sales from Supabase and passes them in, so this component never talks to the database.
"use client";

import { useMemo, useState } from "react";
import pageStyles from "@/styles/page.module.css";
import styles from "./BrowseSalesList.module.css";
import SaleCard from "./SaleCard";
import { uniqueTags } from "@/lib/formatSale";

// Shows the search and filter fields, a "Showing X of Y" count, and a card for each matching sale.
// Takes: `sales`, the array of sale rows loaded by the Browse server page.
export default function BrowseSalesList({ sales }) {
  // What the user has typed or picked in each filter. "" means that filter is off.
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [tag, setTag] = useState("");

  // Every tag used by any sale, without repeats and in A-Z order, for the Tag dropdown.
  // useMemo only recalculates this when `sales` changes, not on every keystroke.
  const tags = useMemo(() => {
    const names = new Set();
    sales.forEach((sale) => {
      // uniqueTags lowercases, so "Clothes" and "clothes" become one dropdown option
      uniqueTags(sale.tags).forEach((name) => names.add(name));
    });
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [sales]);

  // The sales that pass every active filter. A sale is dropped as soon as one filter rules it out.
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return sales.filter((sale) => {
      // Search looks at the title and address together, ignoring upper/lower case
      const haystack = `${sale.title} ${sale.address}`.toLowerCase();
      if (needle && !haystack.includes(needle)) return false;
      if (date && sale.sale_date !== date) return false;
      // Compare against the cleaned-up tags so it matches the lowercase dropdown options
      if (tag && !uniqueTags(sale.tags).includes(tag)) return false;
      return true;
    });
  }, [sales, query, date, tag]);

  const filtersActive = Boolean(query.trim() || date || tag);

  // Resets every filter so all sales show again.
  function clearFilters() {
    setQuery("");
    setDate("");
    setTag("");
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.filters}>
        <label className={styles.field}>
          <span className={styles.label}>Search</span>
          <input
            className={styles.input}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Title or address"
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Date</span>
          <input
            className={styles.input}
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </label>
        <label className={styles.field}>
          <span className={styles.label}>Tag</span>
          <select
            className={styles.input}
            value={tag}
            onChange={(event) => setTag(event.target.value)}
          >
            <option value="">All tags</option>
            {tags.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>
        {filtersActive ? (
          <button className={styles.clear} type="button" onClick={clearFilters}>
            Clear filters
          </button>
        ) : null}
      </div>

      {/* aria-live makes screen readers announce the new count when the filters change */}
      <p className={styles.count} aria-live="polite">
        Showing {filtered.length} of {sales.length} {sales.length === 1 ? "sale" : "sales"}
      </p>

      {filtered.length === 0 ? (
        <div className={pageStyles.emptyState}>
          <p className={pageStyles.stateTitle}>No sales match your filters.</p>
          <p className={pageStyles.meta}>Try a different search, or clear the filters to see every sale.</p>
        </div>
      ) : (
        <ul className={styles.grid}>
          {filtered.map((sale) => (
            <li key={sale.id}>
              <SaleCard sale={sale} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

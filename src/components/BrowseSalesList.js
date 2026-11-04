"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import pageStyles from "@/styles/page.module.css";
import styles from "./BrowseSalesList.module.css";

function formatClock(value) {
  if (!value) return "";
  return value.slice(0, 5);
}

export default function BrowseSalesList({ sales }) {
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  const [tag, setTag] = useState("");

  const tags = useMemo(() => {
    const names = new Set();
    sales.forEach((sale) => {
      sale.tags?.forEach((name) => names.add(name));
    });
    return [...names].sort((a, b) => a.localeCompare(b));
  }, [sales]);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return sales.filter((sale) => {
      const haystack = `${sale.title} ${sale.address}`.toLowerCase();
      if (needle && !haystack.includes(needle)) return false;
      if (date && sale.sale_date !== date) return false;
      if (tag && !sale.tags?.includes(tag)) return false;
      return true;
    });
  }, [sales, query, date, tag]);

  const filtersActive = Boolean(query.trim() || date || tag);

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

      {filtered.length === 0 ? (
        <p className={pageStyles.meta}>No matches.</p>
      ) : (
        <ul className={pageStyles.cardList}>
          {filtered.map((sale) => (
            <li className={pageStyles.card} key={sale.id}>
              <Link className={pageStyles.cardTitle} href={`/sales/${sale.id}`}>
                {sale.title}
              </Link>
              <p className={pageStyles.meta}>{sale.address}</p>
              <p className={pageStyles.meta}>
                {sale.sale_date} · {formatClock(sale.start_time)} – {formatClock(sale.end_time)}
              </p>
              {sale.tags?.length > 0 ? (
                <div className={pageStyles.tags}>
                  {sale.tags.map((name) => (
                    <span className={pageStyles.tag} key={name}>
                      {name}
                    </span>
                  ))}
                </div>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

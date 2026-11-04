"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import pageStyles from "@/styles/page.module.css";
import styles from "./RoutePlanner.module.css";

function formatClock(value) {
  if (!value) return "";
  return value.slice(0, 5);
}

function compareStops(a, b) {
  const byDate = (a.sale_date || "").localeCompare(b.sale_date || "");
  if (byDate !== 0) return byDate;
  return (a.start_time || "").localeCompare(b.start_time || "");
}

export default function RoutePlanner({ sales }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const selected = useMemo(() => {
    const chosen = new Set(selectedIds);
    return sales.filter((sale) => chosen.has(sale.id)).sort(compareStops);
  }, [sales, selectedIds]);

  function toggleSale(id) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  }

  return (
    <div className={styles.layout}>
      <section>
        <h2 className={pageStyles.heading}>Pick sales</h2>
        <ul className={pageStyles.cardList}>
          {sales.map((sale) => {
            const checked = selectedIds.includes(sale.id);
            return (
              <li className={pageStyles.card} key={sale.id}>
                <div className={styles.choice}>
                  <input
                    type="checkbox"
                    checked={checked}
                    aria-label={`Include ${sale.title}`}
                    onChange={() => toggleSale(sale.id)}
                  />
                  <div>
                    <Link className={pageStyles.cardTitle} href={`/sales/${sale.id}`}>
                      {sale.title}
                    </Link>
                    <p className={pageStyles.meta}>{sale.address}</p>
                    <p className={pageStyles.meta}>
                      {sale.sale_date} · {formatClock(sale.start_time)} – {formatClock(sale.end_time)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className={styles.stops}>
        <h2 className={pageStyles.heading}>Stop list</h2>
        {selected.length < 2 ? (
          <p className={pageStyles.meta}>At least two stops are needed.</p>
        ) : (
          <ol className={styles.ordered}>
            {selected.map((sale) => (
              <li key={sale.id}>
                <Link className={pageStyles.cardTitle} href={`/sales/${sale.id}`}>
                  {sale.title}
                </Link>
                <p className={pageStyles.meta}>{sale.address}</p>
                <p className={pageStyles.meta}>
                  {sale.sale_date} · {formatClock(sale.start_time)} – {formatClock(sale.end_time)}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}

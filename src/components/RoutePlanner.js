// The stop picker on the /route page ("Plan your stops"). Buyers tick the sales they want
// to visit, and the stop list shows them in order, grouped by day.
// "use client" is needed because ticking boxes changes what's on screen. The server page
// (src/app/route/page.js) loads the sales and passes them in.
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import pageStyles from "@/styles/page.module.css";
import styles from "./RoutePlanner.module.css";
import { formatShortDate, formatTimeRange, getDateBadge } from "@/lib/formatSale";

// Sort rule for stops: earlier date first, then earlier start time on the same day.
// Takes: two sales. Returns: a negative number if `a` goes first, positive if `b` does, 0 if tied.
// Dates ("2026-11-15") and times ("09:00:00") sort correctly as plain text.
// BACKEND: LATER: replace this with the optimized route order from Roberto/Juan's algorithm.
function compareStops(a, b) {
  const byDate = (a.sale_date || "").localeCompare(b.sale_date || "");
  if (byDate !== 0) return byDate;
  return (a.start_time || "").localeCompare(b.start_time || "");
}

// Splits the sorted stops into one group per day, so each day gets its own numbered list.
// Takes: stops already sorted by compareStops.
// Returns: [{ date: "2026-11-15", stops: [...] }, ...] in the same order.
function groupByDay(stops) {
  const groups = [];
  stops.forEach((sale) => {
    const last = groups[groups.length - 1];
    // Sorted input means all sales for one day sit next to each other
    if (last && last.date === sale.sale_date) {
      last.stops.push(sale);
    } else {
      groups.push({ date: sale.sale_date, stops: [sale] });
    }
  });
  return groups;
}

// Shows the list of sales to pick from and the stop list built from the picked ones.
// Takes: `sales`, the array of sale rows loaded by the Route server page.
export default function RoutePlanner({ sales }) {
  // The ids of the sales the buyer has ticked, in the order they ticked them
  const [selectedIds, setSelectedIds] = useState([]);

  // The ticked sales, sorted into visiting order and grouped by day.
  // useMemo only redoes this when the sales or the ticks change.
  const days = useMemo(() => {
    const chosen = new Set(selectedIds);
    const sorted = sales.filter((sale) => chosen.has(sale.id)).sort(compareStops);
    return groupByDay(sorted);
  }, [sales, selectedIds]);

  // Ticks a sale if it isn't picked yet, or unticks it if it is.
  // Takes: the sale's id. Used by the checkboxes and the × buttons in the stop list.
  function toggleSale(id) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id]
    );
  }

  const count = selectedIds.length;

  return (
    <div className={styles.layout}>
      <section aria-labelledby="pick-heading">
        <h2 className={pageStyles.heading} id="pick-heading">Pick sales</h2>
        <ul className={styles.pickList}>
          {sales.map((sale) => {
            const checked = selectedIds.includes(sale.id);
            const badge = getDateBadge(sale.sale_date);
            return (
              <li
                // Picked cards get a sage border and tint so it's easy to see what's chosen
                className={`${styles.pickCard} ${checked ? styles.picked : ""}`}
                key={sale.id}
              >
                {/* The whole label is clickable, so tapping anywhere on the card ticks the box */}
                <label className={styles.choice}>
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleSale(sale.id)}
                  />
                  {badge ? (
                    <span className={styles.badge} aria-hidden="true">
                      <span className={styles.badgeSmall}>{badge.month}</span>
                      <span className={styles.badgeDay}>{badge.day}</span>
                    </span>
                  ) : null}
                  <span className={styles.info}>
                    <span className={styles.pickTitle}>{sale.title}</span>
                    <span className={styles.meta}>
                      {formatShortDate(sale.sale_date)} · {formatTimeRange(sale.start_time, sale.end_time)}
                    </span>
                    <span className={styles.meta}>{sale.address}</span>
                  </span>
                </label>
                {/* Kept outside the label so clicking it opens the sale instead of ticking the box */}
                <Link className={styles.detailsLink} href={`/sales/${sale.id}`}>
                  Details →
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      {/* aria-live makes screen readers announce changes to the stop list */}
      <section className={styles.stops} aria-labelledby="stops-heading" aria-live="polite">
        <div className={styles.stopsHeader}>
          <h2 className={pageStyles.heading} id="stops-heading">Your stops</h2>
          {count > 0 ? (
            <button className={styles.clearAll} type="button" onClick={() => setSelectedIds([])}>
              Clear all
            </button>
          ) : null}
        </div>

        {count < 2 ? (
          <div className={styles.stopsEmpty}>
            <p className={pageStyles.stateTitle}>
              {count === 0 ? "No stops yet" : "1 stop picked"}
            </p>
            <p className={pageStyles.meta}>
              Tick at least two sales to build your stop list.
            </p>
          </div>
        ) : (
          <>
            <p className={styles.summary}>
              {count} stops{days.length > 1 ? ` over ${days.length} days` : ""}, in order of start time.
            </p>

            {/* LATER: show these stops as a path on a map once sales have coordinates */}
            {days.map((day) => (
              <div className={styles.day} key={day.date}>
                <h3 className={styles.dayHeading}>{formatShortDate(day.date)}</h3>
                <ol className={styles.ordered}>
                  {day.stops.map((sale, index) => (
                    <li className={styles.stop} key={sale.id}>
                      {/* Number circle; the <ol> already tells screen readers the order */}
                      <span className={pageStyles.stepNumber} aria-hidden="true">{index + 1}</span>
                      <div className={styles.stopInfo}>
                        <Link className={styles.stopTitle} href={`/sales/${sale.id}`}>
                          {sale.title}
                        </Link>
                        <span className={styles.meta}>
                          {formatTimeRange(sale.start_time, sale.end_time)}
                        </span>
                        <span className={styles.meta}>{sale.address}</span>
                      </div>
                      <button
                        className={styles.remove}
                        type="button"
                        onClick={() => toggleSale(sale.id)}
                        aria-label={`Remove ${sale.title} from your stops`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </>
        )}
      </section>
    </div>
  );
}

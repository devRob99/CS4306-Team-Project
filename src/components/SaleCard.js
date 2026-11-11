// Card for one sale on the Browse page. BrowseSalesList.js shows one of these for each sale.

import Link from "next/link";
import pageStyles from "@/styles/page.module.css";
import styles from "./SaleCard.module.css";
import { formatTimeRange, getDateBadge, uniqueTags } from "@/lib/formatSale";

// Shows one sale: a date badge, the title (links to the detail page), address, times and tags.
// Takes: `sale`, one row from the Supabase `sales` table
// (id, title, address, sale_date, start_time, end_time, tags).
export default function SaleCard({ sale }) {
  const badge = getDateBadge(sale.sale_date);
  const timeRange = formatTimeRange(sale.start_time, sale.end_time);
  // Each tag once, even if the sale was saved with repeats (also keeps React's keys unique)
  const tags = uniqueTags(sale.tags);

  return (
    <article className={styles.card}>
      {/* LATER: replace the date badge with a photo of the sale when photos exist */}
      {badge ? (
        // <time> tells browsers and screen readers the exact date behind the short badge text
        <time className={styles.badge} dateTime={sale.sale_date}>
          <span className={styles.badgeSmall}>{badge.weekday}</span>
          <span className={styles.badgeDay}>{badge.day}</span>
          <span className={styles.badgeSmall}>{badge.month}</span>
        </time>
      ) : null}

      <div className={styles.body}>
        <h2 className={styles.title}>
          <Link className={styles.titleLink} href={`/sales/${sale.id}`}>
            {sale.title}
          </Link>
        </h2>

        <p className={styles.meta}>{sale.address}</p>
        {timeRange ? <p className={styles.meta}>{timeRange}</p> : null}

        {/* Tag pills reuse the shared .tags/.tag styles so they match the detail page */}
        {tags.length > 0 ? (
          <div className={pageStyles.tags}>
            {tags.map((name) => (
              <span className={pageStyles.tag} key={name}>
                {name}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </article>
  );
}

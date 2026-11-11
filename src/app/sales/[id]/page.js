// The /sales/[id] page: full details for one sale. [id] in the folder name means the
// sale's id comes from the URL, e.g. /sales/42. Browse cards and the Create success message link here.
import Link from "next/link";
import { notFound } from "next/navigation";
import styles from "@/styles/page.module.css";
import { createClient } from "@/lib/supabase/server";
import { formatSaleDate, formatTimeRange, uniqueTags } from "@/lib/formatSale";

export const metadata = {
  title: "Sale details | Yard Sail",
};

// Server page that loads one sale and its items from Supabase.
// Takes: `params`, which holds the id from the URL.
// Shows: a back link, the title and date, Where/When rows, description, tags and the item list.
export default async function SaleDetailPage({ params }) {
  // params is a Promise in Next.js 15+, so it has to be awaited
  const { id } = await params;
  const supabase = await createClient();

  // BACKEND: reads one row from the `sales` table. maybeSingle() gives null instead of an error when no row matches.
  const { data: sale, error } = await supabase
    .from("sales")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  // Database problem: show the error in the normal page layout so the user can still go back
  if (error) {
    return (
      <main className={styles.page}>
        <Link className={styles.backLink} href="/browse">← Back to all sales</Link>
        <div className={styles.errorState} role="alert">
          <p className={styles.stateTitle}>Could not load this sale.</p>
          <p className={styles.meta}>{error.message}</p>
        </div>
      </main>
    );
  }

  // No sale with this id: show Next.js's built-in 404 page
  if (!sale) {
    notFound();
  }

  // BACKEND: reads the items for this sale from the `sale_items` table
  const { data: items } = await supabase
    .from("sale_items")
    .select("id, name")
    .eq("sale_id", id);

  const dateText = formatSaleDate(sale.sale_date);
  const timeText = formatTimeRange(sale.start_time, sale.end_time);
  // Each tag once, even if the sale was saved with repeats
  const tags = uniqueTags(sale.tags);

  return (
    <main className={styles.page}>
      <Link className={styles.backLink} href="/browse">← Back to all sales</Link>

      <section className={styles.hero}>
        <p className={styles.eyebrow}>Sale detail</p>
        <h1 className={styles.title}>{sale.title}</h1>
        {dateText ? <p className={styles.intro}>{dateText}</p> : null}
      </section>

      <section className={styles.panel}>
        <div className={styles.detailBlock}>
          {/* <dl> is a "description list": each <dt> label (Where, When) is paired with its <dd> value */}
          <dl className={styles.facts}>
            <div className={styles.fact}>
              <dt className={styles.factLabel}>Where</dt>
              <dd className={styles.factValue}>{sale.address}</dd>
            </div>
            <div className={styles.fact}>
              <dt className={styles.factLabel}>When</dt>
              <dd className={styles.factValue}>
                {dateText}
                {timeText ? <span className={styles.factExtra}>{timeText}</span> : null}
              </dd>
            </div>
          </dl>

          {/* LATER: show this sale on a small map once the backend fills in latitude/longitude */}

          {sale.description ? (
            <div>
              <h2 className={styles.heading}>About this sale</h2>
              <p className={styles.bodyText}>{sale.description}</p>
            </div>
          ) : null}

          {tags.length > 0 ? (
            <div>
              <h2 className={styles.heading}>Tags</h2>
              <div className={styles.tags}>
                {tags.map((tag) => (
                  <span className={styles.tag} key={tag}>{tag}</span>
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <h2 className={styles.heading}>Items</h2>
            {items && items.length > 0 ? (
              <ul className={styles.itemList}>
                {items.map((item) => (
                  <li key={item.id}>{item.name}</li>
                ))}
              </ul>
            ) : (
              <p className={styles.meta}>No items listed.</p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

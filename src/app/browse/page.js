// The /browse page: loads every sale from Supabase and hands them to BrowseSalesList,
// which shows the filters and sale cards. Also shows the "no sales yet" and error messages.
import Link from "next/link";
import styles from "@/styles/page.module.css";
import buttonStyles from "@/styles/buttons.module.css";
import { createClient } from "@/lib/supabase/server";
import BrowseSalesList from "@/components/BrowseSalesList";

export const metadata = {
  title: "Browse sales | Yard Sail",
};

// Server page (runs on the server, not in the browser), so it can query Supabase before the page is sent.
// Shows: the page heading, plus either an error box, an empty box, or the sale list.
export default async function BrowseSalesPage() {
  const supabase = await createClient();

  // BACKEND: reads the `sales` table, earliest sale date first
  const { data: sales, error } = await supabase
    .from("sales")
    .select("id, title, address, sale_date, start_time, end_time, tags")
    .order("sale_date", { ascending: true });

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Buyer workflow</p>
        <h1 className={styles.title}>Browse sales</h1>
        <p className={styles.intro}>
          Search by title or address, or narrow the list by date and tag.
        </p>
      </section>

      <section className={styles.panel}>
        {/* Only one of these three shows: error, nothing saved yet, or the list */}
        {error ? (
          // role="alert" makes screen readers read the error out right away
          <div className={styles.errorState} role="alert">
            <p className={styles.stateTitle}>Could not load sales.</p>
            <p className={styles.meta}>{error.message}</p>
          </div>
        ) : null}

        {!error && sales && sales.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.stateTitle}>No sales yet.</p>
            <p className={styles.meta}>Be the first to list a yard sale in your area.</p>
            <div className={styles.actions}>
              <Link className={`${buttonStyles.button} ${buttonStyles.primary}`} href="/create">
                Create a sale
              </Link>
            </div>
          </div>
        ) : null}

        {/* The sales array moves from this server page into the client component as a prop */}
        {!error && sales && sales.length > 0 ? (
          <BrowseSalesList sales={sales} />
        ) : null}
      </section>
    </main>
  );
}

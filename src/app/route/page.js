// The /route page ("Plan your stops"): loads upcoming sales and hands them to RoutePlanner,
// where buyers tick the sales they want to visit and see them listed in order.
import Link from "next/link";
import styles from "@/styles/page.module.css";
import buttonStyles from "@/styles/buttons.module.css";
import { createClient } from "@/lib/supabase/server";
import { getTodayString } from "@/lib/formatSale";
import RoutePlanner from "@/components/RoutePlanner";

export const metadata = {
  title: "Plan your stops | Yard Sail",
};

// Server page that loads upcoming sales from Supabase. Takes no inputs.
// Shows the page heading, plus an error box, a "no upcoming sales" box, or the stop picker.
export default async function RoutePage() {
  const supabase = await createClient();

  // BACKEND: reads the `sales` table. Only sales from today onward, because there's no point
  // planning a visit to a sale that's already over. Soonest first, by date then start time.
  const { data: sales, error } = await supabase
    .from("sales")
    .select("id, title, address, sale_date, start_time, end_time, tags")
    .gte("sale_date", getTodayString())
    .order("sale_date", { ascending: true })
    .order("start_time", { ascending: true });

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>For buyers</p>
        <h1 className={styles.title}>Plan your stops</h1>
        <p className={styles.intro}>
          Tick the sales you want to visit, on any day. Your stops are listed
          by day, then by start time.
        </p>
      </section>

      <section className={styles.panel}>
        {/* Only one of these three shows: error, no upcoming sales, or the picker */}
        {error ? (
          <div className={styles.errorState} role="alert">
            <p className={styles.stateTitle}>Could not load sales.</p>
            <p className={styles.meta}>{error.message}</p>
          </div>
        ) : null}

        {!error && sales && sales.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.stateTitle}>No upcoming sales to plan yet.</p>
            <p className={styles.meta}>Check back soon, or post your own sale.</p>
            <div className={styles.actions}>
              <Link className={`${buttonStyles.button} ${buttonStyles.primary}`} href="/create">
                Create a sale
              </Link>
            </div>
          </div>
        ) : null}

        {/* The sales array moves from this server page into the client component as a prop */}
        {!error && sales && sales.length > 0 ? (
          <RoutePlanner sales={sales} />
        ) : null}
      </section>
    </main>
  );
}

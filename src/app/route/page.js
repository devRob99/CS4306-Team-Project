import styles from "@/styles/page.module.css";
import { createClient } from "@/lib/supabase/server";
import RoutePlanner from "@/components/RoutePlanner";

export const metadata = {
  title: "Route | Yard Sail",
};

export default async function RoutePage() {
  const supabase = await createClient();

  const { data: sales, error } = await supabase
    .from("sales")
    .select("id, title, address, sale_date, start_time, end_time, tags")
    .order("sale_date", { ascending: true });

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Buyer workflow</p>
        <h1 className={styles.title}>Saturday stop list</h1>
        <p className={styles.intro}>
          Choose the sales you want to visit. Selected stops are listed by date,
          then start time.
        </p>
      </section>

      <section className={styles.panel}>
        {error ? <p>Could not load sales: {error.message}</p> : null}

        {!error && sales && sales.length === 0 ? <p>No sales yet.</p> : null}

        {!error && sales && sales.length > 0 ? (
          <RoutePlanner sales={sales} />
        ) : null}
      </section>
    </main>
  );
}

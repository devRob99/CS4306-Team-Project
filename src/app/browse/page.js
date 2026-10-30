import Link from 'next/link';
import styles from "@/styles/page.module.css";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Browse sales | Yard Sail",
};

export default async function BrowseSalesPage() {
    const supabase = await createClient();

    // upcoming sales first
    const { data: sales, error } = await supabase
        .from("sales")
        .select("id, title, address, sale_date, start_time, end_time, tags")
        .order("sale_date", { ascending: true });

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Buyer workflow</p>
        <h1 className={styles.title}>Browse sales</h1>
      </section>

      <section className={styles.panel}>
          {error ? <p>Could not load sales: {error.message}</p> : null}

          {sales && sales.length === 0 ? <p>No sales yet.</p> : null}

          <ul>
              {sales?.map((sale) => (
                  <li key={sale.id}>
                      <Link href={`/sales/${sale.id}`}>{sale.title}</Link>
                      <p>{sale.address}</p>
                      <p>
                          {sale.sale_date}, {sale.start_time} - {sale.end_time}
                      </p>
                      {sale.tags?.length > 0 ? <p>Tags: {sale.tags.join(", ")}</p> : null}
                  </li>
              ))}
          </ul>
      </section>
    </main>
  );
}

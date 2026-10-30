import Link from 'next/link';
import { notFound } from 'next/navigation';
import styles from "@/styles/page.module.css";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "Sale details | Yard Sail",
};

export default async function SaleDetailPage({ params }) {
    // params is a Promise in Next.js 15+
    const {id} = await params;
    const supabase = await createClient();

    const {data: sale, error} = await supabase
        .from("sales")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
        return (
            <main className={styles.page}>
                <p>Could not load sale: {error.message}</p>
            </main>
        );
    }

    if (!sale) {
        notFound();
    }

    const {data: items} = await supabase
        .from("sale_items")
        .select("id, name")
        .eq("sale_id", id);

    return (
        <main className={styles.page}>
            <section className={styles.hero}>
                <p className={styles.eyebrow}>Sale detail</p>
                <h1 className={styles.title}>{sale.title}</h1>
            </section>

            <section className={styles.panel}>
                <p>Address: {sale.address}</p>
                <p>Date: {sale.sale_date}</p>
                <p>
                    Time: {sale.start_time} - {sale.end_time}
                </p>
                {sale.description ? <p>{sale.description}</p> : null}
                {sale.tags?.length > 0 ? <p>Tags: {sale.tags.join(", ")}</p> : null}

                <h2 className={styles.heading}>Items</h2>
                {items && items.length > 0 ? (
                    <ul>
                        {items.map((item) => (
                            <li key={item.id}>{item.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p>No items listed.</p>
                )}

                <p>
                    <Link href="/browse">Back to all sales</Link>
                </p>
            </section>
        </main>
    );
}

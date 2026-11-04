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
                <div className={styles.detailBlock}>
                    <p className={styles.meta}>{sale.address}</p>
                    <p className={styles.meta}>
                        {sale.sale_date} · {sale.start_time?.slice(0, 5)} – {sale.end_time?.slice(0, 5)}
                    </p>
                    {sale.description ? <p>{sale.description}</p> : null}
                    {sale.tags?.length > 0 ? (
                        <div className={styles.tags}>
                            {sale.tags.map((tag) => (
                                <span className={styles.tag} key={tag}>{tag}</span>
                            ))}
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

                    <Link className={styles.backLink} href="/browse">Back to all sales</Link>
                </div>
            </section>
        </main>
    );
}

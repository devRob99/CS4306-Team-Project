import styles from "@/styles/page.module.css";

export const metadata = {
  title: "Sale details | Yard Sail",
};

export default function SaleDetailPage({ params }) {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Sale detail</p>
        <h1 className={styles.title}>Sale {params.id}</h1>
        <p className={styles.intro}>
          This dynamic route will show the full details for one sale after
          Phase 4 adds mock sale lookup data.
        </p>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.heading}>Planned details</h2>
        <p className={styles.placeholder}>
          The detail page will show title, address, date, times, description,
          tags, and item listings using the same sale contract as browse and
          create.
        </p>
      </section>
    </main>
  );
}

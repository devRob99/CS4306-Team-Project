import styles from "@/styles/page.module.css";

export const metadata = {
  title: "Browse sales | Yard Sail",
};

export default function BrowseSalesPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Buyer workflow</p>
        <h1 className={styles.title}>Browse sales</h1>
        <p className={styles.intro}>
          This page will list available yard sales from mock data first, then
          later from the backend once Supabase is ready.
        </p>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.heading}>Planned next step</h2>
        <p className={styles.placeholder}>
          Phase 3 will add reusable sale cards and a separated mock data source
          so the UI can be connected to real data later without a rewrite.
        </p>
      </section>
    </main>
  );
}

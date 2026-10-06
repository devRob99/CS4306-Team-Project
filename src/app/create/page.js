import styles from "@/styles/page.module.css";

export const metadata = {
  title: "Create a sale | Yard Sail",
};

export default function CreateSalePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Seller workflow</p>
        <h1 className={styles.title}>Create a sale</h1>
        <p className={styles.intro}>
          This route is reserved for the sale form. Phase 2 will rebuild the
          validated create-sale experience from the previous prototype.
        </p>
      </section>

      <section className={styles.panel}>
        <h2 className={styles.heading}>Form contract</h2>
        <p className={styles.placeholder}>
          Required fields will be title, address, date, start time, and end
          time. Description, tags, and items will be optional. ID and created
          date will be generated later by the backend.
        </p>
      </section>
    </main>
  );
}

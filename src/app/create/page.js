import CreateSaleForm from "@/components/CreateSaleForm";
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
          Add the basic information buyers need to find your yard sale. This
          form validates the draft, but it does not save to a database yet.
        </p>
      </section>

      <section className={styles.panel}>
        <CreateSaleForm />
      </section>
    </main>
  );
}

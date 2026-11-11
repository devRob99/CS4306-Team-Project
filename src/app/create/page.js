// The /create page: heading plus the Create a sale form (src/components/CreateSaleForm.js).
import CreateSaleForm from "@/components/CreateSaleForm";
import styles from "@/styles/page.module.css";

export const metadata = {
  title: "Create a sale | Yard Sail",
};

// Takes no inputs. Shows the page heading and the form inside a panel.
// The form is a client component because it reacts to typing and saves from the browser.
export default function CreateSalePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>For sellers</p>
        <h1 className={styles.title}>Create a sale</h1>
        <p className={styles.intro}>
          Tell buyers where and when, and what you have. It only takes a minute.
        </p>
      </section>

      <section className={styles.panel}>
        <CreateSaleForm />
      </section>
    </main>
  );
}

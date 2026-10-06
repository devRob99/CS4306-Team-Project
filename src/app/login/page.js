import styles from "@/styles/page.module.css";

export const metadata = {
  title: "Log in | Yard Sail",
};

export default function LoginPage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Placeholder</p>
        <h1 className={styles.title}>Log in</h1>
        <p className={styles.intro}>
          Authentication is outside the current MVP. This placeholder preserves
          the route from the static prototype without adding auth complexity.
        </p>
      </section>
    </main>
  );
}

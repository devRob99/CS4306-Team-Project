import Link from "next/link";
import styles from "@/styles/page.module.css";

const workflowSteps = [
  "Create a sale",
  "Browse nearby sales",
  "Filter by date or tags",
  "View sale details",
  "Build a Saturday stop list",
];

const howItWorks = [
  "Sellers post a sale with a date, times, address, tags, and optional items.",
  "Buyers browse the list and filter by words, date, or tag.",
  "Open a sale to see the description and items.",
  "Pick at least two sales on the route page to see them in date and time order.",
];

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>CS 4306 Team Project</p>
        <h1 className={styles.title}>Yard Sail</h1>
        <p className={styles.intro}>
          Discover local yard sales, browse listings, and prepare a good
          route without digging through scattered social media posts.
        </p>
        <div className={styles.actions}>
          <Link className={styles.button} href="/create">
            Create a sale
          </Link>
          <Link className={`${styles.button} ${styles.secondaryButton}`} href="/browse">
            Browse sales
          </Link>
        </div>
      </section>

      <section className={styles.grid} aria-label="Project status">
        <div className={styles.panel}>
          <h2 className={styles.heading}>MVP Workflow</h2>
          <ol className={styles.list}>
            {workflowSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div className={styles.panel}>
          <h2 className={styles.heading}>How it works</h2>
          <ul className={styles.list}>
            {howItWorks.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

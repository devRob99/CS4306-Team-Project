import Link from "next/link";
import styles from "@/styles/page.module.css";

const workflowSteps = [
  "Create a sale",
  "Browse nearby sales",
  "Filter by date or tags",
  "View sale details",
  "Prepare for map and route planning",
];

const prototypeNotes = [
  "The static HTML/CSS prototype is preserved in the html/ and css/ folders.",
  "Future pages should be rebuilt as Next.js routes instead of editing raw HTML files.",
  "Supabase integration is intentionally deferred until the frontend flow is stable.",
];

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>CS 4306 Team Project</p>
        <h1 className={styles.title}>Yard Sail</h1>
        <p className={styles.intro}>
          Discover local yard sales, browse listings, and prepare a Saturday
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
          <h2 className={styles.heading}>Phase 1 Structure</h2>
          <ul className={styles.list}>
            {prototypeNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

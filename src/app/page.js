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
    <main style={styles.page}>
      <section style={styles.hero}>
        <p style={styles.eyebrow}>CS 4306 Team Project</p>
        <h1 style={styles.title}>Yard Sail</h1>
        <p style={styles.intro}>
          Discover local yard sales, browse listings, and prepare a Saturday
          route without digging through scattered social media posts.
        </p>
      </section>

      <section style={styles.grid} aria-label="Project status">
        <div style={styles.panel}>
          <h2 style={styles.heading}>MVP Workflow</h2>
          <ol style={styles.list}>
            {workflowSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>

        <div style={styles.panel}>
          <h2 style={styles.heading}>Phase 0 Status</h2>
          <ul style={styles.list}>
            {prototypeNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}

const styles = {
  page: {
    width: "100%",
    maxWidth: "64rem",
    margin: "0 auto",
    padding: "2rem 1rem 3rem",
  },
  hero: {
    padding: "2rem 0",
  },
  eyebrow: {
    marginBottom: "0.75rem",
    color: "#4f6f3f",
    fontSize: "0.9rem",
    fontWeight: 700,
    textTransform: "uppercase",
  },
  title: {
    marginBottom: "0.75rem",
    fontSize: "clamp(2.25rem, 7vw, 4rem)",
    lineHeight: 1,
  },
  intro: {
    maxWidth: "42rem",
    color: "#4b5563",
    fontSize: "1.1rem",
    lineHeight: 1.6,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(16rem, 1fr))",
    gap: "1rem",
  },
  panel: {
    padding: "1.25rem",
    border: "1px solid #d6d3c4",
    borderRadius: "8px",
    background: "#f8f7f0",
  },
  heading: {
    marginBottom: "0.75rem",
    fontSize: "1.1rem",
  },
  list: {
    display: "grid",
    gap: "0.5rem",
    paddingLeft: "1.25rem",
    color: "#374151",
    lineHeight: 1.5,
  },
};

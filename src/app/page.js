// The Home page at "/": the first page visitors see. Shows the intro and main buttons,
// a short "How it works" in three steps, and a preview of the next few upcoming sales.
import Link from "next/link";
import styles from "@/styles/page.module.css";
import buttonStyles from "@/styles/buttons.module.css";
import { createClient } from "@/lib/supabase/server";
import { getTodayString } from "@/lib/formatSale";
import SaleCard from "@/components/SaleCard";

// The three "How it works" steps. Each one links to a different page:
// two for buyers (Browse, Route) and one for sellers (Create).
const steps = [
  {
    title: "Find sales",
    text: "Browse sales near you and open any sale to see its hours, address, and items.",
    href: "/browse",
    linkText: "Browse sales",
  },
  {
    title: "Plan your stops",
    text: "Pick the sales you want to visit, any day of the week, and get them in order.",
    href: "/route",
    linkText: "Plan your stops",
  },
  {
    title: "Post your own",
    text: "Having a yard sale? List it in a minute so buyers can find it.",
    href: "/create",
    linkText: "Create a sale",
  },
];

// How many upcoming sales to preview on the Home page
const PREVIEW_COUNT = 3;

// Server page (runs on the server), so it can load the upcoming sales from Supabase before the page is sent.
// Takes no inputs. Shows the hero, the three steps, and the upcoming sales preview.
export default async function Home() {
  const supabase = await createClient();

  // BACKEND: reads the next few sales from the `sales` table. Same columns as Browse, but only
  // sales from today onward, soonest first (by date, then start time), and only the first 3.
  const { data: upcoming, error } = await supabase
    .from("sales")
    .select("id, title, address, sale_date, start_time, end_time, tags")
    .gte("sale_date", getTodayString())
    .order("sale_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(PREVIEW_COUNT);

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <p className={styles.eyebrow}>Local yard sales</p>
        <h1 className={styles.title}>Yard Sail</h1>
        <p className={styles.intro}>
          Find yard sales near you, see what they have, and plan your stops,
          all in one place instead of scattered social media posts.
        </p>
        <div className={styles.actions}>
          <Link className={`${buttonStyles.button} ${buttonStyles.primary}`} href="/browse">
            Browse sales
          </Link>
          <Link className={`${buttonStyles.button} ${buttonStyles.secondary}`} href="/create">
            Create a sale
          </Link>
        </div>
      </section>

      {/* aria-labelledby names this section after its heading for screen readers */}
      <section className={styles.section} aria-labelledby="how-it-works">
        <h2 className={styles.heading} id="how-it-works">How it works</h2>
        <ol className={styles.steps}>
          {steps.map((step, index) => (
            <li className={styles.step} key={step.title}>
              {/* The step number is decoration; the <ol> already tells screen readers the order */}
              <span className={styles.stepNumber} aria-hidden="true">{index + 1}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.meta}>{step.text}</p>
              <Link className={styles.stepLink} href={step.href}>
                {step.linkText} →
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section className={styles.section} aria-labelledby="upcoming-sales">
        {/* Heading on the left, "See all sales" link on the right */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.heading} id="upcoming-sales">Upcoming sales</h2>
          <Link className={styles.stepLink} href="/browse">See all sales →</Link>
        </div>

        {/* Only one of these three shows: error, no upcoming sales, or the cards */}
        {error ? (
          <div className={styles.errorState} role="alert">
            <p className={styles.stateTitle}>Could not load upcoming sales.</p>
            <p className={styles.meta}>{error.message}</p>
          </div>
        ) : null}

        {!error && upcoming && upcoming.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.stateTitle}>No upcoming sales yet.</p>
            <p className={styles.meta}>Having a yard sale? Post it so buyers can find it.</p>
            <div className={styles.actions}>
              <Link className={`${buttonStyles.button} ${buttonStyles.primary}`} href="/create">
                Create a sale
              </Link>
            </div>
          </div>
        ) : null}

        {!error && upcoming && upcoming.length > 0 ? (
          <ul className={styles.previewGrid}>
            {upcoming.map((sale) => (
              <li key={sale.id}>
                <SaleCard sale={sale} />
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  );
}

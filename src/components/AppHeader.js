import Link from "next/link";
import AppNav from "./AppNav";
import styles from "./AppHeader.module.css";

// Site header shown on every page: logo, site name, tagline and navigation.
// Takes no inputs.
export default function AppHeader() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link className={styles.brand} href="/">
          <span className={styles.logo} aria-hidden="true">
            YS
          </span>
          <span>
            <span className={styles.name}>Yard Sail</span>
            <span className={styles.tagline}>Local yard sales, all in one place</span>
          </span>
        </Link>
        <AppNav />
      </div>
    </header>
  );
}

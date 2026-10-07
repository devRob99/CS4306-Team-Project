import Link from "next/link";
import AppNav from "./AppNav";
import styles from "./AppHeader.module.css";

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
            <span className={styles.tagline}>Local sales, better routes</span>
          </span>
        </Link>
        <AppNav />
      </div>
    </header>
  );
}

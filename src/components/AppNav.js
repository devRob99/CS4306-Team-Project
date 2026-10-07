import Link from "next/link";
import styles from "./AppNav.module.css";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/create", label: "Sell" },
  { href: "/login", label: "Log In" },
];

export default function AppNav() {
  return (
    <nav className={styles.nav} aria-label="Primary navigation">
      {navItems.map((item) => (
        <Link className={styles.link} href={item.href} key={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

// This must be a client component because usePathname reads the URL in the browser.
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./AppNav.module.css";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/browse", label: "Browse" },
  { href: "/route", label: "Route" },
  { href: "/create", label: "Sell" },
  { href: "/login", label: "Log In" },
];

// Main navigation links in the header. Takes no inputs.
// Shows a link for each page and highlights the page you are on.
export default function AppNav() {
  const pathname = usePathname();

  return (
    <nav className={styles.nav} aria-label="Primary navigation">
      {navItems.map((item) => {
        // Exact match, or a page inside that section. Home only matches "/" exactly.
        const isCurrent = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link
            className={isCurrent ? `${styles.link} ${styles.current}` : styles.link}
            href={item.href}
            key={item.href}
            // Tells screen readers which link is the current page.
            aria-current={isCurrent ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

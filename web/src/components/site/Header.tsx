import Link from "next/link";
import styles from "./Header.module.css";
import { ThemeControl } from "./ThemeControl";

/** Only routes that have real content appear here. */
const NAV = [
  { href: "/about", label: "About" },
  { href: "/learn", label: "Learn" },
  { href: "/notes", label: "Design notes" },
  { href: "/colophon", label: "Colophon" },
];

export function Header() {
  return (
    <header className={styles.header}>
      <a className={styles.skip} href="#main">
        Skip to content
      </a>
      <Link className={styles.name} href="/">
        Shawn Oakley
      </Link>
      <nav className={styles.end} aria-label="Site">
        <ul className={styles.nav}>
          {NAV.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
        <ThemeControl />
      </nav>
    </header>
  );
}

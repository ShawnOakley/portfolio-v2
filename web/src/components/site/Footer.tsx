import { EngineVersion } from "@/components/EngineVersion";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p>Software I built. Not legal services or legal advice.</p>
      <p>
        <EngineVersion />
      </p>
    </footer>
  );
}

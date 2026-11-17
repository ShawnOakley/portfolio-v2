import type { Metadata } from "next";
import Link from "next/link";
import { graphicsExhibits, graphicsPieces } from "@/content/graphics";
import styles from "./graphics.module.css";

export const metadata: Metadata = {
  title: "Graphics",
  description:
    "A Gaussian splat viewer from work at Hover, and a 360° projection viewer of the kind rebuilt at YouVisit.",
};

export default function GraphicsPage() {
  return (
    <>
      <h1>Graphics</h1>
      <p className="lede">
        Two viewers. Gaussian splatting is work from Hover. The projection
        viewer is the kind of 360° viewer rebuilt at YouVisit. Both are separate
        from the legal tools.
      </p>
      <ul className={styles.list}>
        {graphicsExhibits.map((piece) => (
          <li key={piece.href} className={styles.item}>
            <Link className={styles.title} href={piece.href}>
              {piece.title}
            </Link>
            <p className={styles.summary}>{piece.summary}</p>
          </li>
        ))}
      </ul>
      <h2 className={styles.section}>Earlier experiments</h2>
      <p>
        These repositories are still linked. They are not embedded, and they are
        not the exhibits above.
      </p>
      <ul className={styles.list}>
        {graphicsPieces.map((piece) => (
          <li key={piece.href} className={styles.item}>
            <a className={styles.title} href={piece.href}>
              {piece.title}
            </a>
            <p className={styles.summary}>{piece.summary}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

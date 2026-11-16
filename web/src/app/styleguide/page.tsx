import type { Metadata } from "next";
import { AiBadge } from "@/components/ui/AiBadge";
import { AnnotatedText } from "@/components/ui/AnnotatedText";
import { Callout } from "@/components/ui/Callout";
import { CodeBlock } from "@/components/ui/CodeBlock";
import { DocumentFrame } from "@/components/ui/DocumentFrame";
import { Figure } from "@/components/ui/Figure";
import { Metric } from "@/components/ui/Metric";
import { SourceLink } from "@/components/ui/SourceLink";
import { StatusChip } from "@/components/ui/StatusChip";
import { STATUS_KEYS } from "@/lib/status";
import styles from "./styleguide.module.css";

export const metadata: Metadata = {
  title: "Style guide",
  description: "Every shared component on one page.",
  robots: { index: false },
};

const COLORS = [
  "paper",
  "paper-raised",
  "ink",
  "ink-soft",
  "rule",
  "rule-strong",
  "accent",
  "highlight",
];

const STEPS = [5, 4, 3, 2, 1, 0, -1];

export default function StyleGuide() {
  return (
    <>
      <h1>Style guide</h1>
      <p className="lede">
        Every shared component, for review and for automated accessibility
        checks. The examples are illustrative and are not results.
      </p>

      <section className={`wide ${styles.section}`}>
        <h2>Color</h2>
        <ul className={styles.swatches}>
          {COLORS.map((name) => (
            <li key={name}>
              <div
                className={styles.swatch}
                style={{ background: `var(--${name})` }}
              />
              {name}
            </li>
          ))}
        </ul>
      </section>

      <section className={`${styles.section} ${styles.scale}`}>
        <h2>Type scale</h2>
        {STEPS.map((step) => (
          <p key={step} style={{ fontSize: `var(--step-${step})` }}>
            Step {step}: 678 F. Supp. 3d 443
          </p>
        ))}
      </section>

      <section className={`wide ${styles.section}`}>
        <h2>Status chips</h2>
        <div className={styles.row}>
          {STATUS_KEYS.map((status) => (
            <StatusChip key={status} status={status} />
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>AI badge</h2>
        <div className={styles.stack}>
          <p>
            <AiBadge />
          </p>
          <p>
            <AiBadge model="Claude" />
          </p>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Source link</h2>
        <p>
          <SourceLink href="https://www.courtlistener.com/docket/63107798/mata-v-avianca-inc/">
            Docket, Mata v. Avianca, Inc.
          </SourceLink>
        </p>
      </section>

      <section className={`wide ${styles.section}`}>
        <h2>Metric</h2>
        <div className={styles.row}>
          <Metric label="Example at 50 items" successes={45} n={50} />
          <Metric label="Example at 500 items" successes={450} n={500} />
        </div>
      </section>

      <section className={`${styles.section} ${styles.stack}`}>
        <h2>Callouts</h2>
        <Callout>A plain note.</Callout>
        <Callout kind="limit">Something the tool does not do.</Callout>
        <Callout kind="illustration">
          This example was written by hand to explain an idea.
        </Callout>
      </section>

      <section className={styles.section}>
        <h2>Annotated text</h2>
        <p>
          <AnnotatedText
            label="Example citation"
            text="Example v. Sample, 123 F.3d 456."
            spans={[
              {
                start: 0,
                end: "Example v. Sample, 123 F.3d 456.".length,
                kind: "citation",
                id: "full",
              },
              {
                start: 0,
                end: "Example v. Sample".length,
                kind: "case",
                id: "case",
              },
            ]}
          />
        </p>
      </section>

      <section className={styles.section}>
        <h2>Document frame</h2>
        <DocumentFrame
          label="Sample filing text"
          lines={[
            <>The tolling question has been addressed by several courts.</>,
            <>
              See <mark>Example v. Sample Airlines, 123 F.3d 456</mark> (2d Cir.
              1999).
            </>,
            <>
              <mark>Id.</mark> at 460.
            </>,
          ]}
        />
      </section>

      <section className={styles.section}>
        <h2>Code block</h2>
        <CodeBlock label="Install">{"pip install citecheck"}</CodeBlock>
      </section>

      <section className={styles.section}>
        <h2>Figure</h2>
        <Figure caption="A figure holds a diagram or chart and its caption.">
          <p>Figure content</p>
        </Figure>
      </section>
    </>
  );
}

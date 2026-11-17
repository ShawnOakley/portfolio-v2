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

const section = "mt-site-7";
const heading = "mb-site-4 text-step-2";

export default function StyleGuide() {
  return (
    <>
      <h1>Style guide</h1>
      <p className="lede">
        Every shared component, for review and for automated accessibility
        checks. The examples are illustrative and are not results.
      </p>

      <section className={`wide ${section}`}>
        <h2 className={heading}>Color</h2>
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-site-3 p-0 text-step-small">
          {COLORS.map((name) => (
            <li key={name}>
              <div
                className="mb-site-1 h-12 rounded-site border border-rule"
                style={{ background: `var(--${name})` }}
              />
              {name}
            </li>
          ))}
        </ul>
      </section>

      <section className={section}>
        <h2 className={heading}>Type scale</h2>
        {STEPS.map((step) => (
          <p
            key={step}
            className="mb-site-2 font-serif leading-[1.2]"
            style={{ fontSize: `var(--step-${step})` }}
          >
            Step {step}: 678 F. Supp. 3d 443
          </p>
        ))}
      </section>

      <section className={`wide ${section}`}>
        <h2 className={heading}>Status chips</h2>
        <div className="flex flex-wrap items-start gap-x-site-4 gap-y-site-3">
          {STATUS_KEYS.map((status) => (
            <StatusChip key={status} status={status} />
          ))}
        </div>
      </section>

      <section className={section}>
        <h2 className={heading}>AI badge</h2>
        <div className="[&>*+*]:mt-site-4">
          <p>
            <AiBadge />
          </p>
          <p>
            <AiBadge model="Claude" />
          </p>
        </div>
      </section>

      <section className={section}>
        <h2 className={heading}>Source link</h2>
        <p>
          <SourceLink href="https://www.courtlistener.com/docket/63107798/mata-v-avianca-inc/">
            Docket, Mata v. Avianca, Inc.
          </SourceLink>
        </p>
      </section>

      <section className={`wide ${section}`}>
        <h2 className={heading}>Metric</h2>
        <div className="flex flex-wrap items-start gap-x-site-4 gap-y-site-3">
          <Metric label="Example at 50 items" successes={45} n={50} />
          <Metric label="Example at 500 items" successes={450} n={500} />
        </div>
      </section>

      <section className={section}>
        <h2 className={heading}>Callouts</h2>
        <div className="[&>*+*]:mt-site-4">
          <Callout>A plain note.</Callout>
          <Callout kind="limit">Something the tool does not do.</Callout>
          <Callout kind="illustration">
            This example was written by hand to explain an idea.
          </Callout>
        </div>
      </section>

      <section className={section}>
        <h2 className={heading}>Annotated text</h2>
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

      <section className={section}>
        <h2 className="mb-site-2 text-step-2">Document frame</h2>
        <p className="mb-site-4">
          A filing uses this frame: document type and numbered lines. A Learn
          page stays prose and has no line numbers.
        </p>
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

      <section className={section}>
        <h2 className={heading}>Code block</h2>
        <CodeBlock label="Install">{"pip install citecheck"}</CodeBlock>
      </section>

      <section className={section}>
        <h2 className={heading}>Figure</h2>
        <Figure caption="A figure holds a diagram or chart and its caption.">
          <p>Figure content</p>
        </Figure>
      </section>
    </>
  );
}

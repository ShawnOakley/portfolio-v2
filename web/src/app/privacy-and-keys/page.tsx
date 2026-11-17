import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/ui/Callout";

export const metadata: Metadata = {
  title: "Privacy and keys",
  description:
    "Where a CourtListener token or a model key travels. It passes through a stateless function and is not stored.",
};

const steps = [
  {
    title: "Browser memory",
    body: "The page holds the key in component state for the run. It is not written to local storage or a cookie. Closing the tab clears it. The live demo will also have a control that forgets the key.",
  },
  {
    title: "This site's API, over TLS",
    body: "Each request sends the key in a header to /api on this domain. The connection is TLS. The browser is talking to this site, not directly to CourtListener or the model provider.",
  },
  {
    title: "CourtListener or the model provider",
    body: "The API function reads the header and passes the key on for that one request. A CourtListener token goes to CourtListener. A model key goes to the provider.",
  },
  {
    title: "Discarded",
    body: "The function is stateless. It does not write the key to storage, a cookie, a log, or a database. When the request ends, the function does not keep it.",
  },
];

export default function PrivacyPage() {
  return (
    <article className="prose">
      <h1>Privacy and keys</h1>
      <p className="lede">
        A key leaves the browser. It passes through a stateless function on this
        site, over TLS, and then to CourtListener or the model provider. It is
        not stored.
      </p>
      <ol className="my-site-6 list-none p-0" aria-label="Key path">
        {steps.map((step, index) => (
          <li key={step.title} className="border-t border-rule py-site-4">
            <h2 className="m-0 flex items-baseline gap-site-3">
              <span className="font-sans text-step-0 text-ink-soft">
                {index + 1}
              </span>
              {step.title}
            </h2>
            <p className="mt-site-2">{step.body}</p>
          </li>
        ))}
      </ol>
      <Callout kind="limit">
        The live demo is not linked, so this path is the design, not yet a trace
        from the network tab. Before that demo is linked, the page will be
        checked against the requests the browser actually sends, and corrected
        if a sentence is wrong. The same decision is written in{" "}
        <Link href="/notes/where-your-key-goes">Where your key goes</Link>.
      </Callout>
    </article>
  );
}

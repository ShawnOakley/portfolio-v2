import type { Metadata } from "next";
import { Callout } from "@/components/ui/Callout";
import { SourceLink } from "@/components/ui/SourceLink";
import styles from "./failures.module.css";

export const metadata: Metadata = {
  title: "Citation failures",
  description:
    "Four ways a citation can fail, with examples from the public Mata v. Avianca opinion.",
};

const OPINION =
  "https://law.justia.com/cases/federal/district-courts/new-york/nysdce/1:2022cv01461/575368/54/";

export default function CitationFailuresPage() {
  return (
    <article className="prose">
      <h1>Citation failures</h1>
      <p className="lede">
        A citation can fail in four ways. The examples from{" "}
        <em>Mata v. Avianca, Inc.</em>, 678 F. Supp. 3d 443 (S.D.N.Y. 2023), are
        findings in that opinion. The other example is written for this page.
      </p>
      <p>
        <SourceLink href={OPINION}>
          Opinion and order, Mata v. Avianca, Inc.
        </SourceLink>
      </p>

      <h2>A case that does not exist</h2>
      <p>
        The opinion describes a filed citation,{" "}
        <em>Varghese v. China Southern Airlines Co.</em>, 925 F.3d 1339 (11th
        Cir. 2019). It states that the Clerk of the Eleventh Circuit confirmed
        the decision is not an authentic ruling of that court, and that no party
        named Varghese has appeared there since electronic filing began in 2010.
      </p>

      <h2>A real citation with the wrong case name</h2>
      <p>
        The same opinion says the cite{" "}
        <em>Holliday v. Atlantic Capital Corp.</em>, 738 F.2d 1153 (11th Cir.
        1984), does not exist. The case printed at 738 F.2d 1153 is{" "}
        <em>Gibbs v. Maxwell House</em>, 738 F.2d 1153 (11th Cir. 1984). The
        volume, reporter, and page are a real place in the books. The name is
        not the case that lives there.
      </p>

      <h2>An altered quotation</h2>
      <Callout kind="illustration">
        Written for this page. Brown v. Board of Education says “separate
        educational facilities are inherently unequal.” Adding “when the
        buildings are newer” would be a different sentence.
      </Callout>
      <p>
        The Mata opinion states that{" "}
        <em>El Al Israel Airlines, Ltd. v. Tseng</em>, 525 U.S. 155 (1999), does
        not contain quoted language, attributed to it in a filing, about the
        purpose of the Montreal Convention.
      </p>

      <h2>A real case that does not support the sentence</h2>
      <p>
        The opinion states that <em>In re Rimstat, Ltd.</em>, 212 F.3d 1039 (7th
        Cir. 2000), was offered for a point about the federal bankruptcy stay.
        The decision is about Rule 11 sanctions. It does not discuss that stay.
        The case is real, and it does not say what the sentence claimed.
      </p>
      <p className={styles.note}>
        Nothing on this page describes the people who filed the brief.
      </p>
    </article>
  );
}

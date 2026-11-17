import { IndexItem, IndexList } from "@/components/site/IndexList";

export default function Home() {
  return (
    <>
      <h1>Shawn Oakley</h1>
      <p className="lede">A portfolio of software projects.</p>
      <IndexList>
        <IndexItem
          href="/cite-checker"
          title="Legal AI"
          summary="Open-source software that checks a brief’s citations and shows its evidence. In progress."
        />
        <IndexItem
          href="/graphics"
          title="Graphics"
          summary="A Gaussian splat viewer from work at Hover, and a 360° projection viewer of the kind rebuilt at YouVisit."
        />
        <IndexItem
          href="/learn"
          title="Learn"
          summary="Pages that explain citations and evaluation. They do not describe the tools."
        />
      </IndexList>
    </>
  );
}

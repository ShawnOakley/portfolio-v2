import type { Metadata } from "next";
import { graphicsExhibits, graphicsPieces } from "@/content/graphics";
import { IndexItem, IndexList } from "@/components/site/IndexList";

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
      <IndexList>
        {graphicsExhibits.map((piece) => (
          <IndexItem
            key={piece.href}
            href={piece.href}
            title={piece.title}
            summary={piece.summary}
          />
        ))}
      </IndexList>
      <h2 className="mt-site-6 font-serif text-step-1">Earlier experiments</h2>
      <p>
        These repositories are still linked. They are not embedded, and they are
        not the exhibits above.
      </p>
      <IndexList>
        {graphicsPieces.map((piece) => (
          <IndexItem
            key={piece.href}
            href={piece.href}
            title={piece.title}
            summary={piece.summary}
            external
          />
        ))}
      </IndexList>
    </>
  );
}

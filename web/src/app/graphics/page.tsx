import type { Metadata } from "next";
import { graphicsExhibits } from "@/content/graphics";
import { IndexItem, IndexList } from "@/components/site/IndexList";

export const metadata: Metadata = {
  title: "Graphics",
  description: "A Gaussian splat viewer in the browser, from work at Hover.",
};

export default function GraphicsPage() {
  return (
    <>
      <h1>Graphics</h1>
      <p className="lede">
        A Gaussian splat viewer in the browser. I worked with splats at Hover,
        on the web modeling tools.
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
    </>
  );
}

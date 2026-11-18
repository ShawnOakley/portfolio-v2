import type { Metadata } from "next";
import { BackLink } from "@/components/site/BackLink";
import { SplatViewer } from "./SplatViewer";

export const metadata: Metadata = {
  title: "Gaussian splats",
  description:
    "A Gaussian splat viewer. The technique is work from Hover. The lion scan is by Renaud, CC BY 4.0.",
};

export default function SplatsPage() {
  return (
    <>
      <BackLink href="/graphics" label="Back to Graphics" />
      <h1>Gaussian splats</h1>
      <p className="lede">
        Gaussian splatting is work from Hover, on the web modeling tools. This
        file is not a Hover capture.
      </p>
      <SplatViewer />
      <p className="mt-site-3 text-ink-soft">
        Lion scan by <a href="https://superspl.at/user?id=rohls">Renaud</a>,{" "}
        <a href="https://superspl.at/scene/56155c3f">SuperSplat</a>,{" "}
        <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
        Drag to orbit. Arrow keys turn the view.
      </p>
    </>
  );
}

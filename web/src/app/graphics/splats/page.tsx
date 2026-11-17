import type { Metadata } from "next";
import { SplatViewer } from "./SplatViewer";
import styles from "../graphics.module.css";

export const metadata: Metadata = {
  title: "Gaussian splats",
  description:
    "A Gaussian splat viewer. The technique is work from Hover. The lion scan is by Renaud, CC BY 4.0.",
};

export default function SplatsPage() {
  return (
    <>
      <h1>Gaussian splats</h1>
      <p className="lede">
        Gaussian splatting is work from Hover, on the web modeling tools. This
        file is not a Hover capture.
      </p>
      <SplatViewer />
      <p className={styles.credit}>
        Lion scan by <a href="https://superspl.at/user?id=rohls">Renaud</a>,{" "}
        <a href="https://superspl.at/scene/56155c3f">SuperSplat</a>,{" "}
        <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>.
        Drag to orbit. Arrow keys turn the view.
      </p>
    </>
  );
}

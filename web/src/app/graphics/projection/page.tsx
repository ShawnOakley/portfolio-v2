import type { Metadata } from "next";
import { ProjectionViewer } from "./ProjectionViewer";

export const metadata: Metadata = {
  title: "Projection viewer",
  description:
    "A photograph projected from the camera that took it onto a room. The same kind of 360° viewer rebuilt at YouVisit.",
};

export default function ProjectionPage() {
  return (
    <>
      <h1>Projection viewer</h1>
      <p className="lede">
        The photograph is projected from the camera that took it. Move off that
        point and the picture slips, which is the parallax in a 360° tour. This
        is the kind of viewer rebuilt at YouVisit. The room is a stand-in.
      </p>
      <ProjectionViewer />
      <p className="mt-site-3 text-ink-soft">
        Drag to look. Arrow keys turn the view. The brown uncovered walls are
        the room where the photograph does not reach.
      </p>
    </>
  );
}

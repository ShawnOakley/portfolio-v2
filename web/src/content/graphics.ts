export type GraphicsPiece = {
  title: string;
  href: string;
  summary: string;
};

/** The two viewers on this site. */
export const graphicsExhibits: GraphicsPiece[] = [
  {
    title: "Gaussian splats",
    href: "/graphics/splats",
    summary:
      "A splat viewer. Gaussian splatting is work from Hover. The lion on the page is a CC BY scan by Renaud, not a Hover capture.",
  },
  {
    title: "Projection viewer",
    href: "/graphics/projection",
    summary:
      "A photograph projected from the camera that took it onto a room, so a short move shows parallax. The same kind of 360° viewer rebuilt at YouVisit. The room here is a stand-in.",
  },
];

/** Older repositories. They are linked, not embedded. */
export const graphicsPieces: GraphicsPiece[] = [
  {
    title: "A-Frame robot",
    href: "https://github.com/ShawnOakley/a-frame-robot",
    summary:
      "A scene built from primitives. Five spheres use an electric Shader Frog material, and that shader file is missing from the repository.",
  },
  {
    title: "3D portfolio",
    href: "https://github.com/ShawnOakley/3d_portfolio",
    summary:
      "A React Three Fiber experiment. One scene is a wireframe sphere, a solid cone, and a few white triangles, in front of an HDR sky.",
  },
  {
    title: "3D pong",
    href: "https://github.com/ShawnOakley/Pong-3D",
    summary: "A 2014 Three.js game. Two paddles, a ball, first to 7.",
  },
  {
    title: "Pixi shaders",
    href: "https://github.com/ShawnOakley/PixiJS",
    summary:
      "Fragment shaders following The Book of Shaders, chapter by chapter.",
  },
];

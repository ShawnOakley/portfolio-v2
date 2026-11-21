export type GraphicsPiece = {
  title: string;
  href: string;
  summary: string;
};

/** Viewers listed on the Graphics page. The projection viewer is unlisted until it has a real room. */
export const graphicsExhibits: GraphicsPiece[] = [
  {
    title: "Gaussian splats",
    href: "/graphics/splats",
    summary: "A Gaussian splat viewer. The lion is a CC BY scan by Renaud.",
  },
];

/** Older repositories. Not shown on the Graphics page since 2026-11-21; kept here so they can be restored. */
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

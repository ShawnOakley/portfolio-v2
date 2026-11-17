"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../graphics.module.css";

const vertexShader = /* glsl */ `
  uniform mat4 projectorMatrix;
  varying vec4 vProjector;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vProjector = projectorMatrix * world;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D photo;
  varying vec4 vProjector;
  void main() {
    vec3 ndc = vProjector.xyz / vProjector.w;
    vec2 uv = ndc.xy * 0.5 + 0.5;
    if (ndc.z < -1.0 || ndc.z > 1.0 || uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
      gl_FragColor = vec4(0.08, 0.07, 0.06, 1.0);
    } else {
      gl_FragColor = texture2D(photo, uv);
    }
  }
`;

export function ProjectionViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const yaw = useRef<(direction: number) => void>(() => {});
  const [status, setStatus] = useState("Building the stand-in room.");

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;
    let stopped = false;
    let cleanup = () => {};

    void (async () => {
      const THREE = await import("three");
      const { OrbitControls } =
        await import("three/addons/controls/OrbitControls.js");
      if (stopped || !host) return;

      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      const width = host.clientWidth || 640;
      const height = host.clientHeight || 360;
      renderer.setSize(width, height, false);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, width / height, 0.05, 20);
      camera.position.set(0.45, 1.45, 0.7);

      const projector = new THREE.PerspectiveCamera(70, 1, 0.05, 20);
      projector.position.set(0, 1.35, 0.15);
      projector.lookAt(0, 1.2, -1);
      projector.updateMatrixWorld();
      const projectorMatrix = new THREE.Matrix4().multiplyMatrices(
        projector.projectionMatrix,
        projector.matrixWorldInverse,
      );

      const source = new THREE.Scene();
      source.background = new THREE.Color(0xc8b89a);
      const wall = (color: number, x: number, y: number, z: number, ry = 0) => {
        const mesh = new THREE.Mesh(
          new THREE.PlaneGeometry(2.2, 1.6),
          new THREE.MeshBasicMaterial({ color }),
        );
        mesh.position.set(x, y, z);
        mesh.rotation.y = ry;
        source.add(mesh);
      };
      wall(0x8c4a3a, 0, 1.4, -1.8);
      wall(0x3d5a4c, -1.8, 1.4, 0, Math.PI / 2);
      wall(0xd8d2c4, 1.8, 1.4, 0, -Math.PI / 2);
      const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(4, 4),
        new THREE.MeshBasicMaterial({ color: 0x6b5344 }),
      );
      floor.rotation.x = -Math.PI / 2;
      source.add(floor);
      const frame = new THREE.Mesh(
        new THREE.PlaneGeometry(0.7, 0.9),
        new THREE.MeshBasicMaterial({ color: 0x1d4e89 }),
      );
      frame.position.set(0, 1.45, -1.79);
      source.add(frame);

      const target = new THREE.WebGLRenderTarget(1024, 1024);
      renderer.setRenderTarget(target);
      renderer.render(source, projector);
      renderer.setRenderTarget(null);

      const room = new THREE.Mesh(
        new THREE.BoxGeometry(4, 2.8, 4),
        new THREE.ShaderMaterial({
          uniforms: {
            photo: { value: target.texture },
            projectorMatrix: { value: projectorMatrix },
          },
          vertexShader,
          fragmentShader,
          side: THREE.BackSide,
          glslVersion: THREE.GLSL1,
        }),
      );
      room.position.y = 1.4;
      scene.add(room);
      scene.background = new THREE.Color(0x111111);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.target.set(0, 1.3, -0.4);
      controls.enableDamping = true;
      controls.minDistance = 0.15;
      controls.maxDistance = 1.4;
      controls.update();

      host.appendChild(renderer.domElement);
      setStatus("");

      yaw.current = (direction) => {
        const offset = camera.position.clone().sub(controls.target);
        offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), direction * 0.12);
        camera.position.copy(controls.target).add(offset);
        controls.update();
      };

      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const render = () => {
        controls.update();
        renderer.render(scene, camera);
      };
      if (reduce) {
        render();
        controls.addEventListener("change", render);
      } else {
        renderer.setAnimationLoop(render);
      }

      const onResize = () => {
        const nextWidth = host.clientWidth;
        const nextHeight = host.clientHeight;
        if (nextWidth === 0 || nextHeight === 0) return;
        camera.aspect = nextWidth / nextHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(nextWidth, nextHeight, false);
        if (reduce) render();
      };
      const observer = new ResizeObserver(onResize);
      observer.observe(host);

      cleanup = () => {
        observer.disconnect();
        controls.removeEventListener("change", render);
        renderer.setAnimationLoop(null);
        controls.dispose();
        target.dispose();
        room.geometry.dispose();
        (room.material as { dispose: () => void }).dispose();
        renderer.dispose();
        renderer.domElement.remove();
        source.traverse((object) => {
          const mesh = object as {
            geometry?: { dispose: () => void };
            material?: { dispose: () => void };
          };
          mesh.geometry?.dispose();
          mesh.material?.dispose();
        });
      };
    })();

    return () => {
      stopped = true;
      cleanup();
    };
  }, []);

  return (
    <>
      <div
        ref={mountRef}
        className={styles.stage}
        tabIndex={0}
        role="application"
        aria-label="Projected photograph of a stand-in room. Drag to look, or use the arrow keys."
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") yaw.current(1);
          if (event.key === "ArrowRight") yaw.current(-1);
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
          }
        }}
      />
      {status ? <p role="status">{status}</p> : null}
    </>
  );
}

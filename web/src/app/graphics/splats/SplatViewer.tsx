"use client";

import { useEffect, useRef, useState } from "react";
import { stageClass } from "../stage";

export function SplatViewer() {
  const mountRef = useRef<HTMLDivElement>(null);
  const yaw = useRef<(direction: number) => void>(() => {});
  const [status, setStatus] = useState("Loading the lion scan.");

  useEffect(() => {
    const host = mountRef.current;
    if (!host) return;

    let stopped = false;
    let cleanup = () => {};

    void (async () => {
      try {
        const THREE = await import("three/webgpu");
        const { SPZLoader } = await import("three/addons/loaders/SPZLoader.js");
        const { GaussianSplat } =
          await import("three/addons/objects/GaussianSplat.js");
        const { OrbitControls } =
          await import("three/addons/controls/OrbitControls.js");
        if (stopped || !host) return;

        const renderer = new THREE.WebGPURenderer({ antialias: true });
        await renderer.init();
        if (stopped) {
          renderer.dispose();
          return;
        }

        const width = host.clientWidth;
        const height = host.clientHeight;
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height, false);

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x111111);
        const camera = new THREE.PerspectiveCamera(
          50,
          width / height,
          0.01,
          100,
        );
        camera.position.set(0, 0.25, 2.2);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.target.set(0, 0.05, 0);

        const geometry = await new SPZLoader().loadAsync(
          "/graphics/lion.v3.spz",
        );
        if (stopped) {
          geometry.dispose();
          renderer.dispose();
          controls.dispose();
          return;
        }
        geometry.computeBoundingBox();
        geometry.center();
        const size = geometry.boundingBox!.getSize(new THREE.Vector3());
        const span = Math.max(size.x, size.y, size.z) || 1;
        const splats = new GaussianSplat(geometry);
        splats.scale.setScalar(1.2 / span);
        scene.add(splats);

        host.appendChild(renderer.domElement);
        setStatus("");

        yaw.current = (direction) => {
          const offset = camera.position.clone().sub(controls.target);
          offset.applyAxisAngle(new THREE.Vector3(0, 1, 0), direction * 0.15);
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
          geometry.dispose();
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch (error) {
        if (!stopped) {
          setStatus(
            error instanceof Error
              ? error.message
              : "The splat viewer failed to start.",
          );
        }
      }
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
        className={stageClass}
        tabIndex={0}
        role="application"
        aria-label="Gaussian splat of a lion. Drag to orbit, or use the arrow keys."
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

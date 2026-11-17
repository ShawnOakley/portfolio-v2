declare module "three" {
  export const GLSL1: string;
  export const BackSide: number;

  export class Vector3 {
    x: number;
    y: number;
    z: number;
    constructor(x?: number, y?: number, z?: number);
    set(x: number, y: number, z: number): this;
    clone(): Vector3;
    sub(v: Vector3): this;
    copy(v: Vector3): this;
    add(v: Vector3): this;
    applyAxisAngle(axis: Vector3, angle: number): this;
  }

  export class Color {
    constructor(color: number);
  }

  export class Matrix4 {
    multiplyMatrices(a: Matrix4, b: Matrix4): this;
  }

  export class Object3D {
    position: Vector3;
    rotation: { x: number; y: number; z: number };
    add(...objects: unknown[]): this;
    traverse(callback: (object: Mesh) => void): void;
  }

  export class Scene extends Object3D {
    background: Color | null;
  }

  export class Camera extends Object3D {
    matrixWorldInverse: Matrix4;
    projectionMatrix: Matrix4;
    updateMatrixWorld(): void;
  }

  export class PerspectiveCamera extends Camera {
    aspect: number;
    constructor(fov?: number, aspect?: number, near?: number, far?: number);
    lookAt(x: number, y: number, z: number): void;
    updateProjectionMatrix(): void;
  }

  export class BufferGeometry {
    boundingBox: { getSize(target: Vector3): Vector3 } | null;
    computeBoundingBox(): void;
    center(): void;
    dispose(): void;
  }

  export class Material {
    dispose(): void;
  }

  export class MeshBasicMaterial extends Material {
    constructor(parameters?: { color?: number });
  }

  export class ShaderMaterial extends Material {
    constructor(parameters?: object);
  }

  export class PlaneGeometry extends BufferGeometry {
    constructor(width?: number, height?: number);
  }

  export class BoxGeometry extends BufferGeometry {
    constructor(width?: number, height?: number, depth?: number);
  }

  export class Mesh extends Object3D {
    geometry: BufferGeometry;
    material: Material;
    constructor(geometry?: BufferGeometry, material?: Material);
  }

  export class WebGLRenderTarget {
    texture: object;
    constructor(width: number, height: number);
    dispose(): void;
  }

  export class WebGLRenderer {
    domElement: HTMLCanvasElement;
    constructor(parameters?: { antialias?: boolean });
    setPixelRatio(value: number): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    setRenderTarget(target: WebGLRenderTarget | null): void;
    render(scene: Object3D, camera: Camera): void;
    setAnimationLoop(callback: (() => void) | null): void;
    dispose(): void;
  }
}

declare module "three/webgpu" {
  export * from "three";
  export class WebGPURenderer {
    domElement: HTMLCanvasElement;
    constructor(parameters?: { antialias?: boolean });
    init(): Promise<void>;
    setPixelRatio(value: number): void;
    setSize(width: number, height: number, updateStyle?: boolean): void;
    render(scene: unknown, camera: unknown): void;
    setAnimationLoop(callback: (() => void) | null): void;
    dispose(): void;
  }
}

declare module "three/addons/controls/OrbitControls.js" {
  import { Vector3 } from "three";
  export class OrbitControls {
    enableDamping: boolean;
    minDistance: number;
    maxDistance: number;
    target: Vector3;
    constructor(camera: unknown, element?: HTMLElement);
    update(): void;
    dispose(): void;
    addEventListener(type: string, listener: () => void): void;
    removeEventListener(type: string, listener: () => void): void;
  }
}

declare module "three/addons/loaders/SPZLoader.js" {
  import { Vector3 } from "three";
  export class SPZLoader {
    loadAsync(url: string): Promise<{
      boundingBox: { getSize(target: Vector3): Vector3 } | null;
      computeBoundingBox(): void;
      center(): void;
      dispose(): void;
    }>;
  }
}

declare module "three/addons/objects/GaussianSplat.js" {
  export class GaussianSplat {
    scale: { setScalar(value: number): void };
    constructor(geometry: unknown);
  }
}

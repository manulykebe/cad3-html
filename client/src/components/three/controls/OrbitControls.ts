import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls as ThreeOrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class OrbitControls {
  private controls: ThreeOrbitControls;

  constructor(camera: PerspectiveCamera, domElement: HTMLElement) {
    this.controls = new ThreeOrbitControls(camera, domElement);
    this.setupControls();
  }

  private setupControls() {
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = false;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 500;
    this.controls.maxPolarAngle = Math.PI / 1.5;
  }

  public update() {
    this.controls.update();
  }

  public getTarget(): Vector3 {
    return this.controls.target;
  }

  public setTarget(target: Vector3) {
    this.controls.target.copy(target);
  }

  public setZoom(zoom: number) {
    (this.controls.object as PerspectiveCamera).zoom = zoom;
    (this.controls.object as PerspectiveCamera).updateProjectionMatrix();
  }

  public getZoom(): number {
    return (this.controls.object as PerspectiveCamera).zoom;
  }

  public dispose() {
    this.controls.dispose();
  }
}

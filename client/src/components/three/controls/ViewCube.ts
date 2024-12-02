import {
    BoxGeometry,
    Mesh,
    MeshBasicMaterial,
    Scene,
    Vector3,
    EdgesGeometry,
    LineSegments,
    LineBasicMaterial,
    PerspectiveCamera,
    Object3D,
  } from 'three';
  
  export class ViewCube {
    private cube: Object3D;
    private scene: Scene;
    private camera: PerspectiveCamera;
    private size: number;
  
    constructor(scene: Scene, camera: PerspectiveCamera, size: number = 50) {
      this.scene = scene;
      this.camera = camera;
      this.size = size;
      this.cube = new Object3D();
      this.createCube();
    }
  
    private createCube() {
      const geometry = new BoxGeometry(1, 1, 1);
      const material = new MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
      });
  
      const cube = new Mesh(geometry, material);
      
      // Add edges
      const edges = new EdgesGeometry(geometry);
      const line = new LineSegments(
        edges,
        new LineBasicMaterial({ color: 0x000000 })
      );
      
      cube.add(line);
      this.cube.add(cube);
  
      // Position in top-left corner
      this.updatePosition();
      
      this.scene.add(this.cube);
    }
  
    public updatePosition() {
      const aspect = window.innerWidth / window.innerHeight;
      const vFov = (this.camera.fov * Math.PI) / 180;
      const height = 2 * Math.tan(vFov / 2) * this.camera.position.z;
      const width = height * aspect;
  
      this.cube.position.set(
        -width / 2 + this.size / 2,
        height / 2 - this.size / 2,
        -this.camera.position.z / 2
      );
      
      this.cube.scale.setScalar(this.size);
    }
  
    public update() {
      // Make the cube always face the camera
      this.cube.quaternion.copy(this.camera.quaternion);
      this.updatePosition();
    }
  
    public dispose() {
      this.scene.remove(this.cube);
    }
  }
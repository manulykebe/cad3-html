import React, { Component } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createGeometryFromData } from './utils/geometryLoader';
import { createMeshWithMaterial } from './utils/materialHandler';

interface Cad3ViewerProps {
  data?: any;
  className?: string;
}

export class Cad3Viewer extends Component<Cad3ViewerProps> {
  private containerRef: React.RefObject<HTMLDivElement>;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private controls: OrbitControls;
  private mesh: THREE.Mesh | null;
  private animationFrameId: number | null;
  private clock: THREE.Clock;
  private initialPosition: THREE.Vector3;

  constructor(props: Cad3ViewerProps) {
    super(props);
    this.containerRef = React.createRef();
    this.animationFrameId = null;
    this.mesh = null;
    this.clock = new THREE.Clock();
    this.initialPosition = new THREE.Vector3();

    // Initialize scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xf0f0f0);

    // Initialize camera
    this.camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    this.camera.position.set(5, 5, 5);
    this.camera.lookAt(0, 0, 0);

    // Initialize renderer
    this.renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Initialize controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.setupControls();

    // Add lights
    this.setupLights();

    // Bind methods
    this.animate = this.animate.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  private setupControls(): void {
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.screenSpacePanning = true;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 50;
    this.controls.maxPolarAngle = Math.PI / 1.5;
    this.controls.enablePan = true;
    this.controls.panSpeed = 0.5;
    this.controls.rotateSpeed = 0.5;
    this.controls.zoomSpeed = 1.2;
    this.controls.enableZoom = true;
    this.controls.autoRotate = true;
    this.controls.autoRotateSpeed = 2.0;
  }

  private setupLights(): void {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(10, 10, 10);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 500;
    this.scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.3);
    fillLight.position.set(-5, 5, -5);
    this.scene.add(fillLight);

    const groundFill = new THREE.DirectionalLight(0xffffff, 0.2);
    groundFill.position.set(0, -5, 0);
    this.scene.add(groundFill);
  }

  private fitCameraToObject(mesh: THREE.Mesh, offset: number = 1.25): void {
    const boundingBox = new THREE.Box3();
    boundingBox.setFromObject(mesh);

    const center = new THREE.Vector3();
    boundingBox.getCenter(center);
    
    // Store initial position for animation
    this.initialPosition.copy(center);

    const size = new THREE.Vector3();
    boundingBox.getSize(size);

    const maxDim = Math.max(size.x, size.y, size.z);
    const fov = this.camera.fov * (Math.PI / 180);
    const cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * offset;

    const minZ = boundingBox.min.z;
    const cameraToFarEdge = (minZ < 0) ? -minZ + cameraZ : cameraZ - minZ;

    this.camera.position.set(
      center.x + cameraZ,
      center.y + cameraZ,
      center.z + cameraZ
    );
    this.camera.lookAt(center);
    this.camera.far = cameraToFarEdge * 3;
    this.camera.updateProjectionMatrix();

    this.controls.target.copy(center);
    this.controls.minDistance = cameraZ * 0.5;
    this.controls.maxDistance = cameraZ * 2;
    this.controls.update();
  }

  private animate(): void {
    this.animationFrameId = requestAnimationFrame(this.animate);

    // Update controls
    this.controls.update();

    if (this.mesh) {
      const time = this.clock.getElapsedTime();
      
      // Smooth floating animation using the initial position as base
      this.mesh.position.y = this.initialPosition.y + Math.sin(time * 2) * 0.1;
      
      // Optional: Add subtle rotation
      // this.mesh.rotation.y = time * 0.1;
    }

    // Render scene
    this.renderer.render(this.scene, this.camera);
  }

  private handleResize(): void {
    if (!this.containerRef.current) return;

    const width = this.containerRef.current.clientWidth;
    const height = this.containerRef.current.clientHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height, false);
    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  private updateScene(): void {
    const { data } = this.props;
    if (!data) return;

    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
      this.mesh = null;
    }

    try {
      const geometry = createGeometryFromData(data);
      const mesh = createMeshWithMaterial(geometry);
      
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      
      this.scene.add(mesh);
      this.mesh = mesh;
      this.fitCameraToObject(mesh);

      // Reset clock
      this.clock.start();
    } catch (error) {
      console.error('Error creating 3D model:', error);
    }
  }

  componentDidMount(): void {
    if (!this.containerRef.current) return;

    const width = this.containerRef.current.clientWidth;
    const height = this.containerRef.current.clientHeight;
    
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.containerRef.current.appendChild(this.renderer.domElement);

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    window.addEventListener('resize', this.handleResize);

    this.clock.start();
    this.animate();
    this.updateScene();
  }

  componentDidUpdate(prevProps: Cad3ViewerProps): void {
    if (prevProps.data !== this.props.data) {
      this.updateScene();
    }
  }

  componentWillUnmount(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
    }

    window.removeEventListener('resize', this.handleResize);

    if (this.mesh) {
      this.scene.remove(this.mesh);
      this.mesh.geometry.dispose();
    }

    this.controls.dispose();
    this.renderer.dispose();

    if (this.containerRef.current) {
      this.containerRef.current.removeChild(this.renderer.domElement);
    }
  }

  render(): React.ReactNode {
    return (
      <div 
        ref={this.containerRef}
        className={`w-full h-full ${this.props.className || ''}`}
        style={{ position: 'relative' }}
      />
    );
  }
}
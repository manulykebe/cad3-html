import { useEffect, useRef } from 'react';
import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  SpotLight,
  HemisphereLight,
  DirectionalLight,
  Color,
  MeshPhongMaterial,
  Mesh,
  Vector3,
} from 'three';
import { createGeometryFromData } from '../utils/geometryLoader';
import { createMeshWithMaterial } from '../utils/materialHandler';

export const useThreeScene = (containerRef: React.RefObject<HTMLDivElement>, cadData: any) => {
  const sceneRef = useRef<Scene>();
  const rendererRef = useRef<WebGLRenderer>();
  const cameraRef = useRef<PerspectiveCamera>();
  const meshRef = useRef<Mesh>();

  useEffect(() => {
    if (!containerRef.current || !cadData) {
      console.log('Missing container or data:', {container: !!containerRef.current, data: !!cadData});
      return;
    }

    // Get container dimensions
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Scene setup
    const scene = new Scene();
    scene.background = new Color(0xEEF0F0);
    sceneRef.current = scene;

    // Renderer setup
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    rendererRef.current = renderer;

    // Add renderer to DOM
    containerRef.current.appendChild(renderer.domElement);

    // Create geometry and mesh
    try {
      const geometry = createGeometryFromData(cadData);
      geometry.computeBoundingSphere();

      const mesh = createMeshWithMaterial(geometry);
      meshRef.current = mesh;
      scene.add(mesh);

      // Camera
      const radius = geometry.boundingSphere?.radius || 10;
      const camera = new PerspectiveCamera(45, width/height, 0.1, radius * 10);
      camera.position.set(radius*2, radius*2, radius*2);
      camera.lookAt(0, 0, 0);
      cameraRef.current = camera;

      // Lights
      const ambientLight = new HemisphereLight(0xffffff, 0x444444);
      scene.add(ambientLight);

      const light = new DirectionalLight(0xffffff, 1);
      light.position.set(radius, radius, radius);
      scene.add(light);

      // Animation loop
      function animate() {
        requestAnimationFrame(animate);
        mesh.rotation.y += 0.01;
        renderer.render(scene, camera);
      }
      animate();

    } catch (error) {
      console.error('Error creating geometry:', error);
    }

    // Cleanup
    return () => {
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [containerRef, cadData]);

  return {
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current,
    mesh: meshRef.current,
  };
};
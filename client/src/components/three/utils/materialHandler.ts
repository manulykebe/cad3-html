import { 
  MeshStandardMaterial, 
  BufferGeometry, 
  Mesh,
  DoubleSide,
  Color,
  FrontSide
} from 'three';

const DEFAULT_MATERIAL = new MeshStandardMaterial({
  color: new Color(0x888888),
  metalness: 0.3,
  roughness: 0.4,
  side: DoubleSide,
  transparent: false,
  opacity: 1.0,
  flatShading: false,
  depthWrite: true,
  depthTest: true,
  polygonOffset: true,     // Enable polygon offset
  polygonOffsetFactor: 2,  // Amount of offset
  polygonOffsetUnits: 2    // Units of offset
});

export const createMeshWithMaterial = (geometry: BufferGeometry): Mesh => {
  // Ensure normals are computed correctly
  geometry.computeVertexNormals();
  
  const mesh = new Mesh(geometry, DEFAULT_MATERIAL);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  // Ensure proper rendering order
  mesh.renderOrder = 0;
  
  return mesh;
};
import { 
  MeshStandardMaterial, 
  BufferGeometry, 
  Mesh,
  DoubleSide,
  Color
} from 'three';

const DEFAULT_MATERIAL = new MeshStandardMaterial({
  color: new Color(0x888888),
  metalness: 0.3,
  roughness: 0.4,
  side: DoubleSide,
  flatShading: false,
});

export const createMeshWithMaterial = (geometry: BufferGeometry): Mesh => {
  const mesh = new Mesh(geometry, DEFAULT_MATERIAL);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
};
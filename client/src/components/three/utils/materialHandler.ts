// materialHandler.ts
import { 
  MeshStandardMaterial, 
  BufferGeometry, 
  Mesh,
  DoubleSide
} from 'three';

const DEFAULT_METALLIC_MATERIAL = new MeshStandardMaterial({
  color: 0x555555,
  metalness: 0.8,
  roughness: 0.2, 
  side: DoubleSide,
});

export const createMeshWithMaterial = (geometry: BufferGeometry): Mesh => {
  const mesh = new Mesh(geometry, DEFAULT_METALLIC_MATERIAL);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
};
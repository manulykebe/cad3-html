import {
  MeshStandardMaterial,
  BufferGeometry,
  Mesh,
  DoubleSide,
  Color,
  FrontSide,
  BackSide,
} from 'three';

const DEFAULT_MATERIAL = new MeshStandardMaterial({
  color: new Color(0x888888),
  metalness: 0.3,
  roughness: 0.4,
  side: FrontSide,
  transparent: false,
  flatShading: false,
  depthWrite: true,
  depthTest: true,
  polygonOffset: true,
  polygonOffsetFactor: 2,
  polygonOffsetUnits: 2,
});

export const createMeshWithMaterial = (geometry: BufferGeometry): Mesh => {
  // Ensure normals are computed correctly
  geometry.computeVertexNormals();

  const mesh = new Mesh(geometry, DEFAULT_MATERIAL);
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
};

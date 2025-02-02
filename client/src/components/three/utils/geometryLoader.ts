import { BufferGeometry, Group, Vector3, Float32BufferAttribute } from 'three';
import { createMeshWithMaterial } from './materialHandler';
interface CadData {
  g: Array<CadGroupData>;
  mat: any[];
}
interface CadGroupData {
  f: string;
  v: string;
  mti: number[];
}

const parseVertex = (x: string): number => {
  return parseInt(x, 36);
};

const parseVector3 = (v3String: string): Vector3 => {
  const coords = v3String.split(',').map(parseVertex);
  return new Vector3(coords[0], coords[1], coords[2]);
};
export const createGroupFromData = (cadData: CadData): Group => {
  const group = new Group();
  cadData.g.forEach((groupData) => {
    const geometry = createGeometryFromData(groupData);
    const mesh = createMeshWithMaterial(geometry);
    group.add(mesh);
  });
  return group;
};

const createGeometryFromData = (
  groupData: CadGroupData,
): BufferGeometry => {
  const geometry = new BufferGeometry();
  const vertices: number[] = [];

  // Iterate through all groups
  if (!groupData.v || !groupData.f) return;

  // Create vertices lookup array for this groupData
  const groupVertices: Vector3[] = groupData.v
    .split('|')
    .map((v) => parseVector3(v));

  // Process faces - each face is triplet of vertex indices
  const faces = groupData.f.split('|');
  faces.forEach((face) => {
    // Convert base36 indices to numbers and lookup vertices
    const indices = face.split(',').map((x) => parseInt(x, 36));

    // Create a triangle
    const v1 = groupVertices[indices[0]];
    const v2 = groupVertices[indices[1]];
    const v3 = groupVertices[indices[2]];

    // Add vertices
    vertices.push(v1.x, v1.y, v1.z);
    vertices.push(v2.x, v2.y, v2.z);
    vertices.push(v3.x, v3.y, v3.z);
  });

  // Set attributes
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  // geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));

  // Compute bounding sphere for camera positioning
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  geometry.computeBoundingSphere();

  return geometry;
};

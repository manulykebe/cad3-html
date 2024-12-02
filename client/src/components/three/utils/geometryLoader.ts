import { BufferGeometry, Vector3 } from 'three';

interface CadData {
  g: Array<{
    f: string;
    v: string;
    mti: number[];
  }>;
  mat: any[];
}

const parseVertex = (x: string): number => {
  return parseInt(x, 36);
};

const parseVector3 = (v3String: string): Vector3 => {
  const coords = v3String.split(',').map(parseVertex);
  return new Vector3(coords[0], coords[1], coords[2]); 
};

export const createGeometryFromData = (cadData: CadData): BufferGeometry => {
  const geometry = new BufferGeometry();
  const points: Vector3[] = [];

  // Iterate through all groups
  cadData.g.forEach(group => {
    if (!group.v || !group.f) return; // Skip if no vertices or faces

    // Create vertices lookup array for this group
    const groupVertices: Vector3[] = group.v.split('|').map(v => parseVector3(v));
    
    // Process faces - each face is triplet of vertex indices
    const faces = group.f.split('|');
    faces.forEach(face => {
      // Convert base36 indices to numbers and lookup vertices
      const indices = face.split(',').map(x => parseInt(x, 36));
      indices.forEach(vertexIndex => {
        points.push(groupVertices[vertexIndex]);
      });
    });
  });

  // Create the final geometry
  geometry.setFromPoints(points);
  geometry.computeVertexNormals();
  
  return geometry;
};
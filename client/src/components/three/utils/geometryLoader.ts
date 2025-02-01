import { BufferGeometry, Vector3, Float32BufferAttribute } from 'three';

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
  const vertices: number[] = [];
  const normals: number[] = [];

  // Iterate through all groups
  cadData.g.forEach(group => {
    if (!group.v || !group.f) return;

    // Create vertices lookup array for this group
    const groupVertices: Vector3[] = group.v.split('|').map(v => parseVector3(v));
    
    // Process faces - each face is triplet of vertex indices
    const faces = group.f.split('|');
    faces.forEach(face => {
      // Convert base36 indices to numbers and lookup vertices
      const indices = face.split(',').map(x => parseInt(x, 36));
      
      // Create a triangle
      const v1 = groupVertices[indices[0]];
      const v2 = groupVertices[indices[1]];
      const v3 = groupVertices[indices[2]];

      // Add vertices
      vertices.push(v1.x, v1.y, v1.z);
      vertices.push(v2.x, v2.y, v2.z);
      vertices.push(v3.x, v3.y, v3.z);

      // Calculate face normal
      const edge1 = v2.clone().sub(v1);
      const edge2 = v3.clone().sub(v1);
      const normal = edge1.cross(edge2).normalize();

      // Add the same normal for all three vertices
      normals.push(normal.x, normal.y, normal.z);
      normals.push(normal.x, normal.y, normal.z);
      normals.push(normal.x, normal.y, normal.z);
    });
  });

  // Set attributes
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3));
  geometry.setAttribute('normal', new Float32BufferAttribute(normals, 3));
  
  // Compute bounding sphere for camera positioning
  geometry.computeBoundingSphere();
  
  return geometry;
};
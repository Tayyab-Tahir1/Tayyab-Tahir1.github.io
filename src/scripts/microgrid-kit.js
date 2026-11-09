import * as THREE from 'three';

// Shared sizes (world units) and the site's teal, used by the scene and the layer builders.
// Half the side of a square layer plate; assets stay inside +-3.5.
export const HALF = 3.6;
export const PLATE = HALF * 2;
// Height of a plate top (slab 0.32 + cap 0.02) above its layer origin.
export const BASE = 0.34;
export const TEAL = 0x24695f;

// Cached primitives and materials plus small mesh helpers. Every mesh casts a shadow by default.
export function createKit() {
  const geometries = new Map();
  const materials = new Map();
  const tempMatrix = new THREE.Matrix4();
  const up = new THREE.Vector3(0, 1, 0);

  function standardMaterial(color, options = {}) {
    const key = `s:${color}:${JSON.stringify(options)}`;
    if (!materials.has(key)) {
      materials.set(key, new THREE.MeshStandardMaterial({
        color,
        roughness: options.roughness ?? 0.65,
        metalness: options.metalness ?? 0,
        ...options
      }));
    }
    return materials.get(key);
  }

  function boxGeometry(w, h, d) {
    const key = `b:${w}:${h}:${d}`;
    if (!geometries.has(key)) {
      geometries.set(key, new THREE.BoxGeometry(w, h, d));
    }
    return geometries.get(key);
  }

  function cylinderGeometry(r, segments = 10) {
    const key = `c:${r}:${segments}`;
    if (!geometries.has(key)) {
      geometries.set(key, new THREE.CylinderGeometry(r, r, 1, segments));
    }
    return geometries.get(key);
  }

  function sphereGeometry(r, width = 12, height = 8) {
    const key = `s:${r}:${width}:${height}`;
    if (!geometries.has(key)) {
      geometries.set(key, new THREE.SphereGeometry(r, width, height));
    }
    return geometries.get(key);
  }

  function addMesh(geometry, material, parentObject, x = 0, y = 0, z = 0) {
    const object = new THREE.Mesh(geometry, material);
    object.position.set(x, y, z);
    object.castShadow = true;
    object.receiveShadow = false;
    parentObject.add(object);
    return object;
  }

  function addBox(parentObject, w, h, d, material, x, y, z) {
    return addMesh(boxGeometry(w, h, d), material, parentObject, x, y, z);
  }

  function addCylinder(parentObject, r, height, material, x, y, z, segments = 10) {
    const object = addMesh(cylinderGeometry(r, segments), material, parentObject, x, y, z);
    object.scale.y = height;
    return object;
  }

  function cylinderBetween(parentObject, p1, p2, r, material, segments = 8) {
    const direction = new THREE.Vector3().subVectors(p2, p1);
    const length = direction.length();
    const object = addMesh(
      cylinderGeometry(r, segments),
      material,
      parentObject
    );
    object.position.copy(p1).add(p2).multiplyScalar(0.5);
    object.quaternion.setFromUnitVectors(up, direction.normalize());
    object.scale.y = length;
    return object;
  }

  function addInstancedBoxes(parentObject, w, h, d, material, positions) {
    const instances = new THREE.InstancedMesh(
      boxGeometry(w, h, d),
      material,
      positions.length
    );
    positions.forEach((position, index) => {
      tempMatrix.makeTranslation(position[0], position[1], position[2]);
      instances.setMatrixAt(index, tempMatrix);
    });
    instances.instanceMatrix.needsUpdate = true;
    instances.castShadow = true;
    parentObject.add(instances);
    return instances;
  }

  const steel = standardMaterial(0x9aa1a8, { metalness: 0.6, roughness: 0.45 });
  const darkSteel = standardMaterial(0x3b4045, { metalness: 0.35, roughness: 0.55 });
  const copper = standardMaterial(0xb07a4a, { metalness: 0.6, roughness: 0.4 });
  const whiteSteel = standardMaterial(0xecebe7, { roughness: 0.58, metalness: 0.12 });
  return {
    geometries,
    standardMaterial,
    boxGeometry,
    cylinderGeometry,
    sphereGeometry,
    addMesh,
    addBox,
    addCylinder,
    cylinderBetween,
    addInstancedBoxes,
    steel,
    darkSteel,
    copper,
    whiteSteel
  };
}

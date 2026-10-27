import * as THREE from 'three';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { BASE, TEAL as teal } from './microgrid-kit.js';

// Procedural assets for the six layers (grid, EV, hydrogen, battery, PV, RL agent).
// Returns the RL-network handles the animation loop needs.
export function buildLayerAssets(layers, kit, renderer) {
  const {
    geometries,
    standardMaterial,
    sphereGeometry,
    addMesh,
    addBox,
    addCylinder,
    cylinderBetween,
    addInstancedBoxes,
    steel,
    darkSteel,
    whiteSteel
  } = kit;

  function buildGridLayer(group) {
    const transformer = new THREE.Group();
    transformer.position.set(-1.8, BASE, 1.2);
    group.add(transformer);

    const tankMaterial = standardMaterial(0x7f8a83, {
      roughness: 0.6,
      metalness: 0.3
    });
    addBox(transformer, 1.6, 1.2, 1.1, tankMaterial, 0, 0.6, 0);

    const finPositions = [];
    for (let side = -1; side <= 1; side += 2) {
      for (let i = 0; i < 8; i++) {
        finPositions.push([
          -0.65 + i * (1.3 / 7),
          0.57,
          side * 0.715
        ]);
      }
    }
    addInstancedBoxes(transformer, 0.04, 1, 0.35, tankMaterial, finPositions);

    const porcelain = standardMaterial(0x8a5a44, {
      roughness: 0.38,
      metalness: 0.05
    });
    for (const x of [-0.48, 0, 0.48]) {
      for (let section = 0; section < 3; section++) {
        addCylinder(
          transformer,
          section === 1 ? 0.09 : 0.07,
          0.15,
          porcelain,
          x,
          1.275 + section * 0.15,
          -0.12
        );
      }
    }

    const conservator = addCylinder(
      transformer, 0.18, 0.9, tankMaterial, 0, 1.55, 0.25, 16
    );
    conservator.rotation.z = Math.PI / 2;
    addBox(transformer, 0.08, 0.2, 0.08, tankMaterial, -0.3, 1.3, 0.25);
    addBox(transformer, 0.08, 0.2, 0.08, tankMaterial, 0.3, 1.3, 0.25);

    const conduitMaterial = standardMaterial(0x353b3c, {
      roughness: 0.75,
      metalness: 0.2
    });
    for (const x of [-2.12, -1.8, -1.48]) {
      addBox(group, 0.12, 0.12, 1.5, conduitMaterial, x, BASE + 0.06, 2.55);
    }

    const pylon = new THREE.Group();
    pylon.position.set(2.4, BASE, -2.2);
    group.add(pylon);

    const point = (x, y, z) => new THREE.Vector3(x, y, z);
    const halfAt = y => THREE.MathUtils.lerp(0.45, 0.125, y / 1.55);

    for (const sx of [-1, 1]) {
      for (const sz of [-1, 1]) {
        cylinderBetween(
          pylon,
          point(sx * 0.45, 0, sz * 0.45),
          point(sx * 0.125, 1.55, sz * 0.125),
          0.025,
          steel
        );
      }
    }

    const ringHeights = [0.12, 0.55, 1, 1.55];
    const cornersAt = y => {
      const h = halfAt(y);
      return [
        point(-h, y, -h),
        point(h, y, -h),
        point(h, y, h),
        point(-h, y, h)
      ];
    };

    for (const y of ringHeights) {
      const corners = cornersAt(y);
      for (let side = 0; side < 4; side++) {
        cylinderBetween(
          pylon,
          corners[side],
          corners[(side + 1) % 4],
          0.017,
          steel
        );
      }
    }

    for (let level = 0; level < ringHeights.length - 1; level++) {
      const lower = cornersAt(ringHeights[level]);
      const upper = cornersAt(ringHeights[level + 1]);
      for (let side = 0; side < 4; side++) {
        const next = (side + 1) % 4;
        cylinderBetween(pylon, lower[side], upper[next], 0.012, steel, 6);
        cylinderBetween(pylon, lower[next], upper[side], 0.012, steel, 6);
      }
    }

    cylinderBetween(pylon, point(0, 1.5, 0), point(0, 1.95, 0), 0.035, steel);
    addBox(pylon, 1.4, 0.05, 0.06, steel, 0, 1.6, 0);
    addBox(pylon, 1, 0.05, 0.06, steel, 0, 1.85, 0);

    for (const [x, y] of [[-0.63, 1.6], [0.63, 1.6], [-0.43, 1.85], [0.43, 1.85]]) {
      addCylinder(pylon, 0.027, 0.16, darkSteel, x, y - 0.1, 0, 8);
    }
  }

  function buildEvLayer(group) {
    const marking = standardMaterial(0xf2f1e9, { roughness: 0.9 });
    // Two bays parked along x (car's length): side lines along x, a head line along z.
    for (const z of [-1.85, 0.65, 3.15]) {
      addBox(group, 3.0, 0.008, 0.045, marking, 1.2, BASE + 0.006, z);
    }
    addBox(group, 0.045, 0.008, 5.0, marking, -0.3, BASE + 0.006, 0.65);

    // Car sits back-right so the energy risers in front of the plate do not cross it.
    const car = new THREE.Group();
    car.position.set(1.25, BASE, -0.6);
    group.add(car);

    const paint = standardMaterial(0xc9ced2, {
      metalness: 0.5,
      roughness: 0.35
    });
    const glass = standardMaterial(0x2a3036, {
      metalness: 0.2,
      roughness: 0.15
    });
    const tyre = standardMaterial(0x1d1f21, { roughness: 0.9 });
    const hub = standardMaterial(0xbec5ca, { metalness: 0.8, roughness: 0.25 });

    // Side profiles (x along the car, y up), extruded across the width (z).
    const bodyShape = new THREE.Shape([
      new THREE.Vector2(-1.3, 0.2),
      new THREE.Vector2(1.3, 0.2),
      new THREE.Vector2(1.32, 0.46),
      new THREE.Vector2(1.05, 0.6),
      new THREE.Vector2(-1.18, 0.66),
      new THREE.Vector2(-1.32, 0.52)
    ]);
    const greenhouseShape = new THREE.Shape([
      new THREE.Vector2(-1.05, 0),
      new THREE.Vector2(0.72, 0),
      new THREE.Vector2(0.22, 0.4),
      new THREE.Vector2(-0.82, 0.4)
    ]);
    const extrude = (shape, depth, bevel) => {
      const geometry = new THREE.ExtrudeGeometry(shape, {
        depth,
        bevelEnabled: true,
        bevelThickness: bevel,
        bevelSize: bevel,
        bevelSegments: 2,
        curveSegments: 4
      });
      geometry.translate(0, 0, -depth / 2);
      return geometry;
    };
    addMesh(extrude(bodyShape, 1.1, 0.05), paint, car);
    addMesh(extrude(greenhouseShape, 0.96, 0.03), glass, car, 0, 0.66, 0);
    addBox(car, 1.0, 0.04, 1.0, paint, -0.3, 1.075, 0);

    for (const x of [-0.85, 0.85]) {
      for (const z of [-0.6, 0.6]) {
        const wheel = addCylinder(car, 0.24, 0.18, tyre, x, 0.24, z, 20);
        wheel.rotation.x = Math.PI / 2;

        const disc = addCylinder(
          car, 0.135, 0.012, hub, x, 0.24, z + Math.sign(z) * 0.096, 16
        );
        disc.rotation.x = Math.PI / 2;
      }
    }

    const headlight = standardMaterial(0xffffff, {
      emissive: 0xffffff,
      emissiveIntensity: 1.5,
      roughness: 0.25
    });
    for (const z of [-0.36, 0.36]) {
      addBox(car, 0.03, 0.06, 0.3, headlight, 1.36, 0.44, z);
    }

    const charger = new THREE.Group();
    charger.position.set(-1.0, BASE, 0.0);
    group.add(charger);

    const chargerWhite = standardMaterial(0xeeeeec, {
      roughness: 0.5,
      metalness: 0.08
    });
    const chargerAccent = standardMaterial(teal, {
      roughness: 0.45,
      metalness: 0.15
    });

    addBox(charger, 0.45, 1.25, 0.3, chargerWhite, 0, 0.625, 0);
    addBox(charger, 0.3, 0.3, 0.018, glass, 0, 0.87, 0.159);
    addBox(charger, 0.45, 0.055, 0.018, chargerAccent, 0, 0.56, 0.16);

    const cableCurve = new THREE.CatmullRomCurve3([
      // charger side -> slack on the ground -> charge port on the car's rear flank
      new THREE.Vector3(-0.76, BASE + 0.85, 0.0),
      new THREE.Vector3(-0.45, BASE + 0.1, 0.25),
      new THREE.Vector3(0.0, BASE + 0.06, 0.45),
      new THREE.Vector3(0.25, BASE + 0.3, 0.15),
      new THREE.Vector3(0.3, BASE + 0.48, 0.04)
    ]);
    addMesh(
      new THREE.TubeGeometry(cableCurve, 36, 0.025, 7, false),
      darkSteel,
      group
    );
  }

  function buildHydrogenLayer(group) {
    const electrolyser = new THREE.Group();
    electrolyser.position.set(-2.2, BASE, -1.2);
    group.add(electrolyser);

    const containerMaterial = standardMaterial(0xe4e2dc, {
      roughness: 0.64,
      metalness: 0.16
    });
    addBox(electrolyser, 2.2, 1, 1, containerMaterial, 0, 0.5, 0);

    const ribPositions = [];
    for (let i = 0; i < 14; i++) {
      const x = -0.975 + i * 0.15;
      ribPositions.push([x, 0.5, -0.515], [x, 0.5, 0.515]);
    }
    addInstancedBoxes(electrolyser, 0.025, 0.9, 0.035, containerMaterial, ribPositions);
    addBox(electrolyser, 0.58, 0.42, 0.025, darkSteel, 0.52, 0.48, 0.54);

    for (const x of [-0.62, 0.58]) {
      addCylinder(electrolyser, 0.065, 0.32, steel, x, 1.16, 0, 12);
    }

    const tankGroup = new THREE.Group();
    tankGroup.position.set(1.4, BASE, -1.6);
    group.add(tankGroup);

    const tankMaterial = standardMaterial(0xf1f1ef, {
      roughness: 0.3,
      metalness: 0.12
    });
    const tank = addCylinder(tankGroup, 0.42, 2.2, tankMaterial, 0, 0.6, 0, 24);
    tank.rotation.z = Math.PI / 2;

    const hemisphereGeometry = new THREE.SphereGeometry(
      0.42, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2
    );
    const rightCap = addMesh(hemisphereGeometry, tankMaterial, tankGroup, 1.1, 0.6, 0);
    rightCap.rotation.z = -Math.PI / 2;
    const leftCap = addMesh(hemisphereGeometry, tankMaterial, tankGroup, -1.1, 0.6, 0);
    leftCap.rotation.z = Math.PI / 2;

    for (const x of [-0.68, 0.68]) {
      addBox(tankGroup, 0.18, 0.18, 0.76, steel, x, 0.09, 0);
    }

    const pipeMaterial = standardMaterial(0x718894, {
      roughness: 0.45,
      metalness: 0.55
    });
    const pipeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.05, BASE + 0.45, -1.35),
      new THREE.Vector3(-0.35, BASE + 0.28, -1.35),
      new THREE.Vector3(0.05, BASE + 0.3, -1.6),
      new THREE.Vector3(0.28, BASE + 0.58, -1.6)
    ]);
    addMesh(new THREE.TubeGeometry(pipeCurve, 28, 0.035, 8, false), pipeMaterial, group);

    // H2 supply line from the tank's right end along the ground to the fuel-cell stack.
    const supplyCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(2.75, BASE + 0.45, -1.35),
      new THREE.Vector3(2.75, BASE + 0.07, -0.9),
      new THREE.Vector3(2.75, BASE + 0.07, 0.9),
      new THREE.Vector3(2.4, BASE + 0.07, 1.3),
      new THREE.Vector3(2.3, BASE + 0.35, 1.5)
    ]);
    addMesh(new THREE.TubeGeometry(supplyCurve, 32, 0.035, 8, false), pipeMaterial, group);

    const fuelCell = new THREE.Group();
    fuelCell.position.set(2.1, BASE, 1.9);
    group.add(fuelCell);

    addBox(fuelCell, 1.08, 0.1, 0.86, darkSteel, 0, 0.05, 0);
    const plateA = standardMaterial(0x3b4045, { metalness: 0.5, roughness: 0.45 });
    const plateB = standardMaterial(0x6b7178, { metalness: 0.55, roughness: 0.4 });
    const endPlate = standardMaterial(0x8d949b, { metalness: 0.65, roughness: 0.35 });

    const positionsA = [];
    const positionsB = [];
    for (let i = 0; i < 14; i++) {
      (i % 2 === 0 ? positionsA : positionsB).push([0, 0.2 + i * 0.04, 0]);
    }
    addInstancedBoxes(fuelCell, 0.9, 0.04, 0.7, plateA, positionsA);
    addInstancedBoxes(fuelCell, 0.9, 0.04, 0.7, plateB, positionsB);
    addBox(fuelCell, 0.98, 0.1, 0.78, endPlate, 0, 0.13, 0);
    addBox(fuelCell, 0.98, 0.1, 0.78, endPlate, 0, 0.79, 0);

    for (const x of [-0.4, 0.4]) {
      for (const z of [-0.3, 0.3]) {
        addCylinder(fuelCell, 0.022, 0.78, steel, x, 0.45, z, 8);
      }
    }
  }

  function buildBessLayer(group) {
    const seamMaterial = standardMaterial(0x777d7d, { roughness: 0.7 });
    const handleMaterial = standardMaterial(0x363c3e, {
      metalness: 0.35,
      roughness: 0.5
    });
    const ledMaterial = standardMaterial(0x3fbfa6, {
      emissive: 0x3fbfa6,
      emissiveIntensity: 1.2,
      roughness: 0.3
    });
    const hvacMaterial = standardMaterial(0xc4c7c9, {
      roughness: 0.55,
      metalness: 0.25
    });

    for (const z of [-1, 1]) {
      for (let i = 0; i < 4; i++) {
        const x = (i - 1.5) * 1.07;
        const cabinet = new THREE.Group();
        cabinet.position.set(x, BASE, z);
        group.add(cabinet);

        addBox(cabinet, 0.95, 1.35, 0.85, whiteSteel, 0, 0.675, 0);
        addBox(cabinet, 0.99, 0.04, 0.89, whiteSteel, 0, 1.36, 0);
        addBox(cabinet, 0.012, 1.17, 0.012, seamMaterial, 0, 0.67, 0.431);
        addBox(cabinet, 0.035, 0.17, 0.025, handleMaterial, -0.12, 0.7, 0.447);
        addBox(cabinet, 0.035, 0.17, 0.025, handleMaterial, 0.12, 0.7, 0.447);
        addBox(cabinet, 0.045, 0.045, 0.02, ledMaterial, 0.31, 1.14, 0.442);
      }

      addBox(group, 0.46, 1.12, 0.85, hvacMaterial, 2.38, BASE + 0.56, z);
      addBox(group, 0.34, 0.64, 0.025, darkSteel, 2.38, BASE + 0.57, z + 0.438);
    }
  }

  function makeCellTexture() {
    const textureCanvas = document.createElement('canvas');
    textureCanvas.width = 384;
    textureCanvas.height = 640;
    const context = textureCanvas.getContext('2d');
    context.fillStyle = '#1c2a3d';
    context.fillRect(0, 0, 384, 640);
    context.strokeStyle = '#8290a0';
    context.lineWidth = 2;

    for (let x = 0; x <= 6; x++) {
      context.beginPath();
      context.moveTo(x * 64, 0);
      context.lineTo(x * 64, 640);
      context.stroke();
    }
    for (let y = 0; y <= 10; y++) {
      context.beginPath();
      context.moveTo(0, y * 64);
      context.lineTo(384, y * 64);
      context.stroke();
    }

    const texture = new THREE.CanvasTexture(textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
    return texture;
  }

  function buildPvLayer(group) {
    const frameMaterial = standardMaterial(0xc9ced4, {
      metalness: 0.7,
      roughness: 0.32
    });
    const cellMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      map: makeCellTexture(),
      roughness: 0.25,
      metalness: 0.35
    });
    const faceGeometry = new THREE.PlaneGeometry(0.94, 1.54);

    const tilt = THREE.MathUtils.degToRad(25);
    const legZ = 0.58;
    for (let row = 0; row < 3; row++) {
      for (let column = 0; column < 6; column++) {
        const x = (column - 2.5) * 1.12;
        const z = (row - 1) * 2.5;
        const centerY = BASE + 0.8;

        const panel = new THREE.Group();
        panel.position.set(x, centerY, z);
        panel.rotation.x = tilt;
        group.add(panel);

        addBox(panel, 1.04, 0.045, 0.035, frameMaterial, 0, 0, -0.8);
        addBox(panel, 1.04, 0.045, 0.035, frameMaterial, 0, 0, 0.8);
        addBox(panel, 0.035, 0.045, 1.6, frameMaterial, -0.5, 0, 0);
        addBox(panel, 0.035, 0.045, 1.6, frameMaterial, 0.5, 0, 0);

        const face = addMesh(faceGeometry, cellMaterial, panel, 0, 0.027, 0);
        face.rotation.x = -Math.PI / 2;

        addBox(panel, 1.06, 0.05, 0.06, steel, 0, -0.055, 0);

        // Legs end at the underside of the tilted frame at world offset +-legZ.
        const drop = legZ * Math.tan(tilt);
        const frontY = centerY - drop - 0.03;
        const backY = centerY + drop - 0.03;
        for (const lx of [x - 0.38, x + 0.38]) {
          cylinderBetween(
            group,
            new THREE.Vector3(lx, BASE, z + legZ),
            new THREE.Vector3(lx, frontY, z + legZ),
            0.024,
            steel
          );
          cylinderBetween(
            group,
            new THREE.Vector3(lx, BASE, z - legZ),
            new THREE.Vector3(lx, backY, z - legZ),
            0.024,
            steel
          );
        }
      }
    }
  }

  const rl = {
    nodeMaterials: [],
    edges: [],
    dots: null,
    dotData: []
  };

  function buildRlLayer(group) {
    const counts = [5, 7, 7, 4];
    const columns = [];
    const nodePositions = [];

    counts.forEach((count, column) => {
      const x = (column - 1.5) * 2.1;
      const nodes = [];
      const material = new THREE.MeshStandardMaterial({
        color: teal,
        emissive: teal,
        emissiveIntensity: 0.6,
        roughness: 0.35,
        metalness: 0.1
      });
      rl.nodeMaterials.push(material);

      for (let i = 0; i < count; i++) {
        const position = new THREE.Vector3(
          x,
          BASE + 0.32,
          (i - (count - 1) / 2) * 0.85
        );
        nodes.push(position);
        nodePositions.push(position);
        addMesh(sphereGeometry(0.16, 16, 12), material, group, position.x, position.y, position.z);
      }
      columns.push(nodes);
    });

    const edgePositions = [];
    for (let column = 0; column < columns.length - 1; column++) {
      for (const a of columns[column]) {
        for (const b of columns[column + 1]) {
          edgePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
          rl.edges.push([a, b]);
        }
      }
    }

    const edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(edgePositions, 3)
    );
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: teal,
      transparent: true,
      opacity: 0.5,
      depthWrite: false
    });
    group.add(new THREE.LineSegments(edgeGeometry, edgeMaterial));

    const dotMaterial = new THREE.MeshStandardMaterial({
      color: 0xa4e5d5,
      emissive: teal,
      emissiveIntensity: 1.8,
      roughness: 0.25
    });

    rl.dots = new THREE.InstancedMesh(sphereGeometry(0.06, 8, 6), dotMaterial, 12);
    rl.dots.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    group.add(rl.dots);

    for (let i = 0; i < 12; i++) {
      rl.dotData.push({
        edge: Math.floor(Math.random() * rl.edges.length),
        offset: Math.random(),
        speed: 0.18 + Math.random() * 0.25
      });
    }
  }

  buildGridLayer(layers[0]);
  buildEvLayer(layers[1]);
  buildHydrogenLayer(layers[2]);
  buildBessLayer(layers[3]);
  buildPvLayer(layers[4]);
  buildRlLayer(layers[5]);

  // Bake each layer's static meshes into one mesh per material and shadow mode, so the
  // scene draws ~70 meshes instead of ~400. Instanced meshes, lines and labels stay as they are.
  function mergeStaticMeshes(group) {
    group.updateMatrixWorld(true);
    const toGroup = new THREE.Matrix4().copy(group.matrixWorld).invert();
    const buckets = new Map();
    const merged = [];
    group.traverse(object => {
      if (!object.isMesh || object.isInstancedMesh) return;
      const key = `${object.material.uuid}:${object.castShadow}:${object.receiveShadow}`;
      if (!buckets.has(key)) buckets.set(key, { source: object, parts: [] });
      const part = object.geometry.index
        ? object.geometry.toNonIndexed()
        : object.geometry.clone();
      part.applyMatrix4(new THREE.Matrix4().multiplyMatrices(toGroup, object.matrixWorld));
      buckets.get(key).parts.push(part);
      merged.push(object);
    });

    const sharedGeometries = new Set(geometries.values());
    for (const object of merged) {
      object.removeFromParent();
      if (!sharedGeometries.has(object.geometry)) object.geometry.dispose();
    }
    for (const { source, parts } of buckets.values()) {
      const geometry = mergeGeometries(parts, false);
      parts.forEach(part => part.dispose());
      if (!geometry) continue;
      const mesh = new THREE.Mesh(geometry, source.material);
      mesh.castShadow = source.castShadow;
      mesh.receiveShadow = source.receiveShadow;
      group.add(mesh);
    }
  }
  layers.forEach(mergeStaticMeshes);

  return rl;
}

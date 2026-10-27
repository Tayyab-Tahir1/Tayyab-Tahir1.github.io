import * as THREE from 'three';
import {
  CSS2DRenderer,
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { BASE, HALF, PLATE, TEAL as teal, createKit } from './microgrid-kit.js';
import { buildLayerAssets } from './microgrid-layers.js';

export function mountMicrogridHero(canvas, opts = {}) {
  const parent = canvas.parentElement;
  if (!parent) throw new Error('microgrid-hero: canvas must have a parent element');

  const reducedMotion = opts.reducedMotion ??
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true
  });
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFShadowMap;

  let createdLabelLayer = false;
  let labelLayer = opts.labelLayer;
  let previousParentPosition = null;

  if (!labelLayer) {
    createdLabelLayer = true;
    labelLayer = document.createElement('div');
    labelLayer.style.position = 'absolute';
    labelLayer.style.inset = '0';
    labelLayer.style.pointerEvents = 'none';
    labelLayer.style.overflow = 'visible';

    if (window.getComputedStyle(parent).position === 'static') {
      previousParentPosition = parent.style.position;
      parent.style.position = 'relative';
    }
    parent.appendChild(labelLayer);
  }

  const labelRenderer = new CSS2DRenderer();
  labelRenderer.domElement.style.position = 'absolute';
  labelRenderer.domElement.style.inset = '0';
  labelRenderer.domElement.style.pointerEvents = 'none';
  labelLayer.appendChild(labelRenderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-10, 10, 10, -10, 0.1, 220);

  const hemisphere = new THREE.HemisphereLight(0xffffff, 0xb9b4a8, 0.9);
  scene.add(hemisphere);

  const sun = new THREE.DirectionalLight(0xfff6ea, 1.6);
  // Same direction as (8, 14, 6) -> (0, 7, 0), re-centred on the exploded stack (y 0..33).
  sun.position.set(24, 37, 18);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -22;
  sun.shadow.camera.right = 22;
  sun.shadow.camera.top = 22;
  sun.shadow.camera.bottom = -22;
  sun.shadow.camera.near = 1;
  sun.shadow.camera.far = 120;
  sun.shadow.radius = 4;
  sun.shadow.bias = -0.0004;
  sun.shadow.normalBias = 0.02;
  sun.target.position.set(0, 16, 0);
  scene.add(sun, sun.target);

  const fill = new THREE.DirectionalLight(0xdfe8ff, 0.35);
  fill.position.set(-6, 4, -8);
  scene.add(fill);

  const kit = createKit();
  const {
    geometries,
    boxGeometry,
    cylinderGeometry,
    sphereGeometry,
    addMesh,
    addBox,
    cylinderBetween,
    copper
  } = kit;
  const layers = [];
  const layerTops = new Array(6).fill(0);
  const tempMatrix = new THREE.Matrix4();
  const tempPosition = new THREE.Vector3();
  const tempScale = new THREE.Vector3(1, 1, 1);
  const tempQuaternion = new THREE.Quaternion();
  // Energy risers run just outside the plates' front-left face (z = +HALF).
  const RISER_Z = HALF + 0.25;

  const plateColors = [
    0xa7a59e,
    0x5f6366,
    0xcfccc4,
    0xd6d3cb,
    0xb7b99a
  ];
  const layerNames = [
    'Grid',
    'EV / V2G',
    'Hydrogen',
    'Battery storage',
    'Solar PV',
    'RL agent'
  ];

  function makeLabel(text) {
    const element = document.createElement('div');
    element.className = 'mg-label';
    element.style.whiteSpace = 'nowrap';
    element.style.pointerEvents = 'none';
    element.style.transformOrigin = 'left center';

    const tick = document.createElement('span');
    tick.className = 'mg-tick';
    tick.style.display = 'inline-block';
    tick.style.width = '18px';

    const content = document.createElement('span');
    content.textContent = text;

    element.append(tick, content);
    const label = new CSS2DObject(element);
    label.center.set(0, 0.5);
    label.position.set(HALF, 0.17, -HALF);
    return label;
  }

  for (let index = 0; index < 6; index++) {
    const group = new THREE.Group();
    group.name = layerNames[index];
    scene.add(group);
    layers.push(group);

    if (index < 5) {
      const base = new THREE.Color(plateColors[index]);
      const capColor = base.clone().lerp(new THREE.Color(0xffffff), 0.09);
      const slabMaterial = new THREE.MeshStandardMaterial({
        color: base,
        roughness: 0.88,
        metalness: 0
      });
      const capMaterial = new THREE.MeshStandardMaterial({
        color: capColor,
        roughness: 0.82,
        metalness: 0
      });

      const slab = addBox(group, PLATE, 0.32, PLATE, slabMaterial, 0, 0.16, 0);
      const cap = addBox(group, PLATE, 0.02, PLATE, capMaterial, 0, 0.33, 0);
      slab.castShadow = false;
      cap.castShadow = false;
      slab.receiveShadow = true;
      cap.receiveShadow = true;
    } else {
      const base = new THREE.Color(0xdfe9e6);
      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: base,
        transparent: true,
        opacity: 0.35,
        roughness: 0.2,
        metalness: 0,
        depthWrite: false
      });

      const glass = addBox(group, PLATE, 0.32, PLATE, glassMaterial, 0, 0.16, 0);
      glass.castShadow = false;
      glass.receiveShadow = true;

      const edgeMaterial = new THREE.LineBasicMaterial({ color: teal });
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(boxGeometry(PLATE, 0.34, PLATE)),
        edgeMaterial
      );
      edges.position.y = 0.17;
      group.add(edges);
    }

    group.add(makeLabel(layerNames[index]));
  }

  // Width reserved for the longest HTML label ('Battery storage' + leader) at the page's font size.
  const LABEL_PX = 128;
  // Plate-top to plate-top distance. Assembled leaves just room for the tallest asset (pylon, 1.95).
  const SPACING_ASSEMBLED = 2.6;
  const SPACING_EXPLODED = 4.6;
  // Control spine sits just outside the plates' left-hand corner (x=-HALF, z=+HALF) as seen by the camera.
  const SPINE_X = -HALF - 0.8;
  const SPINE_Z = HALF + 0.8;

  const rl = buildLayerAssets(layers, kit, renderer);

  const risers = [];
  let energyParticles;

  function buildRisers() {
    const definitions = [
      { x: -3, from: 4, to: 3 },
      { x: -1.5, from: 0, to: 3 },
      { x: 1.3, from: 3, to: 1 },
      { x: 2.1, from: 2, to: 1 }
    ];

    for (const definition of definitions) {
      const vertical = addMesh(
        cylinderGeometry(0.035, 10),
        copper,
        scene,
        definition.x,
        0,
        RISER_Z
      );
      const stubs = [0, 1].map(() => cylinderBetween(
        scene,
        new THREE.Vector3(definition.x, 0, RISER_Z),
        new THREE.Vector3(definition.x, 0, HALF - 0.4),
        0.035,
        copper,
        10
      ));
      risers.push({ ...definition, vertical, stubs });
    }

    const particleMaterial = new THREE.MeshStandardMaterial({
      color: 0xe8a54b,
      emissive: 0xe8a54b,
      emissiveIntensity: 1.2,
      roughness: 0.3
    });
    energyParticles = new THREE.InstancedMesh(
      sphereGeometry(0.1, 12, 8),
      particleMaterial,
      risers.length * 6
    );
    energyParticles.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    scene.add(energyParticles);
  }

  const spine = {
    vertical: null,
    stubs: [],
    pulses: []
  };

  function buildControlSpine() {
    const material = new THREE.MeshStandardMaterial({
      color: teal,
      emissive: teal,
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: 0.7,
      roughness: 0.45
    });

    spine.vertical = addMesh(
      cylinderGeometry(0.02, 8),
      material,
      scene,
      SPINE_X,
      0,
      SPINE_Z
    );

    for (let i = 0; i < 6; i++) {
      spine.stubs.push(cylinderBetween(
        scene,
        new THREE.Vector3(SPINE_X, 0, SPINE_Z),
        new THREE.Vector3(-HALF + 0.02, 0, HALF - 0.02),
        0.02,
        material,
        8
      ));
    }

    for (let i = 0; i < 6; i++) {
      const pulseMaterial = new THREE.MeshStandardMaterial({
        color: teal,
        emissive: teal,
        emissiveIntensity: 1.5,
        transparent: true,
        opacity: 1,
        roughness: 0.25
      });
      const pulse = addMesh(sphereGeometry(0.12, 12, 8), pulseMaterial, scene);
      spine.pulses.push(pulse);
    }
  }

  buildRisers();
  buildControlSpine();
  // Flow and control overlays are diagram marks, not physical parts: no stray shadows on plates.
  [
    ...risers.flatMap(riser => [riser.vertical, ...riser.stubs]),
    spine.vertical,
    ...spine.stubs,
    ...spine.pulses
  ].forEach(mesh => {
    mesh.castShadow = false;
  });

  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const shadowContext = shadowCanvas.getContext('2d');
  const shadowGradient = shadowContext.createRadialGradient(128, 128, 5, 128, 128, 125);
  shadowGradient.addColorStop(0, 'rgba(0,0,0,0.25)');
  shadowGradient.addColorStop(0.55, 'rgba(0,0,0,0.13)');
  shadowGradient.addColorStop(1, 'rgba(0,0,0,0)');
  shadowContext.fillStyle = shadowGradient;
  shadowContext.fillRect(0, 0, 256, 256);

  const contactMaterial = new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(shadowCanvas),
    transparent: true,
    depthWrite: false
  });
  const contactShadow = new THREE.Mesh(new THREE.PlaneGeometry(PLATE * 1.6, PLATE * 1.6), contactMaterial);
  contactShadow.rotation.x = -Math.PI / 2;
  contactShadow.position.y = -0.05;
  scene.add(contactShadow);

  const stackMidY = (5 * SPACING_EXPLODED) / 2 + 0.17;
  const labelShift = 4;
  const cameraTarget = new THREE.Vector3(0.6 * labelShift, stackMidY, 0);
  const baseDirection = new THREE.Vector3(1, 0.62, 1).normalize();
  const baseTheta = Math.atan2(baseDirection.x, baseDirection.z);
  const basePhi = Math.acos(baseDirection.y);
  let currentTheta = baseTheta;
  let currentPhi = basePhi;
  let targetTheta = baseTheta;
  let targetPhi = basePhi;

  function positionCamera() {
    const spherical = new THREE.Spherical(60, currentPhi, currentTheta);
    camera.position.copy(cameraTarget).add(new THREE.Vector3().setFromSpherical(spherical));
    camera.lookAt(cameraTarget);
    camera.updateMatrixWorld();
  }

  function fitCamera(width, height) {
    currentTheta = baseTheta;
    currentPhi = basePhi;
    positionCamera();

    const points = [];
    for (let layer = 0; layer < 6; layer++) {
      const y = layer * SPACING_EXPLODED;
      for (const x of [-HALF, HALF]) {
        for (const z of [-HALF, HALF]) {
          points.push(new THREE.Vector3(x, y, z));
          points.push(new THREE.Vector3(x, y + 0.34, z));
        }
      }
    }

    points.push(
      new THREE.Vector3(2.4, BASE + 1.95, -2.2),
      new THREE.Vector3(SPINE_X, 0, SPINE_Z),
      new THREE.Vector3(SPINE_X, 5 * SPACING_EXPLODED + BASE, SPINE_Z),
      new THREE.Vector3(-3, 0, RISER_Z),
      new THREE.Vector3(3, 5 * SPACING_EXPLODED + BASE, RISER_Z)
    );

    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;

    for (const point of points) {
      point.applyMatrix4(camera.matrixWorldInverse);
      minX = Math.min(minX, point.x);
      maxX = Math.max(maxX, point.x);
      minY = Math.min(minY, point.y);
      maxY = Math.max(maxY, point.y);
    }

    // Labels are HTML with a fixed pixel size, so reserve their width in pixels, not world units.
    const margin = 0.05;
    const aspect = width / height;
    let frustumHeight = (maxY - minY) / (1 - 2 * margin);
    let frustumWidth = frustumHeight * aspect;
    const labelWorld = () => (LABEL_PX / width) * frustumWidth;
    if ((maxX - minX) + labelWorld() > frustumWidth * (1 - 2 * margin)) {
      // Width-limited: solve w = (span + LABEL_PX * w / width) / (1 - 2 margin) for w.
      frustumWidth = (maxX - minX) / (1 - 2 * margin - LABEL_PX / width);
      frustumHeight = frustumWidth / aspect;
    }
    const centerX = (minX + maxX + labelWorld()) / 2;
    const centerY = (minY + maxY) / 2;
    camera.left = centerX - frustumWidth / 2;
    camera.right = centerX + frustumWidth / 2;
    camera.bottom = centerY - frustumHeight / 2;
    camera.top = centerY + frustumHeight / 2;
    camera.updateProjectionMatrix();
  }

  function explosionAt(time) {
    if (reducedMotion) return 1;
    const t = time % 12;
    if (t < 1.5) return 0;
    if (t < 5) {
      const u = (t - 1.5) / 3.5;
      return u * u * (3 - 2 * u);
    }
    if (t < 9.5) return 1;
    const u = (t - 9.5) / 2.5;
    return 1 - u * u * (3 - 2 * u);
  }

  function updateWorld(time) {
    const explosion = explosionAt(time);
    const spacing = THREE.MathUtils.lerp(SPACING_ASSEMBLED, SPACING_EXPLODED, explosion);

    for (let i = 0; i < layers.length; i++) {
      const bob = reducedMotion ? 0 : Math.sin(time * 0.7 + i * 0.8) * 0.03;
      layers[i].position.y = (i - 2.5) * spacing + 2.5 * SPACING_EXPLODED + bob;
      layerTops[i] = layers[i].position.y + BASE;
    }

    risers.forEach((riser, riserIndex) => {
      const y1 = layerTops[riser.from];
      const y2 = layerTops[riser.to];
      riser.vertical.position.y = (y1 + y2) / 2;
      riser.vertical.scale.y = Math.abs(y2 - y1);

      riser.stubs[0].position.y = y1;
      riser.stubs[1].position.y = y2;

      for (let k = 0; k < 6; k++) {
        const progress = reducedMotion
          ? k / 6
          : THREE.MathUtils.euclideanModulo(time * 0.22 + k / 6 + riserIndex * 0.07, 1);
        tempPosition.set(
          riser.x,
          THREE.MathUtils.lerp(y1, y2, progress),
          RISER_Z
        );
        tempMatrix.compose(tempPosition, tempQuaternion.identity(), tempScale);
        energyParticles.setMatrixAt(riserIndex * 6 + k, tempMatrix);
      }
    });
    energyParticles.instanceMatrix.needsUpdate = true;

    const spineBottom = layerTops[0];
    const spineTop = layerTops[5];
    spine.vertical.position.y = (spineBottom + spineTop) / 2;
    spine.vertical.scale.y = spineTop - spineBottom;
    spine.stubs.forEach((stub, index) => {
      stub.position.y = layerTops[index];
    });

    const latestPulse = Math.floor(time / 1.2);
    spine.pulses.forEach((pulse, slot) => {
      const pulseIndex = latestPulse - slot;
      const age = time - pulseIndex * 1.2;
      if (pulseIndex < 0 || age < 0 || age > 4.2) {
        pulse.visible = false;
        return;
      }

      const targetLayer = THREE.MathUtils.euclideanModulo(4 - pulseIndex, 5);
      const targetY = layerTops[targetLayer];
      const descentDuration = Math.max(0.01, (spineTop - targetY) / 6);
      pulse.visible = true;
      pulse.material.opacity = 1;

      if (age <= descentDuration) {
        pulse.position.set(SPINE_X, THREE.MathUtils.lerp(spineTop, targetY, age / descentDuration), SPINE_Z);
      } else {
        const branchTime = age - descentDuration;
        const branchProgress = Math.min(1, branchTime / 0.28);
        pulse.position.set(
          THREE.MathUtils.lerp(SPINE_X, -HALF + 0.02, branchProgress),
          targetY,
          THREE.MathUtils.lerp(SPINE_Z, HALF - 0.02, branchProgress)
        );
        if (branchProgress >= 1) {
          pulse.material.opacity = Math.max(0, 1 - (branchTime - 0.28) / 0.3);
          if (pulse.material.opacity === 0) pulse.visible = false;
        }
      }
    });

    rl.nodeMaterials.forEach((material, column) => {
      const wave = Math.max(0, Math.cos(time * 1.5 - column * 0.8));
      material.emissiveIntensity = 0.6 + Math.pow(wave, 8) * 1.25;
    });

    rl.dotData.forEach((data, index) => {
      const edge = rl.edges[data.edge];
      const progress = reducedMotion
        ? data.offset
        : THREE.MathUtils.euclideanModulo(data.offset + time * data.speed, 1);
      tempPosition.lerpVectors(edge[0], edge[1], progress);
      tempMatrix.compose(tempPosition, tempQuaternion.identity(), tempScale);
      rl.dots.setMatrixAt(index, tempMatrix);
    });
    rl.dots.instanceMatrix.needsUpdate = true;

    contactMaterial.opacity = 1 - explosion * 0.25;
    contactShadow.position.y = layers[0].position.y - 0.05;
    const shadowScale = 1 - explosion * 0.06;
    contactShadow.scale.set(shadowScale, shadowScale, shadowScale);

    if (!reducedMotion) {
      currentTheta = THREE.MathUtils.lerp(currentTheta, targetTheta, 0.05);
      currentPhi = THREE.MathUtils.lerp(currentPhi, targetPhi, 0.05);
    }
    positionCamera();
  }

  let firstFrameCalled = false;
  function renderFrame(time) {
    updateWorld(time);
    renderer.render(scene, camera);
    labelRenderer.render(scene, camera);
    if (!firstFrameCalled) {
      firstFrameCalled = true;
      if (typeof opts.onFirstFrame === 'function') opts.onFirstFrame();
    }
  }

  let width = 1;
  let height = 1;
  function resize() {
    width = Math.max(1, parent.clientWidth);
    height = Math.max(1, parent.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height, false);
    labelRenderer.setSize(width, height);
    fitCamera(width, height);
    if (!running) renderFrame(animationTime);
  }

  let animationTime = 0;
  let rafId = 0;
  let running = false;
  let previousTimestamp = null;
  let intersecting = true;
  let disposed = false;

  function tick(timestamp) {
    if (!running || disposed) return;
    const dt = previousTimestamp === null
      ? 0
      : Math.min(0.05, Math.max(0, (timestamp - previousTimestamp) / 1000));
    previousTimestamp = timestamp;
    animationTime += dt;
    renderFrame(animationTime);
    rafId = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (reducedMotion || running || disposed || !intersecting || document.hidden) return;
    running = true;
    previousTimestamp = null;
    rafId = requestAnimationFrame(tick);
  }

  function stopLoop() {
    running = false;
    previousTimestamp = null;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = 0;
  }

  function onPointerMove(event) {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const nx = THREE.MathUtils.clamp(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
      -1,
      1
    );
    const ny = THREE.MathUtils.clamp(
      ((event.clientY - rect.top) / rect.height) * 2 - 1,
      -1,
      1
    );
    targetTheta = baseTheta + THREE.MathUtils.degToRad(4) * nx;
    targetPhi = basePhi - THREE.MathUtils.degToRad(2.5) * ny;
  }

  function onVisibilityChange() {
    if (document.hidden) stopLoop();
    else startLoop();
  }

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(parent);

  const intersectionObserver = new IntersectionObserver(entries => {
    intersecting = entries[0]?.isIntersecting ?? true;
    if (intersecting) startLoop();
    else stopLoop();
  });
  intersectionObserver.observe(canvas);

  window.addEventListener('pointermove', onPointerMove, { passive: true });
  document.addEventListener('visibilitychange', onVisibilityChange);

  resize();
  startLoop();

  return {
    dispose() {
      if (disposed) return;
      disposed = true;
      stopLoop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('visibilitychange', onVisibilityChange);

      const disposedGeometries = new Set();
      const disposedMaterials = new Set();
      const disposedTextures = new Set();

      scene.traverse(object => {
        if (object.geometry && !disposedGeometries.has(object.geometry)) {
          disposedGeometries.add(object.geometry);
          object.geometry.dispose();
        }

        const objectMaterials = object.material
          ? (Array.isArray(object.material) ? object.material : [object.material])
          : [];

        for (const material of objectMaterials) {
          if (disposedMaterials.has(material)) continue;
          disposedMaterials.add(material);
          for (const value of Object.values(material)) {
            if (value instanceof THREE.Texture && !disposedTextures.has(value)) {
              disposedTextures.add(value);
              value.dispose();
            }
          }
          material.dispose();
        }
      });

      // Cached primitives that were baked into merged meshes are no longer in the scene graph.
      geometries.forEach(geometry => geometry.dispose());
      renderer.dispose();
      labelRenderer.domElement.remove();

      if (createdLabelLayer) {
        labelLayer.remove();
      } else {
        labelLayer.replaceChildren();
      }

      if (previousParentPosition !== null) {
        parent.style.position = previousParentPosition;
      }
    }
  };
}

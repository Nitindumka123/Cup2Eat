import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

interface Cup3DCanvasProps {
  currentFlavor: 'chocolate' | 'vanilla' | 'elaichi';
  beverageType?: 'latte' | 'chai' | 'chocolate';
  steamEnabled?: boolean;
  autoRotate?: boolean;
  liquidLevel?: number; // 0 to 1
  onCanvasClick?: () => void;
}

export const Cup3DCanvas: React.FC<Cup3DCanvasProps> = ({
  currentFlavor = 'chocolate',
  beverageType = 'latte',
  steamEnabled = true,
  autoRotate = true,
  liquidLevel = 0.8,
  onCanvasClick,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // References to 3D elements for dynamic state updates
  const cupMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const liquidMeshRef = useRef<THREE.Mesh | null>(null);
  const liquidMatRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const foamMeshRef = useRef<THREE.Mesh | null>(null);
  const steamParticlesRef = useRef<THREE.Points | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Initial WebGL Scene Setup
  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 440;

    // Detect software WebGL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(0, 2.6, 5.2);

    // 2. WebGL Renderer with ACESFilmic Tone Mapping
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);

    // 3. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = !isSoftwareGl;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.minPolarAngle = 0.2;
    controls.minDistance = 3.2;
    controls.maxDistance = 7.5;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.2;
    controlsRef.current = controls;

    // 4. Procedural Studio Environment Map (RoomEnvironment)
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Key Light (Warm Sunlight)
    const keyLight = new THREE.DirectionalLight(0xfff5e4, 2.5);
    keyLight.position.set(4.5, 6, 4);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0004;
    }
    scene.add(keyLight);

    // Fill Light (Cool Sky)
    const fillLight = new THREE.HemisphereLight(0xfff8ee, 0x073b2b, 1.4);
    scene.add(fillLight);

    // Rim Backlight (Warm Gold Highlight)
    const rimLight = new THREE.DirectionalLight(0xd9a52b, 2.0);
    rimLight.position.set(-4, 5, -4);
    scene.add(rimLight);

    // 5. Procedural Wafer Grid Bump Map Canvas
    const createWaffleTextures = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // Wafer background base
      ctx.fillStyle = '#909090';
      ctx.fillRect(0, 0, 512, 512);

      // Deep waffle grid pattern
      const step = 48;
      ctx.strokeStyle = '#202020';
      ctx.lineWidth = 14;

      for (let x = 0; x <= 512; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, 512);
        ctx.stroke();
      }
      for (let y = 0; y <= 512; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(512, y);
        ctx.stroke();
      }

      // Baked wafer noise & micro-pores
      for (let i = 0; i < 6000; i++) {
        const nx = Math.random() * 512;
        const ny = Math.random() * 512;
        ctx.fillStyle = Math.random() > 0.5 ? '#ffffff' : '#000000';
        ctx.globalAlpha = 0.08;
        ctx.fillRect(nx, ny, 2, 2);
      }
      ctx.globalAlpha = 1.0;

      const bumpTexture = new THREE.CanvasTexture(canvas);
      bumpTexture.wrapS = THREE.RepeatWrapping;
      bumpTexture.wrapT = THREE.RepeatWrapping;
      bumpTexture.repeat.set(5, 4);
      bumpTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      return bumpTexture;
    };

    const waffleBumpMap = createWaffleTextures();

    // Flavor Specific PBR Color
    const getFlavorColor = (flavor: 'chocolate' | 'vanilla' | 'elaichi') => {
      switch (flavor) {
        case 'chocolate':
          return new THREE.Color('#3A1D0E');
        case 'vanilla':
          return new THREE.Color('#C4932B');
        case 'elaichi':
          return new THREE.Color('#466343');
      }
    };

    const cupMaterial = new THREE.MeshStandardMaterial({
      color: getFlavorColor(currentFlavor),
      roughness: 0.65,
      metalness: 0.04,
      bumpMap: waffleBumpMap,
      bumpScale: 0.05,
    });
    cupMaterialRef.current = cupMaterial;

    // 6. Realistic Tapered Waffle Cup Geometry (Lathe Extrusion)
    const cupGroup = new THREE.Group();

    const points: THREE.Vector2[] = [];
    const heightCup = 2.3;
    const rBottom = 0.88;
    const rTop = 1.35;

    // Outer profile with curved base & rolled top rim lip
    points.push(new THREE.Vector2(0, 0));
    points.push(new THREE.Vector2(rBottom - 0.1, 0));
    points.push(new THREE.Vector2(rBottom, 0.08));
    points.push(new THREE.Vector2(rTop, heightCup - 0.12));
    // Rolled Top Rim Lip
    points.push(new THREE.Vector2(rTop + 0.1, heightCup - 0.04));
    points.push(new THREE.Vector2(rTop + 0.08, heightCup + 0.04));
    points.push(new THREE.Vector2(rTop - 0.02, heightCup + 0.04));
    // Inner profile
    points.push(new THREE.Vector2(rTop - 0.1, heightCup - 0.08));
    points.push(new THREE.Vector2(rBottom - 0.08, 0.16));
    points.push(new THREE.Vector2(0, 0.16));

    const cupGeo = new THREE.LatheGeometry(points, 48);
    cupGeo.computeVertexNormals();
    cupGeo.computeTangents();

    const cupMesh = new THREE.Mesh(cupGeo, cupMaterial);
    cupMesh.castShadow = !isSoftwareGl;
    cupMesh.receiveShadow = !isSoftwareGl;
    cupGroup.add(cupMesh);

    // Embossed Gold Brand Logo Seal Ring
    const sealGeo = new THREE.TorusGeometry(rTop - 0.02, 0.025, 16, 48);
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0xd9a52b,
      metalness: 0.8,
      roughness: 0.3,
    });
    const sealMesh = new THREE.Mesh(sealGeo, sealMat);
    sealMesh.rotation.x = Math.PI / 2;
    sealMesh.position.y = heightCup - 0.25;
    cupGroup.add(sealMesh);

    // Beverage Liquid Cavity Mesh
    const liquidGeo = new THREE.CylinderGeometry(rTop - 0.12, rBottom + 0.04, 1.7, 36);
    const liquidMat = new THREE.MeshStandardMaterial({
      color: 0x24130a, // Dark espresso base
      roughness: 0.12,
      metalness: 0.05,
    });
    liquidMatRef.current = liquidMat;

    const liquidMesh = new THREE.Mesh(liquidGeo, liquidMat);
    liquidMesh.position.y = 0.16 + 0.85 * liquidLevel;
    liquidMesh.scale.set(1, liquidLevel, 1);
    liquidMeshRef.current = liquidMesh;
    cupGroup.add(liquidMesh);

    // Foam Latte Art Disk
    const foamGeo = new THREE.CircleGeometry(rTop - 0.18, 36);
    const foamMat = new THREE.MeshStandardMaterial({
      color: 0xe6cbab,
      roughness: 0.4,
      side: THREE.DoubleSide,
    });
    const foamMesh = new THREE.Mesh(foamGeo, foamMat);
    foamMesh.rotation.x = -Math.PI / 2;
    foamMesh.position.y = 0.85;
    foamMeshRef.current = foamMesh;
    liquidMesh.add(foamMesh);

    // 7. Dark Walnut Studio Counter Surface + Contact Shadow
    const tableGeo = new THREE.PlaneGeometry(16, 16);
    const tableMat = new THREE.MeshStandardMaterial({
      color: 0x140e0a,
      roughness: 0.7,
      metalness: 0.1,
    });
    const tableMesh = new THREE.Mesh(tableGeo, tableMat);
    tableMesh.rotation.x = -Math.PI / 2;
    tableMesh.position.y = -0.02;
    tableMesh.receiveShadow = !isSoftwareGl;
    scene.add(tableMesh);

    // Soft Radial Contact Shadow Plane
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sctx = shadowCanvas.getContext('2d')!;
    const grad = sctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, 'rgba(0,0,0,0.85)');
    grad.addColorStop(0.6, 'rgba(0,0,0,0.3)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    sctx.fillStyle = grad;
    sctx.fillRect(0, 0, 128, 128);

    const shadowTex = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeo = new THREE.PlaneGeometry(3.6, 3.6);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTex,
      transparent: true,
      opacity: 0.65,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = 0.01;
    scene.add(shadowMesh);

    // 8. Scattered Props (Coffee Beans on Counter)
    const beanGroup = new THREE.Group();
    const beanGeo = new THREE.SphereGeometry(0.1, 12, 12);
    beanGeo.scale(1.4, 0.7, 0.9);
    const beanMat = new THREE.MeshStandardMaterial({ color: 0x2b170c, roughness: 0.4 });

    for (let i = 0; i < 14; i++) {
      const bean = new THREE.Mesh(beanGeo, beanMat);
      const angle = Math.random() * Math.PI * 2;
      const radius = 1.8 + Math.random() * 1.2;
      bean.position.set(Math.cos(angle) * radius, 0.04, Math.sin(angle) * radius);
      bean.rotation.set(Math.random(), Math.random(), Math.random());
      bean.castShadow = !isSoftwareGl;
      beanGroup.add(bean);
    }
    scene.add(beanGroup);

    // 9. Steam Particle System
    const particleCount = 35;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 0.7;
      positions[i * 3 + 1] = heightCup + Math.random() * 1.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0xfff8ee,
      size: 0.09,
      transparent: true,
      opacity: 0.3,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const steamParticles = new THREE.Points(particleGeo, particleMat);
    steamParticlesRef.current = steamParticles;
    scene.add(steamParticles);

    // Position cup
    cupGroup.position.y = 0.02;
    scene.add(cupGroup);

    // 10. Render Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Steam particle animation
      if (steamParticlesRef.current && steamEnabled) {
        const posAttr = steamParticlesRef.current.geometry.attributes.position as THREE.BufferAttribute;
        const array = posAttr.array as Float32Array;

        for (let i = 0; i < particleCount; i++) {
          array[i * 3 + 1] += delta * 0.35;
          array[i * 3] += Math.sin(time * 1.8 + i) * 0.002;
          if (array[i * 3 + 1] > heightCup + 2.0) {
            array[i * 3 + 1] = heightCup + 0.1;
            array[i * 3] = (Math.random() - 0.5) * 0.7;
            array[i * 3 + 2] = (Math.random() - 0.5) * 0.7;
          }
        }
        posAttr.needsUpdate = true;
      }

      controls.update();
      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 440;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      controls.dispose();
      renderer.dispose();
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update flavor colors dynamically
  useEffect(() => {
    if (cupMaterialRef.current) {
      let targetColor = '#3A1D0E';
      if (currentFlavor === 'chocolate') targetColor = '#3A1D0E';
      if (currentFlavor === 'vanilla') targetColor = '#C4932B';
      if (currentFlavor === 'elaichi') targetColor = '#466343';

      cupMaterialRef.current.color.set(targetColor);
    }
  }, [currentFlavor]);

  // Update beverage appearance dynamically
  useEffect(() => {
    if (liquidMatRef.current && foamMeshRef.current) {
      if (beverageType === 'latte') {
        liquidMatRef.current.color.set(0x28150a);
        foamMeshRef.current.visible = true;
      } else if (beverageType === 'chai') {
        liquidMatRef.current.color.set(0x733d1d); // Warm Indian Chai
        foamMeshRef.current.visible = false;
      } else if (beverageType === 'chocolate') {
        liquidMatRef.current.color.set(0x1a0a03); // Dark Cocoa
        foamMeshRef.current.visible = false;
      }
    }
  }, [beverageType]);

  // Update auto rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Update liquid level
  useEffect(() => {
    if (liquidMeshRef.current) {
      liquidMeshRef.current.scale.set(1, Math.max(0.01, liquidLevel), 1);
      liquidMeshRef.current.position.y = 0.16 + 0.85 * liquidLevel;
      liquidMeshRef.current.visible = liquidLevel > 0.05;
    }
  }, [liquidLevel]);

  // Update steam particles
  useEffect(() => {
    if (steamParticlesRef.current) {
      steamParticlesRef.current.visible = steamEnabled;
    }
  }, [steamEnabled]);

  return (
    <div
      ref={mountRef}
      onClick={onCanvasClick}
      className="w-full h-full cursor-grab active:cursor-grabbing"
    />
  );
};

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  useGLTF,
  Html,
  Environment,
  ContactShadows,
  Float,
  CameraControls,
  PerspectiveCamera,
  useProgress
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Info, ChevronDown, ChevronRight, Check, Plus, X, Share2 } from 'lucide-react';
import { SERVICES_DATA, VIEW_CONTENT } from './servicesData';
import LoadingScreen from './LoadingScreen';
import { DirtShell, FoamParticles, FoamAccumulator, WaterParticles, EngineSparkles, PetHairProxy, PetHairSparkles, HeadlightGlow, HeadlightFrontSparkles } from './CleaningEffects';

// Preload the model
useGLTF.preload('/bmw_m4_f82_optimized.glb');

// --- Constants & Styles ---
const THEME = {
  primary: '#FF7F50',
  dark: '#0a0a0a',
  text: '#ffffff',
  cardBg: 'rgba(10, 10, 10, 0.90)',
  border: 'rgba(255, 255, 255, 0.1)'
};

const HOME_MENU_ITEM = {
  id: 'home',
  title: 'Home',
  description: 'Reset to a hero orbit view of the car.',
  target: 'home'
};

const MENU_ITEMS = [HOME_MENU_ITEM, ...SERVICES_DATA];

// --- Hooks ---
function useMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return isMobile;
}

// --- Debug Helper ---
function ModelDebugger({ scene }) {
  useEffect(() => {
    // console.log("--- MODEL NODE STRUCTURE ---");
    scene.traverse((node) => {
      if (node.isMesh || node.isGroup) {
        // console.log(`Name: "${node.name}"`);
      }
    });
    // console.log("---------------------------");
  }, [scene]);
  return null;
}

// --- Camera Rig ---
function CameraRig({ view, enableHomeOrbit = true }) {
  const controls = useRef();
  const { camera } = useThree();
  const [homeOrbitEnabled, setHomeOrbitEnabled] = useState(false);

  useEffect(() => {
    if (!controls.current) return;

    switch (view) {
      case 'interior':
        // User requested swap: Driver door is at +X.
        // Positioned to align with back of seat, further down the car (negative Z)
        // Pulled back to avoid polygon glitching
        controls.current.setLookAt(
          1.5, 1.0, -0.5,
          0.0, 0.6, 0.0,
          true
        );
        controls.current.zoomTo(1.0, true);
        break;

      case 'interior_detail':
        // Dashboard/cockpit view for interior add-ons (from driver's perspective)
        // Moved back to show rear seats
        controls.current.setLookAt(
          0.0, 1.1, -1.2,
          0.0, 0.9, 0.5,
          true
        );
        controls.current.zoomTo(1.0, true);
        break;

      case 'interior_floor':
        // Low angle toward the rear footwells to showcase pet hair removal
        controls.current.setLookAt(
          0.0, 0.85, -0.8, // Position: lower and slightly behind the seats
          0.0, 0.15, 0.25, // Target: slightly lower toward the rear floor area
          true
        );
        controls.current.zoomTo(1.1, true);
        break;

      case 'engine':
        controls.current.setLookAt(
          0.8, 1.4, 2.0,
          0, 0.5, 0.5,
          true
        );
        break;

      case 'exterior':
        // Use the right-side profile view (same as demo target)
        controls.current.setLookAt(
          -2.0, 1.0, 3.0, // Position
          -0.8, 0.8, 0.0, // Target (Right Door approx)
          true
        );
        break;

      case 'paint':
        // Side profile view for Premium Protection
        controls.current.setLookAt(
          -5.5, 1.3, 0.2,
          0, 0.6, 0,
          true
        );
        break;

      case 'paint_detail':
        // Closer side profile for paint correction details - looking down the car
        controls.current.setLookAt(
          -3.2, 1.4, -1.5,
          0, 0.8, 0.5,
          true
        );
        break;

      case 'paint_correction':
        // Closer side sweep to showcase polishing passes
        controls.current.setLookAt(
          -3.0, 1.3, 1.6,
          0.2, 0.9, 0.1,
          true
        );
        controls.current.zoomTo(1.05, true);
        break;

      case 'ceramic_coating':
        // Slightly higher, balanced three-quarter to show overall gloss
        controls.current.setLookAt(
          -2.8, 1.6, -1.8,
          0.1, 0.9, 0.0,
          true
        );
        controls.current.zoomTo(1.0, true);
        break;

      case 'front':
        // Focus on headlight area (closer, lower angle)
        controls.current.setLookAt(
          1.0, 0.9, 2.2, // Position: Closer in
          0.5, 0.7, 1.8, // Target: Headlight area
          true
        );
        break;

      case 'wheel':
        controls.current.setLookAt(
          1.5, 1.2, 2.5,
          0.5, 0.7, 1.8,
          true
        );
        break;

      case 'right_side':
        // View of the right door
        controls.current.setLookAt(
          -2.0, 1.0, 3.0, // Position
          -0.8, 0.8, 0.0, // Target (Right Door approx)
          true
        );
        break;

      case 'home':
        // Hero-style orbit that keeps the car prominent
        controls.current.setLookAt(
          2.6, 1.6, 3.2,
          0.0, 0.9, 0.0,
          true
        );
        controls.current.zoomTo(1.1, true);
        break;

      default:
        controls.current.setLookAt(4, 2, 5, 0, 0, 0, true);
        break;
    }
  }, [view, camera]);

  useEffect(() => {
    if (view !== 'home' || !enableHomeOrbit) {
      setHomeOrbitEnabled(false);
      return;
    }
    const t = setTimeout(() => setHomeOrbitEnabled(true), 450); // let the camera settle first
    return () => clearTimeout(t);
  }, [view, enableHomeOrbit]);

  useFrame((_, delta) => {
    if (!controls.current || view !== 'home') return;
    if (homeOrbitEnabled) controls.current.rotate(-0.2 * delta, 0, false);
    controls.current.update(delta); // apply the gentle home orbit only
  });

  return <CameraControls ref={controls} minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} />;
}



// --- Canvas Loader Component ---
function CanvasLoader({ setLoadingProgress }) {
  const { progress } = useProgress();

  useEffect(() => {
    setLoadingProgress(progress);
  }, [progress, setLoadingProgress]);

  return null;
}

// --- 3D Car Component ---
function CarModel({ activeService, activeAddOn, onPartClick, cleaningState, isMobile, view, foamCount, waterCount, foamSplatCount, headlightTrigger, engineTrigger, petHairTrigger }) {
  const { scene } = useGLTF('/bmw_m4_f82_optimized.glb');

  // We store the *Pivot Groups* not the raw nodes for animation
  const [hoodGroup, setHoodGroup] = useState(null);
  const [leftDoorGroup, setLeftDoorGroup] = useState(null);
  const [rightDoorGroup, setRightDoorGroup] = useState(null);
  const [rightDoorNodes, setRightDoorNodes] = useState([]); // Store nodes for DirtShell
  const [engineGroup, setEngineGroup] = useState(null);
  const [engineNodes, setEngineNodes] = useState([]);
  const [engineBounds, setEngineBounds] = useState(null);
  const [headlightNodes, setHeadlightNodes] = useState([]);
  const [headlightLeftNodes, setHeadlightLeftNodes] = useState([]);
  const [headlightRightNodes, setHeadlightRightNodes] = useState([]);
  const [headlightLeftBounds, setHeadlightLeftBounds] = useState(null);
  const [headlightRightBounds, setHeadlightRightBounds] = useState(null);
  const [floorNodes, setFloorNodes] = useState([]);

  // Dirt Opacity State (Animation driven) - refs to avoid React churn per frame
  const dirtOpacityRef = useRef(0);
  const engineDirtOpacityRef = useRef(0);
  const engineHoldRef = useRef(0);
  const engineFadeRef = useRef(0);
  const engineDelayRef = useRef(0);
  const foamAccumRef = useRef();

  const isSetup = useRef(false);
  const lastCleaningState = useRef(cleaningState);
  const materialsInitialized = useRef(false);
  const ENGINE_HOLD_DURATION = 0.5;
  const ENGINE_FADE_DURATION = 2.5;
  const ENGINE_MAX_OPACITY = 0.85;
  const ENGINE_DELAY_DURATION = 0;

  // 1. Setup Grouping & Pivots (Run ONCE)
  useEffect(() => {
    if (isSetup.current) return;
    isSetup.current = true;

    // Temporary collectors
    const rawHoodNodes = [];
    const rawLeftDoorNodes = [];
    const rawRightDoorNodes = [];
    const rawEngineNodes = [];
    const rawHeadlightNodes = [];
    const rawHeadlightLeft = [];
    const rawHeadlightRight = [];
    const rawFloorNodes = [];
    let engineBayGroup = null;
    const tmpBox = new THREE.Box3();
    const tmpCenter = new THREE.Vector3();
    const tmpSize = new THREE.Vector3();
    const headlightNames = [];

    scene.traverse((node) => {
      if (node.isGroup && !engineBayGroup) {
        const groupName = node.name?.toLowerCase() || '';
        if (groupName.includes('enginebay')) {
          engineBayGroup = node;
        }
      }

      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
        const name = node.name.toLowerCase();
        const parentName = node.parent?.name.toLowerCase() || '';

        // --- HOOD DETECTION ---
        if ((name.includes('hood') || name.includes('bonnet')) &&
          !name.includes('badge') &&
          !name.includes('light') &&
          !name.includes('lamp')) {
          rawHoodNodes.push(node);
        }

        // --- ENGINE BAY DETECTION ---
        const isEngine =
          (name.includes('enginebay') || parentName.includes('enginebay')) ||
          ((name.includes('engine') || parentName.includes('engine')) && !name.includes('hood'));
        if (isEngine) {
          rawEngineNodes.push(node);
          if (!engineBayGroup && node.parent?.isObject3D) engineBayGroup = node.parent;
        }

        // --- HEADLIGHT DETECTION ---
        const isHeadlight =
          (name.includes('headlight') || name.includes('head_light')) &&
          !name.includes('tail') &&
          !name.includes('rear');
        const isFrontLampGlass =
          (name.includes('lamp') || name.includes('light')) &&
          (name.includes('glass') || name.includes('lens')) &&
          !name.includes('tail') &&
          !name.includes('rear');
        if (isHeadlight || isFrontLampGlass) {
          rawHeadlightNodes.push(node);
          headlightNames.push(node.name);

          // Quick left/right split based on name or position
          const isLeft = name.includes('left') || name.includes('_l') || node.position.x > 0;
          const isRight = name.includes('right') || name.includes('_r') || node.position.x < 0;
          if (isLeft && !isRight) rawHeadlightLeft.push(node);
          else if (isRight && !isLeft) rawHeadlightRight.push(node);
          else {
            // Fallback to world X if ambiguous
            node.updateWorldMatrix(true, false);
            node.getWorldPosition(tmpCenter);
            if (tmpCenter.x >= 0) rawHeadlightLeft.push(node); else rawHeadlightRight.push(node);
          }
        }

        // --- DOOR DETECTION ---
        const isBlocked =
          name.includes('rear') ||
          name.includes('back') ||
          name.includes('quarter') ||
          name.includes('fixed') ||
          name.includes('headlight') ||
          name.includes('lamp') ||
          name.includes('fog') ||
          name.includes('light') ||
          name.includes('windshield') ||
          name.includes('fender') ||
          name.includes('bumper') ||
          name.includes('grille') ||
          name.includes('skirt') ||
          name.includes('spoiler') ||
          name.includes('logo') ||
          name.includes('badge');

        if (!isBlocked) {
          // Explicit Left Door parts
          if (
            (name.includes('door') && (name.includes('left') || name.includes('_l'))) ||
            (parentName.includes('door') && (parentName.includes('left') || parentName.includes('_l')))
          ) {
            rawLeftDoorNodes.push(node);
          }
          // Explicit Right Door parts
          else if (
            (name.includes('door') && (name.includes('right') || name.includes('_r'))) ||
            (parentName.includes('door') && (parentName.includes('right') || parentName.includes('_r')))
          ) {
            rawRightDoorNodes.push(node);
          }
        }

        // Floor detection: explicit interior meshes that cover cabin base
        if (node.isMesh) {
          const isNamedFloor =
            name.includes('interior_ar4_interior_black_0'.toLowerCase()) ||
            name.includes('interior_ar4_alcnt_0'.toLowerCase()) ||
            name.includes('interior_ar4_main_0'.toLowerCase()) ||
            name.includes('interior_ar4_int_decals_0'.toLowerCase()) ||
            name.includes('interior_ar4_int_seams_0'.toLowerCase());
          if (isNamedFloor) {
            rawFloorNodes.push(node);
          }
        }
      }
    });

    // --- PIVOT CREATION ---
    // 1. Calculate Bounding Box to understand Scale
    const box = new THREE.Box3().setFromObject(scene);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    // console.log("Model Size:", size);
    // console.log("Model Center:", center);

    // 2. Final Hinge Setup (User Calibrated)
    // ISOLATING LEFT DOOR AS REQUESTED
    // User verified coordinates: X=0.830, Y=0.950, Z=0.670
    // User verified rotation: -1.15 (from the Hinge Tuner test)

    const leftHinge = new THREE.Vector3(0.830, 0.950, 0.670);
    // const rightHinge = new THREE.Vector3(-0.830, 0.950, 0.670);
    const hoodHinge = new THREE.Vector3(0, 1.0, 0.8);

    // --- ANIMATION GROUPS ---
    const leftGroup = new THREE.Group();
    leftGroup.position.copy(leftHinge);
    scene.add(leftGroup);
    rawLeftDoorNodes.forEach(node => leftGroup.attach(node));
    setLeftDoorGroup(leftGroup);

    // RIGHT DOOR SETUP
    const rightGroup = new THREE.Group();
    const rightHinge = new THREE.Vector3(-0.830, 0.950, 0.670); // Symmetric to left
    rightGroup.position.copy(rightHinge);
    scene.add(rightGroup);
    rawRightDoorNodes.forEach(node => rightGroup.attach(node));
    setRightDoorGroup(rightGroup);
    setRightDoorNodes(rawRightDoorNodes);

    const hGroup = new THREE.Group();
    hGroup.position.copy(hoodHinge);
    scene.add(hGroup);
    rawHoodNodes.forEach(node => hGroup.attach(node));
    setHoodGroup(hGroup);

    // ENGINE BAY (no re-parenting to preserve transforms)
    const engineBox = new THREE.Box3();
    rawEngineNodes.forEach((node) => {
      node.updateWorldMatrix(true, false);
      engineBox.expandByObject(node);
    });
    const engineCenter = engineBox.isEmpty() ? null : engineBox.getCenter(new THREE.Vector3());
    const engineSize = engineBox.isEmpty() ? null : engineBox.getSize(new THREE.Vector3());
    let engineOverlayGroup = engineBayGroup;
    if (!engineOverlayGroup) {
      engineOverlayGroup = new THREE.Group();
      scene.add(engineOverlayGroup);
    }
    setEngineGroup(engineOverlayGroup);
    setEngineNodes(rawEngineNodes);
    setEngineBounds(engineCenter && engineSize ? { center: engineCenter, size: engineSize } : null);

    setHeadlightNodes(rawHeadlightNodes);
    setHeadlightLeftNodes(rawHeadlightLeft);
    setHeadlightRightNodes(rawHeadlightRight);

    // Headlight bounds
    const leftBox = new THREE.Box3();
    rawHeadlightLeft.forEach((n) => {
      n.updateWorldMatrix(true, false);
      leftBox.expandByObject(n);
    });
    const rightBox = new THREE.Box3();
    rawHeadlightRight.forEach((n) => {
      n.updateWorldMatrix(true, false);
      rightBox.expandByObject(n);
    });
    const leftCenter = leftBox.isEmpty() ? null : leftBox.getCenter(new THREE.Vector3());
    const leftSize = leftBox.isEmpty() ? null : leftBox.getSize(new THREE.Vector3());
    const rightCenter = rightBox.isEmpty() ? null : rightBox.getCenter(new THREE.Vector3());
    const rightSize = rightBox.isEmpty() ? null : rightBox.getSize(new THREE.Vector3());
    setHeadlightLeftBounds(leftCenter && leftSize ? { center: leftCenter, size: leftSize } : null);
    setHeadlightRightBounds(rightCenter && rightSize ? { center: rightCenter, size: rightSize } : null);
    setFloorNodes(rawFloorNodes);

    console.info('Headlight node count:', rawHeadlightNodes.length, 'names:', headlightNames);
    console.info('PetHair floor candidates:', rawFloorNodes.map(n => n.name));

  }, [scene]); // Only run once per scene load

  // 2. Material Updates (Run when service changes)
  useEffect(() => {
    if (materialsInitialized.current) return;

    scene.traverse((node) => {
      if (node.isMesh && node.material) {
        // Store original values on first run
        if (node.userData.origEnvMapIntensity === undefined) {
          node.userData.origEnvMapIntensity = node.material.envMapIntensity || 1.0;
        }
        if (node.userData.origRoughness === undefined) {
          node.userData.origRoughness = node.material.roughness || 0.5;
        }

        // Restore original values
        node.material.envMapIntensity = node.userData.origEnvMapIntensity;
        node.material.roughness = node.userData.origRoughness;
        node.material.needsUpdate = true;
      }
    });

    materialsInitialized.current = true;
  }, [scene]);

  useEffect(() => {
    if (!engineTrigger) return;
    engineDelayRef.current = ENGINE_DELAY_DURATION;
    engineHoldRef.current = ENGINE_HOLD_DURATION;
    engineFadeRef.current = ENGINE_FADE_DURATION;
    engineDirtOpacityRef.current = ENGINE_MAX_OPACITY;
  }, [engineTrigger]);

  useEffect(() => {
    if (activeAddOn?.name?.includes('Engine')) return;
    engineDelayRef.current = 0;
    engineHoldRef.current = 0;
    engineFadeRef.current = 0;
    engineDirtOpacityRef.current = 0;
  }, [activeAddOn]);

  // Animations
  useFrame((state, delta) => {
    const easing = 2.0 * delta; // Smoother, slower easing
    const isEngineActive = activeAddOn?.name?.includes('Engine');
    const isInteriorActive = activeService?.id === 'interior' && view !== 'home';

    // Animate Groups
    if (hoodGroup) {
      const targetX = isEngineActive ? -0.8 : 0; // Open Down wider
      hoodGroup.rotation.x = THREE.MathUtils.lerp(hoodGroup.rotation.x, targetX, easing);
    }

    if (leftDoorGroup) {
      // Open Outwards (Using -1.15 as verified in Hinge Tuner)
      const targetY = isInteriorActive ? -1.15 : 0;
      leftDoorGroup.rotation.y = THREE.MathUtils.lerp(leftDoorGroup.rotation.y, targetY, easing);
    }

    // if (rightDoorGroup) {
    //   const targetY = isInteriorActive ? 1.15 : 0;
    //   rightDoorGroup.rotation.y = THREE.MathUtils.lerp(rightDoorGroup.rotation.y, targetY, easing);
    // }

    // Cleaning Animation Logic
    if (cleaningState !== lastCleaningState.current) {
      if (cleaningState === 'foaming') {
        dirtOpacityRef.current = 1;
      } else if (cleaningState === 'clean') {
        dirtOpacityRef.current = 0;
      }
      lastCleaningState.current = cleaningState;
    }

    const targetDirt =
      cleaningState === 'dirty' ? 1 :
        cleaningState === 'foaming' ? 0 :
          cleaningState === 'rinsing' ? 0 : 0;
    const dirtSpeed =
      cleaningState === 'foaming' ? 7.0 :
        cleaningState === 'rinsing' ? 8.5 :
          4.0;
    dirtOpacityRef.current = THREE.MathUtils.lerp(dirtOpacityRef.current, targetDirt, 1 - Math.exp(-dirtSpeed * delta));

    // Engine bay overlay timeline (matching headlight logic)
    let engineOpacity = 0;
    if (engineDelayRef.current > 0) {
      engineDelayRef.current = Math.max(0, engineDelayRef.current - delta);
    } else if (engineHoldRef.current > 0) {
      engineHoldRef.current = Math.max(0, engineHoldRef.current - delta);
      engineOpacity = ENGINE_MAX_OPACITY;
    } else if (engineFadeRef.current > 0) {
      engineFadeRef.current = Math.max(0, engineFadeRef.current - delta);
      engineOpacity = ENGINE_MAX_OPACITY * (engineFadeRef.current / ENGINE_FADE_DURATION);
    }
    engineDirtOpacityRef.current = engineOpacity;

  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (/window|glass|door/i.test(e.object.name)) {
      onPartClick('interior');
    }
  };

  // Expose cleaning function to parent via custom event or prop (simplified here)
  // useEffect(() => {
  //   window.handleClean = () => {
  //     if (cleaningState === 'clean') {
  //       setCleaningState('dirty');
  //       setDirtOpacity(1);
  //       return;
  //     }

  //     setCleaningState('foaming');
  //     setTimeout(() => {
  //       setCleaningState('rinsing');
  //       setTimeout(() => {
  //         setCleaningState('clean');
  //       }, 4000);
  //     }, 3000);
  //   };
  // }, [cleaningState]);

  return (
    <>
      <ModelDebugger scene={scene} />
      <primitive
        object={scene}
        scale={1.0}
        onPointerDown={handleClick}
      />

      {/* Pet hair proxy floor */}
      <PetHairProxy
        trigger={petHairTrigger}
        position={[0, 0.35, -0.2]}
        size={[3.0, 3.0]}
      />
      <PetHairSparkles trigger={petHairTrigger} />

      {/* Dirt Shell & Foam - Attached to the Right Door Group if it exists */}
      {
        rightDoorGroup && rightDoorNodes.length > 0 && (
          <primitive object={rightDoorGroup}>
            <DirtShell nodes={rightDoorNodes} opacityRef={dirtOpacityRef} />
            <FoamAccumulator
              ref={foamAccumRef}
              foaming={cleaningState === 'foaming'}
              rinsing={cleaningState === 'rinsing'}
              count={foamSplatCount}
            />
          </primitive>
        )
      }

      {/* Engine Bay Dirt Overlay */}
      {
        engineGroup && engineNodes.length > 0 && (
          <primitive object={engineGroup}>
            <DirtShell
              nodes={engineNodes}
              opacityRef={engineDirtOpacityRef}
              color="#5c4033"
              texturePath="/engine_dirt.png"
            />
          </primitive>
        )
      }

      {/* Engine sparkles (world-space, avoid double transforms) */}
      {
        engineBounds && (
          <EngineSparkles
            center={engineBounds.center}
            size={engineBounds.size}
            trigger={engineTrigger}
          />
        )
      }

      {/* Foam Cannon - World Space */}
      <FoamParticles
        active={cleaningState === 'foaming'}
        rinsing={false}
        doorMeshes={rightDoorNodes}
        onHit={(point, normal) => foamAccumRef.current?.addSplat(point, normal)}
        count={foamCount}
        position={[0, 0, 0]}
      />
      <WaterParticles
        active={cleaningState === 'rinsing'}
        doorMeshes={rightDoorNodes}
        count={waterCount}
      />

      {/* Headlight overlay (warm glow) */}
      <HeadlightGlow
        nodes={headlightNodes}
        trigger={headlightTrigger}
      />
      <HeadlightFrontSparkles
        nodes={headlightLeftNodes}
        center={headlightLeftBounds?.center}
        size={headlightLeftBounds?.size}
        fixedCenter={new THREE.Vector3(-0.7, 0.68, 1.85)}
        trigger={headlightTrigger}
        forward={new THREE.Vector3(0, 0, 1)}
        yNudge={0.04}
        zNudge={-0.05}
        xNudge={0}
      />
      <HeadlightFrontSparkles
        nodes={headlightRightNodes}
        center={headlightRightBounds?.center}
        size={headlightRightBounds?.size}
        fixedCenter={new THREE.Vector3(0.7, 0.68, 1.85)}
        trigger={headlightTrigger}
        forward={new THREE.Vector3(0, 0, 1)}
        yNudge={0.04}
        zNudge={-0.05}
        xNudge={0}
      />
    </>
  );
}



// --- UI Components ---

const ServiceItem = ({ item, isActive, onClick, isAddOn = false }) => (
  <motion.div
    layout
    onClick={onClick}
    style={{
      padding: '12px 16px',
      background: isActive ? 'rgba(255, 127, 80, 0.1)' : 'transparent',
      borderLeft: isActive ? `3px solid ${THEME.primary}` : '3px solid transparent',
      cursor: 'pointer',
      marginBottom: '4px',
      borderRadius: '0 8px 8px 0'
    }}
  >
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{
        fontSize: isAddOn ? '0.9rem' : '1rem',
        color: isActive ? THEME.primary : 'rgba(255,255,255,0.8)',
        fontWeight: isActive ? 600 : 400
      }}>
        {isAddOn && <Plus size={12} style={{ marginRight: 6, display: 'inline' }} />}
        {item.name || item.title}
      </span>
      {item.price !== undefined && (
        <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
          ${item.price}
        </span>
      )}
    </div>
    {isActive && !isAddOn && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        style={{ marginTop: '8px', fontSize: '0.85rem', color: '#aaa', lineHeight: '1.4' }}
      >
        {item.description}
      </motion.div>
    )}
  </motion.div>
);

const Sidebar = ({ activeService, setActiveService, activeAddOn, setActiveAddOn, setCameraView, activeMenuItem, setActiveMenuItem, queueInfoCard }) => {
  return (
    <div style={{
      position: 'absolute',
      left: 0,
      top: 0,
      bottom: 0,
      width: '350px',
      background: THEME.cardBg,
      backdropFilter: 'blur(20px)',
      borderRight: `1px solid ${THEME.border}`,
      zIndex: 20,
      overflowY: 'auto',
      padding: '100px 0 40px 0'
    }}>
      <div style={{ padding: '0 24px 24px 24px' }}>
        <h2 style={{
          fontFamily: '"Playfair Display", serif',
          color: 'white',
          fontSize: '1.8rem',
          marginBottom: '8px'
        }}>
          Service Menu
        </h2>
        <p style={{ color: '#888', fontSize: '0.9rem' }}>
          Select a package to view details and 3D demonstration.
        </p>
      </div>

      {/* Main Service Buttons - Always Visible */}
      <div>
        {MENU_ITEMS.map((service) => {
          const isHome = service.id === 'home';
          const isActive = activeMenuItem === service.id;
          return (
            <div key={service.id}>
              <ServiceItem
                item={service}
                isActive={isActive}
                onClick={() => {
                  if (isHome) {
                    setActiveMenuItem('home');
                    setActiveAddOn(null);
                    setCameraView('home');
                    queueInfoCard('home');
                    return;
                  }
                  setActiveMenuItem(service.id);
                  setActiveService(service);
                  setActiveAddOn(null);
                  setCameraView(service.target);
                  queueInfoCard(service.target);
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Add-ons Section - Shows below all three main buttons */}
      <AnimatePresence>
        {activeService && activeService.addOns && activeService.addOns.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ overflow: 'hidden', background: 'rgba(0,0,0,0.2)' }}
          >
            <div style={{ padding: '12px 0' }}>
              <div style={{
                padding: '0 24px 8px',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#666'
              }}>
                Recommended Add-ons
              </div>
              {activeService.addOns.map((addon, idx) => (
                <ServiceItem
                  key={idx}
                  item={addon}
                  isActive={activeAddOn?.name === addon.name}
                  isAddOn={true}
                  onClick={() => {
                    setActiveAddOn(activeAddOn?.name === addon.name ? null : addon);
                    if (addon.target) {
                      setCameraView(addon.target);
                      queueInfoCard(addon.target);
                    }
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};



// Minimal info card shell (no text yet) that appears after camera settles
// Minimal info card shell (no text yet) that appears after camera settles
const InfoCard = ({ visible, onClose, isMobile, view }) => {
  const content = VIEW_CONTENT[view];

  return (
    <AnimatePresence>
      {visible && content && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 0.22, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            top: isMobile ? '100px' : '120px',
            right: isMobile ? '16px' : '32px',
            width: isMobile ? '280px' : '340px',
            minHeight: '180px',
            background: 'linear-gradient(145deg, rgba(18, 14, 12, 0.95), rgba(10, 8, 6, 0.95))',
            border: `1px solid ${THEME.primary}`,
            borderRadius: '4px', // Sharper corners for premium feel
            boxShadow: '0 14px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,127,80,0.1)',
            padding: '32px 24px',
            color: 'white',
            zIndex: 60,
            pointerEvents: 'auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            ...content.position // Override position based on view
          }}
        >
          <button
            onClick={onClose}
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              border: 'none',
              background: 'transparent',
              color: 'rgba(255,255,255,0.4)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s ease'
            }}
            aria-label="Close info card"
          >
            <X size={18} />
          </button>

          <h3 style={{
            fontFamily: '"Playfair Display", serif',
            fontSize: '1.6rem',
            fontWeight: '700',
            margin: '0 0 16px 0',
            color: THEME.primary,
            textTransform: 'uppercase',
            letterSpacing: '1px',
            lineHeight: '1.1'
          }}>
            {content.title}
          </h3>

          <div style={{
            width: '60px',
            height: '2px',
            background: 'rgba(255,255,255,0.2)',
            marginBottom: '20px'
          }} />

          <p style={{
            fontFamily: 'inherit',
            fontSize: '1rem',
            lineHeight: '1.6',
            color: 'rgba(255,255,255,0.9)',
            margin: 0,
            fontWeight: '300'
          }}>
            {content.description}
          </p>

        </motion.div>
      )}
    </AnimatePresence>
  );
};


// --- Booking Modal ---
const BookingModal = ({ isOpen, onClose, service, addOn }) => {
  if (!isOpen) return null;
  const total = (service?.price || 0) + (addOn?.price || 0);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
    }} onClick={onClose}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#111', border: `1px solid ${THEME.border}`,
          padding: '30px', borderRadius: '20px', width: '100%', maxWidth: '400px',
          position: 'relative'
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}>
          <X size={24} />
        </button>

        <h2 style={{ color: 'white', fontFamily: '"Playfair Display", serif', marginTop: 0 }}>Request Booking</h2>
        <div style={{ marginBottom: '20px', color: '#888', fontSize: '0.9rem' }}>
          <p>Service: <span style={{ color: 'white' }}>{service?.title}</span></p>
          {addOn && <p>Add-on: <span style={{ color: 'white' }}>{addOn.name}</span></p>}
          <p style={{ color: THEME.primary, fontWeight: 'bold', fontSize: '1.1rem', marginTop: '10px' }}>Total Est: ${total}</p>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); alert("Booking request sent! (Demo)"); onClose(); }}>
          <input type="text" placeholder="Your Name" style={{ width: '100%', padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: 'white', marginBottom: '10px' }} required />
          <input type="tel" placeholder="Phone Number" style={{ width: '100%', padding: '12px', background: '#222', border: '1px solid #333', borderRadius: '8px', color: 'white', marginBottom: '20px' }} required />
          <button type="submit" style={{ width: '100%', padding: '14px', background: THEME.primary, color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer' }}>
            Send Request
          </button>
        </form>
      </motion.div>
    </div>
  );
};

// --- BottomSheet Component (Mobile) ---
const BottomSheet = ({
  activeService,
  activeMenuItem,
  setActiveMenuItem,
  setActiveService,
  activeAddOn,
  setActiveAddOn,
  setCameraView,
  queueInfoCard,
  onShare
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      initial={{ y: '100%' }}
      animate={{ y: isOpen ? 0 : 'calc(100% - 60px)' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: '70vh',
        background: THEME.cardBg,
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${THEME.border}`,
        zIndex: 40,
        borderRadius: '20px 20px 0 0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Drag Handle / Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '16px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          borderBottom: `1px solid ${THEME.border}`,
          position: 'relative'
        }}
      >
        <div style={{
          width: '40px',
          height: '4px',
          background: 'rgba(255,255,255,0.3)',
          borderRadius: '2px'
        }} />

        <button
          onClick={(e) => { e.stopPropagation(); onShare(); }}
          style={{
            position: 'absolute',
            right: 20,
            top: 16,
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.6)',
            cursor: 'pointer'
          }}
        >
          <Share2 size={20} />
        </button>
      </div>

      <div style={{ overflowY: 'auto', flex: 1, padding: '20px' }}>
        <h2 style={{
          fontFamily: '"Playfair Display", serif',
          color: 'white',
          fontSize: '1.5rem',
          marginBottom: '8px'
        }}>
          Service Menu
        </h2>

        {/* Main Services */}
        <div style={{ marginBottom: '20px' }}>
          {MENU_ITEMS.map((service) => {
            const isHome = service.id === 'home';
            const isActive = activeMenuItem === service.id;
            return (
              <ServiceItem
                key={service.id}
                item={service}
                isActive={isActive}
                onClick={() => {
                  if (isHome) {
                    setActiveMenuItem('home');
                    setActiveAddOn(null);
                    setCameraView('home');
                    queueInfoCard('home');
                    setIsOpen(false);
                    return;
                  }
                  setActiveMenuItem(service.id);
                  setActiveService(service);
                  setActiveAddOn(null);
                  setCameraView(service.target);
                  queueInfoCard(service.target);
                  setIsOpen(false); // Auto-minimize on selection for better view
                }}
              />
            );
          })}
        </div>

        {/* Add-ons */}
        <AnimatePresence>
          {activeService && activeService.addOns && activeService.addOns.length > 0 && (
            <div style={{ marginTop: '10px' }}>
              <div style={{
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: '#666',
                marginBottom: '10px'
              }}>
                Available Add-ons
              </div>
              {activeService.addOns.map((addon, idx) => (
                <ServiceItem
                  key={idx}
                  item={addon}
                  isActive={activeAddOn?.name === addon.name}
                  isAddOn={true}
                  onClick={() => {
                    setActiveAddOn(activeAddOn?.name === addon.name ? null : addon);
                    if (addon.target) {
                      setCameraView(addon.target);
                      queueInfoCard(addon.target);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default function App() {
  const isMobile = useMobile();
  const prefersReducedMotion = useMemo(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }, []);
  const performanceTier = useMemo(() => {
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 8 : 8;
    const memory = typeof navigator !== 'undefined' && navigator.deviceMemory ? navigator.deviceMemory : 8;
    const score = (isMobile ? 1 : 0) + (dpr > 1.75 ? 1 : 0) + (cores <= 4 ? 1 : 0) + (memory && memory <= 4 ? 1 : 0);
    return score >= 2 ? 'low' : 'high';
  }, [isMobile]);
  const foamCount = performanceTier === 'low' ? (isMobile ? 260 : 420) : (isMobile ? 350 : 500);
  const waterCount = performanceTier === 'low' ? (isMobile ? 140 : 220) : (isMobile ? 180 : 280);
  const foamSplatCount = performanceTier === 'low' ? 220 : 320;
  const shouldFloat = !prefersReducedMotion && performanceTier !== 'low';
  const [activeService, setActiveService] = useState(HOME_MENU_ITEM);
  const [activeMenuItem, setActiveMenuItem] = useState('home');
  const [activeAddOn, setActiveAddOn] = useState(null);
  const [cameraView, setCameraView] = useState('home');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [headlightTrigger, setHeadlightTrigger] = useState(0);
  const [infoCardVisible, setInfoCardVisible] = useState(false);
  const infoCardTimer = useRef(null);

  // Cleaning State (Lifted)
  const [cleaningState, setCleaningState] = useState('clean');
  const [engineTrigger, setEngineTrigger] = useState(0);
  const [petHairTrigger, setPetHairTrigger] = useState(0);

  const cleaningTimers = useRef([]);

  const handleClean = () => {
    if (cleaningState === 'foaming' || cleaningState === 'rinsing') return;

    // Clear any existing timers before starting a new sequence
    cleaningTimers.current.forEach(clearTimeout);
    cleaningTimers.current = [];

    // brief pause so camera can settle on the door
    setCleaningState('dirty');

    cleaningTimers.current.push(setTimeout(() => {
      setCleaningState('foaming');
      cleaningTimers.current.push(setTimeout(() => {
        setCleaningState('rinsing');
        cleaningTimers.current.push(setTimeout(() => {
          setCleaningState('clean');
        }, 4000));
      }, 2500)); // slightly longer foaming window before rinse
    }, 1250)); // linger on dirty view a bit longer before spraying
  };

  // Watchdog: Kill exterior animation if user leaves the "exterior" service
  useEffect(() => {
    if (activeService?.id !== 'exterior') {
      cleaningTimers.current.forEach(clearTimeout);
      cleaningTimers.current = [];
      setCleaningState('clean');
    }
  }, [activeService]);

  // Schedule the minimal info card after camera settles
  const queueInfoCard = (view) => {
    if (infoCardTimer.current) clearTimeout(infoCardTimer.current);
    setInfoCardVisible(false);
    if (!view || view === 'home') return;
    infoCardTimer.current = setTimeout(() => setInfoCardVisible(true), 650);
  };

  useEffect(() => {
    return () => {
      if (infoCardTimer.current) clearTimeout(infoCardTimer.current);
    };
  }, []);

  // Engine bay cleaning trigger (matches headlight timing)
  useEffect(() => {
    if (activeAddOn?.name?.includes('Engine')) {
      setCameraView('engine');
      setEngineTrigger(Date.now());
    } else {
      setEngineTrigger(0);
    }
  }, [activeAddOn, setCameraView]);

  // Headlight add-on: just snap camera forward for now
  useEffect(() => {
    if (activeAddOn?.name === 'Headlight Restoration') {
      setCameraView('front');
    }
  }, [activeAddOn, setCameraView]);

  // Trigger headlight glow flash on selection
  useEffect(() => {
    if (activeAddOn?.name === 'Headlight Restoration') {
      const t = Date.now();
      setHeadlightTrigger(t);
      console.info('[Headlight] Trigger fired at', new Date(t).toISOString());
    }
  }, [activeAddOn]);

  // Pet Hair Removal trigger (rear floor focus)
  useEffect(() => {
    const isPetHair = activeService?.id === 'interior' && activeAddOn?.name === 'Pet Hair Removal';
    if (isPetHair) {
      setCameraView('interior_floor');
      setPetHairTrigger(Date.now());
    } else {
      setPetHairTrigger(0);
    }
  }, [activeAddOn, activeService, setCameraView]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Hardy's Wash N' Wax",
          text: `Check out this ${activeService.title} configuration!`,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing', error);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  // Hide loading screen when model is fully loaded
  useEffect(() => {
    if (loadingProgress >= 100) {
      const timer = setTimeout(() => setIsLoaded(true), 150);
      return () => clearTimeout(timer);
    }
  }, [loadingProgress]);

  return (
    <div style={{ width: '100%', height: '100vh', background: 'linear-gradient(to bottom, #000000 0%, #1a0b05 70%, #4a1905 100%)', position: 'relative', overflow: 'hidden' }}>

      {/* LOADING SCREEN */}
      <AnimatePresence>
        {!isLoaded && <LoadingScreen progress={loadingProgress} />}
      </AnimatePresence>

      {/* HEADER UI */}
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '80px',
        zIndex: 30,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 40px',
        pointerEvents: 'none'
      }}>
        <div style={{
          marginLeft: isMobile ? '0' : '320px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          pointerEvents: 'auto'
        }}>
          <div style={{
            width: isMobile ? '32px' : '40px',
            height: isMobile ? '32px' : '40px',
            background: THEME.primary,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: 'white',
            fontSize: isMobile ? '0.9rem' : '1rem'
          }}>H</div>
          <div>
            <h1 style={{
              margin: 0,
              color: 'white',
              fontFamily: '"Playfair Display", serif',
              fontSize: isMobile ? '1.2rem' : '1.5rem',
              letterSpacing: '0.5px',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}>
              Hardy's Wash N' Wax
            </h1>
          </div>
        </div>

        {!isMobile && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleShare}
              style={{
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)'
              }}
              title="Share Configuration"
            >
              <Share2 size={20} />
            </button>

            <button
              onClick={() => setIsBookingOpen(true)}
              style={{
                pointerEvents: 'auto',
                background: 'white',
                color: 'black',
                border: 'none',
                padding: '12px 28px',
                borderRadius: '30px',
                fontWeight: '600',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
              }}>
              <Phone size={16} />
              Book Selection • ${(activeService?.price || 0) + (activeAddOn?.price || 0)}
            </button>
          </div>
        )}
      </header>

      <InfoCard
        visible={infoCardVisible}
        onClose={() => setInfoCardVisible(false)}
        isMobile={isMobile}
        view={cameraView}
      />

      {isMobile ? (
        <BottomSheet
          activeService={activeService}
          activeMenuItem={activeMenuItem}
          setActiveMenuItem={setActiveMenuItem}
          setActiveService={(service) => {
            setActiveService(service);
            setActiveMenuItem(service?.id || activeMenuItem);
            if (service?.id === 'exterior') handleClean();
          }}
          activeAddOn={activeAddOn}
          setActiveAddOn={setActiveAddOn}
          setCameraView={setCameraView}
          queueInfoCard={queueInfoCard}
          onShare={handleShare}
        />
      ) : (
        <Sidebar
          activeService={activeService}
          activeMenuItem={activeMenuItem}
          setActiveMenuItem={setActiveMenuItem}
          setActiveService={(service) => {
            setActiveService(service);
            setActiveMenuItem(service?.id || activeMenuItem);
            if (service?.id === 'exterior') handleClean();
          }}
          activeAddOn={activeAddOn}
          setActiveAddOn={setActiveAddOn}
          setCameraView={setCameraView}
          queueInfoCard={queueInfoCard}
        />
      )}

      <Canvas
        shadows
        dpr={isMobile ? [1, 1.5] : [1, 1.75]} // Clamp desktop DPR to reduce render target size
        performance={{ min: 0.5 }} // Allow frame rate to drop if needed
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false
        }}
        style={{ marginLeft: isMobile ? '0' : '350px', width: isMobile ? '100%' : 'calc(100% - 350px)' }}
      >
        <Suspense fallback={<CanvasLoader setLoadingProgress={setLoadingProgress} />}>
          <ambientLight intensity={0.45} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={8}
            castShadow
            shadow-mapSize={isMobile ? [384, 384] : [768, 768]} // Reduced for mobile performance
          />
          <pointLight position={[-10, -10, -10]} color={THEME.primary} intensity={5} />

          <Environment preset="city" blur={isMobile ? 0.6 : 0.4} resolution={isMobile ? 128 : 256} />

          {isMobile ? (
            <CarModel
              activeService={activeService}
              activeAddOn={activeAddOn}
              onPartClick={setCameraView}
              cleaningState={cleaningState}
              petHairTrigger={petHairTrigger}
              isMobile={isMobile}
              view={cameraView}
              foamCount={foamCount}
              waterCount={waterCount}
              foamSplatCount={foamSplatCount}
              headlightTrigger={headlightTrigger}
              engineTrigger={engineTrigger}
            />
          ) : (
            shouldFloat ? (
              <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
                <CarModel
                  activeService={activeService}
                  activeAddOn={activeAddOn}
                  onPartClick={setCameraView}
                  cleaningState={cleaningState}
                  petHairTrigger={petHairTrigger}
                  isMobile={isMobile}
                  view={cameraView}
                  foamCount={foamCount}
                  waterCount={waterCount}
                  foamSplatCount={foamSplatCount}
                  headlightTrigger={headlightTrigger}
                  engineTrigger={engineTrigger}
                />
              </Float>
            ) : (
              <CarModel
                activeService={activeService}
                activeAddOn={activeAddOn}
                onPartClick={setCameraView}
                cleaningState={cleaningState}
                petHairTrigger={petHairTrigger}
                isMobile={isMobile}
                view={cameraView}
                foamCount={foamCount}
                waterCount={waterCount}
                foamSplatCount={foamSplatCount}
                headlightTrigger={headlightTrigger}
                engineTrigger={engineTrigger}
              />
            )
          )}

          <ContactShadows
            resolution={isMobile ? 320 : 768}
            scale={isMobile ? 24 : 32}
            blur={isMobile ? 2.2 : 2.8}
            opacity={0.65}
            far={30}
            color="#000000"
            frames={1}
          />

          <CameraRig view={cameraView} enableHomeOrbit={!isMobile} />
        </Suspense>
      </Canvas>

      {/* HERO FOOTER */}
      {/* HERO FOOTER - Desktop Only or Simplified Mobile */}
      {!isMobile && (
        <div style={{
          position: 'absolute',
          bottom: '40px',
          left: '390px', // Sidebar width + padding
          zIndex: 25,
          maxWidth: '600px',
          pointerEvents: 'none'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: activeMenuItem === 'home' ? 1 : 0,
              y: activeMenuItem === 'home' ? 0 : 20
            }}
            transition={{ duration: 0.5 }}
          >
            <h1 style={{
              margin: '0 0 16px 0',
              lineHeight: '1.1',
              textShadow: '0 2px 20px rgba(0,0,0,0.8)',
              fontFamily: '"Playfair Display", serif',
              fontSize: '3rem',
            }}>
              <span style={{ display: 'block', color: 'white', marginBottom: '8px' }}>
                Mobile Car Detailing
              </span>
              <span style={{ color: THEME.primary, fontWeight: 'normal' }}>
                Sacramento, CA
              </span>
            </h1>
            <h2 style={{
              color: '#e0e0e0',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: '24px',
              textShadow: '0 1px 10px rgba(0,0,0,0.8)',
              fontWeight: 'normal',
              fontFamily: 'inherit'
            }}>
              Providing Interior Detailing, Exterior Detailing, Paint Correction,
              Ceramic Coating, and more! Serving Sacramento, Davis, Woodland,
              Dixon, Winters, Elk Grove, and surrounding areas — all delivered
              with precision, care, and professional-grade results.
            </h2>
          </motion.div>
        </div>
      )}

      {/* Mobile Floating Action Button for Booking */}
      {isMobile && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsBookingOpen(true)}
          style={{
            position: 'absolute',
            bottom: '80px', // Above bottom sheet collapsed state
            right: '20px',
            zIndex: 50,
            background: THEME.primary,
            color: 'white',
            border: 'none',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 20px rgba(255, 127, 80, 0.4)'
          }}
        >
          <Phone size={24} />
        </motion.button>
      )}

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        service={activeService}
        addOn={activeAddOn}
      />

    </div>
  );
}

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
  useTexture,
  useProgress
} from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Info, ChevronDown, ChevronRight, Check, Plus, X, Share2 } from 'lucide-react';
import { SERVICES_DATA } from './servicesData';
import LoadingScreen from './LoadingScreen';

// Preload the model
useGLTF.preload('/bmw_m4_f82.glb');

// --- Constants & Styles ---
const THEME = {
  primary: '#FF7F50',
  dark: '#0a0a0a',
  text: '#ffffff',
  cardBg: 'rgba(10, 10, 10, 0.90)',
  border: 'rgba(255, 255, 255, 0.1)'
};

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
function CameraRig({ view }) {
  const controls = useRef();
  const { camera } = useThree();

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

      case 'engine':
        controls.current.setLookAt(
          0.8, 1.4, 2.0,
          0, 0.5, 0.5,
          true
        );
        break;

      case 'exterior':
        controls.current.setLookAt(
          4, 2, 5,
          0, 0.5, 0,
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

      case 'wheel':
      case 'front':
        // Focus on headlight area (front bumper, higher angle)
        controls.current.setLookAt(
          1.5, 1.2, 2.5,
          0.5, 0.7, 1.8,
          true
        );
        break;

      default:
        controls.current.setLookAt(4, 2, 5, 0, 0, 0, true);
        break;
    }
  }, [view, camera]);

  return <CameraControls ref={controls} minPolarAngle={0} maxPolarAngle={Math.PI / 1.8} />;
}

// --- Background Component ---
function Background() {
  const texture = useTexture('/background.png');
  texture.colorSpace = THREE.SRGBColorSpace;

  return (
    <mesh position={[0, 0, -5]} rotation={[0, 0, 0]}>
      <planeGeometry args={[30, 15]} />
      <meshBasicMaterial map={texture} toneMapped={false} />
    </mesh>
  );
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
function CarModel({ activeService, activeAddOn, onPartClick }) {
  const { scene } = useGLTF('/bmw_m4_f82.glb');

  // We store the *Pivot Groups* not the raw nodes for animation
  const [hoodGroup, setHoodGroup] = useState(null);
  const [leftDoorGroup, setLeftDoorGroup] = useState(null);
  const [rightDoorGroup, setRightDoorGroup] = useState(null);

  const isSetup = useRef(false);

  // 1. Setup Grouping & Pivots (Run ONCE)
  useEffect(() => {
    if (isSetup.current) return;
    isSetup.current = true;

    // Temporary collectors
    const rawHoodNodes = [];
    const rawLeftDoorNodes = [];
    const rawRightDoorNodes = [];

    scene.traverse((node) => {
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

    // DISABLE RIGHT DOOR FOR NOW
    // const rightGroup = new THREE.Group();
    // rightGroup.position.copy(rightHinge);
    // scene.add(rightGroup);
    // rawRightDoorNodes.forEach(node => rightGroup.attach(node));
    // setRightDoorGroup(rightGroup);

    const hGroup = new THREE.Group();
    hGroup.position.copy(hoodHinge);
    scene.add(hGroup);
    rawHoodNodes.forEach(node => hGroup.attach(node));
    setHoodGroup(hGroup);

  }, [scene]); // Only run once per scene load

  // 2. Material Updates (Run when service changes)
  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh && node.material) {
        if (!node.userData.origEnvMapIntensity) {
          node.userData.origEnvMapIntensity = node.material.envMapIntensity;
        }

        if (activeService?.id === 'premium') {
          node.material.envMapIntensity = 3.0;
          node.material.roughness = Math.max(0, node.material.roughness - 0.2);
        } else {
          node.material.envMapIntensity = 1.5;
        }
        node.material.needsUpdate = true;
      }
    });
  }, [scene, activeService]);

  // Animations
  useFrame((state, delta) => {
    const easing = 2.0 * delta; // Smoother, slower easing
    const isEngineActive = activeAddOn?.name?.includes('Engine');
    const isInteriorActive = activeService?.id === 'interior';

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
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (/window|glass|door/i.test(e.object.name)) {
      onPartClick('interior');
    }
  };

  return (
    <>
      <ModelDebugger scene={scene} />
      <primitive
        object={scene}
        scale={1.0}
        onPointerDown={handleClick}
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
      <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
        ${item.price}
      </span>
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

const Sidebar = ({ activeService, setActiveService, activeAddOn, setActiveAddOn, setCameraView }) => {
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
        {SERVICES_DATA.map((service) => {
          const isActive = activeService?.id === service.id;
          return (
            <div key={service.id}>
              <ServiceItem
                item={service}
                isActive={isActive}
                onClick={() => {
                  setActiveService(service);
                  setActiveAddOn(null);
                  setCameraView(service.target);
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
                    if (addon.target) setCameraView(addon.target);
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
const BottomSheet = ({ activeService, setActiveService, activeAddOn, setActiveAddOn, setCameraView, onShare }) => {
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
          {SERVICES_DATA.map((service) => {
            const isActive = activeService?.id === service.id;
            return (
              <ServiceItem
                key={service.id}
                item={service}
                isActive={isActive}
                onClick={() => {
                  setActiveService(service);
                  setActiveAddOn(null);
                  setCameraView(service.target);
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
                    if (addon.target) setCameraView(addon.target);
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
  const [activeService, setActiveService] = useState(SERVICES_DATA[1]);
  const [activeAddOn, setActiveAddOn] = useState(null);
  const [cameraView, setCameraView] = useState('default');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

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
      const timer = setTimeout(() => setIsLoaded(true), 500);
      return () => clearTimeout(timer);
    }
  }, [loadingProgress]);

  return (
    <div style={{ width: '100%', height: '100vh', background: '#050505', position: 'relative', overflow: 'hidden' }}>

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

      {isMobile ? (
        <BottomSheet
          activeService={activeService}
          setActiveService={setActiveService}
          activeAddOn={activeAddOn}
          setActiveAddOn={setActiveAddOn}
          setCameraView={setCameraView}
          onShare={handleShare}
        />
      ) : (
        <Sidebar
          activeService={activeService}
          setActiveService={setActiveService}
          activeAddOn={activeAddOn}
          setActiveAddOn={setActiveAddOn}
          setCameraView={setCameraView}
        />
      )}

      <Canvas
        shadows
        dpr={isMobile ? [1, 1.5] : [1, 2]} // Lower max DPR for better mobile performance
        performance={{ min: 0.5 }} // Allow frame rate to drop if needed
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: 'high-performance',
          preserveDrawingBuffer: false
        }}
        style={{ marginLeft: isMobile ? '0' : '350px', width: isMobile ? '100%' : 'calc(100% - 350px)' }}
      >
        <Suspense fallback={<CanvasLoader setLoadingProgress={setLoadingProgress} />}>
          <CanvasLoader setLoadingProgress={setLoadingProgress} />
          <Background />

          <ambientLight intensity={0.5} />
          <spotLight
            position={[10, 10, 10]}
            angle={0.15}
            penumbra={1}
            intensity={10}
            castShadow
            shadow-mapSize={isMobile ? [512, 512] : [1024, 1024]} // Reduced for mobile performance
          />
          <pointLight position={[-10, -10, -10]} color={THEME.primary} intensity={5} />

          <Environment preset="city" />

          <Float speed={1} rotationIntensity={0.1} floatIntensity={0.1}>
            <CarModel
              activeService={activeService}
              activeAddOn={activeAddOn}
              onPartClick={setCameraView}
            />
          </Float>

          <ContactShadows
            resolution={isMobile ? 512 : 1024}
            scale={10}
            blur={isMobile ? 2 : 1}
            opacity={1}
            far={10}
            color="#000000"
          />

          <CameraRig view={cameraView} />
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 style={{
              color: 'white',
              fontFamily: '"Playfair Display", serif',
              fontSize: '3rem',
              margin: '0 0 16px 0',
              lineHeight: '1.1',
              textShadow: '0 2px 20px rgba(0,0,0,0.8)'
            }}>
              Mobile Car Detailing<br />
              <span style={{ color: THEME.primary }}>Sacramento, CA</span>
            </h2>
            <p style={{
              color: '#e0e0e0',
              fontSize: '1.1rem',
              lineHeight: '1.6',
              marginBottom: '24px',
              textShadow: '0 1px 10px rgba(0,0,0,0.8)'
            }}>
              Providing Interior Detailing, Exterior Detailing, Paint Correction,
              Ceramic Coating, and more! Serving Sacramento, Davis, Woodland,
              Dixon, Winters, Elk Grove, and surrounding areas — all delivered
              with precision, care, and professional-grade results.
            </p>
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

import React, { useRef, useMemo, useEffect, useImperativeHandle, forwardRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture, useGLTF } from '@react-three/drei';

// --- Dirt Shell Component ---
// Renders a transparent "dirt" layer over the existing geometry
export function DirtShell({ nodes, opacity = 1, opacityRef, color = '#3e2b22', texturePath = '/dirt_mask_inverted.png' }) {
    const texture = useTexture(texturePath);
    const materialRefs = useRef([]);

    useFrame(() => {
        if (!opacityRef) return;
        const next = opacityRef.current ?? 0;
        materialRefs.current.forEach((mat) => {
            if (!mat) return;
            mat.opacity = next;
            mat.transparent = true;
            mat.visible = next > 0.001;
        });
    });

    return (
        <group>
            {nodes.map((node, i) => (
                <mesh
                    key={i}
                    geometry={node.geometry}
                    position={node.position}
                    rotation={node.rotation}
                    scale={node.scale}
                >
                    <meshStandardMaterial
                        ref={(ref) => { materialRefs.current[i] = ref; }}
                        color={color} // Deep dirt brown
                        alphaMap={texture} // White spots = Visible Dirt
                        transparent
                        opacity={opacityRef ? opacityRef.current : opacity}
                        roughness={1.0}
                        metalness={0.0}
                        depthWrite={false}
                        side={THREE.DoubleSide}
                        polygonOffset
                        polygonOffsetFactor={-1}
                    />
                </mesh>
            ))}
        </group>
    );
}

// --- Foam Shell Component (Animated) ---
// Replaced by foam splat accumulator below

// --- Foam Cannon Component (GPU Instanced) ---
export function FoamParticles({ active, rinsing, doorMeshes = [], onHit, count = 500 }) {
    const meshRef = useRef();
    const nozzleRef = useRef();
    const nozzleAlpha = useRef(0);
    const liveCountRef = useRef(0);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const spawnIndex = useRef(0);
    const raycaster = useMemo(() => new THREE.Raycaster(), []);

    // World-space references for aiming/hit placement
    const cannonOrigin = useMemo(() => new THREE.Vector3(-2.5, 1.05, 0.52), []);
    const maxTravel = 3.5; // clamp spray travel so it doesn't fly off into the ether
    const fallbackTarget = useMemo(() => new THREE.Vector3(-0.83, 0.95, 0.67), []);
    const doorBox = useMemo(() => new THREE.Box3(), []);
    const doorExpanded = useMemo(() => new THREE.Box3(), []);
    const doorCenter = useMemo(() => new THREE.Vector3(), []);
    const doorSize = useMemo(() => new THREE.Vector3(), []);
    const tmpTarget = useMemo(() => new THREE.Vector3(), []);
    const tmpDir = useMemo(() => new THREE.Vector3(), []);
    const tmpDelta = useMemo(() => new THREE.Vector3(), []);
    const tmpNormal = useMemo(() => new THREE.Vector3(1, 0, 0), []);
    const jitter = useMemo(() => new THREE.Vector3(), []);

    // Per-instance state kept off the React graph for speed
    const particles = useMemo(() => {
        return Array.from({ length: count }, () => ({
            position: new THREE.Vector3(),
            prev: new THREE.Vector3(),
            velocity: new THREE.Vector3(),
            life: 0,
            maxLife: 0,
            size: 0
        }));
    }, [count]);

    // Initialize all matrices to "invisible"
    useEffect(() => {
        if (!meshRef.current) return;
        for (let i = 0; i < count; i++) {
            dummy.scale.setScalar(0);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.count = count;
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [count, dummy]);

    useFrame((_, delta) => {
        const mesh = meshRef.current;
        if (!mesh) return;

        // Smooth nozzle fade
        const targetAlpha = active ? 1 : 0;
        nozzleAlpha.current = THREE.MathUtils.lerp(nozzleAlpha.current, targetAlpha, 1 - Math.exp(-8 * delta));
        if (nozzleRef.current) {
            nozzleRef.current.visible = nozzleAlpha.current > 0.02;
            nozzleRef.current.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.transparent = true;
                    child.material.opacity = nozzleAlpha.current;
                    child.material.needsUpdate = true;
                }
            });
        }

        const shouldSimulate = active || liveCountRef.current > 0;
        if (!shouldSimulate) return;

        // Update a live bounding box of the right door in world space (so Float/animations are respected)
        if (doorMeshes.length > 0) {
            doorBox.makeEmpty();
            doorMeshes.forEach((m) => {
                m.updateWorldMatrix(true, false);
                doorBox.expandByObject(m);
            });
            doorBox.getCenter(doorCenter);
            doorBox.getSize(doorSize);
            doorExpanded.copy(doorBox).expandByScalar(0.12);
        } else {
            doorBox.makeEmpty();
        }

        // Keep the visible nozzle aimed at the current door center (or fallback target)
        if (nozzleRef.current) {
            nozzleRef.current.lookAt(doorBox.isEmpty() ? fallbackTarget : doorCenter);
        }

        // Spawn burst while active
        if (active) {
            const spawnPerFrame = 14; // fewer hits to keep perf high
            for (let s = 0; s < spawnPerFrame; s++) {
                const i = spawnIndex.current % count;
                const p = particles[i];

                p.position.copy(cannonOrigin);
                p.position.x += (Math.random() - 0.5) * 0.12;
                p.position.y += (Math.random() - 0.5) * 0.08;
                p.position.z += (Math.random() - 0.5) * 0.18;

                // Aim across the entire door area using its live bounds
                if (!doorBox.isEmpty()) {
                    tmpTarget.copy(doorCenter);
                    tmpTarget.y += (Math.random() - 0.5) * doorSize.y * 0.9;
                    tmpTarget.z += (Math.random() - 0.5) * doorSize.z * 0.95;
                } else {
                    tmpTarget.copy(fallbackTarget);
                    tmpTarget.y += (Math.random() - 0.5) * 0.35;
                    tmpTarget.z += (Math.random() - 0.5) * 0.65;
                }

                jitter.set(
                    (Math.random() - 0.5) * 0.08,
                    (Math.random() - 0.5) * 0.06,
                    (Math.random() - 0.5) * 0.08
                );
                const dir = tmpDir.copy(tmpTarget).sub(cannonOrigin).add(jitter).normalize();
                const speed = rinsing ? 4.5 + Math.random() * 1.5 : 6.5 + Math.random() * 2.0;

                p.velocity.copy(dir).multiplyScalar(speed);
                p.velocity.y += Math.random() * 0.4; // slight upward push

                p.life = rinsing ? 1.5 + Math.random() * 0.5 : 2.0 + Math.random() * 0.8;
                p.maxLife = p.life;
                p.size = rinsing ? 0.12 + Math.random() * 0.08 : 0.16 + Math.random() * 0.08;

                spawnIndex.current++;
            }
        }

        let liveCount = 0;
        for (let i = 0; i < count; i++) {
            const p = particles[i];

            if (p.life > 0) {
                p.life -= delta;

                p.prev.copy(p.position);

                if (rinsing) {
                    p.velocity.y -= 9 * delta; // gravity for rinsing
                    p.velocity.multiplyScalar(0.992);
                } else {
                    p.velocity.y += 0.4 * delta; // keep foam buoyant
                    p.velocity.multiplyScalar(0.995);
                }

                p.position.addScaledVector(p.velocity, delta);

                if (
                    p.position.distanceToSquared(cannonOrigin) > maxTravel * maxTravel ||
                    (!doorBox.isEmpty() && p.position.x > doorBox.max.x + 0.3)
                ) {
                    p.life = 0;
                }

                // Kill particles that fly past the car envelope
                if (
                    p.position.distanceToSquared(cannonOrigin) > maxTravel * maxTravel ||
                    (!doorBox.isEmpty() && p.position.x > doorBox.max.x + 0.3)
                ) {
                    p.life = 0;
                }

                // Broad-phase bounds check then precise raycast to the actual door meshes
                if (!doorBox.isEmpty() && onHit) {
                    const maxY = Math.max(p.prev.y, p.position.y);
                    const minY = Math.min(p.prev.y, p.position.y);
                    const maxZ = Math.max(p.prev.z, p.position.z);
                    const minZ = Math.min(p.prev.z, p.position.z);
                    const crossesX =
                        (p.prev.x <= doorExpanded.max.x && p.position.x >= doorExpanded.min.x) ||
                        (p.position.x <= doorExpanded.max.x && p.prev.x >= doorExpanded.min.x);
                    const crossesY = maxY >= doorExpanded.min.y && minY <= doorExpanded.max.y;
                    const crossesZ = maxZ >= doorExpanded.min.z && minZ <= doorExpanded.max.z;

                    if (crossesX && crossesY && crossesZ) {
                        tmpDelta.copy(p.position).sub(p.prev);
                        const segLength = tmpDelta.length();
                        if (segLength > 0.0001) {
                            raycaster.set(p.prev, tmpDelta.normalize());
                            raycaster.far = segLength;
                            const hits = raycaster.intersectObjects(doorMeshes, true);
                            if (hits.length) {
                                const hit = hits[0];
                                if (hit.face && hit.object) {
                                    tmpNormal.copy(hit.face.normal).transformDirection(hit.object.matrixWorld).normalize();
                                } else {
                                    tmpNormal.set(-1, 0, 0);
                                }
                                onHit(hit.point, tmpNormal);
                                p.position.copy(hit.point);
                                p.life = 0; // Stop particle after sticking
                            }
                        }
                    }
                }

                dummy.position.copy(p.position);
                const fade = Math.max(0, p.life / (p.maxLife || 1));
                dummy.scale.setScalar(p.size * fade);
                liveCount++;
            } else {
                dummy.scale.setScalar(0);
            }

            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }

        liveCountRef.current = liveCount;
        mesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <group>
            <group ref={nozzleRef} position={cannonOrigin.toArray()}>
                {/* Gun body */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.035, 0.04, 0.34, 16]} />
                    <meshStandardMaterial color="#1a1f27" metalness={0.35} roughness={0.55} transparent />
                </mesh>
                {/* Tip collar */}
                <mesh position={[0, 0, 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.045, 0.048, 0.06, 12]} />
                    <meshStandardMaterial color="#2c3440" metalness={0.25} roughness={0.45} transparent />
                </mesh>
                {/* Emit nub */}
                <mesh position={[0, 0, 0.23]} rotation={[-Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.018, 0.018, 0.05, 10]} />
                    <meshStandardMaterial color="#161b22" metalness={0.3} roughness={0.5} transparent />
                </mesh>
                {/* Handle */}
                <mesh position={[0, -0.08, -0.05]} rotation={[0, 0, Math.PI / 2.4]}>
                    <boxGeometry args={[0.14, 0.06, 0.04]} />
                    <meshStandardMaterial color="#11151c" roughness={0.6} metalness={0.15} transparent />
                </mesh>
                {/* Bottle (uniform, opaque) */}
                <mesh position={[0, -0.2, -0.05]} scale={[0.9, 0.9, 0.9]}>
                    <cylinderGeometry args={[0.09, 0.09, 0.22, 18]} />
                    <meshStandardMaterial color="#3a3d44" roughness={0.52} metalness={0.1} transparent />
                </mesh>
                {/* Neck connector */}
                <mesh position={[0, -0.06, -0.05]}>
                    <cylinderGeometry args={[0.06, 0.07, 0.07, 12]} />
                    <meshStandardMaterial color="#1c222c" roughness={0.45} metalness={0.3} transparent />
                </mesh>
                {/* Cap */}
                <mesh position={[0, -0.04, -0.05]}>
                    <cylinderGeometry args={[0.12, 0.12, 0.03, 16]} />
                    <meshStandardMaterial color="#0f141b" roughness={0.4} metalness={0.3} transparent />
                </mesh>
                {/* Hose (dark green) */}
                <mesh position={[0, -0.8, -0.05]} rotation={[0, 0, 0]}>
                    <cylinderGeometry args={[0.018, 0.018, 1.2, 12]} />
                    <meshStandardMaterial color="#1f3b2b" roughness={0.55} metalness={0.05} transparent />
                </mesh>
            </group>

            <instancedMesh
                ref={meshRef}
                args={[null, null, count]}
                castShadow={false}
                receiveShadow={false}
                frustumCulled={false}
            >
                <sphereGeometry args={[0.08, 12, 12]} />
                <meshStandardMaterial
                    color="#e8f4ff"
                    emissive="#9fd6ff"
                    emissiveIntensity={1.0}
                    roughness={0.35}
                    metalness={0}
                    transparent
                    opacity={0.95}
                    depthWrite={false}
                    toneMapped={false}
                />
            </instancedMesh>
        </group>
    );
}

// --- Water Rinse Particles (visual only, no sticking) ---
export function WaterParticles({ active, doorMeshes = [], count = 280 }) {
    const meshRef = useRef();
    const nozzleRef = useRef();
    const nozzleAlpha = useRef(0);
    const liveCountRef = useRef(0);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const spawnIndex = useRef(0);

    const cannonOrigin = useMemo(() => new THREE.Vector3(-2.5, 1.05, 0.52), []);
    const fallbackTarget = useMemo(() => new THREE.Vector3(-0.83, 0.95, 0.67), []);
    const doorBox = useMemo(() => new THREE.Box3(), []);
    const doorCenter = useMemo(() => new THREE.Vector3(), []);
    const doorSize = useMemo(() => new THREE.Vector3(), []);
    const tmpTarget = useMemo(() => new THREE.Vector3(), []);
    const tmpDir = useMemo(() => new THREE.Vector3(), []);
    const jitter = useMemo(() => new THREE.Vector3(), []);

    const particles = useMemo(() => {
        return Array.from({ length: count }, () => ({
            position: new THREE.Vector3(),
            prev: new THREE.Vector3(),
            velocity: new THREE.Vector3(),
            life: 0,
            maxLife: 0,
            size: 0
        }));
    }, [count]);

    useEffect(() => {
        if (!meshRef.current) return;
        for (let i = 0; i < count; i++) {
            dummy.scale.setScalar(0);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.count = count;
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [count, dummy]);

    useFrame((_, delta) => {
        const mesh = meshRef.current;
        if (!mesh) return;

        // Fade nozzle visibility like foam gun
        const targetAlpha = active ? 1 : 0;
        nozzleAlpha.current = THREE.MathUtils.lerp(nozzleAlpha.current, targetAlpha, 1 - Math.exp(-8 * delta));
        if (nozzleRef.current) {
            nozzleRef.current.visible = nozzleAlpha.current > 0.02;
            nozzleRef.current.traverse((child) => {
                if (child.isMesh && child.material) {
                    child.material.transparent = true;
                    child.material.opacity = nozzleAlpha.current;
                    child.material.needsUpdate = true;
                }
            });
        }

        const shouldSimulate = active || liveCountRef.current > 0;
        if (!shouldSimulate) return;

        if (doorMeshes.length > 0) {
            doorBox.makeEmpty();
            doorMeshes.forEach((m) => {
                m.updateWorldMatrix(true, false);
                doorBox.expandByObject(m);
            });
            doorBox.getCenter(doorCenter);
            doorBox.getSize(doorSize);
        } else {
            doorBox.makeEmpty();
        }

        if (nozzleRef.current) {
            nozzleRef.current.lookAt(doorBox.isEmpty() ? fallbackTarget : doorCenter);
        }

        if (active) {
            const spawnPerFrame = 12;
            for (let s = 0; s < spawnPerFrame; s++) {
                const i = spawnIndex.current % count;
                const p = particles[i];

                p.position.copy(cannonOrigin);
                p.position.x += (Math.random() - 0.5) * 0.08;
                p.position.y += (Math.random() - 0.5) * 0.06;
                p.position.z += (Math.random() - 0.5) * 0.14;

                if (!doorBox.isEmpty()) {
                    tmpTarget.copy(doorCenter);
                    tmpTarget.y += (Math.random() - 0.5) * doorSize.y * 0.8;
                    tmpTarget.z += (Math.random() - 0.5) * doorSize.z * 0.9;
                } else {
                    tmpTarget.copy(fallbackTarget);
                    tmpTarget.y += (Math.random() - 0.5) * 0.3;
                    tmpTarget.z += (Math.random() - 0.5) * 0.55;
                }

                jitter.set(
                    (Math.random() - 0.5) * 0.08,
                    (Math.random() - 0.5) * 0.04,
                    (Math.random() - 0.5) * 0.08
                );
                const dir = tmpDir.copy(tmpTarget).sub(cannonOrigin).add(jitter).normalize();
                const speed = 6.5 + Math.random() * 1.8;

                p.velocity.copy(dir).multiplyScalar(speed);
                p.velocity.y -= Math.random() * 0.2;

                p.life = 1.2 + Math.random() * 0.5;
                p.maxLife = p.life;
                p.size = 0.12 + Math.random() * 0.05;

                spawnIndex.current++;
            }
        }

        let liveCount = 0;
        for (let i = 0; i < count; i++) {
            const p = particles[i];

            if (p.life > 0) {
                p.life -= delta;
                p.prev.copy(p.position);
                p.velocity.y -= 9 * delta;
                p.velocity.multiplyScalar(0.994);
                p.position.addScaledVector(p.velocity, delta);

                dummy.position.copy(p.position);
                const fade = Math.max(0, p.life / (p.maxLife || 1));
                dummy.scale.setScalar(p.size * fade);
                liveCount++;
            } else {
                dummy.scale.setScalar(0);
            }

            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }

        liveCountRef.current = liveCount;
        mesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <group>
            <group ref={nozzleRef} position={cannonOrigin.toArray()}>
                {/* Gun body */}
                <mesh rotation={[-Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.035, 0.04, 0.34, 16]} />
                    <meshStandardMaterial color="#1a1f27" metalness={0.35} roughness={0.55} transparent />
                </mesh>
                {/* Tip collar */}
                <mesh position={[0, 0, 0.18]} rotation={[-Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.045, 0.048, 0.06, 12]} />
                    <meshStandardMaterial color="#2c3440" metalness={0.25} roughness={0.45} transparent />
                </mesh>
                {/* Emit nub */}
                <mesh position={[0, 0, 0.23]} rotation={[-Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.018, 0.018, 0.05, 10]} />
                    <meshStandardMaterial color="#161b22" metalness={0.3} roughness={0.5} transparent />
                </mesh>
                {/* Handle */}
                <mesh position={[0, -0.08, -0.05]} rotation={[0, 0, Math.PI / 2.4]}>
                    <boxGeometry args={[0.14, 0.06, 0.04]} />
                    <meshStandardMaterial color="#11151c" roughness={0.6} metalness={0.15} transparent />
                </mesh>
                {/* Bottle (uniform, opaque) */}
                <mesh position={[0, -0.2, -0.05]} scale={[0.9, 0.9, 0.9]}>
                    <cylinderGeometry args={[0.09, 0.09, 0.22, 18]} />
                    <meshStandardMaterial color="#3a3d44" roughness={0.52} metalness={0.1} transparent />
                </mesh>
                {/* Neck connector */}
                <mesh position={[0, -0.06, -0.05]}>
                    <cylinderGeometry args={[0.06, 0.07, 0.07, 12]} />
                    <meshStandardMaterial color="#1c222c" roughness={0.45} metalness={0.3} transparent />
                </mesh>
                {/* Cap */}
                <mesh position={[0, -0.04, -0.05]}>
                    <cylinderGeometry args={[0.12, 0.12, 0.03, 16]} />
                    <meshStandardMaterial color="#0f141b" roughness={0.4} metalness={0.3} transparent />
                </mesh>
                {/* Hose (dark green) */}
                <mesh position={[0, -0.8, -0.05]} rotation={[0, 0, 0]}>
                    <cylinderGeometry args={[0.018, 0.018, 1.2, 12]} />
                    <meshStandardMaterial color="#1f3b2b" roughness={0.55} metalness={0.05} transparent />
                </mesh>
            </group>

            <instancedMesh
                ref={meshRef}
                args={[null, null, count]}
                castShadow={false}
                receiveShadow={false}
                frustumCulled={false}
            >
                <sphereGeometry args={[0.07, 10, 10]} />
                <meshStandardMaterial
                    color="#a4d7ff"
                    emissive="#6bb7ff"
                    emissiveIntensity={0.4}
                    roughness={0.25}
                    metalness={0}
                    transparent
                    opacity={0.55}
                    depthWrite={false}
                    toneMapped={false}
                />
            </instancedMesh>
        </group>
    );
}

// --- Foam Accumulation Splat Layer (sticks to door) ---
export const FoamAccumulator = forwardRef(function FoamAccumulator({ foaming, rinsing }, ref) {
    const count = 320;
    const meshRef = useRef();

    const foamAlpha = useMemo(() => {
        const size = 64;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        const g = ctx.createRadialGradient(size / 2, size / 2, size * 0.05, size / 2, size / 2, size * 0.48);
        g.addColorStop(0, 'rgba(255,255,255,1)');
        g.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, size, size);
        const tex = new THREE.CanvasTexture(canvas);
        tex.needsUpdate = true;
        return tex;
    }, []);
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const tmpMatrix = useMemo(() => new THREE.Matrix4(), []);
    const tmpQuat = useMemo(() => new THREE.Quaternion(), []);
    const baseNormal = useMemo(() => new THREE.Vector3(0, 0, 1), []);
    const splats = useMemo(() => {
        return Array.from({ length: count }, () => ({
            position: new THREE.Vector3(),
            quaternion: new THREE.Quaternion(),
            size: 0
        }));
    }, [count]);
    const writeIndex = useRef(0);
    const globalAlpha = useRef(0);
    const rinseTimer = useRef(0);

    // Initialize all splats hidden
    useEffect(() => {
        if (!meshRef.current) return;
        for (let i = 0; i < count; i++) {
            dummy.scale.setScalar(0);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.count = count;
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [count, dummy]);

    useImperativeHandle(ref, () => ({
        addSplat(worldPoint, worldNormal) {
            const mesh = meshRef.current;
            if (!mesh || !mesh.parent) return;

            const parent = mesh.parent;
            const localPos = worldPoint.clone();
            parent.worldToLocal(localPos);

            const invMatrix = tmpMatrix.copy(parent.matrixWorld).invert();
            const localNormal = worldNormal.clone().transformDirection(invMatrix).normalize();

            const i = writeIndex.current % count;
            const s = splats[i];
            s.position.copy(localPos);
            s.quaternion.copy(tmpQuat.setFromUnitVectors(baseNormal, localNormal));
            s.size = 0.12 + Math.random() * 0.12;
            writeIndex.current++;
        }
    }), [splats, tmpMatrix, foaming, baseNormal, tmpQuat]);

    useFrame((_, delta) => {
        const mesh = meshRef.current;
        if (!mesh) return;

        // Keep foam opaque until water has had time to reach the door
        if (foaming) {
            rinseTimer.current = 0;
        } else if (rinsing) {
            rinseTimer.current += delta;
        } else {
            rinseTimer.current = 0;
        }

        const holdFoam = rinsing && rinseTimer.current < 0.35;
        const target = foaming || holdFoam ? 1 : 0;
        const speed = rinsing ? 2.2 : foaming ? 6 : 1.2;
        globalAlpha.current = THREE.MathUtils.lerp(globalAlpha.current, target, 1 - Math.exp(-speed * delta));

        for (let i = 0; i < count; i++) {
            const s = splats[i];
            const fade = globalAlpha.current;
            if (fade < 1e-3) {
                dummy.scale.setScalar(0);
            } else {
                dummy.position.copy(s.position);
                dummy.quaternion.copy(s.quaternion);
                dummy.scale.setScalar(s.size * fade);
            }

            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }

        mesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh
            ref={meshRef}
            args={[null, null, count]}
            castShadow={false}
            receiveShadow={false}
        >
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial
                color="#f5fbff"
                emissive="#b8e6ff"
                emissiveIntensity={0.8}
                roughness={0.25}
                metalness={0}
                transparent
                opacity={0.95}
                depthWrite={false}
                toneMapped={false}
                alphaMap={foamAlpha}
                alphaTest={0.35}
                side={THREE.DoubleSide}
            />
        </instancedMesh>
    );
});

// --- Engine Brush & Light Wash (Engine Bay demo) ---
export function EngineBrush({ cleaningState, center, size }) {
    const { scene: brushScene } = useGLTF('/brush_optimized.glb');
    const brushRef = useRef();
    const meshRef = useRef();
    const dummy = useMemo(() => new THREE.Object3D(), []);
    const tmpInverse = useMemo(() => new THREE.Matrix4(), []);
    const tmpPos = useMemo(() => new THREE.Vector3(), []);
    const tmpDir = useMemo(() => new THREE.Vector3(), []);
    const tmpJitter = useMemo(() => new THREE.Vector3(), []);
    const tmpQuat = useMemo(() => new THREE.Quaternion(), []);
    const spawnIndex = useRef(0);
    const count = 120;

    // Clone the brush scene so we can use it multiple times if needed (though here just once)
    const brushClone = useMemo(() => brushScene.clone(), [brushScene]);

    const particles = useMemo(() => {
        return Array.from({ length: count }, () => ({
            position: new THREE.Vector3(),
            velocity: new THREE.Vector3(),
            life: 0,
            maxLife: 0,
            size: 0
        }));
    }, [count]);

    useEffect(() => {
        if (!meshRef.current) return;
        for (let i = 0; i < count; i++) {
            dummy.scale.setScalar(0);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.count = count;
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [count, dummy]);

    useFrame((state, delta) => {
        if (!center || !size) return;

        const t = state.clock.getElapsedTime();
        const isBrushing = cleaningState === 'brushing';
        const isRinsing = cleaningState === 'rinsing';

        // --- BRUSH ANIMATION ---
        if (brushRef.current) {
            const isBrushActive = isBrushing || isRinsing; // Show during both phases

            if (isBrushActive) {
                // Smooth painting motion - horizontal strokes like painting a canvas
                const strokeSpeed = 0.8; // Calm, deliberate strokes
                const stroke = Math.sin(t * strokeSpeed); // Main horizontal stroke
                const microVariation = Math.sin(t * 3.2) * 0.03; // Subtle hand tremor

                // Position: Smooth horizontal strokes across the engine
                brushRef.current.position.set(
                    center.x + stroke * size.x * 0.25 + microVariation, // Smooth side-to-side painting
                    center.y + 0.65, // Positioned above engine
                    center.z // Centered front-to-back
                );

                // Rotation: Brush tilts naturally with stroke direction
                const tiltAngle = Math.cos(t * strokeSpeed) * 0.15; // Tilt follows stroke
                brushRef.current.rotation.set(
                    -Math.PI / 2, // Pointing down
                    Math.PI / 2, // Oriented north-south (90 degrees)
                    tiltAngle // Natural tilt matching stroke direction
                );
                brushRef.current.visible = true;
            } else {
                brushRef.current.visible = false;
            }
        }

        // --- SPRAY ANIMATION ---
        // Only active during rinsing
        if (!isRinsing) {
            // Clear particles if not rinsing
            if (meshRef.current) {
                meshRef.current.visible = false;
            }
            return;
        }

        if (meshRef.current) meshRef.current.visible = true;

        // External Spray Motion (same as before)
        const nozzlePos = new THREE.Vector3(
            -2.5 + Math.sin(t * 0.8) * 0.5,
            1.8 + Math.cos(t * 0.5) * 0.2,
            1.5 + Math.sin(t * 1.1) * 0.3
        );

        const targetPos = center.clone().add(new THREE.Vector3(
            Math.sin(t * 2.5) * size.x * 0.4,
            0,
            Math.cos(t * 1.8) * size.z * 0.3
        ));

        const mesh = meshRef.current;
        if (!mesh) return;
        const parent = mesh.parent;
        if (!parent) return;

        parent.updateWorldMatrix(true, false);
        tmpInverse.copy(parent.matrixWorld).invert();

        const localEmitterPos = nozzlePos.clone().applyMatrix4(tmpInverse);
        const sprayDir = targetPos.clone().sub(nozzlePos).normalize();
        const localSprayDir = sprayDir.clone().transformDirection(tmpInverse);

        const spawnPerFrame = 15;
        for (let s = 0; s < spawnPerFrame; s++) {
            const i = spawnIndex.current % count;
            const p = particles[i];

            p.position.copy(localEmitterPos);
            p.position.add(new THREE.Vector3(
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05,
                (Math.random() - 0.5) * 0.05
            ));

            tmpJitter.copy(localSprayDir);
            tmpJitter.x += (Math.random() - 0.5) * 0.15;
            tmpJitter.y += (Math.random() - 0.5) * 0.15;
            tmpJitter.z += (Math.random() - 0.5) * 0.15;
            tmpJitter.normalize();

            const speed = 8.0 + Math.random() * 4.0;
            p.velocity.copy(tmpJitter).multiplyScalar(speed);

            p.life = 1.0 + Math.random() * 0.4;
            p.maxLife = p.life;
            p.size = 0.08 + Math.random() * 0.06;

            spawnIndex.current++;
        }

        for (let i = 0; i < count; i++) {
            const p = particles[i];
            if (p.life > 0) {
                p.life -= delta;
                p.velocity.y -= 3.0 * delta;
                p.velocity.multiplyScalar(0.98);
                p.position.addScaledVector(p.velocity, delta);

                dummy.position.copy(p.position);
                const fade = Math.max(0, p.life / (p.maxLife || 1));
                dummy.scale.setScalar(p.size * fade);
            } else {
                dummy.scale.setScalar(0);
            }

            dummy.updateMatrix();
            mesh.setMatrixAt(i, dummy.matrix);
        }

        mesh.instanceMatrix.needsUpdate = true;
    });

    return (
        <group>
            {/* Custom Brush Model */}
            <primitive
                ref={brushRef}
                object={brushClone}
                scale={0.15}
                visible={false}
                frustumCulled={true}
            />

            {/* Water Spray Particles */}
            <instancedMesh
                ref={meshRef}
                args={[null, null, count]}
                castShadow={false}
                receiveShadow={false}
            >
                <sphereGeometry args={[0.05, 8, 8]} />
                <meshStandardMaterial
                    color="#a4d7ff"
                    emissive="#6bb7ff"
                    emissiveIntensity={0.3}
                    roughness={0.2}
                    metalness={0.1}
                    transparent
                    opacity={0.6}
                    depthWrite={false}
                />
            </instancedMesh>
        </group>
    );
}


import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

const planets = [
  { name: "Mercury", distance: 2.2, radius: 0.12, color: "#aaa9a5", speed: 0.8 },
  { name: "Venus", distance: 3.1, radius: 0.2, color: "#d9ad78", speed: 0.55 },
  { name: "Earth", distance: 4.2, radius: 0.23, color: "#3288ff", speed: 0.4 },
  { name: "Mars", distance: 5.3, radius: 0.17, color: "#e86c4a", speed: 0.32 },
  { name: "Jupiter", distance: 7.0, radius: 0.53, color: "#d4ad8a", speed: 0.2 },
  { name: "Saturn", distance: 8.8, radius: 0.43, color: "#e4d2a0", speed: 0.15 },
  { name: "Uranus", distance: 10.4, radius: 0.31, color: "#85dce3", speed: 0.11 },
  { name: "Neptune", distance: 12.0, radius: 0.3, color: "#456eff", speed: 0.085 },
];

function Planet({
  distance,
  radius,
  color,
  speed,
}: {
  distance: number;
  radius: number;
  color: string;
  speed: number;
}) {
  const group = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (group.current) {
      const angle = clock.elapsedTime * speed;
      group.current.position.x = Math.cos(angle) * distance;
      group.current.position.z = Math.sin(angle) * distance;
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <sphereGeometry args={[radius, 32, 32]} />
        <meshStandardMaterial
          color={color}
          roughness={0.8}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

function OrbitRing({ radius }: { radius: number }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]}>
      <ringGeometry args={[radius - 0.008, radius + 0.008, 160]} />
      <meshBasicMaterial
        color="#627398"
        transparent
        opacity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function SolarSystem() {
  const sun = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (sun.current) {
      sun.current.rotation.y = clock.elapsedTime * 0.15;
    }
  });

  return (
    <>
      <ambientLight intensity={0.65} />
      <pointLight position={[0, 0, 0]} intensity={100} color="#ffcc77" />

      <Stars radius={90} depth={45} count={1800} factor={3} fade />

      <mesh ref={sun}>
        <sphereGeometry args={[0.85, 48, 48]} />
        <meshStandardMaterial
          color="#ffb52e"
          emissive="#ff7900"
          emissiveIntensity={2}
          roughness={0.7}
        />
      </mesh>

      {planets.map((planet) => (
        <group key={planet.name}>
          <OrbitRing radius={planet.distance} />
          <Planet {...planet} />
        </group>
      ))}
    </>
  );
}

export default function SolarScene() {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: 320 }}>
      <Canvas
        camera={{ position: [0, 12, 18], fov: 45 }}
        gl={{ antialias: true }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#070913"]} />
        <SolarSystem />
        <OrbitControls
          enablePan={false}
          minDistance={8}
          maxDistance={28}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 2}
          autoRotate
          autoRotateSpeed={0.25}
        />
      </Canvas>
    </div>
  );
}

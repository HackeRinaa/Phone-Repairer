"use client";

import React, { useRef } from "react";
import { pointsInner, pointsOuter } from "./utils";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { useTheme } from "next-themes";

type PointProps = {
  position: [number, number, number];
  color: string;
};

const ParticleRing: React.FC = () => {
  const { theme } = useTheme(); // Get the current theme

  // Define background colors based on theme
  const bgClass = theme === "dark" ? "bg-slate-900" : "bg-gray-100";

  return (
    <div className={`relative ${bgClass} transition-colors duration-300`}>
      <Canvas
        camera={{
          position: [10, -7.5, -5],
        }}
        style={{ height: "100vh" }}
        className="transition-colors duration-300"
      >
        <OrbitControls maxDistance={20} minDistance={10} />
        <directionalLight />
        <pointLight position={[-30, 0, -30]} power={10.0} />
        <PointCircle theme={theme} />
      </Canvas>
    </div>
  );
};

type PointCircleProps = {
  theme: string | undefined;
};

const PointCircle: React.FC<PointCircleProps> = ({ theme }) => {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={ref}>
      {pointsInner.map((point) => (
        <Point key={point.idx} position={point.position} color={getThemeColor(point.color, theme)} />
      ))}
      {pointsOuter.map((point) => (
        <Point key={point.idx} position={point.position} color={getThemeColor(point.color, theme)} />
      ))}
    </group>
  );
};

// Adjust point colors based on theme
const getThemeColor = (color: string, theme: string | undefined) => {
  if (theme === "dark") return color; // Keep original colors in dark mode
  return "#1e3a8a"; // Light mode alternative (adjust to match design)
};

const Point: React.FC<PointProps> = ({ position, color }) => {
  return (
    <Sphere position={position} args={[0.1, 10, 10]}>
      <meshStandardMaterial
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.5}
        color={color}
      />
    </Sphere>
  );
};

export default ParticleRing;

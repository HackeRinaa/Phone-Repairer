"use client";
import { useEffect, useRef } from "react";

export function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener("resize", setCanvasSize);

    // Light trail properties
    const trails: Array<{
      x: number;
      y: number;
      size: number;
      speed: number;
      color: string;
      life: number;
    }> = [];

    const colors = ["#00bfff", "#8a2be2", "#00ff7f"]; // Blue, Purple, Green

    // Create light trails
    function createTrail() {
      const x = Math.random() * canvas.width;
      const y = 0;
      const size = Math.random() * 3 + 1;
      const speed = Math.random() * 2 + 1;
      const color = colors[Math.floor(Math.random() * colors.length)];
      const life = Math.random() * 100 + 50;

      trails.push({ x, y, size, speed, color, life });
    }

    // Animation
    function animate() {
      // Clear canvas with a subtle dark background
      ctx.fillStyle = "rgba(10, 10, 20, 0.1)"; // Default dark background
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create new trails
      if (Math.random() < 0.1) {
        createTrail();
      }

      // Draw and update trails
      trails.forEach((trail, index) => {
        // Draw trail
        ctx.beginPath();
        ctx.arc(trail.x, trail.y, trail.size, 0, Math.PI * 2);
        ctx.fillStyle = trail.color;
        ctx.fill();

        // Update position
        trail.y += trail.speed;
        trail.life -= 1;

        // Remove trail if it's off-screen or has no life left
        if (trail.y > canvas.height || trail.life <= 0) {
          trails.splice(index, 1);
        }
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full opacity-30 pointer-events-none"
    />
  );
}
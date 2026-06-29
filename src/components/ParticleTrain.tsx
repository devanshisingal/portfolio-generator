/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
  decay: number;
}

export default function ParticleTrain() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    let mouse = { x: -100, y: -100, active: false };

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Track mouse move
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      // Spawn particles on move
      const particleColors = [
        "rgba(34, 211, 238, 0.8)", // Cyan
        "rgba(59, 130, 246, 0.8)",  // Blue
        "rgba(99, 102, 241, 0.8)",  // Indigo
        "rgba(255, 255, 255, 0.9)", // White spark
      ];

      for (let i = 0; i < 3; i++) {
        const size = Math.random() * 4 + 1.5;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5;
        
        particles.push({
          x: mouse.x,
          y: mouse.y,
          vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 0.5,
          vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 0.5,
          size: size,
          alpha: 1,
          color: particleColors[Math.floor(Math.random() * particleColors.length)],
          decay: Math.random() * 0.015 + 0.01,
        });
      }
    };

    // Track touch move for mobile
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouse.x = e.touches[0].clientX;
        mouse.y = e.touches[0].clientY;
        mouse.active = true;
        
        const particleColors = ["rgba(34, 211, 238, 0.8)", "rgba(59, 130, 246, 0.8)", "rgba(255, 255, 255, 0.9)"];
        for (let i = 0; i < 2; i++) {
          particles.push({
            x: mouse.x,
            y: mouse.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            size: Math.random() * 3 + 1,
            alpha: 1,
            color: particleColors[Math.floor(Math.random() * particleColors.length)],
            decay: Math.random() * 0.02 + 0.015,
          });
        }
      }
    };

    // Drifting starfield background particles
    const bgStars: { x: number; y: number; size: number; speed: number; alpha: number }[] = [];
    for (let i = 0; i < 60; i++) {
      bgStars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.2 + 0.05,
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    // Animation Loop
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw and update background star drift
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      bgStars.forEach((star) => {
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Drift star downwards
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
      });

      // 2. Draw and update interactive cursor particles
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(index, 1);
          return;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        
        // Glow effect
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = p.color;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-40 transition-opacity duration-300"
      style={{ mixBlendMode: "screen" }}
      id="particle-train-canvas"
    />
  );
}

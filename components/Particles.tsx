import React, { useEffect, useState } from 'react';

interface Star { id: number; left: string; top: string; delay: string; duration: string; size: string; opacity: number; }
interface Particle { id: number; left: string; top: string; delay: string; duration: string; size: string; color: string; }

const Particles: React.FC<{ active: boolean }> = ({ active }) => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // 1. Generate deep space stars (always visible, twinkling)
    const newStars = Array.from({ length: 120 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 5}s`,
      duration: `${3 + Math.random() * 4}s`,
      size: `${Math.random() * 2.5}px`,
      opacity: 0.3 + Math.random() * 0.7
    }));
    setStars(newStars);

    // 2. Generate floating magical orbs (more intense when active)
    const orbCount = active ? 40 : 15;
    const orbColors = ['#d8b4fe', '#c084fc', '#e879f9', '#ffffff'];

    const newParticles = Array.from({ length: orbCount }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 3}s`,
      duration: `${2 + Math.random() * 4}s`,
      size: `${2 + Math.random() * 3}px`,
      color: orbColors[Math.floor(Math.random() * orbColors.length)]
    }));
    setParticles(newParticles);
  }, [active]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {/* Stars Layer */}
      {stars.map((s) => (
        <div
          key={`star-${s.id}`}
          className="star-particle"
          style={{
            left: s.left, top: s.top,
            width: s.size, height: s.size,
            opacity: s.opacity,
            animationDelay: s.delay,
            animationDuration: s.duration,
            boxShadow: `0 0 4px 1px rgba(255,255,255,0.4)`
          }}
        />
      ))}

      {/* Magical Orbs Layer */}
      {particles.map((p) => (
        <div
          key={`orb-${p.id}`}
          className="mystic-particle"
          style={{
            left: p.left,
            top: active ? '110%' : p.top, // Shoot from bottom if revealed
            width: p.size, height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 0 12px 3px ${p.color}90`,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
};

export default Particles;

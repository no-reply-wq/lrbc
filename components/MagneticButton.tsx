'use client';

import { useRef, useEffect, ReactNode } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}

export default function MagneticButton({
  children,
  strength = 0.4,
  radius   = 80,
  className = '',
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const el = ref.current;
    if (!el) return;

    let animId: number;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = e.clientX - cx;
      const dy   = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < radius) {
        const pull = 1 - dist / radius;
        targetX = dx * strength * pull;
        targetY = dy * strength * pull;
      } else {
        targetX = 0;
        targetY = 0;
      }
    };

    const animate = () => {
      currentX = lerp(currentX, targetX, 0.1);
      currentY = lerp(currentY, targetY, 0.1);
      el.style.transform = `translate(${currentX}px, ${currentY}px)`;
      animId = requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', onMove);
    animate();

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(animId);
      el.style.transform = '';
    };
  }, [strength, radius]);

  return (
    <div ref={ref} className={`inline-block ${className}`} style={{ willChange: 'transform' }}>
      {children}
    </div>
  );
}

'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import MagneticButton from './MagneticButton';

interface SpotlightIconProps {
  href: string;
  label: string;
  glowColor: string; // e.g. "160,0,240"
  children: React.ReactNode;
}

export default function SpotlightIcon({ href, label, glowColor, children }: SpotlightIconProps) {
  const btnRef = useRef<HTMLAnchorElement>(null);
  const glowRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const btn = btnRef.current;
    const glow = glowRef.current;
    if (!btn || !glow) return;

    const enter = () => {
      glow.style.opacity = '1';
      glow.style.transform = 'scale(1)';
    };
    const leave = () => {
      glow.style.opacity = '0';
      glow.style.transform = 'scale(0.6)';
    };

    btn.addEventListener('mouseenter', enter);
    btn.addEventListener('mouseleave', leave);
    return () => {
      btn.removeEventListener('mouseenter', enter);
      btn.removeEventListener('mouseleave', leave);
    };
  }, []);

  return (
    <MagneticButton strength={0.45} radius={60}>
      <Link
        ref={btnRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        style={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40px',
          height: '40px',
          borderRadius: '50%',
          border: `1px solid rgba(${glowColor}, 0.3)`,
          color: `rgba(${glowColor}, 0.7)`,
          background: 'transparent',
          transition: 'color 0.3s, border-color 0.3s',
          overflow: 'visible',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.color = '#fff';
          (e.currentTarget as HTMLElement).style.borderColor = `rgba(${glowColor}, 0.8)`;
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.color = `rgba(${glowColor}, 0.7)`;
          (e.currentTarget as HTMLElement).style.borderColor = `rgba(${glowColor}, 0.3)`;
        }}
      >
        {/* Glow blob */}
        <span
          ref={glowRef}
          style={{
            position: 'absolute',
            inset: '-10px',
            borderRadius: '50%',
            background: `radial-gradient(circle at 50% 50%, rgba(${glowColor}, 0.45) 0%, rgba(${glowColor}, 0.15) 45%, transparent 70%)`,
            opacity: 0,
            transform: 'scale(0.6)',
            transition: 'opacity 0.35s ease, transform 0.35s ease',
            filter: 'blur(6px)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
        {/* Icon */}
        <span style={{ position: 'relative', zIndex: 1, display: 'flex' }}>
          {children}
        </span>
      </Link>
    </MagneticButton>
  );
}

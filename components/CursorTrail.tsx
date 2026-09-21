'use client';

import { useEffect, useRef } from 'react';

const TRAIL_LENGTH = 12;
const DOT_SIZE     = 6;

export default function CursorTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined' || window.innerWidth < 768) return;
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        let mouseX = -100, mouseY = -100;
        const dots = Array.from({ length: TRAIL_LENGTH }, () => ({ x: -100, y: -100 }));
        let ringX = -100, ringY = -100;
        let isHovering = false;

        const onMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        window.addEventListener('mousemove', onMove);

        const onOver = (e: MouseEvent) => {
            const t = e.target as HTMLElement;
            isHovering = !!(t.closest('a, button, [role="button"], input, textarea, select'));
        };
        window.addEventListener('mouseover', onOver);

        let raf: number;
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ringX = lerp(ringX, mouseX, 0.12);
            ringY = lerp(ringY, mouseY, 0.12);

            // Ring — enlarges on hover
            const ringSize = isHovering ? 40 : 28;
            ctx.beginPath();
            ctx.arc(ringX, ringY, ringSize / 2, 0, Math.PI * 2);
            ctx.strokeStyle = isHovering
                ? 'rgba(160, 0, 240, 0.85)'
                : 'rgba(15, 93, 255, 0.5)';
            ctx.lineWidth = isHovering ? 2 : 1.5;
            ctx.stroke();

            // Inner dot
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(15, 93, 255, 1)';
            ctx.fill();

            // Trail
            dots[0].x = lerp(dots[0].x, mouseX, 0.35);
            dots[0].y = lerp(dots[0].y, mouseY, 0.35);
            for (let i = 1; i < TRAIL_LENGTH; i++) {
                dots[i].x = lerp(dots[i].x, dots[i - 1].x, 0.6);
                dots[i].y = lerp(dots[i].y, dots[i - 1].y, 0.6);
            }
            for (let i = 0; i < TRAIL_LENGTH; i++) {
                const progress = 1 - i / TRAIL_LENGTH;
                const size     = DOT_SIZE * progress * 0.6;
                const alpha    = progress * 0.5;
                const hue      = i % 2 === 0 ? 224 : 276;
                ctx.beginPath();
                ctx.arc(dots[i].x, dots[i].y, size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${hue}, 100%, 60%, ${alpha})`;
                ctx.fill();
            }

            raf = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseover', onOver);
            window.removeEventListener('resize', resize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none fixed inset-0 z-[9998] hidden md:block"
            aria-hidden="true"
        />
    );
}
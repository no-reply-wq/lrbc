'use client';

import { useEffect, useRef } from 'react';

// Dot trail that follows the cursor with a spring lag
// Each dot fades out based on its position in the trail
const TRAIL_LENGTH = 12;
const DOT_SIZE     = 6;

export default function CursorTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        // Desktop only
        if (typeof window === 'undefined' || window.innerWidth < 768) return;
        if (window.matchMedia('(pointer: coarse)').matches) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize canvas to full window
        const resize = () => {
            canvas.width  = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        // Mouse position
        let mouseX = -100, mouseY = -100;

        // Trail dots — each follows the one before it
        const dots = Array.from({ length: TRAIL_LENGTH }, () => ({
            x: -100, y: -100,
        }));

        // Cursor ring
        let ringX = -100, ringY = -100;
        let isHovering = false;

        const onMove = (e: MouseEvent) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };
        window.addEventListener('mousemove', onMove);

        // Detect hover over interactive elements
        const onOver = (e: MouseEvent) => {
            const t = e.target as HTMLElement;
            isHovering = !!(t.closest('a, button, [role="button"], input, textarea, select'));
        };
        window.addEventListener('mouseover', onOver);

        let raf: number;
        const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Spring follow for ring
            ringX = lerp(ringX, mouseX, 0.12);
            ringY = lerp(ringY, mouseY, 0.12);

            // Outer ring
            const ringSize = isHovering ? 36 : 28;
            ctx.beginPath();
            ctx.arc(ringX, ringY, ringSize / 2, 0, Math.PI * 2);
            ctx.strokeStyle = isHovering
                ? 'rgba(166, 4, 255, 0.8)'
                : 'rgba(15, 93, 255, 0.5)';
            ctx.lineWidth = isHovering ? 2 : 1.5;
            ctx.stroke();

            // Inner dot (sharp, no lag)
            ctx.beginPath();
            ctx.arc(mouseX, mouseY, 3, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(15, 93, 255, 1)';
            ctx.fill();

            // Update trail: each dot follows the one in front
            dots[0].x = lerp(dots[0].x, mouseX, 0.35);
            dots[0].y = lerp(dots[0].y, mouseY, 0.35);
            for (let i = 1; i < TRAIL_LENGTH; i++) {
                dots[i].x = lerp(dots[i].x, dots[i - 1].x, 0.6);
                dots[i].y = lerp(dots[i].y, dots[i - 1].y, 0.6);
            }

            // Draw trail dots
            for (let i = 0; i < TRAIL_LENGTH; i++) {
                const progress = 1 - i / TRAIL_LENGTH;       // 1 at front, 0 at back
                const size     = DOT_SIZE * progress * 0.6;
                const alpha    = progress * 0.5;
                // Alternate logo blue (#0f5dff=224°) and logo purple (#a604ff=276°)
                const hue = i % 2 === 0 ? 224 : 276;
                const sat = 100;

                ctx.beginPath();
                ctx.arc(dots[i].x, dots[i].y, size, 0, Math.PI * 2);
                ctx.fillStyle = `hsla(${hue}, ${sat}%, 60%, ${alpha})`;
                ctx.fill();
            }

            raf = requestAnimationFrame(draw);
        };

        // Hide default cursor on canvas (CSS handles it globally)
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

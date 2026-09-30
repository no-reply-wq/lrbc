'use client';

import { useEffect, useRef } from 'react';

/**
 * Cursor tail — the normal arrow stays; a short, quick teardrop trails behind it.
 *  • One tapered "comet" blob (fat at the pointer, sharp at the tip) that stretches while you move and
 *    snaps back when you stop. Filled with the site's indigo → violet gradient.
 *  • Drawn on a canvas that is sized in explicit CSS pixels, so it stays aligned with the real pointer
 *    at any screen scaling / zoom. Never intercepts clicks.
 *  • Touch devices are skipped; reduced-motion users get no tail.
 */

const N = 9;           // points along the tail (short)
const HEAD_R = 7;      // half-thickness at the pointer (px)
const FOLLOW = 0.62;   // how fast the tail catches up (higher = shorter, snappier)

export default function CursorTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(pointer: coarse)').matches) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            const w = window.innerWidth, h = window.innerHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        const pts = Array.from({ length: N }, () => ({ x: -100, y: -100 }));
        let mx = -100, my = -100;
        let inside = false;
        let raf = 0, running = false, idle = 0;

        const wake = () => {
            idle = 0;
            if (!running) { running = true; raf = requestAnimationFrame(tick); }
        };
        const onMove = (e: MouseEvent) => {
            if (!inside) pts.forEach((p) => { p.x = e.clientX; p.y = e.clientY; });
            inside = true;
            mx = e.clientX; my = e.clientY;
            wake();
        };
        const onLeave = () => { inside = false; wake(); };

        window.addEventListener('mousemove', onMove, { passive: true });
        document.documentElement.addEventListener('mouseleave', onLeave);

        function tick() {
            let moving = false;
            let px = mx, py = my;
            for (let i = 0; i < N; i++) {
                const p = pts[i];
                const k = FOLLOW - i * 0.02;
                const nx = p.x + (px - p.x) * k;
                const ny = p.y + (py - p.y) * k;
                if (Math.abs(nx - p.x) + Math.abs(ny - p.y) > 0.15) moving = true;
                p.x = nx; p.y = ny; px = nx; py = ny;
            }

            ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
            const tail = pts[N - 1];
            const len = Math.hypot(mx - tail.x, my - tail.y);
            if (inside && len > 2.5) {
                const chain = [{ x: mx, y: my }, ...pts];
                const left: { x: number; y: number }[] = [];
                const right: { x: number; y: number }[] = [];
                const thick = Math.min(1, 0.35 + len / 45);   // thinner when the tail is short
                for (let i = 0; i < chain.length; i++) {
                    const a = chain[Math.max(0, i - 1)];
                    const b = chain[Math.min(chain.length - 1, i + 1)];
                    let dx = b.x - a.x, dy = b.y - a.y;
                    const d = Math.hypot(dx, dy) || 1;
                    dx /= d; dy /= d;
                    const t = i / (chain.length - 1);
                    const r = HEAD_R * Math.pow(1 - t, 0.9) * thick;
                    left.push({ x: chain[i].x - dy * r, y: chain[i].y + dx * r });
                    right.push({ x: chain[i].x + dy * r, y: chain[i].y - dx * r });
                }
                ctx!.beginPath();
                ctx!.moveTo(left[0].x, left[0].y);
                for (let i = 1; i < left.length; i++) {
                    const m = { x: (left[i - 1].x + left[i].x) / 2, y: (left[i - 1].y + left[i].y) / 2 };
                    ctx!.quadraticCurveTo(left[i - 1].x, left[i - 1].y, m.x, m.y);
                }
                ctx!.lineTo(left[left.length - 1].x, left[left.length - 1].y);
                ctx!.lineTo(right[right.length - 1].x, right[right.length - 1].y);
                for (let i = right.length - 1; i > 0; i--) {
                    const m = { x: (right[i].x + right[i - 1].x) / 2, y: (right[i].y + right[i - 1].y) / 2 };
                    ctx!.quadraticCurveTo(right[i].x, right[i].y, m.x, m.y);
                }
                ctx!.closePath();

                // site colours: indigo at the pointer → violet → fades out at the tip
                const g = ctx!.createLinearGradient(mx, my, tail.x, tail.y);
                g.addColorStop(0, 'rgba(79,70,229,0.95)');
                g.addColorStop(0.5, 'rgba(124,92,246,0.7)');
                g.addColorStop(1, 'rgba(168,85,247,0)');
                ctx!.fillStyle = g;
                ctx!.fill();
            }

            idle = moving ? 0 : idle + 1;
            if (idle > 3) { running = false; ctx!.clearRect(0, 0, canvas!.width, canvas!.height); return; }
            raf = requestAnimationFrame(tick);
        }

        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
            document.documentElement.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{ position: 'fixed', left: 0, top: 0, pointerEvents: 'none', zIndex: 2147483000 }}
        />
    );
}

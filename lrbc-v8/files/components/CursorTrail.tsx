'use client';

import { useEffect, useRef } from 'react';

/**
 * Cursor — a smooth "bullet" that follows the pointer:
 *  • front = half-circle whose tip sits exactly on the real pointer position,
 *  • behind it a short, soft tail that tapers away while you move,
 *  • at rest the tail collapses and only the half-circle remains.
 * Drawn as an SVG path (renders on every browser / GPU, no canvas). Indigo → violet gradient.
 * Mouse: follows the pointer. Touch: follows your finger and fades out when you lift.
 * The normal arrow is hidden only AFTER the first shape has been drawn, so you never lose the cursor.
 * Text fields keep their I-beam.
 */

const HISTORY = 8;    // frames of pointer history for the tail
const BASE_R = 9;     // half-thickness of the head (px)
const HOVER_R = 12;   // slightly bigger over links / buttons

export default function CursorTrail() {
    const svgRef = useRef<SVGSVGElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const gradRef = useRef<SVGLinearGradientElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        // use the mouse path whenever any hover-capable pointer exists (touch-screen laptops included)
        const coarse = !window.matchMedia('(any-hover: hover)').matches;
        const path = pathRef.current, grad = gradRef.current, svg = svgRef.current;
        if (!path || !grad || !svg) return;
        const root = document.documentElement;

        const hist: { x: number; y: number }[] = [];
        let mx = -100, my = -100;
        let fx = -0.7071, fy = -0.7071;   // facing direction (default: up-left, like an arrow)
        let inside = false, alpha = 0, radius = BASE_R, hoverTarget = BASE_R;
        let raf = 0, running = false, still = 0, hidArrow = false;

        const wake = () => {
            still = 0;
            if (!running) { running = true; raf = requestAnimationFrame(tick); }
        };
        const point = (x: number, y: number, target?: EventTarget | null) => {
            if (!inside) { hist.length = 0; hist.push({ x, y }); }
            inside = true;
            mx = x; my = y;
            if (target instanceof Element) {
                hoverTarget = target.closest('a,button,[role="button"],summary,label,select') ? HOVER_R : BASE_R;
            }
            wake();
        };
        const onMove = (e: MouseEvent) => point(e.clientX, e.clientY, e.target);
        const onTouch = (e: TouchEvent) => { const t = e.touches[0]; if (t) point(t.clientX, t.clientY); };
        const onLeave = () => { inside = false; wake(); };

        if (coarse) {
            window.addEventListener('touchstart', onTouch, { passive: true });
            window.addEventListener('touchmove', onTouch, { passive: true });
            window.addEventListener('touchend', onLeave, { passive: true });
            window.addEventListener('touchcancel', onLeave, { passive: true });
        } else {
            window.addEventListener('mousemove', onMove, { passive: true });
            window.addEventListener('mouseover', onMove, { passive: true });
            window.addEventListener('blur', onLeave);
            root.addEventListener('mouseleave', onLeave);
        }

        const MAX_TAIL = 26;   // the tail never gets longer than this, however fast you move
        const SAMPLES = 9;

        function draw() {
            const R = radius;
            // head centre sits one radius behind the pointer tip
            const hx = mx - fx * R, hy = my - fy * R;

            // recent path (newest → oldest), then cut to MAX_TAIL px and re-sample evenly
            const pts: { x: number; y: number }[] = [{ x: hx, y: hy }];
            for (let i = hist.length - 2; i >= 0; i--) pts.push({ x: hist[i].x - fx * R, y: hist[i].y - fy * R });
            const cum: number[] = [0];
            for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
            const total = Math.min(MAX_TAIL, cum[cum.length - 1]);

            const chain: { x: number; y: number }[] = [];
            let seg = 1;
            for (let k = 0; k < SAMPLES; k++) {
                const dist = (total * k) / (SAMPLES - 1);
                while (seg < pts.length - 1 && cum[seg] < dist) seg++;
                const c0 = cum[seg - 1] ?? 0, c1 = cum[seg] ?? c0;
                const t = c1 - c0 > 0.001 ? Math.min(1, Math.max(0, (dist - c0) / (c1 - c0))) : 0;
                const p0 = pts[seg - 1] ?? pts[0], p1 = pts[seg] ?? p0;
                chain.push({ x: p0.x + (p1.x - p0.x) * t, y: p0.y + (p1.y - p0.y) * t });
            }
            const n = chain.length;
            const A: { x: number; y: number }[] = [];
            const B: { x: number; y: number }[] = [];
            for (let i = 0; i < n; i++) {
                let dx = fx, dy = fy;
                if (i > 0 && total > 1) {
                    const a = chain[i - 1], b = chain[Math.min(n - 1, i + 1)];
                    const l = Math.hypot(a.x - b.x, a.y - b.y);
                    if (l > 0.01) { dx = (a.x - b.x) / l; dy = (a.y - b.y) / l; }
                }
                const t = i / (n - 1);
                const r = i === 0 ? R : R * Math.pow(1 - t, 0.8);
                A.push({ x: chain[i].x + dy * r, y: chain[i].y - dx * r });
                B.push({ x: chain[i].x - dy * r, y: chain[i].y + dx * r });
            }
            const f = (v: number) => v.toFixed(2);
            let d = `M${f(A[0].x)} ${f(A[0].y)} A${f(R)} ${f(R)} 0 0 1 ${f(B[0].x)} ${f(B[0].y)}`;
            for (let i = 1; i < n; i++) {
                d += ` Q${f(B[i - 1].x)} ${f(B[i - 1].y)} ${f((B[i - 1].x + B[i].x) / 2)} ${f((B[i - 1].y + B[i].y) / 2)}`;
            }
            d += ` L${f(chain[n - 1].x)} ${f(chain[n - 1].y)}`;
            for (let i = n - 1; i > 0; i--) {
                d += ` Q${f(A[i].x)} ${f(A[i].y)} ${f((A[i].x + A[i - 1].x) / 2)} ${f((A[i].y + A[i - 1].y) / 2)}`;
            }
            d += ' Z';
            path!.setAttribute('d', d);
            path!.style.opacity = String(alpha);
            const tail = chain[n - 1];
            grad!.setAttribute('x1', f(mx)); grad!.setAttribute('y1', f(my));
            grad!.setAttribute('x2', f(tail.x - fx)); grad!.setAttribute('y2', f(tail.y - fy));
        }

        function tick() {
            try {
                hist.push({ x: mx, y: my });
                if (hist.length > HISTORY) hist.shift();

                alpha += ((inside ? 1 : 0) - alpha) * 0.25;
                if (!inside && alpha < 0.02) alpha = 0;
                radius += (hoverTarget - radius) * 0.2;

                const ref = hist[Math.max(0, hist.length - 4)];
                const vx = mx - ref.x, vy = my - ref.y, vl = Math.hypot(vx, vy);
                if (vl > 1.5) {
                    // follow the real direction quickly, so sudden turns look natural
                    const k = Math.min(0.6, 0.25 + vl / 120);
                    fx = fx * (1 - k) + (vx / vl) * k;
                    fy = fy * (1 - k) + (vy / vl) * k;
                    const n = Math.hypot(fx, fy) || 1; fx /= n; fy /= n;
                }

                if (alpha > 0.02) {
                    draw();
                    if (!coarse && !hidArrow) { root.classList.add('lrbc-cursor'); hidArrow = true; }
                } else {
                    path!.setAttribute('d', '');
                }

                const moving = Math.hypot(mx - hist[0].x, my - hist[0].y) > 0.5;
                still = moving || Math.abs(radius - hoverTarget) > 0.1 || (!inside && alpha > 0) ? 0 : still + 1;
                if (still > HISTORY + 2) { running = false; return; }   // keep the last frame on screen
            } catch (err) {
                (window as unknown as { __cursorErr?: unknown }).__cursorErr = String(err);
                hist.length = 0;   // never let one bad frame kill the cursor
            }
            raf = requestAnimationFrame(tick);
        }

        return () => {
            cancelAnimationFrame(raf);
            root.classList.remove('lrbc-cursor');
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseover', onMove);
            window.removeEventListener('blur', onLeave);
            window.removeEventListener('touchstart', onTouch);
            window.removeEventListener('touchmove', onTouch);
            window.removeEventListener('touchend', onLeave);
            window.removeEventListener('touchcancel', onLeave);
            root.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <svg
            ref={svgRef}
            aria-hidden="true"
            width="100%"
            height="100%"
            style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2147483000, overflow: 'visible' }}
        >
            <defs>
                <linearGradient ref={gradRef} id="lrbc-cursor-grad" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stopColor="rgba(79,70,229,0.95)" />
                    <stop offset="0.55" stopColor="rgba(124,92,246,0.7)" />
                    <stop offset="1" stopColor="rgba(168,85,247,0)" />
                </linearGradient>
            </defs>
            <path ref={pathRef} d="" fill="url(#lrbc-cursor-grad)" stroke="rgba(255,255,255,0.75)" strokeWidth="1" strokeLinejoin="round" />
        </svg>
    );
}

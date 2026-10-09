'use client';

import { useEffect, useRef } from 'react';

/**
 * Desktop-only cursor ("Colour mist"):
 *  • a round brand-violet dot with a thin white edge sits exactly on the pointer,
 *  • two soft violet / pink colour clouds swirl slowly around it like a living mist,
 *  • reaching a link or button sends out a shock-ripple of two faint, short brand-coloured rings,
 *  • a click pops a small splash of brand-coloured droplets,
 *  • over text fields everything gives way to a slim text bar (the system cursor is never shown).
 * Touch / mobile devices get nothing at all (native behaviour).
 * The native arrow is hidden only after the first frame has really been drawn.
 */

const LINK = 'a,button,[role="button"],summary,label,[data-magnet-wrap],input[type="checkbox"],input[type="radio"],input[type="submit"],input[type="button"],input[type="file"]';
const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="file"]):not([type="range"]),textarea,[contenteditable="true"]';
// things the browser draws itself (dropdown lists, embedded maps) or the admin editor: the effect steps aside and the normal cursor shows
const NATIVE = 'select,option,iframe,[data-cms-panel],.lrbc-cms-hide';

const BRAND = ['#5227ff', '#7c5cf6', '#a855f7', '#d946ef'];
const col = (i: number) => BRAND[((i % 4) + 4) % 4];
const rgba = (h: string, a: number) => {
    const n = parseInt(h.slice(1), 16);
    return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
};
const rnd = (a: number, b: number) => a + Math.random() * (b - a);

type Part = { x: number; y: number; vx: number; vy: number; r: number; life: number; d: number; c: string };
type Ring = { x: number; y: number; r: number; life: number; c: string };

export default function CursorTrail() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const finePointer = window.matchMedia('(any-pointer: fine)').matches && window.matchMedia('(any-hover: hover)').matches;
        const cv = canvasRef.current, bar = barRef.current;
        const ctx = cv?.getContext('2d');
        if (!finePointer || !cv || !bar || !ctx) return;
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const root = document.documentElement;

        let W = 0, H = 0;
        const resize = () => {
            const dpr = Math.min(2, window.devicePixelRatio || 1);
            W = window.innerWidth; H = window.innerHeight;
            cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        resize();
        window.addEventListener('resize', resize);

        let mx = -200, my = -200;
        let inside = false, alpha = 0, warm = 0, warmT = 0;
        let mode: 'idle' | 'link' | 'text' | 'native' = 'idle';
        let target: Element | null = null;
        let raf = 0, running = false, hidArrow = false, last = 0;
        const parts: Part[] = [];
        const rings: Ring[] = [];

        const wake = () => {
            if (!running) { running = true; last = performance.now(); raf = requestAnimationFrame(tick); }
        };

        const setMode = (t: EventTarget | null) => {
            let m: typeof mode = 'idle';
            let tgt: Element | null = null;
            if (root.classList.contains('lrbc-editing')) m = 'native';
            else if (t instanceof Element) {
                if (t.closest(NATIVE)) m = 'native';
                else if (t.closest(TEXT)) m = 'text';
                else {
                    const l = t.closest(LINK);
                    if (l) { m = 'link'; tgt = l; }
                }
            }
            const entered = m === 'link' && tgt && tgt !== target;
            mode = m; target = tgt;
            warmT = m === 'link' ? 1 : 0;
            if (entered && !reduce) for (let i = 0; i < 2; i++) rings.push({ x: mx, y: my, r: -i * 8, life: 1, c: col(i + 1) });
        };

        const onMove = (e: MouseEvent) => {
            mx = e.clientX; my = e.clientY;
            inside = true;
            setMode(e.target);
            wake();
        };
        const onLeave = () => { inside = false; wake(); };
        const onDown = (e: MouseEvent) => {
            if (mode === 'text' || mode === 'native' || reduce) return;
            for (let i = 0; i < 8; i++) {
                const a = rnd(0, Math.PI * 2), v = rnd(1.5, 5);
                parts.push({ x: e.clientX, y: e.clientY, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: rnd(2.5, 6), life: 1, d: rnd(0.012, 0.022), c: col(i) });
            }
            wake();
        };

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('mouseover', onMove, { passive: true });
        window.addEventListener('mousedown', onDown, { passive: true });
        window.addEventListener('blur', onLeave);
        root.addEventListener('mouseleave', onLeave);

        function tick(now: number) {
            try {
                const dt = Math.min(2, (now - last) / 16.7 || 1); last = now;
                alpha += ((inside ? 1 : 0) - alpha) * 0.25 * Math.min(1.5, dt);
                if (!inside && alpha < 0.02) alpha = 0;
                warm += (warmT - warm) * 0.15 * Math.min(1.5, dt);
                const text = mode === 'text';
                const a = mode === 'native' ? 0 : alpha;

                ctx!.clearRect(0, 0, W, H);

                // droplets from a click
                for (let i = parts.length - 1; i >= 0; i--) {
                    const q = parts[i];
                    q.vy += 0.08 * dt; q.x += q.vx * dt; q.y += q.vy * dt; q.vx *= 0.985; q.life -= q.d * dt;
                    if (q.life <= 0) { parts.splice(i, 1); continue; }
                    ctx!.globalAlpha = q.life; ctx!.fillStyle = q.c;
                    ctx!.beginPath(); ctx!.arc(q.x, q.y, q.r * (0.5 + q.life * 0.5), 0, 7); ctx!.fill();
                }
                ctx!.globalAlpha = 1;

                // shock ripple rings
                for (let i = rings.length - 1; i >= 0; i--) {
                    const r = rings[i];
                    r.r += 0.9 * dt; if (r.r > 0) r.life -= 0.03 * dt;
                    if (r.life <= 0) { rings.splice(i, 1); continue; }
                    if (r.r <= 0) continue;
                    ctx!.strokeStyle = r.c; ctx!.lineWidth = 1.2 * r.life + 0.3;
                    ctx!.globalAlpha = r.life * 0.32; ctx!.beginPath(); ctx!.arc(r.x, r.y, r.r, 0, 7); ctx!.stroke();
                }
                ctx!.globalAlpha = 1;

                // mist + round head
                if (a > 0.01 && !text) {
                    const t = reduce ? 0 : now / 1000;
                    const sc = 1 + warm * 0.2;
                    [[0, 0], [2.1, 2]].forEach(([ph, ci]) => {
                        const ox = Math.cos(t * 1.6 + ph) * 15, oy = Math.sin(t * 1.9 + ph) * 15, R = 48 * sc;
                        const g = ctx!.createRadialGradient(mx + ox, my + oy, 0, mx + ox, my + oy, R);
                        g.addColorStop(0, rgba(col(ci), 0.4 * a)); g.addColorStop(1, rgba(col(ci), 0));
                        ctx!.fillStyle = g; ctx!.beginPath(); ctx!.arc(mx + ox, my + oy, R, 0, 7); ctx!.fill();
                    });
                    ctx!.globalAlpha = a;
                    ctx!.fillStyle = '#fff'; ctx!.beginPath(); ctx!.arc(mx, my, 5.8, 0, 7); ctx!.fill();
                    ctx!.fillStyle = col(1); ctx!.beginPath(); ctx!.arc(mx, my, 4, 0, 7); ctx!.fill();
                    ctx!.globalAlpha = 1;
                }

                bar!.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
                bar!.style.opacity = String(text ? a : 0);

                if (alpha > 0.02 && !hidArrow) { root.classList.add('lrbc-cursor'); hidArrow = true; }

                // keep drawing while the pointer is in the page (the mist drifts) or anything is still fading
                if (!inside && alpha === 0 && !parts.length && !rings.length) { running = false; return; }
            } catch (err) {
                (window as unknown as { __cursorErr?: unknown }).__cursorErr = String(err);
            }
            raf = requestAnimationFrame(tick);
        }

        return () => {
            cancelAnimationFrame(raf);
            root.classList.remove('lrbc-cursor');
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseover', onMove);
            window.removeEventListener('mousedown', onDown);
            window.removeEventListener('blur', onLeave);
            root.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <div aria-hidden="true" className="lrbc-cur" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2147483000, overflow: 'hidden' }}>
            <canvas ref={canvasRef} className="lrbc-cur-canvas" />
            <div ref={barRef} className="lrbc-cur-bar" />
        </div>
    );
}

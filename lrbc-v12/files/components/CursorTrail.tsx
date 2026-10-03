'use client';

import { useEffect, useRef } from 'react';

/**
 * Desktop-only cursor ("Orbit"):
 *  • a small brand-gradient diamond that sits exactly on the pointer (precise, zero lag),
 *  • a hairline ring that glides after it with easing, with a tiny satellite orbiting on it,
 *  • a very light aura glow behind the ring (never covers text),
 *  • over links / buttons the ring grows and fills with a translucent brand tint,
 *  • on press the ring squeezes, and each click sends out a soft ripple,
 *  • over text fields the effect gets out of the way and the normal I-beam shows.
 * Touch / mobile devices get nothing at all (native behaviour, no finger trail).
 * The native arrow is hidden only after the first frame has really been drawn.
 */

const LINK = 'a,button,[role="button"],summary,label,select,[data-magnet-wrap]';
const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]),textarea,[contenteditable="true"]';

export default function CursorTrail() {
    const dotRef = useRef<HTMLDivElement>(null);
    const ringRef = useRef<HTMLDivElement>(null);
    const auraRef = useRef<HTMLDivElement>(null);
    const rippleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        // Only for real mouse / trackpad devices. Phones & tablets: nothing.
        const finePointer = window.matchMedia('(any-pointer: fine)').matches && window.matchMedia('(any-hover: hover)').matches;
        const dot = dotRef.current, ring = ringRef.current, aura = auraRef.current, ripple = rippleRef.current;
        if (!finePointer || !dot || !ring || !aura || !ripple) return;
        const root = document.documentElement;

        let mx = -200, my = -200;      // pointer
        let rx = -200, ry = -200;      // ring (eased)
        let ax = -200, ay = -200;      // aura (eased, slower)
        let inside = false, alpha = 0;
        let scale = 1, scaleTarget = 1;
        let mode: 'idle' | 'link' | 'text' = 'idle';
        let down = false;
        let raf = 0, running = false, hidArrow = false, still = 0;

        const wake = () => {
            still = 0;
            if (!running) { running = true; raf = requestAnimationFrame(tick); }
        };

        const setMode = (target: EventTarget | null) => {
            let m: typeof mode = 'idle';
            if (target instanceof Element) {
                if (target.closest(TEXT)) m = 'text';
                else if (target.closest(LINK)) m = 'link';
            }
            mode = m;
            scaleTarget = m === 'link' ? 0.8 : 1;   // gets slightly tighter over buttons, never covers them
            ring.dataset.mode = m;
        };

        const onMove = (e: MouseEvent) => {
            if (!inside) { rx = ax = mx = e.clientX; ry = ay = my = e.clientY; }
            inside = true;
            mx = e.clientX; my = e.clientY;
            setMode(e.target);
            wake();
        };
        const onLeave = () => { inside = false; wake(); };
        const onDown = (e: MouseEvent) => {
            down = true; wake();
            // soft ripple at the click point
            ripple.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            ripple.classList.remove('lrbc-ripple-go');
            void ripple.offsetWidth;
            ripple.classList.add('lrbc-ripple-go');
        };
        const onUp = () => { down = false; wake(); };

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('mouseover', onMove, { passive: true });
        window.addEventListener('mousedown', onDown, { passive: true });
        window.addEventListener('mouseup', onUp, { passive: true });
        window.addEventListener('blur', onLeave);
        root.addEventListener('mouseleave', onLeave);

        function tick() {
            try {
                alpha += ((inside ? 1 : 0) - alpha) * 0.2;
                if (!inside && alpha < 0.02) alpha = 0;

                // ring follows quickly but smoothly, aura a little slower
                rx += (mx - rx) * 0.22; ry += (my - ry) * 0.22;
                ax += (mx - ax) * 0.1;  ay += (my - ay) * 0.1;
                const target = down ? scaleTarget * 0.8 : scaleTarget;
                scale += (target - scale) * 0.2;

                const textMode = mode === 'text';
                const a = textMode ? 0 : alpha;                       // step aside over text fields
                const ringA = mode === 'link' ? a * 0.55 : a;
                const auraA = mode === 'link' ? 0 : a;

                dot.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(${mode === 'link' ? 0.8 : 1})`;
                dot.style.opacity = String(a);
                ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${scale.toFixed(3)})`;
                ring.style.opacity = String(ringA);
                aura.style.transform = `translate3d(${ax}px, ${ay}px, 0)`;
                aura.style.opacity = String(auraA);

                if (alpha > 0.02 && !hidArrow) { root.classList.add('lrbc-cursor'); hidArrow = true; }

                const settled =
                    Math.abs(mx - rx) < 0.1 && Math.abs(my - ry) < 0.1 &&
                    Math.abs(mx - ax) < 0.3 && Math.abs(my - ay) < 0.3 &&
                    Math.abs(scale - target) < 0.005 && (inside ? alpha > 0.98 || textMode : alpha === 0);
                still = settled ? still + 1 : 0;
                if (still > 6) { running = false; return; }
            } catch (err) {
                (window as unknown as { __cursorErr?: unknown }).__cursorErr = String(err);
            }
            raf = requestAnimationFrame(tick);
        }

        return () => {
            cancelAnimationFrame(raf);
            root.classList.remove('lrbc-cursor');
            window.removeEventListener('mousemove', onMove);
            window.removeEventListener('mouseover', onMove);
            window.removeEventListener('mousedown', onDown);
            window.removeEventListener('mouseup', onUp);
            window.removeEventListener('blur', onLeave);
            root.removeEventListener('mouseleave', onLeave);
        };
    }, []);

    return (
        <div aria-hidden="true" className="lrbc-cur" style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 2147483000, overflow: 'hidden' }}>
            <div ref={auraRef} className="lrbc-cur-aura" />
            <div ref={rippleRef} className="lrbc-cur-ripple" />
            <div ref={ringRef} className="lrbc-cur-ring" data-mode="idle"><span className="lrbc-cur-spin" /></div>
            <div ref={dotRef} className="lrbc-cur-dot"><i /></div>
        </div>
    );
}

'use client';

import { useEffect, useRef } from 'react';

/**
 * Desktop-only cursor ("Spark + Viewfinder + Spotlight"):
 *  • a small brand-gradient four-point sparkle sits exactly on the pointer (precise, zero lag) and turns slowly,
 *  • four thin corner brackets (a camera viewfinder) appear ONLY over links and buttons, gliding out and snapping around the element,
 *  • a faint violet-to-pink spotlight glows softly behind the pointer and warms up a little over links,
 *  • on press the sparkle and brackets squeeze slightly,
 *  • over text fields everything gives way to a slim text bar (the system cursor is never shown).
 * Touch / mobile devices get nothing at all (native behaviour).
 * The native arrow is hidden only after the first frame has really been drawn.
 */

const LINK = 'a,button,[role="button"],summary,label,[data-magnet-wrap],input[type="checkbox"],input[type="radio"],input[type="submit"],input[type="button"],input[type="file"]';
const TEXT = 'input:not([type="checkbox"]):not([type="radio"]):not([type="submit"]):not([type="button"]):not([type="file"]):not([type="range"]),textarea,[contenteditable="true"]';
// things the browser draws itself (dropdown lists, embedded maps) or the admin editor: the effect steps aside and the normal cursor shows
const NATIVE = 'select,option,iframe,[data-cms-panel],.lrbc-cms-hide';

export default function CursorTrail() {
    const glowRef = useRef<HTMLDivElement>(null);
    const frameRef = useRef<HTMLDivElement>(null);
    const sparkRef = useRef<HTMLDivElement>(null);
    const barRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const finePointer = window.matchMedia('(any-pointer: fine)').matches && window.matchMedia('(any-hover: hover)').matches;
        const glow = glowRef.current, frame = frameRef.current, spark = sparkRef.current, bar = barRef.current;
        if (!finePointer || !glow || !frame || !spark || !bar) return;
        const root = document.documentElement;

        let mx = -200, my = -200;                 // pointer
        let gx = -200, gy = -200;                 // spotlight (eased)
        // viewfinder frame: position + size, eased toward its target
        let fx = -200, fy = -200, fw = 26, fh = 26;
        let inside = false, alpha = 0, warm = 0, warmT = 0, fa = 0;
        let sparkScale = 1, sparkT = 1;
        let mode: 'idle' | 'link' | 'text' | 'native' = 'idle';
        let target: Element | null = null;
        let down = false;
        let raf = 0, running = false, hidArrow = false, still = 0;

        const wake = () => {
            still = 0;
            if (!running) { running = true; raf = requestAnimationFrame(tick); }
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
            mode = m; target = tgt;
            warmT = m === 'link' ? 1 : 0;
        };

        const onMove = (e: MouseEvent) => {
            if (!inside) { gx = fx = mx = e.clientX; gy = fy = my = e.clientY; }
            inside = true;
            mx = e.clientX; my = e.clientY;
            setMode(e.target);
            wake();
        };
        const onLeave = () => { inside = false; wake(); };
        const onDown = () => { down = true; wake(); };
        const onUp = () => { down = false; wake(); };

        window.addEventListener('mousemove', onMove, { passive: true });
        window.addEventListener('mouseover', onMove, { passive: true });
        window.addEventListener('mousedown', onDown, { passive: true });
        window.addEventListener('mouseup', onUp, { passive: true });
        window.addEventListener('blur', onLeave);
        root.addEventListener('mouseleave', onLeave);

        function tick() {
            try {
                alpha += ((inside ? 1 : 0) - alpha) * 0.25;
                if (!inside && alpha < 0.02) alpha = 0;
                warm += (warmT - warm) * 0.15;

                const text = mode === 'text';
                const a = mode === 'native' ? 0 : alpha;

                // spotlight: eased, faint, never covers content
                gx += (mx - gx) * 0.14; gy += (my - gy) * 0.14;
                const gs = 1 + warm * 0.25;
                glow!.style.transform = `translate3d(${gx}px, ${gy}px, 0) scale(${gs.toFixed(3)})`;
                glow!.style.opacity = String(text ? a * 0.5 : a * (0.75 + warm * 0.25));

                // viewfinder target box
                let tx = mx - 13, ty = my - 13, tw = 26, th = 26;
                let snapped = false;
                if (mode === 'link' && target) {
                    const r = target.getBoundingClientRect();
                    // very large link areas (whole cards) keep the small frame so nothing is boxed in awkwardly
                    if (r.width > 0 && r.height > 0 && r.width < 520 && r.height < 200) {
                        tx = r.left - 7; ty = r.top - 6; tw = r.width + 14; th = r.height + 12; snapped = true;
                    }
                }
                if (down) { tx += 2; ty += 2; tw -= 4; th -= 4; }
                const k = snapped ? 0.3 : 0.4;
                fx += (tx - fx) * k; fy += (ty - fy) * k; fw += (tw - fw) * k; fh += (th - fh) * k;
                frame!.style.width = `${Math.max(0, fw).toFixed(1)}px`;
                frame!.style.height = `${Math.max(0, fh).toFixed(1)}px`;
                frame!.style.transform = `translate3d(${fx}px, ${fy}px, 0)`;
                fa += ((snapped ? 1 : 0) - fa) * 0.3;               // brackets show only while a link or button is under the pointer
                frame!.style.opacity = String(text ? 0 : a * fa);

                // sparkle sits exactly on the pointer
                sparkT = down ? 0.8 : (mode === 'link' ? (snapped ? 0.75 : 1.35) : 1);
                sparkScale += (sparkT - sparkScale) * 0.25;
                spark!.style.transform = `translate3d(${mx}px, ${my}px, 0) scale(${sparkScale.toFixed(3)})`;
                spark!.style.opacity = String(text ? 0 : a);

                bar!.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
                bar!.style.opacity = String(text ? a : 0);

                if (alpha > 0.02 && !hidArrow) { root.classList.add('lrbc-cursor'); hidArrow = true; }

                const settled =
                    Math.abs(tx - fx) < 0.2 && Math.abs(ty - fy) < 0.2 && Math.abs(tw - fw) < 0.2 && Math.abs(th - fh) < 0.2 &&
                    Math.abs(mx - gx) < 0.3 && Math.abs(my - gy) < 0.3 &&
                    Math.abs(sparkT - sparkScale) < 0.004 && Math.abs((snapped ? 1 : 0) - fa) < 0.01 && Math.abs(warmT - warm) < 0.01 &&
                    (inside ? alpha > 0.98 || mode === 'native' : alpha === 0);
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
            <div ref={glowRef} className="lrbc-cur-glow" />
            <div ref={frameRef} className="lrbc-cur-frame"><i /><i /><i /><i /></div>
            <div ref={sparkRef} className="lrbc-cur-spark">
                <svg viewBox="0 0 24 24" width="26" height="26">
                    <defs>
                        <linearGradient id="lrbcSparkGrad" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0" stopColor="#5227FF" />
                            <stop offset="0.55" stopColor="#a855f7" />
                            <stop offset="1" stopColor="#d946ef" />
                        </linearGradient>
                    </defs>
                    <path d="M12 1 L14.6 9.4 L23 12 L14.6 14.6 L12 23 L9.4 14.6 L1 12 L9.4 9.4 Z"
                          fill="url(#lrbcSparkGrad)" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round" paintOrder="stroke" />
                </svg>
            </div>
            <div ref={barRef} className="lrbc-cur-bar" />
        </div>
    );
}

'use client';

import { useEffect } from 'react';

/**
 * Site-wide magnetic effect: every button / CTA link gently leans toward the pointer when it comes close.
 * Uses the CSS `translate` property, so it never fights hover transforms or GSAP.
 * Skipped on touch-only devices. Opt out with data-no-magnet.
 */
const SELECTOR = [
    'button:not([role="tab"]):not([aria-expanded]):not([role="switch"]):not([role="combobox"])',
    'a[data-slot="button"]',
    '.lrbc-liquid-btn',
    '[data-magnetic]',
].join(',');

const RADIUS = 70;     // px around the button where the pull starts
const STRENGTH = 0.28; // how far it leans (fraction of the distance)

export default function MagneticAll() {
    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.matchMedia('(pointer: coarse)').matches) return;

        let active: HTMLElement | null = null;
        let raf = 0, px = 0, py = 0;

        const eligible = (el: HTMLElement) => {
            if (el.closest('[data-no-magnet],[data-magnet-wrap]')) return false;
            // buttons positioned with Tailwind translate classes (e.g. -translate-y-1/2) must not be moved
            if (typeof el.className === 'string' && /(^|\s)-?translate-/.test(el.className)) return false;
            if (el.hasAttribute('disabled')) return false;
            const r = el.getBoundingClientRect();
            return r.width > 20 && r.height > 20 && r.width < 420 && r.height < 100;
        };
        const reset = (el: HTMLElement | null) => {
            if (!el) return;
            el.style.transition = 'translate .45s cubic-bezier(.22,1,.36,1)';
            el.style.translate = '';
            el.dataset.mx = '0'; el.dataset.my = '0';
        };

        const frame = () => {
            raf = 0;
            // find the closest eligible button within RADIUS of the pointer
            const hit = document.elementFromPoint(px, py);
            let el = (hit as HTMLElement | null)?.closest?.(SELECTOR) as HTMLElement | null;
            let best: HTMLElement | null = null;
            if (el && eligible(el)) best = el;
            else if (active) {
                const r = active.getBoundingClientRect();
                const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
                const dx = Math.max(Math.abs(px - cx) - r.width / 2, 0), dy = Math.max(Math.abs(py - cy) - r.height / 2, 0);
                if (Math.hypot(dx, dy) < RADIUS * 0.6) best = active;   // keep leaning while still near
            }
            if (active && active !== best) { reset(active); active = null; }
            if (best) {
                const r = best.getBoundingClientRect();
                const tx = parseFloat(best.dataset.mx || '0'), ty = parseFloat(best.dataset.my || '0');
                // un-shift the rect so the pull is measured from the button's resting centre
                const cx = r.left + r.width / 2 - tx, cy = r.top + r.height / 2 - ty;
                const nx = Math.max(-10, Math.min(10, (px - cx) * STRENGTH));
                const ny = Math.max(-8, Math.min(8, (py - cy) * STRENGTH));
                best.dataset.mx = String(nx); best.dataset.my = String(ny);
                best.style.transition = 'translate .12s ease-out';
                best.style.translate = `${nx}px ${ny}px`;
                active = best;
            }
        };

        const onMove = (e: MouseEvent) => {
            px = e.clientX; py = e.clientY;
            if (!raf) raf = requestAnimationFrame(frame);
        };
        const onLeave = () => { reset(active); active = null; };

        window.addEventListener('mousemove', onMove, { passive: true });
        document.documentElement.addEventListener('mouseleave', onLeave);
        return () => {
            window.removeEventListener('mousemove', onMove);
            document.documentElement.removeEventListener('mouseleave', onLeave);
            if (raf) cancelAnimationFrame(raf);
            reset(active);
        };
    }, []);

    return null;
}

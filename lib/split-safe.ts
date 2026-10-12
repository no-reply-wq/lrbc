/**
 * Descender-safe helpers for GSAP SplitText `mask: "lines"`.
 *
 * SplitText wraps every line in a mask element with `overflow: clip`, which slices the bottom of
 * "g", "y", "p", "j" when line-height is tight. `padMasks` gives each mask extra bottom room and
 * pulls it back with an equal negative margin so the visual rhythm does not change.
 * Use it as `onSplit: padMasks` and start reveals from `yPercent: REVEAL_Y` (slightly > 100) so the
 * hidden line never peeks into the extra padding.
 */
export const REVEAL_Y = 125;

export function padMasks(self: { masks?: Element[] }) {
  (self.masks || []).forEach((el) => {
    const m = el as HTMLElement;
    m.style.paddingBottom = "0.22em";
    m.style.marginBottom = "-0.22em";
  });
}

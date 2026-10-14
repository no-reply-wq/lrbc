"use client";

import { useEffect, useRef, useState } from "react";
import { Et, useVal } from "@/components/cms/editable";
import { useCms } from "@/components/cms/ContentProvider";
import { VIDEO_TESTIMONIALS, VIDEO_DIR, type VideoTestimonial } from "@/lib/video-testimonials";

type Src = { kind: "youtube" | "vimeo" | "file"; id: string; src: string };

function parse(url: string): Src | null {
  const u = (url || "").trim();
  if (!u) return null;
  const yt = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/i);
  if (yt) return { kind: "youtube", id: yt[1], src: `https://www.youtube-nocookie.com/embed/${yt[1]}?autoplay=1&rel=0&modestbranding=1` };
  const vm = u.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vm) return { kind: "vimeo", id: vm[1], src: `https://player.vimeo.com/video/${vm[1]}?autoplay=1` };
  return { kind: "file", id: u, src: u };
}

function Card({ v, playing, onPlay, onStop }: { v: VideoTestimonial; playing: boolean; onPlay: () => void; onStop: () => void }) {
  const { editing } = useCms();
  const defUrl = v.videoFile ? `${VIDEO_DIR}${v.videoFile}` : v.youtube;
  const url = useVal(`home.video.${v.id}.url`, defUrl);
  const yt = useVal(`home.video.${v.id}.yt`, v.youtube).trim();
  const src = parse(url);
  const poster = v.poster || (src?.kind === "youtube" ? `https://i.ytimg.com/vi/${src.id}/hqdefault.jpg` : "");
  const start = () => { if (src && !editing) onPlay(); };
  const isPlaying = playing && !!src && !editing;
  const vid = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  useEffect(() => { if (!isPlaying) setPaused(false); }, [isPlaying]);
  const toggle = () => {
    const el = vid.current;
    if (!el) return;
    if (el.paused) { el.play().catch(() => {}); } else { el.pause(); }
  };
  const isFile = src?.kind === "file";

  // magnetic buttons: they lean toward the pointer, but never closer than MIN_GAP to each other
  const row = useRef<HTMLDivElement>(null);
  const magMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !row.current) return;
    const els = Array.from(row.current.querySelectorAll<HTMLElement>("[data-mag]"));
    els.forEach((el) => (el.style.transform = "translate(0,0)"));
    const rects = els.map((el) => el.getBoundingClientRect());
    const off = rects.map((r) => {
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy), R = 90;
      if (dist > R || dist === 0) return { x: 0, y: 0 };
      const k = (1 - dist / R) * 0.55;
      return { x: Math.max(-10, Math.min(10, dx * k)), y: Math.max(-8, Math.min(8, dy * k)) };
    });
    if (els.length === 2) {
      const MIN_GAP = 10;
      const gap = rects[1].left - rects[0].right + off[1].x - off[0].x;
      if (gap < MIN_GAP) { const ex = (MIN_GAP - gap) / 2; off[0].x -= ex; off[1].x += ex; }
    }
    els.forEach((el, i) => (el.style.transform = `translate(${off[i].x.toFixed(1)}px, ${off[i].y.toFixed(1)}px)`));
  };
  const magLeave = () => row.current?.querySelectorAll<HTMLElement>("[data-mag]").forEach((el) => (el.style.transform = "translate(0,0)"));

  return (
    <div className="vt-card shrink-0" data-vt-card>
      <div
        onClick={isPlaying ? (isFile ? toggle : undefined) : start}
        className={`group relative aspect-[9/16] overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1245] via-[#5227FF] to-[#a855f7] shadow-lg ring-1 ring-black/5 ${src && !editing && (!isPlaying || isFile) ? "cursor-pointer" : ""}`}
      >
        {poster ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={poster} alt="" decoding="async" className="absolute inset-0 !h-full !w-full object-cover" />
        ) : isFile && !isPlaying ? (
          <video src={`${src!.src}#t=0.5`} preload="metadata" muted playsInline className="absolute inset-0 !h-full !w-full object-cover" />
        ) : null}

        {isPlaying && src && (isFile ? (
          <video
            ref={vid}
            src={src.src}
            autoPlay
            playsInline
            disablePictureInPicture
            controlsList="nodownload nofullscreen noremoteplayback"
            onPlay={() => setPaused(false)}
            onPause={() => setPaused(true)}
            onEnded={onStop}
            onContextMenu={(e) => e.preventDefault()}
            className="absolute inset-0 !h-full !w-full bg-black object-cover"
          />
        ) : (
          <iframe src={src.src.replace("autoplay=1", "autoplay=1&controls=0&fs=0&disablekb=1")} title={`Video testimonial from ${v.client}`} allow="autoplay; encrypted-media; picture-in-picture" className="absolute inset-0 h-full w-full border-0 bg-black" />
        ))}

        {/* readability gradient */}
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-t ${isPlaying ? "from-black/60 via-transparent to-black/30" : "from-black/90 via-black/30 to-black/40"}`} />

        {/* top: topic tag, company underneath (stacked so they can never collide) */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex flex-col items-start gap-1.5 sm:inset-x-4 sm:top-4">
          <Et as="span" id={`home.video.${v.id}.tag`} def={v.category} className="max-w-full rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase leading-tight tracking-wider text-[#3b1fd1]" />
          <Et as="span" id={`home.video.${v.id}.company`} def={v.company} className="font-heading text-sm font-bold leading-tight text-white drop-shadow" />
        </div>

        {/* bottom: quote + person (hidden while playing so the video's own captions stay clear), then actions */}
        <div className="absolute inset-x-3 bottom-3 flex flex-col gap-2 text-left text-white sm:inset-x-4 sm:bottom-4">
          {!isPlaying && (
            <>
              <Et as="p" id={`home.video.${v.id}.quote`} def={v.quote} className="line-clamp-4 text-[14px] font-semibold leading-snug drop-shadow sm:text-[15px]" />
              <p className="text-[11px] leading-snug text-white/80">
                <Et as="span" id={`home.video.${v.id}.name`} def={v.client} className="font-semibold text-white" />
                {" · "}
                <Et as="span" id={`home.video.${v.id}.role`} def={v.position} />
              </p>
            </>
          )}
          <div ref={row} onPointerMove={magMove} onPointerLeave={magLeave} className="-m-3 flex items-center justify-center gap-3 p-3 pt-4">
            {src ? (
              isPlaying ? (
                isFile && (
                  <button
                    type="button"
                    data-mag
                    onClick={(e) => { e.stopPropagation(); toggle(); }}
                    aria-label={paused ? "Resume video" : "Pause video"}
                    className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#1b1b2f] shadow-md transition-[transform,scale] duration-200 ease-out hover:scale-105 active:scale-95"
                  >
                    {paused ? (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#5227FF]" fill="currentColor" aria-hidden><path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11-6.86a1 1 0 0 0 0-1.7l-11-6.86A1 1 0 0 0 8 5.14Z" /></svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#5227FF]" fill="currentColor" aria-hidden><rect x="6" y="5" width="4" height="14" rx="1" /><rect x="14" y="5" width="4" height="14" rx="1" /></svg>
                    )}
                    {paused ? "Resume" : "Pause"}
                  </button>
                )
              ) : (
                <button
                  type="button"
                  data-mag
                  onClick={(e) => { e.stopPropagation(); start(); }}
                  aria-label={`Play video testimonial from ${v.client}`}
                  className="inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-[#1b1b2f] shadow-md transition-[transform,scale] duration-200 ease-out hover:scale-105 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-[#5227FF]" fill="currentColor" aria-hidden><path d="M8 5.14v13.72a1 1 0 0 0 1.52.85l11-6.86a1 1 0 0 0 0-1.7l-11-6.86A1 1 0 0 0 8 5.14Z" /></svg>
                  Play story
                </button>
              )
            ) : (
              <span className="whitespace-nowrap rounded-full bg-white/90 px-4 py-2 text-xs font-semibold text-[#5227FF]">Video coming soon</span>
            )}
            {yt && !editing && (
              <a
                data-mag
                href={yt}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Watch ${v.client}'s testimonial on YouTube`}
                title="Watch on YouTube"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/95 text-[#FF0000] shadow-md transition-[transform,scale] duration-200 ease-out hover:scale-110 active:scale-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2C0 8.1 0 12 0 12s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.6 15.6V8.4l6.2 3.6-6.2 3.6z" /></svg>
              </a>
            )}
          </div>
        </div>
      </div>
      {editing && (
        <p className="mt-2 break-all rounded-md border border-dashed border-border p-2 text-xs text-muted-foreground">
          Video link (YouTube, Vimeo or {VIDEO_DIR}file.mp4):{" "}
          <Et id={`home.video.${v.id}.url`} def={defUrl} />
          <br />
          YouTube link (shows the YouTube icon): <Et id={`home.video.${v.id}.yt`} def={v.youtube} />
        </p>
      )}
    </div>
  );
}

function Arrow({ dir, onClick }: { dir: "l" | "r"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "l" ? "Previous video" : "Next video"}
      className={`absolute top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-border bg-background text-foreground shadow-md transition hover:scale-105 hover:bg-muted ${dir === "l" ? "left-1 sm:left-2" : "right-1 sm:right-2"}`}
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d={dir === "l" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
      </svg>
    </button>
  );
}

const GAP = 20;          // px between cards
const DWELL = 4500;      // ms each video stays in the centre
const SLIDE = 1000;      // ms for the slow slide to the next one

export default function VideoTestimonials() {
  const { editing } = useCms();
  const [playKey, setPlayKey] = useState<string | null>(null);
  const [cw, setCw] = useState(320);
  const rail = useRef<HTMLDivElement>(null);
  const hold = useRef(false);
  const openRef = useRef(false);
  openRef.current = playKey !== null;
  const cur = useRef(0);
  const busy = useRef(false);
  const anim = useRef(0);
  const touchX = useRef<number | null>(null);
  const goRef = useRef<(d: 1 | -1) => void>(() => {});

  // Three identical sets let the strip loop forever (one set, with unique ids, while editing).
  const base = VIDEO_TESTIMONIALS;
  const items = editing ? base : base.length >= 5 ? base : [...base, ...base];
  const sets = editing ? 1 : 3;
  const per = items.length;

  // card width follows the section width: one big card in the middle, neighbours peeking in
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const size = () => { const w = el.clientWidth; const n = w >= 720 ? 3.5 : w >= 480 ? 2.5 : 1.5; setCw(Math.round(Math.min(290, Math.max(210, w / n - 12)))); };
    size();
    const ro = new ResizeObserver(size);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const cards = () => Array.from(el.querySelectorAll<HTMLElement>("[data-vt-card]"));
    const target = (i: number) => {
      const c = cards()[i];
      return c ? c.offsetLeft + c.offsetWidth / 2 - el.clientWidth / 2 : 0;
    };
    // centred card = full strength; the further away, the fainter and smaller
    const paint = () => {
      const mid = el.scrollLeft + el.clientWidth / 2;
      for (const c of cards()) {
        const d = Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid) / (c.offsetWidth + GAP);
        c.style.opacity = String(d <= 1.15 ? 1 : Math.max(0.1, 1 - 0.7 * (d - 1.15)));
        c.style.transform = `scale(${1 - 0.04 * Math.min(d, 1)})`;
        c.style.filter = d < 0.04 ? "none" : `blur(${Math.min(4, 0.6 + d * 1.6).toFixed(2)}px)`;
      }
    };
    const place = () => {
      cur.current = editing ? Math.min(cur.current, per - 1) : per + (cur.current % per);
      el.scrollLeft = target(cur.current);
      paint();
    };
    place();

    const tween = (to: number, done: () => void) => {
      cancelAnimationFrame(anim.current);
      const from = el.scrollLeft, t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / SLIDE);
        const e = p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        el.scrollLeft = from + (to - from) * e;
        paint();
        if (p < 1) anim.current = requestAnimationFrame(step); else done();
      };
      anim.current = requestAnimationFrame(step);
    };

    goRef.current = (d) => {
      if (busy.current) return;
      setPlayKey(null);
      const next = cur.current + d;
      if (editing && (next < 0 || next > per - 1)) return;
      busy.current = true;
      cur.current = next;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const finish = () => {
        if (!editing) {
          if (cur.current >= 2 * per) cur.current -= per;
          else if (cur.current < per) cur.current += per;
          el.scrollLeft = target(cur.current);
          paint();
        }
        busy.current = false;
      };
      if (reduce) { el.scrollLeft = target(cur.current); paint(); finish(); }
      else tween(target(cur.current), finish);
    };

    const timer = editing ? 0 : window.setInterval(() => {
      if (!hold.current && !openRef.current && !document.hidden) goRef.current(1);
    }, DWELL);

    const onResize = () => { if (!busy.current) { el.scrollLeft = target(cur.current); paint(); } };
    window.addEventListener("resize", onResize);
    return () => { clearInterval(timer); cancelAnimationFrame(anim.current); busy.current = false; window.removeEventListener("resize", onResize); };
  }, [editing, per, cw]);

  const fade = "linear-gradient(to right, transparent 0, #000 14%, #000 86%, transparent 100%)";

  return (
    <section id="video-testimonials" className="lrbc-section bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <div className="lrbc-eyebrow-row mb-4"><Et as="div" id="home.video.badge" def="Client stories" className="lrbc-eyebrow" /></div>
          <Et as="h2" id="home.video.title" def="Hear it from our clients" className="font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl" />
          <Et as="p" id="home.video.sub" def="Short videos from the people who work with us every day." className="mt-3 text-base text-muted-foreground" />
        </div>

        <div
          className="relative"
          onPointerEnter={(e) => { if (e.pointerType === "mouse") hold.current = true; }}
          onPointerLeave={() => { hold.current = false; }}
          onFocusCapture={() => { hold.current = true; }}
          onBlurCapture={() => { hold.current = false; }}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; hold.current = true; }}
          onTouchEnd={(e) => {
            hold.current = false;
            const x0 = touchX.current; touchX.current = null;
            if (x0 == null) return;
            const dx = e.changedTouches[0].clientX - x0;
            if (!openRef.current && Math.abs(dx) > 40) goRef.current(dx < 0 ? 1 : -1);
          }}
        >
          <Arrow dir="l" onClick={() => goRef.current(-1)} />
          <Arrow dir="r" onClick={() => goRef.current(1)} />
          <div
            ref={rail}
            className="vt-rail flex overflow-hidden py-5"
            style={{
              ["--cw" as string]: `${cw}px`,
              paddingLeft: `calc(50% - ${cw / 2}px)`,
              touchAction: "pan-y",
              WebkitMaskImage: fade,
              maskImage: fade,
            }}
          >
            {Array.from({ length: sets }).flatMap((_, si) =>
              items.map((v, i) => (
                <Card key={`${si}-${i}`} v={v} playing={playKey === `${si}-${i}`} onPlay={() => setPlayKey(`${si}-${i}`)} onStop={() => setPlayKey(null)} />
              ))
            )}
            <div className="shrink-0" style={{ width: `calc(50% - ${cw / 2}px)` }} aria-hidden />
          </div>
        </div>
      </div>
      <style>{`.vt-card{width:var(--cw);margin-right:${GAP}px;will-change:opacity,transform;transition:none}`}</style>

    </section>
  );
}

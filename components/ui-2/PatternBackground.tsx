import { GlowPill } from "./GlowPill"

export default function PatternBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-3xl">

      {/* Blue */}

      <GlowPill
        color="#0175ff"
        className="left-[-40px] top-2 h-2 w-52 rotate-12"
      />

      <GlowPill
        color="#0175ff"
        className="left-12 top-32 h-2 w-44 rotate-[82deg]"
      />

      <GlowPill
        color="#0175ff"
        className="right-24 top-0 h-2 w-56 rotate-[147deg]"
      />

      <GlowPill
        color="#0175ff"
        className="right-0 bottom-24 h-2 w-60 rotate-[39deg]"
      />

      {/* Yellow */}

      <GlowPill
        color="#ffac0a"
        className="right-0 top-0 h-2 w-56 -rotate-12"
      />

      <GlowPill
        color="#ffac0a"
        className="left-8 bottom-12 h-2 w-48 -rotate-[97deg]"
      />

      <GlowPill
        color="#ffac0a"
        className="left-24 top-16 h-2 w-44 rotate-12"
      />

      <GlowPill
        color="#ffac0a"
        className="left-20 -top-8 h-2 w-52 -rotate-[56deg]"
      />

      {/* SVG Pattern */}

      <svg
        className="absolute inset-0 h-full w-full opacity-40"
        viewBox="0 0 578 462"
        fill="none"
      >
        <path
          d="M0 144L222 0L577.5 162.5L325.5 461.5L0 245L119 0L577.5 95.5L0 199L577.5 419L69.5 0L119 461.5L428 0L487.5 461.5"
          stroke="white"
          strokeOpacity=".18"
        />
      </svg>
    </div>
  )
}
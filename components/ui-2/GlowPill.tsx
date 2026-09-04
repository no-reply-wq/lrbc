interface GlowPillProps {
  className?: string
  color: string
  animation?: string
}

export function GlowPill({
  className = "",
  color,
  animation = "animate-glow-x",
}: GlowPillProps) {
  return (
    <div className={`absolute ${animation} ${className}`}>
      {/* Blur */}
      <div
        className="absolute inset-0 rounded-full blur-md opacity-80"
        style={{
          background: `linear-gradient(90deg, ${color}, white)`,
        }}
      />

      {/* Main */}
      <div
        className="relative h-full w-full rounded-full"
        style={{
          background: `linear-gradient(90deg, ${color}, white)`,
        }}
      />
    </div>
  )
}
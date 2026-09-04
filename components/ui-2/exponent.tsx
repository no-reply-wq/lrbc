import { cn } from "@/lib/utils";

interface ExponentLogoProps {
  className?: string;
}

export function ExponentLogo({ className }: ExponentLogoProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-3 text-zinc-900 dark:text-white",
        className
      )}
    >
      <svg
        viewBox="0 0 48 48"
        className="h-10 w-10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer */}
        <rect
          x="4"
          y="4"
          width="40"
          height="40"
          rx="12"
          fill="currentColor"
        />

        {/* Cutouts */}
        <rect
          x="13"
          y="13"
          width="22"
          height="4"
          rx="2"
          fill="white"
        />

        <rect
          x="13"
          y="22"
          width="17"
          height="4"
          rx="2"
          fill="white"
        />

        <rect
          x="13"
          y="31"
          width="22"
          height="4"
          rx="2"
          fill="white"
        />
      </svg>

      <span className="text-2xl font-bold tracking-tight">
        Exponent
      </span>
    </div>
  );
}
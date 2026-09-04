import { cn } from "@/lib/utils";
import Image from "next/image";

export const Logo = ({
  className,
  uniColor,
}: {
  className?: string;
  uniColor?: boolean;
}) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        className
      )}
    >
      <div className="relative h-7 w-7 shrink-0">
        <Image
          src="/images/icon.png"
          alt="logo lrbc"
          fill
          className="object-contain"
        />
      </div>

      <div>
        <p className="font-bold text-sm text-black dark:text-white">
          LRBC
        </p>

        <p className="text-[10px] tracking-tighter text-muted-foreground dark:text-gray-300">
          Business Consulting
        </p>
      </div>
    </div>
  );
};
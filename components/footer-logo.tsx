import { cn } from '@/lib/utils'
import Image from 'next/image';

export const LogoFooter = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "w-[170px] h-[170px] flex flex-col justify-center items-center gap-2",
        className
      )}
      >
      <div className="relative w-[108px] h-[108px]">
        <Image
          src="/images/icon.png"
          alt="LRBC logo"
          fill
          className="object-contain"
        />
      </div>

      <div className="flex flex-col justify-center items-center gap-0">
        <p className="font-bold text-md text-foreground dark:text-white tracking-tighter text-center">
          Lean Resource Business Consulting Private Limited
        </p>

        <p className="text-sm text-muted-foreground dark:text-gray-300 tracking-wider">
          Business Consulting
        </p>
      </div>
    </div>
  );
};
export const LogoIcon = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "relative w-[100px] h-[30px] flex items-center justify-center",
        className
      )}
    >
      <Image
        src="/images/icon.png"
        alt="LRBC logo"
        fill
        className="object-contain"
      />
    </div>
  );
};
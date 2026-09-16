import Image from "next/image";
import { InfiniteSlider } from "@/components/ui/motion-primitives/infinite-slider";

const logos = [
  "/images/c1.png",
  "/images/c2.png",
  "/images/c3.png",
  "/images/c4.png",
  "/images/c5.png",
  "/images/c6.png",
  "/images/c7.png",
];

const Logos = () => (
  <>
    {logos.map((logo, index) => (
      <div
        key={index}
        className="relative flex h-20 w-[90px] sm:h-30 sm:w-[100px] shrink-0 items-center justify-center"
      >
        <Image
          src={logo}
          alt={`Client logo ${index + 1}`}
          width={110}
          height={58}
          className="h-auto max-h-10 w-auto max-w-full object-contain"
        />
      </div>
    ))}
  </>
);

export function LogoCloud() {
  return (
    <section className="bg-background py-6 md:py-8">
      <div className="relative m-auto max-w-7xl px-4 sm:px-6">
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-12">

          {/* Label — always left-aligned, sits above slider on mobile */}
          <p className="shrink-0 text-left text-sm font-medium text-muted-foreground
                        lg:border-r lg:pr-12 lg:text-end">
            Our<br className="hidden lg:block" /> Clients
          </p>

          <div className="w-full overflow-hidden">
            <InfiniteSlider gap={56} className="mask-x-from-85% mask-x-to-99% w-full">
              <Logos />
            </InfiniteSlider>
          </div>
        </div>
      </div>
    </section>
  );
}

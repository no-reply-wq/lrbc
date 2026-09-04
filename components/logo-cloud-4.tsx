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

const Logos = () => {
  return (
    <>
      {logos.map((logo, index) => (
        <div
          key={index}
          className="relative flex h-30 w-[100px] shrink-0 items-center justify-center"
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
};

export function LogoCloud() {
  return (
    <section className="bg-background py-8">
      <div className="relative m-auto max-w-7xl px-6">
        <div className="relative flex gap-6 max-lg:flex-col lg:items-center lg:gap-12">
          <p className="text-muted-foreground shrink-0 lg:border-r lg:pr-12 lg:text-end">
            Our <br className="max-lg:hidden" /> Clients
          </p>

          <InfiniteSlider
            gap={56}
            className="mask-x-from-85% mask-x-to-99%"
          >
            <Logos />
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
}
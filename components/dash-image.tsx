import Image from "next/image";

export default function MobileImage() {
  return (
    <div className="relative block md:hidden w-full">
      <Image
        src="/images/mobile-image.jpg"
        alt="Mobile image"
        width={800}
        height={600}
        className="w-full h-auto object-cover"
        priority
      />
    </div>
  );
}
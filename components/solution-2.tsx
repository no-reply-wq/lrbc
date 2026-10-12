"use client";

import { Et, Hide } from "@/components/cms/editable";
import { useScrollFadeWords } from "@/components/ui/use-scroll-fade";

export default function IntegrationsSection() {
  const fade = useScrollFadeWords<HTMLParagraphElement>();
  return (
    <Hide id="lekha.integrations.sec">
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      <div className="mx-auto max-w-2xl text-center">
        <Et as="h2" id="lekha.integrations.title" def="Meet LekhaSetu." className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl" />

        <p ref={fade} className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          <Et id="lekha.integrations.text1" def="LekhaSetu automatically syncs your accounts software data to the cloud in the background, keeping your business information accurate, connected, and always up to date." />
          <br />
          <br />
          <Et id="lekha.integrations.text2" def="No manual effort. No interruptions. Just the clarity you need to make better business decisions." />
        </p>
      </div>
    </section>
    </Hide>
  );
}

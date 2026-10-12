"use client";

import { Et } from "@/components/cms/editable";
import { useScrollFadeWords } from "@/components/ui/use-scroll-fade";

/** Editable paragraph that uses the site-wide "words fill in as you scroll" animation. */
export default function FadeText({ id, def, className }: { id: string; def: string; className?: string }) {
  const ref = useScrollFadeWords<HTMLParagraphElement>();
  return <Et as="p" ref={ref} reload id={id} def={def} className={className} />;
}

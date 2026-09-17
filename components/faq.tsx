'use client'

import { useState } from 'react'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import Link from 'next/link'
import { useFadeUp } from '@/components/ui/use-scroll-animation'

type FAQItem = {
    id: string
    icon: IconName
    question: string
    answer: string
}

const ALL_FAQ_ITEMS: FAQItem[] = [
    { id:'item-1', icon:'cpu',        question:'What is a custom ERP system, and how is it different from off-the-shelf software?', answer:"A custom ERP system is built around your business's existing physical processes, rather than forcing your operations to conform to a generic template. Off-the-shelf software offers standardised modules that often require you to change how your teams actually work; LRBC instead maps your real workflow first, then architects the system around it." },
    { id:'item-2', icon:'user-minus', question:'How do I make my business less dependent on key employees?', answer:'You reduce person-dependency by converting workflows, approvals, and institutional knowledge into a documented, digital system that anyone can follow. LRBC builds Flow Management Systems and accountability dashboards specifically to capture this tribal knowledge, so operations continue smoothly even if a key employee is unavailable or leaves.' },
    { id:'item-3', icon:'building-2', question:'Is LRBC only for large enterprises, or can growing businesses afford this too?', answer:"LRBC works with both growing businesses and large-scale enterprises, with architecture and pricing calibrated to the client's budget and stage of growth. Our discovery process starts by understanding your budget constraints before scoping a solution, rather than selling a fixed-price package regardless of company size." },
    { id:'item-4', icon:'handshake',  question:'What makes LRBC different from a typical software vendor?', answer:'LRBC provides hands-on, on-the-ground implementation and training, not just a software license. We stay engaged after deployment — training your workforce directly on the floor — until the system is fully adopted and running on autopilot, which is where most off-the-shelf software implementations fail.' },
    { id:'item-5', icon:'timer',      question:'How long does it take to implement a custom business system?', answer:'Implementation timelines depend on the complexity of the processes being digitized and the scale of the business, and are scoped individually during the Requirement & Budget Discovery phase. Because LRBC builds around your existing workflows rather than forcing adoption of a fixed template, timelines are typically faster to real-world adoption than generic software rollouts.' },
    { id:'item-6', icon:'git-branch', question:'Does LRBC only build software, or do you also help with process design?', answer:"LRBC's engagement begins with studying your actual operational process before any system is built, and includes redesigning inefficient workflows where needed. The goal is not just digitization, but converting your operations into a structured, system-driven process — software is the outcome, not the starting point." },
    { id:'item-7', icon:'factory',    question:'What industries does LRBC work with?', answer:'LRBC works with manufacturing and service businesses across industries, including sectors like OEM manufacturer, steel manufacturing, chemicals, interiors, and industrial production. Our approach is process-first and tech-agnostic, so it adapts to the physical and operational realities of different industries rather than applying a one-size-fits-all vertical solution.' },
]

const INITIAL_VISIBLE = 5

export default function FAQs() {
    const [showAll, setShowAll] = useState(false)
    const sectionRef = useFadeUp()

    const visibleItems = showAll ? ALL_FAQ_ITEMS : ALL_FAQ_ITEMS.slice(0, INITIAL_VISIBLE)
    const hiddenCount  = ALL_FAQ_ITEMS.length - INITIAL_VISIBLE

    return (
        <section ref={sectionRef} className="bg-muted dark:bg-background py-10 md:py-16 lg:py-20">
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="flex flex-col gap-6 md:flex-row md:gap-16">

                    <div className="md:w-1/3">
                        <div className="md:sticky md:top-20">
                            <h2 className="lrbc-anim mt-2 text-2xl font-bold sm:text-3xl">
                                Frequently Asked<br className="hidden sm:block" /> Questions
                            </h2>
                            <p className="lrbc-anim lrbc-anim-d1 text-muted-foreground mt-3 text-sm sm:text-base">
                                {"Can't find what you're looking for? Contact our "}
                                <Link href="/contact" className="text-primary font-medium hover:underline">
                                    customer support team
                                </Link>
                            </p>
                        </div>
                    </div>

                    <div className="md:w-2/3">
                        <Accordion type="single" collapsible className="w-full space-y-2">
                            {visibleItems.map((item, i) => (
                                <AccordionItem
                                    key={item.id}
                                    value={item.id}
                                    className="lrbc-anim bg-background shadow-xs rounded-lg border px-4 last:border-b"
                                    style={{ transitionDelay: `${i * 0.06}s` }}
                                >
                                    <AccordionTrigger className="cursor-pointer items-center py-4 hover:no-underline min-h-[52px]">
                                        <div className="flex items-center gap-3 text-left">
                                            <div className="flex size-5 shrink-0">
                                                <DynamicIcon name={item.icon} className="m-auto size-4" />
                                            </div>
                                            <span className="text-sm sm:text-base">{item.question}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-4">
                                        <div className="px-8">
                                            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                                {item.answer}
                                            </p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>

                        {!showAll && hiddenCount > 0 && (
                            <div className="mt-4 flex justify-center">
                                <button onClick={() => setShowAll(true)}
                                    className="text-primary text-sm font-medium rounded-md px-3 py-2 hover:bg-primary/5 transition-colors min-h-[44px]">
                                    See {hiddenCount} more ↓
                                </button>
                            </div>
                        )}
                        {showAll && (
                            <div className="mt-4 flex justify-center">
                                <button onClick={() => setShowAll(false)}
                                    className="text-muted-foreground text-sm font-medium rounded-md px-3 py-2 hover:bg-muted transition-colors min-h-[44px]">
                                    See less ↑
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

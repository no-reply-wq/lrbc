'use client'

import ReceivablesAgingChart from '@/components/dashboar-view/components/receivables-aging-chart'
import { useFadeUp } from '@/components/ui/use-scroll-animation'

export function SolutionSection() {
    const ref = useFadeUp()
    return (
        <section ref={ref}>
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 md:py-14">
                <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:gap-12">
                    <div className="flex flex-col justify-between gap-12 pb-6 max-lg:order-last md:mt-6">
                        <div>
                            <h2 className="lrbc-anim text-balance text-xl sm:text-2xl md:text-4xl font-medium tracking-tight lg:text-5xl">
                                When your data is scattered, every decision takes longer.
                            </h2>
                            <p className="lrbc-anim lrbc-anim-d1 text-muted-foreground mb-6 mt-4 text-balance text-lg">
                                Manual exports, outdated reports, and disconnected systems create bottlenecks that slow down your business.
                            </p>
                        </div>
                        <p className="lrbc-anim lrbc-anim-d2 text-muted-foreground max-w-xs text-balance text-xs">
                            Without real-time visibility, teams spend <span className="text-foreground font-medium">more time</span> searching for information than acting on it.
                        </p>
                    </div>
                    <div className="lrbc-anim lrbc-anim-d1 mask-radial-at-top-left mask-radial-from-65% mask-radial-[100%_80%] -mx-6 px-6 sm:mx-auto sm:max-w-md md:-mx-6 md:ml-auto md:mr-0">
                        <ReceivablesAgingChart />
                    </div>
                </div>
            </div>
        </section>
    )
}

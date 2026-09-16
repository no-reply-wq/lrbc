import ReceivablesAgingChart from '@/components/dashboar-view/components/receivables-aging-chart';

export function SolutionSection() {
    return (
        <section>
            <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
                <div className="grid gap-4 md:grid-cols-2 md:gap-6 lg:gap-12">
                    <div className="flex flex-col justify-between gap-12 pb-6 max-lg:order-last md:mt-6">
                        <div>
                            <h2 className="text-balance text-4xl font-medium tracking-tight lg:text-5xl">When your data is scattered, every decision takes longer.</h2>
                            <p className="text-muted-foreground mb-6 mt-4 text-balance text-lg">
                                Manual exports, outdated reports, and disconnected systems create bottlenecks that slow down your business.
                            </p>
                            
                        </div>

                        <p className="text-muted-foreground max-w-xs text-balance text-xs">
                             Without real-time visibility, teams spend  <span className="text-foreground font-medium"> more time</span>  searching for information than acting on it.
                        </p>
                    </div>

                    <div className="mask-radial-at-top-left mask-radial-from-65% mask-radial-[100%_80%] -mx-6 px-6 sm:mx-auto sm:max-w-md md:-mx-6 md:ml-auto md:mr-0">
                        <ReceivablesAgingChart />
                    </div>
                </div>
            </div>
        </section>
    )
}

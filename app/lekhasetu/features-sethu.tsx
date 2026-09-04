import SalesFunnelCard from '@/components/dashboar-view/components/sales-funnel-card'
import StatCard from '@/components/dashboar-view/components/stat-card'
import { Card } from '@/components/ui/card'
import { ArrowLeftRight, Bell, LineChart, Percent, Users } from 'lucide-react'

export function FeaturesSethu() {
    return (
        <section className="py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-6">
                <h2 className="text-muted-foreground max-w-4xl text-balance text-4xl font-medium tracking-tight lg:text-5xl">
                    <span className="text-foreground">Everything You Need </span> <br />Built to keep your business connected.

                </h2>
                <div className="*:bg-background mt-8 grid gap-3 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
                    <Card className="p-8">
                        <p className="text-muted-foreground max-w-xs text-lg font-medium">
                            <span className="text-foreground">Real-Time Synchronization.</span> Automatically sync vouchers, ledgers, and stock data every few minutes.
                        </p>

                        <div className="my-16">
                            <div
                                aria-hidden
                                className="bg-background relative mx-auto aspect-square w-10/12 rounded-xl border"
                            >
                                <StatCard
                                    title="Lead to Client C.R. %"
                                    value={12}
                                    suffix="%"
                                    description="+2% Target Achieved"
                                    icon={Percent}
                                    iconColor="text-violet-500"
                                    iconBg="bg-violet-500/10"
                                />
                                <div className="bg-card ring-foreground/6.5 absolute bottom-0 right-0 aspect-square w-3/5 translate-x-8 translate-y-16 rounded-xl shadow-xl ring" />
                            </div>
                        </div>
                    </Card>
                    <Card className="lg:col-span-2">
                        <div className="p-8">
                            <p className="text-muted-foreground max-w-xs text-lg font-medium">
                                <span className="text-foreground">Multi-Company Support.</span> Manage multiple location accounting from a single platform.
                            </p>
                        </div>

                        <div className="mask-x-from-65% mt-6 pt-2">
                            <div
                                aria-hidden
                                className="bg-linear-to-b from-foreground/5 ring-foreground/6.5 relative h-72 rounded-xl shadow-xl ring"
                            >
                                <SalesFunnelCard />
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="max-sm:*:not-last:border-b max-sm:*:not-last:pb-3 mt-12 grid gap-3 *:max-w-xs sm:grid-cols-2 md:mt-16 md:gap-y-6 lg:mt-24 lg:grid-cols-4 lg:gap-6">
                    <p className="text-muted-foreground text-balance">
                        <span className="text-foreground font-medium">
                            <ArrowLeftRight className="inline size-4 -translate-y-0.5" /> Live Business Dashboards.
                        </span>{' '}
                        Access real-time insights from any device, anywhere.
                    </p>

                    <p className="text-muted-foreground text-balance">
                        <span className="text-foreground font-medium">
                            <Bell className="inline size-4 -translate-y-0.5" /> Inventory & Stock Tracking
                        </span>{' '}
                        Stay on top of stock movement, consumption, and production.
                    </p>

                    <p className="text-muted-foreground text-balance">
                        <span className="text-foreground font-medium">
                            <Users className="inline size-4 -translate-y-0.5" /> Google Sheets Integration.
                        </span>{' '}
                        Build custom reports using the tools your team already knows.
                    </p>

                    <p className="text-muted-foreground text-balance">
                        <span className="text-foreground font-medium">
                            <LineChart className="inline size-4 -translate-y-0.5" /> Automatic Cloud Sync
                        </span>{' '}
                        Keep your business data secure, current, and always accessible without manual effort.
                    </p>
                </div>
            </div>
        </section>
    )
}

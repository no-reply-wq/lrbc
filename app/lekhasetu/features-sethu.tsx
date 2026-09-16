"use client";
import SalesFunnelCard from '@/components/dashboar-view/components/sales-funnel-card'
import LekhaSetuSyncDashboard from '@/components/lekhasetu-sync-dashboard'
import { Card } from '@/components/ui/card'
import { ArrowLeftRight, Bell, LineChart, Users } from 'lucide-react'

export function FeaturesSethu() {
    return (
        <section className="py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <h2 className="text-muted-foreground max-w-4xl text-balance text-4xl font-medium tracking-tight lg:text-5xl">
                    <span className="text-foreground">Everything You Need </span> <br />Built to keep your business connected.
                </h2>

                <div className="*:bg-background mt-8 grid gap-3 md:mt-16 md:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1: Real-Time Sync — with live sync dashboard */}
                    <Card className="p-6 flex flex-col gap-5">
                        <p className="text-muted-foreground max-w-xs text-lg font-medium">
                            <span className="text-foreground">Real-Time Synchronization.</span> Automatically sync vouchers, ledgers, and stock data every few minutes.
                        </p>
                        <div className="flex-1 min-h-[260px]">
                            <LekhaSetuSyncDashboard />
                        </div>
                    </Card>

                    {/* Card 2: Multi-Company — with sales funnel */}
                    <Card className="lg:col-span-2 flex flex-col">
                        <div className="p-6">
                            <p className="text-muted-foreground max-w-xs text-lg font-medium">
                                <span className="text-foreground">Multi-Company Support.</span> Manage multiple location accounting from a single platform.
                            </p>
                        </div>
                        <div className="flex-1 min-h-[260px] px-4 pb-4">
                            <div className="relative h-full rounded-xl overflow-hidden bg-foreground/5 ring-1 ring-foreground/10">
                                <SalesFunnelCard />
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Bottom 3 feature pills — full width, clearly spaced */}
                <div className="mt-12 grid gap-6 sm:grid-cols-2 md:mt-16 lg:mt-20 lg:grid-cols-3">
                    {[
                        { icon: ArrowLeftRight, title: "Live Business Dashboards", desc: "Access real-time insights from any device, anywhere." },
                        { icon: Bell,           title: "Inventory & Stock Tracking", desc: "Stay on top of stock movement, consumption, and production." },
                        { icon: LineChart,      title: "Automatic Cloud Sync", desc: "Keep your business data secure, current, and always accessible without manual effort." },
                    ].map(({ icon: Icon, title, desc }) => (
                        <div key={title} className="flex items-start gap-4 rounded-2xl border border-border bg-card/60 p-5">
                            <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{title}</p>
                                <p className="text-muted-foreground text-sm mt-1 leading-relaxed">{desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

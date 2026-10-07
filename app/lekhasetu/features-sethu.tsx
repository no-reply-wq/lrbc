"use client";
import { Et, Hide } from "@/components/cms/editable";
import SalesFunnelCard from '@/components/dashboar-view/components/sales-funnel-card'
import LekhaSetuSyncDashboard from '@/components/lekhasetu-sync-dashboard'
import { Card } from '@/components/ui/card'
import { ArrowLeftRight, Bell, LineChart, Users } from 'lucide-react'

export function FeaturesSethu() {
    return (
        <Hide id="lekha.features.sec">
        <section className="py-8 md:py-12">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <h2 className="text-muted-foreground max-w-4xl text-balance text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight lg:text-5xl">
                    <Et id="lekha.features.title1" def="Everything You Need " className="text-foreground" /> <br /><Et id="lekha.features.title2" def="Built to keep your business connected." />
                </h2>

                <div className="*:bg-background mt-5 grid gap-3 grid-cols-1 md:mt-10 md:grid-cols-2 lg:grid-cols-3">
                    {/* Card 1: Real-Time Sync — with live sync dashboard */}
                    <Card className="p-4 sm:p-6 flex flex-col gap-4">
                        <p className="text-muted-foreground max-w-xs text-lg font-medium">
                            <Et id="lekha.features.card.0.title" def="Real-Time Synchronization." className="text-foreground" /><Et id="lekha.features.card.0.text" def=" Automatically sync vouchers, ledgers, and stock data every few minutes." />
                        </p>
                        <div className="flex-1 min-h-[260px]">
                            <LekhaSetuSyncDashboard />
                        </div>
                    </Card>

                    {/* Card 2: Multi-Company — with sales funnel */}
                    <Card className="col-span-1 lg:col-span-2 flex flex-col">
                        <div className="p-6">
                            <p className="text-muted-foreground max-w-xs text-lg font-medium">
                                <Et id="lekha.features.card.1.title" def="Multi-Company Support." className="text-foreground" /><Et id="lekha.features.card.1.text" def=" Manage multiple location accounting from a single platform." />
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
                <div className="mt-8 grid gap-4 grid-cols-1 sm:grid-cols-2 md:mt-12 lg:mt-16 lg:grid-cols-3">
                    {[
                        { icon: ArrowLeftRight, title: "Live Business Dashboards", desc: "Access real-time insights from any device, anywhere." },
                        { icon: Bell,           title: "Inventory & Stock Tracking", desc: "Stay on top of stock movement, consumption, and production." },
                        { icon: LineChart,      title: "Automatic Cloud Sync", desc: "Keep your business data secure, current, and always accessible without manual effort." },
                    ].map(({ icon: Icon, title, desc }, i) => (
                        <Hide key={title} id={`lekha.features.pill.${i}`}>
                        <div className={`lrbc-card-hover ${i === 2 ? "sm:col-span-2 lg:col-span-1" : ""} flex items-start gap-3 sm:gap-4 rounded-xl sm:rounded-2xl border border-border bg-card/60 p-4 sm:p-5 transition-all duration-200`}>
                            <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                                <Icon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <Et as="p" id={`lekha.features.pill.${i}.title`} def={title} className="font-semibold text-sm" />
                                <Et as="p" id={`lekha.features.pill.${i}.desc`} def={desc} className="text-muted-foreground text-sm mt-1 leading-relaxed" />
                            </div>
                        </div>
                        </Hide>
                    ))}
                </div>
            </div>
        </section>
        </Hide>
    )
}

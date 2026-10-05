'use client'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X, ChevronDown, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import { ModeToggle } from './mode-toggle'
import MagneticButton from './MagneticButton'
import { ERPRequestModal } from "@/components/ERPRequestModal"

const menuItems = [
    { name: 'Home',         href: '/',                          children: null },
    { name: 'About',        href: '/about',                     children: null },
    { name: 'Products',     href: '/lekhasetu',                 children: [
        { name: 'LekhaSetu', href: '/lekhasetu' },
        { name: 'WorkPilot', href: '/workpilot' },
        { name: 'Mini ERP', href: '/mini-erp' },
        { name: 'Custom ERP', href: '/custom-erp' },
    ]},
    { name: 'Why LRBC',    href: '/why-lrbc',                  children: null },
    { name: 'Case Studies', href: '/testimonials-case-studies', children: null },
    { name: 'Contact',      href: '/contact',                   children: null },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const [productsOpen, setProductsOpen] = React.useState(false)

    React.useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2">
                <div className={cn(
                    'mx-auto mt-2 max-w-6xl px-4 transition-all duration-300 lg:px-8',
                    isScrolled && 'bg-background/80 max-w-5xl rounded-2xl border backdrop-blur-xl shadow-lg shadow-black/10 lg:px-5'
                )}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">

                        {/* Logo + mobile hamburger */}
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link href="/" aria-label="home" className="flex items-center space-x-2">
                                <Logo />
                            </Link>
                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        {/* ── DESKTOP nav ── */}
                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-1 text-sm items-center">
                                {menuItems.map((item, index) => (
                                    <li key={index} className="relative group">
                                        {item.children ? (
                                            <>
                                                {/* Products — text + arrow, hover (or keyboard focus) opens the dropdown */}
                                                <div className="flex items-center gap-1 rounded-full px-3 py-1.5 text-muted-foreground transition-colors duration-200 group-hover:bg-primary/10 group-hover:text-primary group-focus-within:bg-primary/10 group-focus-within:text-primary">
                                                    <Link href={item.href} className="outline-none">
                                                        {item.name}
                                                    </Link>
                                                    <ChevronDown className="size-3.5 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />
                                                </div>
                                                {/* Dropdown */}
                                                <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 translate-y-1 pt-2 opacity-0 transition-all duration-200 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                                                    <div className="min-w-[190px] overflow-hidden rounded-2xl border border-border bg-background/95 p-1.5 shadow-xl shadow-primary/10 backdrop-blur-xl">
                                                        {item.children.map((child, ci) => (
                                                            <Link
                                                                key={ci}
                                                                href={child.href}
                                                                className="group/item flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground transition-all duration-150 hover:bg-primary/10 hover:pl-4 hover:text-primary focus-visible:bg-primary/10 focus-visible:text-primary focus-visible:outline-none">
                                                                {child.name}
                                                                <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all duration-150 group-hover/item:translate-x-0 group-hover/item:opacity-100 group-focus-visible/item:translate-x-0 group-focus-visible/item:opacity-100" />
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className="block rounded-full px-3 py-1.5 text-muted-foreground transition-colors duration-200 hover:bg-primary/10 hover:text-primary active:bg-primary/15">
                                                <span>{item.name}</span>
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Right-side panel */}
                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent mt-2">

                            {/* ── MOBILE nav list ── */}
                            <div className="lg:hidden w-full">
                                <ul className="space-y-1 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            {item.children ? (
                                                <>
                                                    {/* Products row — tap to expand */}
                                                    <div className={cn(
                                                        "flex items-center justify-between rounded-xl transition-colors duration-150 hover:bg-primary/10 active:bg-primary/15",
                                                        productsOpen && "bg-primary/10"
                                                    )}>
                                                        <Link
                                                            href={item.href}
                                                            onClick={() => setMenuState(false)}
                                                            className="flex-1 px-3 py-3 text-lg font-medium text-muted-foreground hover:text-primary active:text-primary">
                                                            {item.name}
                                                        </Link>
                                                        <button
                                                            onClick={() => setProductsOpen(p => !p)}
                                                            aria-label="Show products"
                                                            aria-expanded={productsOpen}
                                                            className="p-3 text-muted-foreground hover:text-primary">
                                                            <ChevronDown className={cn(
                                                                "size-5 transition-transform duration-300",
                                                                productsOpen && "rotate-180 text-primary"
                                                            )} />
                                                        </button>
                                                    </div>
                                                    {/* Expandable child links (animated) */}
                                                    <div className={cn(
                                                        "grid transition-[grid-template-rows,opacity] duration-300 ease-out",
                                                        productsOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                                                    )}>
                                                        <ul className="ml-4 min-h-0 space-y-1 overflow-hidden border-l-2 border-primary/20 pl-3">
                                                            {item.children.map((child, ci) => (
                                                                <li key={ci} className={ci === 0 ? "pt-1" : ""}>
                                                                    <Link
                                                                        href={child.href}
                                                                        tabIndex={productsOpen ? 0 : -1}
                                                                        onClick={() => { setMenuState(false); setProductsOpen(false) }}
                                                                        className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-all duration-150 hover:bg-primary/10 hover:pl-4 hover:text-primary active:bg-primary/15 active:text-primary">
                                                                        {child.name}
                                                                        <ArrowRight className="size-3.5 opacity-50" />
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setMenuState(false)}
                                                    className="block rounded-xl px-3 py-3 text-lg font-medium text-muted-foreground transition-colors duration-150 hover:bg-primary/10 hover:text-primary active:bg-primary/15 active:text-primary">
                                                    <span>{item.name}</span>
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>

                                {/* ModeToggle in mobile drawer */}
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Theme</span>
                                    <ModeToggle />
                                </div>
                            </div>

                            {/* Desktop buttons — original scroll behaviour */}
                            <div className="hidden lg:flex lg:flex-row lg:items-center lg:gap-3">
                                <MagneticButton strength={0.35} radius={70}>
                                    <Button
                                        asChild
                                        size="sm"
                                        className={cn(isScrolled && 'lg:hidden')}>
                                        <Link href="https://wa.me/919954953008" target="_blank" rel="noopener noreferrer">
                                            <span>Whatsapp</span>
                                        </Link>
                                    </Button>
                                </MagneticButton>

                                <div className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                    <MagneticButton strength={0.4} radius={75}>
                                        <ERPRequestModal
                                            buttonText="Book a Demo"
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                                        />
                                    </MagneticButton>
                                </div>

                                <ModeToggle />
                            </div>

                            {/* Mobile drawer action buttons */}
                            <div className="lg:hidden flex flex-col gap-3 w-full">
                                <Button asChild size="sm">
                                    <Link href="https://wa.me/919954953008" target="_blank" rel="noopener noreferrer">
                                        <span>Whatsapp</span>
                                    </Link>
                                </Button>
                                <ERPRequestModal
                                    buttonText="Book a Demo"
                                    className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium transition-colors h-9 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
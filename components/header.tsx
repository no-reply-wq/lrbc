'use client'
import Link from 'next/link'
import { Logo } from '@/components/logo'
import { Menu, X, ChevronDown } from 'lucide-react'
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
                            <ul className="flex gap-4 text-sm items-center">
                                {menuItems.map((item, index) => (
                                    <li key={index} className="relative group">
                                        {item.children ? (
                                            <>
                                                {/* Products — plain text style + arrow, hover dropdown */}
                                                <button
                                                    className="text-muted-foreground hover:text-accent-foreground flex items-center gap-1 duration-150 py-3 text-sm cursor-pointer bg-transparent border-none outline-none">
                                                    <Link href={item.href} className="hover:text-accent-foreground">
                                                        {item.name}
                                                    </Link>
                                                    <ChevronDown className="size-3.5 transition-transform duration-200 group-hover:rotate-180" />
                                                </button>
                                                {/* Dropdown — appears on hover */}
                                                <div className="absolute left-0 top-full pt-1 hidden group-hover:block z-50">
                                                    <div className="bg-background border border-border rounded-xl shadow-lg shadow-black/10 py-1 min-w-[140px] overflow-hidden">
                                                        {item.children.map((child, ci) => (
                                                            <Link
                                                                key={ci}
                                                                href={child.href}
                                                                className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors duration-150">
                                                                {child.name}
                                                            </Link>
                                                        ))}
                                                    </div>
                                                </div>
                                            </>
                                        ) : (
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground active:text-primary block duration-150 py-3 text-sm">
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
                                <ul className="space-y-2 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            {item.children ? (
                                                <>
                                                    {/* Products row — tap arrow to expand */}
                                                    <div className="flex items-center justify-between">
                                                        <Link
                                                            href={item.href}
                                                            onClick={() => setMenuState(false)}
                                                            className="text-muted-foreground hover:text-accent-foreground active:text-primary duration-150 py-3 text-lg font-medium">
                                                            {item.name}
                                                        </Link>
                                                        <button
                                                            onClick={() => setProductsOpen(p => !p)}
                                                            className="p-2 text-muted-foreground">
                                                            <ChevronDown className={cn(
                                                                "size-4 transition-transform duration-200",
                                                                productsOpen && "rotate-180"
                                                            )} />
                                                        </button>
                                                    </div>
                                                    {/* Expandable child links */}
                                                    {productsOpen && (
                                                        <ul className="ml-4 border-l pl-4 space-y-2 pb-2">
                                                            {item.children.map((child, ci) => (
                                                                <li key={ci}>
                                                                    <Link
                                                                        href={child.href}
                                                                        onClick={() => { setMenuState(false); setProductsOpen(false) }}
                                                                        className="text-muted-foreground hover:text-accent-foreground block text-sm duration-150 py-2">
                                                                        {child.name}
                                                                    </Link>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </>
                                            ) : (
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setMenuState(false)}
                                                    className="text-muted-foreground hover:text-accent-foreground active:text-primary block duration-150 py-3 text-lg font-medium">
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

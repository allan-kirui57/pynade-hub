"use client"

import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Menu, X } from "lucide-react"
import { useState } from "react"
import { ThemeToggle } from "@/pages/frontend/components/theme-toggle"

export function SiteHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="inline-block h-6 w-6 rounded-full bg-primary"></span>
                        <span className="hidden font-bold sm:inline-block">TechHub</span>
                    </Link>
                    <nav className="hidden md:flex md:gap-6">
                        <Link href="/blog" className="text-sm font-medium transition-colors hover:text-primary">
                            Blog
                        </Link>
                        <Link href="/products" className="text-sm font-medium transition-colors hover:text-primary">
                            Products
                        </Link>
                        <Link href="/jobs" className="text-sm font-medium transition-colors hover:text-primary">
                            Jobs
                        </Link>
                        <Link href="/about" className="text-sm font-medium transition-colors hover:text-primary">
                            About
                        </Link>
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <form className="hidden items-center lg:flex">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input type="search" placeholder="Search..." className="w-[200px] pl-8 md:w-[300px] lg:w-[320px]" />
                        </div>
                    </form>
                    <ThemeToggle />
                    <div className="hidden space-x-2 md:flex">
                        <Button variant="outline" size="sm">
                            Sign In
                        </Button>
                        <Button size="sm">Sign Up</Button>
                    </div>
                    <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        <span className="sr-only">Toggle menu</span>
                    </Button>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="container md:hidden">
                    <nav className="flex flex-col space-y-4 pb-4">
                        <Link
                            href="/blog"
                            className="text-sm font-medium transition-colors hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Blog
                        </Link>
                        <Link
                            href="/products"
                            className="text-sm font-medium transition-colors hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Products
                        </Link>
                        <Link
                            href="/jobs"
                            className="text-sm font-medium transition-colors hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Jobs
                        </Link>
                        <Link
                            href="/about"
                            className="text-sm font-medium transition-colors hover:text-primary"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            About
                        </Link>
                        <div className="flex flex-col space-y-2 pt-2">
                            <Button variant="outline" onClick={() => setIsMenuOpen(false)}>
                                Sign In
                            </Button>
                            <Button onClick={() => setIsMenuOpen(false)}>Sign Up</Button>
                        </div>
                    </nav>
                </div>
            )}
        </header>
    )
}


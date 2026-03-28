import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from "@/pages/frontend/components/theme-toggle";

export function SiteHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 8);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [isMenuOpen]);

    const navLinks = [
        { label: 'Products', href: '/products', route: 'products.index' },
        { label: 'Blog', href: '/blogs', route: 'blogs.index' },
    ];

    return (
        <>
            <header
                className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
                    isScrolled
                        ? 'bg-background/80 backdrop-blur-xl shadow-sm'
                        : 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'
                }`}
            >
                <div className="container mx-auto h-16 px-4 md:px-6">
                    {/* Three-column grid: logo | nav | actions */}
                    <div className="grid h-full grid-cols-3 items-center">

                        {/* LEFT — Logo */}
                        <div className="flex items-center">
                            <Link
                                href={route('home')}
                                className="group flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                            >
                                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-sm transition-transform duration-200 group-hover:scale-110">
                                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="7" cy="7" r="3" fill="currentColor" className="text-primary-foreground" />
                                        <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" className="text-primary-foreground" strokeOpacity="0.4" />
                                    </svg>
                                </span>
                                <span className="font-bold text-base tracking-tight hidden sm:inline-block">
                                    TechHub
                                </span>
                            </Link>
                        </div>

                        {/* CENTER — Desktop Nav */}
                        <nav className="hidden md:flex items-center justify-center gap-1">
                            {navLinks.map(({ label, href }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="relative px-4 py-2 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground rounded-md hover:bg-accent group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    {label}
                                    <span className="absolute bottom-1 left-4 right-4 h-px scale-x-0 bg-primary transition-transform duration-200 group-hover:scale-x-100 rounded-full" />
                                </Link>
                            ))}
                        </nav>

                        {/* RIGHT — Actions */}
                        <div className="flex items-center justify-end gap-2">
                            <ThemeToggle />

                            {/* Desktop Sign In */}
                            <Link href={route('login')} className="hidden md:block">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-sm font-medium transition-all duration-150 hover:bg-primary hover:text-primary-foreground hover:border-primary"
                                >
                                    Sign In
                                </Button>
                            </Link>

                            {/* Mobile Hamburger */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="md:hidden h-9 w-9"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                aria-label="Toggle navigation menu"
                                aria-expanded={isMenuOpen}
                            >
                                <span className="sr-only">Toggle menu</span>
                                <Menu
                                    className={`h-5 w-5 absolute transition-all duration-200 ${isMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}
                                />
                                <X
                                    className={`h-5 w-5 absolute transition-all duration-200 ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}
                                />
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${
                    isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                }`}
            >
                {/* Backdrop */}
                <div
                    className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                    onClick={() => setIsMenuOpen(false)}
                />

                {/* Drawer */}
                <div
                    className={`absolute top-16 left-0 right-0 bg-background border-b shadow-lg transition-all duration-300 ease-out ${
                        isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
                    }`}
                >
                    <nav className="container mx-auto px-4 py-6 flex flex-col gap-1">
                        {navLinks.map(({ label, href }, i) => (
                            <Link
                                key={label}
                                href={href}
                                onClick={() => setIsMenuOpen(false)}
                                className="flex items-center px-4 py-3 text-base font-medium rounded-lg transition-colors duration-150 hover:bg-accent hover:text-foreground text-muted-foreground"
                                style={{ animationDelay: `${i * 60}ms` }}
                            >
                                {label}
                            </Link>
                        ))}

                        <div className="mt-4 pt-4 border-t">
                            <Link href={route('login')} onClick={() => setIsMenuOpen(false)}>
                                <Button variant="outline" className="w-full font-medium">
                                    Sign In
                                </Button>
                            </Link>
                        </div>
                    </nav>
                </div>
            </div>
        </>
    );
}

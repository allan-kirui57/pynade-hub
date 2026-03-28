import { Link } from '@inertiajs/react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin, Facebook } from "lucide-react"

const socialLinks = [
    { icon: Twitter, href: 'https://x.com/pynade', label: 'Twitter' },
    { icon: Facebook, href: 'https://web.facebook.com/pynade', label: 'Facebook' },
    { icon: Linkedin, href: 'https://www.linkedin.com/in/allan-kirui/', label: 'LinkedIn' },
    { icon: Github, href: 'https://github.com/allan-kirui57', label: 'GitHub' },
];

const footerLinks = {
    Resources: [
        { label: 'Blog', href: '/blogs' },
        { label: 'Products', href: '/products' },
    ],
    Company: [
        { label: 'About', href: '/about' },
        { label: 'Contact', href: '/contact' },
        { label: 'Privacy', href: '/privacy' },
        { label: 'Terms', href: '/terms' },
    ],
};

const legalLinks = [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
];

export function SiteFooter() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">

                {/* 4-column grid matching the header's container width */}
                <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.5fr]">

                    {/* Col 1 — Brand */}
                    <div className="flex flex-col">
                        <Link
                            href="/"
                            className="group inline-flex items-center gap-2 w-fit rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        >
                            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary shadow-sm transition-transform duration-200 group-hover:scale-110">
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="7" cy="7" r="3" fill="currentColor" className="text-primary-foreground" />
                                    <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5" className="text-primary-foreground" strokeOpacity="0.4" />
                                </svg>
                            </span>
                            <span className="font-bold text-base tracking-tight">TechHub</span>
                        </Link>

                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-[220px]">
                            Your gateway to tech resources — connecting developers with blogs, products, and opportunities.
                        </p>

                        <div className="mt-6 flex items-center gap-0.5">
                            {socialLinks.map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors duration-150 hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Col 2 & 3 — Nav link groups */}
                    {Object.entries(footerLinks).map(([title, links]) => (
                        <div key={title}>
                            <h3 className="text-sm font-semibold text-foreground">{title}</h3>
                            <ul className="mt-4 space-y-2.5">
                                {links.map(({ label, href }) => (
                                    <li key={label}>
                                        <Link
                                            href={href}
                                            className="text-sm text-muted-foreground transition-colors duration-150 hover:text-foreground"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Col 4 — Newsletter */}
                    <div className="flex flex-col">
                        <h3 className="text-sm font-semibold text-foreground">Stay Updated</h3>
                        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                            Get the latest articles and products delivered to your inbox.
                        </p>
                        <div className="mt-4 flex flex-col gap-2">
                            <Input type="email" placeholder="you@example.com" className="h-9 text-sm" />
                            <Button size="sm" className="w-full font-medium">Subscribe</Button>
                        </div>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="mt-12 border-t pt-6">
                    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} TechHub. All rights reserved.
                        </p>
                        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
                            {legalLinks.map(({ label, href }) => (
                                <Link
                                    key={label}
                                    href={href}
                                    className="text-xs text-muted-foreground transition-colors duration-150 hover:text-foreground"
                                >
                                    {label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

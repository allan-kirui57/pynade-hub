import { Link } from '@inertiajs/react';

export function HeroSection() {
    return (
        <section className="relative w-full min-h-[60vh] flex items-center justify-center py-16 md:py-28 lg:py-36 overflow-hidden bg-gradient-to-b from-background to-muted">
            {/* Subtle background decoration */}
            <div
                className="pointer-events-none absolute inset-0 flex items-center justify-center"
                aria-hidden="true"
            >
                <div className="h-[500px] w-[500px] rounded-full bg-primary/5 blur-3xl" />
            </div>

            <div className="container relative z-10 px-4 md:px-6">
                <div className="mx-auto flex max-w-3xl flex-col items-center justify-center space-y-6 text-center">

                    {/* Badge */}
                    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-4 py-1.5 text-xs font-medium text-muted-foreground shadow-sm backdrop-blur-sm">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                        Blogs · Open Source · Tools
                    </span>

                    {/* Headline */}
                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl leading-[1.1]">
                        Your Gateway to{' '}
                        <span className="text-primary">Tech Resources</span>
                    </h1>

                    {/* Sub-copy */}
                    <p className="mx-auto max-w-[600px] text-base text-muted-foreground sm:text-lg md:text-xl leading-relaxed">
                        Discover blogs, open source projects, and innovative tech solutions, all in one place.
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <Link
                            href={route('blogs.index')}
                            className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-8 text-sm font-semibold text-primary-foreground shadow-sm transition-all duration-150 hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
                        >
                            Explore Content
                        </Link>
                        <Link
                            href={route('products.index')}
                            className="inline-flex h-11 items-center justify-center rounded-lg border border-border bg-background px-8 text-sm font-semibold text-foreground shadow-sm transition-all duration-150 hover:bg-accent hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 active:scale-[0.98]"
                        >
                            Browse Products
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}

import { Link } from '@inertiajs/react';

export function HeroSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                            Your Gateway to Tech Resources
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                            Discover blogs, open source projects, job opportunities, and innovative tech solutions all in one place.
                        </p>
                    </div>
                    <div className="space-x-4">
                        <Link
                            href={route('blogs.index')}
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            Explore Content
                        </Link>
                        <Link
                            href="#jobs"
                            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            Find Jobs
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}


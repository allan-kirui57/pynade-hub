import React from 'react';
import { Link } from '@inertiajs/react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThumbsUp, ThumbsDown, MessageSquare, ExternalLink, Star, GitlabIcon as GitHubLogoIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Product {
    id: number;
    title: string;
    description: string;
    image: string;
    category: string;
    pricing: "Free" | "Freemium" | "Paid";
    stars?: number;
    language?: string;
    repoUrl?: string;
    comments: number;
    upvotes: number;
    downvotes: number;
    link: string;
    isOpenSource: boolean;
}

interface PricingVariants {
    [key: string]: "secondary" | "outline" | "default";
}

export default function ProductsSection() {
    // Sample products data (combined projects and open source)
    const products: Product[] = [
        {
            id: 1,
            title: "NextUI",
            description: "Beautiful, fast and modern React UI library with first-class support for Next.js",
            image: "/placeholder.svg?height=200&width=400",
            category: "Open Source",
            pricing: "Free",
            stars: 12543,
            language: "TypeScript",
            repoUrl: "https://github.com/nextui-org/nextui",
            comments: 32,
            upvotes: 245,
            downvotes: 12,
            link: "https://nextui.org",
            isOpenSource: true,
        },
        {
            id: 2,
            title: "FinTrack",
            description: "An AI-powered personal finance tracker with budget forecasting and investment recommendations.",
            image: "/placeholder.svg?height=200&width=400",
            category: "Fintech",
            pricing: "Freemium",
            comments: 24,
            upvotes: 187,
            downvotes: 8,
            link: "#",
            isOpenSource: false,
        },
        {
            id: 3,
            title: "Tauri",
            description: "Build smaller, faster, and more secure desktop applications with a web frontend",
            image: "/placeholder.svg?height=200&width=400",
            category: "Open Source",
            pricing: "Free",
            stars: 67321,
            language: "Rust",
            repoUrl: "https://github.com/tauri-apps/tauri",
            comments: 87,
            upvotes: 678,
            downvotes: 23,
            link: "https://tauri.app",
            isOpenSource: true,
        },
        {
            id: 4,
            title: "HarvestHub",
            description: "Smart farming platform that uses IoT sensors and AI to optimize crop yields and resource usage.",
            image: "/placeholder.svg?height=200&width=400",
            category: "Agritech",
            pricing: "Paid",
            comments: 18,
            upvotes: 143,
            downvotes: 12,
            link: "#",
            isOpenSource: false,
        },
        {
            id: 5,
            title: "ShadcnUI",
            description: "Beautifully designed components built with Radix UI and Tailwind CSS",
            image: "/placeholder.svg?height=200&width=400",
            category: "Open Source",
            pricing: "Free",
            stars: 34982,
            language: "TypeScript",
            repoUrl: "https://github.com/shadcn/ui",
            comments: 56,
            upvotes: 432,
            downvotes: 8,
            link: "https://ui.shadcn.com",
            isOpenSource: true,
        },
        {
            id: 6,
            title: "MedConnect",
            description: "Telemedicine platform connecting patients with healthcare providers for virtual consultations.",
            image: "/placeholder.svg?height=200&width=400",
            category: "Healthtech",
            pricing: "Free",
            comments: 32,
            upvotes: 215,
            downvotes: 5,
            link: "#",
            isOpenSource: false,
        },
    ];

    // Categories for filtering
    const categories = ["All", "Open Source", "Fintech", "Agritech", "Healthtech", "Edtech", "Cleantech"];

    // Pricing badge variants
    const pricingVariants: PricingVariants = {
        Free: "secondary",
        Freemium: "outline",
        Paid: "default",
    };

    return (
        <section id="products" className="w-full py-12 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Products</h2>
                        <p className="max-w-[700px] text-muted-foreground">
                            Discover innovative tech products and open source projects across various industries.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Link
                            href={route('products.index')}
                            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            View All
                        </Link>
                    </div>
                </div>

                <Tabs defaultValue="All" className="mt-8">
                    <TabsList className="mb-6 flex flex-wrap justify-center md:justify-start">
                        {categories.map((category) => (
                            <TabsTrigger key={category} value={category} className="mb-2">
                                {category}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value="All" className="mt-0">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {products.map((product) => (
                                <Card key={product.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
                                    <div className="aspect-video relative">
                                        <img
                                            src={product.image || "/placeholder.svg"}
                                            alt={product.title}
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                        <div className="absolute right-2 top-2">
                                            <Badge variant={pricingVariants[product.pricing]}>
                                                {product.pricing}
                                            </Badge>
                                        </div>
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <Badge variant="secondary">{product.category}</Badge>
                                            <div className="flex items-center gap-2">
                                                {product.isOpenSource && (
                                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                                        <Star className="h-3.5 w-3.5" />
                                                        <span>{product.stars?.toLocaleString()}</span>
                                                    </div>
                                                )}
                                                <a
                                                    href={product.link}
                                                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <ExternalLink className="h-4 w-4" />
                                                    Visit
                                                </a>
                                            </div>
                                        </div>
                                        <CardTitle className="mt-2">{product.title}</CardTitle>
                                    </CardHeader>
                                    <CardContent className="flex-grow">
                                        <p className="text-muted-foreground">{product.description}</p>

                                        {product.isOpenSource && product.language && (
                                            <div className="mt-4 flex items-center gap-2">
                                                <Badge>{product.language}</Badge>
                                                <a
                                                    href={product.repoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                                                >
                                                    <GitHubLogoIcon className="h-4 w-4" />
                                                    GitHub
                                                </a>
                                            </div>
                                        )}
                                    </CardContent>
                                    <Separator />
                                    <CardFooter className="pt-4">
                                        <div className="flex w-full items-center justify-between">
                                            <Button variant="ghost" size="sm" className="gap-1">
                                                <MessageSquare className="h-4 w-4" />
                                                <span>{product.comments}</span>
                                            </Button>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="sm" className="gap-1">
                                                    <ThumbsUp className="h-4 w-4" />
                                                    <span>{product.upvotes}</span>
                                                </Button>
                                                <Button variant="ghost" size="sm" className="gap-1">
                                                    <ThumbsDown className="h-4 w-4" />
                                                    <span>{product.downvotes}</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    {/* Other tab contents would be similar but filtered by category */}
                </Tabs>
            </div>
        </section>
    );
}

import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { ThumbsUp, ThumbsDown, MessageSquare, ExternalLink, Star, GitlabIcon as GitHubLogoIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SharedData } from '@/types';
import { Product } from '@/types/product';

interface PricingVariants {
    [key: string]: "secondary" | "outline" | "default";
}
interface Props extends SharedData {
    products: Product[];
}

export default function ProductsSection() {
    const { products } = usePage<Props>().props;

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

                </Tabs>
            </div>
        </section>
    );
}

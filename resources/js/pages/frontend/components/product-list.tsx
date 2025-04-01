import React from 'react';
import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, MessageSquare, ExternalLink, Star, GitlabIcon as GitHubLogoIcon } from 'lucide-react';

interface Product {
    id: number;
    title: string;
    slug: string;
    description: string;
    image: string;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    pricing: "Free" | "Freemium" | "Paid";
    stars?: number;
    language?: string;
    repoUrl?: string;
    comments: number;
    upvotes: number;
    downvotes: number;
    link: string;
    isOpenSource: boolean;
    created_at: string;
}

interface ProductListProps {
    products: Product[];
}

export default function ProductList({ products }: ProductListProps) {
    // Pricing badge variants
    const pricingVariants = {
        Free: "secondary",
        Freemium: "outline",
        Paid: "default",
    };

    if (products.length === 0) {
        return (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed bg-background p-8 text-center">
                <div>
                    <p className="text-muted-foreground">No products found.</p>
                    <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="grid gap-6 sm:grid-cols-2">
            {products.map((product) => (
                <Card key={product.id} className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
                    <div className="aspect-video relative">
                        <img
                            src={product.image || "/placeholder.svg?height=200&width=400"}
                            alt={product.title}
                            className="absolute inset-0 h-full w-full object-cover"
                        />
                        <div className="absolute right-2 top-2">
                            <Badge variant={pricingVariants[product.pricing] as "default" | "secondary" | "outline"}>
                                {product.pricing}
                            </Badge>
                        </div>
                    </div>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <Link href={route('products.category', product.category.slug)}>
                                <Badge variant="secondary">{product.category.name}</Badge>
                            </Link>
                            <div className="flex items-center gap-2">
                                {product.isOpenSource && product.stars && (
                                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                        <Star className="h-3.5 w-3.5" />
                                        <span>{product.stars.toLocaleString()}</span>
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
                        <CardTitle className="mt-2">
                            <Link href={route('products.show', product.slug)} className="hover:text-primary">
                                {product.title}
                            </Link>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-muted-foreground">{product.description}</p>

                        {product.isOpenSource && product.language && (
                            <div className="mt-4 flex items-center gap-2">
                                <Badge>{product.language}</Badge>
                                {product.repoUrl && (
                                    <a
                                        href={product.repoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
                                    >
                                        <GitHubLogoIcon className="h-4 w-4" />
                                        GitHub
                                    </a>
                                )}
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
    );
}

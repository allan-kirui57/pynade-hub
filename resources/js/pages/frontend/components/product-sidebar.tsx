import React from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp } from 'lucide-react';

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

interface ProductSidebarProps {
    featuredProducts: Product[];
    popularProducts: Product[];
    newArrivals: Product[];
    openSourcePicks: Product[];
}

export default function ProductSidebar({
                                           featuredProducts,
                                           popularProducts,
                                           newArrivals,
                                           openSourcePicks
                                       }: ProductSidebarProps) {
    // Pricing badge variants
    const pricingVariants = {
        Free: "secondary",
        Freemium: "outline",
        Paid: "default",
    };

    const renderProductItem = (product: Product) => (
        <div key={product.id} className="group">
            <div className="flex gap-3">
                <img
                    src={product.image || '/placeholder.svg?height=60&width=60'}
                    alt={product.title}
                    className="h-16 w-16 rounded-md object-cover"
                />
                <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <Badge
                            variant={pricingVariants[product.pricing] as "default" | "secondary" | "outline"}
                            className="mb-1 text-xs"
                        >
                            {product.pricing}
                        </Badge>
                        {product.isOpenSource && product.stars && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="h-3 w-3" />
                                <span>{product.stars.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                    <Link
                        href={route('products.show', product.slug)}
                        className="line-clamp-2 text-sm font-medium group-hover:text-primary"
                    >
                        {product.title}
                    </Link>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{product.upvotes}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                            {product.category.name}
                        </Badge>
                    </div>
                </div>
            </div>
            <Separator className="mt-4" />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Featured Products Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Featured Products</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {featuredProducts?.map(renderProductItem)}
                    </div>
                    <div className="mt-4 text-center">
                        <Link href={route('products.featured')}>
                            <Button variant="outline" size="sm" className="w-full">View All Featured</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Popular Products Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Most Upvoted</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {popularProducts?.map(renderProductItem)}
                    </div>
                    <div className="mt-4 text-center">
                        <Link href={route('products.popular')}>
                            <Button variant="outline" size="sm" className="w-full">View All Popular</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* New Arrivals Section */}
            <Card>
                <CardHeader>
                    <CardTitle>New Arrivals</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {newArrivals?.map(renderProductItem)}
                    </div>
                    <div className="mt-4 text-center">
                        <Link href={route('products.new')}>
                            <Button variant="outline" size="sm" className="w-full">View All New</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Open Source Picks Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Open Source Picks</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {openSourcePicks?.map(renderProductItem)}
                    </div>
                    <div className="mt-4 text-center">
                        <Link href={route('products.open-source')}>
                            <Button variant="outline" size="sm" className="w-full">View All Open Source</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>

            {/* Submit Product CTA */}
            <Card className="bg-primary text-primary-foreground">
                <CardContent className="pt-6">
                    <h3 className="text-lg font-semibold">Have a product to share?</h3>
                    <p className="mt-2 text-sm text-primary-foreground/80">
                        Submit your product or open source project to our community.
                    </p>
                    <div className="mt-4">
                        <Link href={route('products.create')}>
                            <Button variant="secondary" className="w-full">Submit Your Product</Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

import React from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp } from 'lucide-react';
import { Product } from '@/types/product';

interface ProductSidebarProps {
    featuredProducts: Product[];
    popularProducts: Product[];
    newArrivals: Product[];
    openSourcePicks: Product[];
}

export default function ProductSidebar({
                                           featuredProducts,
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
                    alt={product.name}
                    className="h-16 w-16 rounded-none object-cover"
                />
                <div className="flex flex-col">
                    <div className="flex items-center justify-between">
                        <Badge
                            variant={pricingVariants[product.pricing_type] as "default" | "secondary" | "outline"}
                            className="mb-1 text-xs"
                        >
                            {product.pricing_type}
                        </Badge>
                        {product.is_open_source && product.stars_count && (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Star className="h-3 w-3" />
                                <span>{product.stars_count.toLocaleString()}</span>
                            </div>
                        )}
                    </div>
                    <Link
                        href={route('products.show', product.slug)}
                        className="line-clamp-2 text-sm font-medium group-hover:text-primary"
                    >
                        {product.name}
                    </Link>
                    <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            <span>{product.stars_count}</span>
                        </div>
                    </div>
                </div>
            </div>
            <Separator className="mt-4" />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Featured Products Section */}
            <Card className="rounded-none">
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

            {/* Open Source Picks Section */}
            <Card className="rounded-none">
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

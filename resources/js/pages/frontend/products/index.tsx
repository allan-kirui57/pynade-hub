import { Pagination } from '@/components/pagination';
import { Input } from '@/components/ui/input';
import ProductFilters from '@/pages/frontend/components/product-filters';
import ProductList from '@/pages/frontend/components/product-list';
import ProductSidebar from '@/pages/frontend/components/product-sidebar';
import { SiteFooter } from '@/pages/frontend/components/site-footer';
import { SiteHeader } from '@/pages/frontend/components/site-header';
import { Product } from '@/types/product';
import { Head } from '@inertiajs/react';
import { Search } from 'lucide-react';
import React, { useState } from 'react';

interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedProducts {
    data: Product[];
    links: PaginationLinks[];
    from: number;
    to: number;
    total: number;
    current_page: number;
    last_page: number;
}

interface Props {
    products: PaginatedProducts;
    featuredProducts: Product[];
    popularProducts: Product[];
    newArrivals: Product[];
    openSourcePicks: Product[];
    filters: {
        search?: string;
        pricing?: string;
        openSource?: boolean;
        sort?: string;
    };
}

export default function Index({ products, featuredProducts, openSourcePicks, filters = {} }: Props) {
    const [searchQuery, setSearchQuery] = useState(filters?.search || '');

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        window.location.href = route('products.index', { search: searchQuery });
    };

    return (
        <>
            <Head title="Products - TechHub" />
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="bg-muted/30 flex-1">
                    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
                        <div className="mb-8 text-center">
                            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Products</h1>
                            <p className="text-muted-foreground mt-4 text-xl">
                                Discover innovative tech products and open source projects across various industries.
                            </p>
                            <form onSubmit={handleSearch} className="mx-auto mt-6 max-w-md">
                                <div className="relative">
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                                    <Input
                                        type="search"
                                        placeholder="Search products..."
                                        className="pl-10"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </div>
                            </form>
                        </div>

                        <ProductFilters selectedPricing={filters?.pricing} selectedSort={filters?.sort} isOpenSource={filters?.openSource} />

                        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
                            <div className="order-2 lg:order-1 lg:col-span-3">
                                <ProductList products={products.data} />
                                {products.last_page > 1 && (
                                    <div className="mt-8">
                                        <Pagination
                                            currentPage={products.current_page}
                                            lastPage={products.last_page}
                                            from={products.from}
                                            to={products.to}
                                            total={products.total}
                                            links={products.links}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="order-1 lg:order-2">
                                <ProductSidebar
                                    featuredProducts={featuredProducts}
                                    openSourcePicks={openSourcePicks}
                                />
                            </div>
                        </div>
                    </div>
                </main>
                <SiteFooter />
            </div>
        </>
    );
}

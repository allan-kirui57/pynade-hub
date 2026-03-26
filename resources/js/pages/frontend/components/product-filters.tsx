import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { X } from 'lucide-react';

interface ProductFiltersProps {
    selectedCategory?: string;
    selectedPricing?: string;
    selectedSort?: string;
    isOpenSource?: boolean;
}

export default function ProductFilters({
                                           selectedCategory,
                                           selectedPricing,
                                           selectedSort,
                                           isOpenSource,
                                       }: ProductFiltersProps) {
    const sortOptions = [
        { value: 'latest', label: 'Latest' },
        { value: 'oldest', label: 'Oldest' },
        { value: 'popular', label: 'Most Upvoted' },
        { value: 'trending', label: 'Trending' },
    ];

    const pricingOptions = [
        { value: 'all', label: 'All Pricing' },
        { value: 'free', label: 'Free' },
        { value: 'freemium', label: 'Freemium' },
        { value: 'paid', label: 'Paid' },
    ];

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(window.location.search);
        params.set('sort', value);
        window.location.href = `${window.location.pathname}?${params.toString()}`;
    };

    const handlePricingChange = (value: string) => {
        const params = new URLSearchParams(window.location.search);
        if (value === 'all') {
            params.delete('pricing');
        } else {
            params.set('pricing', value);
        }
        window.location.href = `${window.location.pathname}?${params.toString()}`;
    };

    const handleOpenSourceToggle = () => {
        const params = new URLSearchParams(window.location.search);
        if (isOpenSource) {
            params.delete('open_source');
        } else {
            params.set('open_source', 'true');
        }
        window.location.href = `${window.location.pathname}?${params.toString()}`;
    };

    const getActiveFilters = () => {
        const filters = [];

        if (selectedPricing && selectedPricing !== 'all') {
            filters.push({
                type: 'pricing',
                label: selectedPricing.charAt(0).toUpperCase() + selectedPricing.slice(1),
                value: selectedPricing,
            });
        }

        return filters;
    };

    const removeFilter = (type: string) => {
        const params = new URLSearchParams(window.location.search);
        params.delete(type);
        window.location.href = `${window.location.pathname}?${params.toString()}`;
    };

    const activeFilters = getActiveFilters();

    return (
        <div className="space-y-4">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    {activeFilters.length > 0 ? (
                        <>
                            <span className="text-sm text-muted-foreground">Filters:</span>
                            {activeFilters.map((filter) => (
                                <Badge key={`${filter.type}-${filter.value}`} variant="secondary" className="flex items-center gap-1">
                                    {filter.label}
                                    <button
                                        onClick={() => removeFilter(filter.type)}
                                        className="ml-1 rounded-full hover:bg-muted"
                                    >
                                        <X className="h-3 w-3" />
                                        <span className="sr-only">Remove {filter.type} filter</span>
                                    </button>
                                </Badge>
                            ))}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs"
                                asChild
                            >
                                <Link href={route('products.index')}>Clear All</Link>
                            </Button>
                        </>
                    ) : (
                        <span className="text-sm text-muted-foreground">All Products</span>
                    )}
                </div>
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Open Source Only:</span>
                        <Switch
                            checked={isOpenSource === true}
                            onCheckedChange={handleOpenSourceToggle}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Pricing:</span>
                        <Select
                            value={selectedPricing || 'all'}
                            onValueChange={handlePricingChange}
                            defaultValue="all"
                        >
                            <SelectTrigger className="h-9 w-[130px] text-sm">
                                <SelectValue placeholder="Pricing" />
                            </SelectTrigger>
                            <SelectContent>
                                {pricingOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">Sort by:</span>
                        <Select
                            value={selectedSort || 'latest'}
                            onValueChange={handleSortChange}
                            defaultValue="latest"
                        >
                            <SelectTrigger className="h-9 w-[130px] text-sm">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </div>
        </div>
    );
}

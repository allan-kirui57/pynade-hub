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
import { X } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    slug: string;
    count: number;
}

interface BlogFiltersProps {
    categories: Category[];
    selectedCategory?: string;
    selectedTag?: string;
    selectedSort?: string;
}

export default function BlogFilters({
                                        categories,
                                        selectedCategory,
                                        selectedTag,
                                        selectedSort,
                                    }: BlogFiltersProps) {
    const sortOptions = [
        { value: 'latest', label: 'Latest' },
        { value: 'oldest', label: 'Oldest' },
        { value: 'popular', label: 'Most Popular' },
    ];

    const handleSortChange = (value: string) => {
        const params = new URLSearchParams(window.location.search);
        params.set('sort', value);
        window.location.href = `${window.location.pathname}?${params.toString()}`;
    };

    const getActiveFilters = () => {
        const filters = [];

        if (selectedCategory) {
            const category = categories.find(c => c.slug === selectedCategory);
            if (category) {
                filters.push({
                    type: 'category',
                    label: category.name,
                    value: selectedCategory,
                });
            }
        }

        if (selectedTag) {
            filters.push({
                type: 'tag',
                label: selectedTag.replace('-', ' '),
                value: selectedTag,
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
                            <Link href={route('blogs.index')}>Clear All</Link>
                        </Button>
                    </>
                ) : (
                    <span className="text-sm text-muted-foreground">All Posts</span>
                )}
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
    );
}

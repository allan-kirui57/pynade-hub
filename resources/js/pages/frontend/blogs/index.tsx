import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import { SiteHeader } from '@/pages/frontend/components/site-header';
import { SiteFooter } from '@/pages/frontend/components/site-footer';
import BlogList from '@/pages/frontend/components/blog-list';
import BlogSidebar from '@/pages/frontend/components/blog-sidebar';
import BlogFilters from '@/pages/frontend/components/blog-filters';
import { Pagination } from '@/components/pagination';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface Category {
id: number;
name: string;
slug: string;
count: number;
}

interface Tag {
id: number;
name: string;
slug: string;
count: number;
}

interface Blog {
id: number;
title: string;
slug: string;
excerpt: string;
content: string;
image: string;
published_at: string;
read_time: string;
category: {
id: number;
name: string;
slug: string;
};
tags: {
id: number;
name: string;
slug: string;
}[];
author: {
id: number;
name: string;
avatar: string;
};
views: number;
}

interface PaginationLinks {
url: string | null;
label: string;
active: boolean;
}

interface PaginatedBlogs {
data: Blog[];
links: PaginationLinks[];
from: number;
to: number;
total: number;
current_page: number;
last_page: number;
}

interface Props {
blogs: PaginatedBlogs;
categories: Category[];
tags: Tag[];
popularBlogs: Blog[];
filters: {
search?: string;
category?: string;
tag?: string;
sort?: string;
};
}

export default function Index({ blogs, categories, tags, popularBlogs, filters }: Props) {
const [searchQuery, setSearchQuery] = useState(filters.search || '');

const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
e.preventDefault();
window.location.href = route('blogs.index', { search: searchQuery });
};

return (
<>
<Head title="Blog - TechHub" />
<div className="flex min-h-screen flex-col">
    <SiteHeader />
    <main className="flex-1 bg-muted/30">
        <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Blog</h1>
                <p className="mt-4 text-xl text-muted-foreground">
                    Stay updated with the latest trends, tutorials, and insights in technology and development.
                </p>
                <form onSubmit={handleSearch} className="mx-auto mt-6 max-w-md">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search articles..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </form>
            </div>

            <BlogFilters
                categories={categories}
                selectedCategory={filters.category}
                selectedTag={filters.tag}
                selectedSort={filters.sort}
            />

            <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
                <div className="order-2 lg:order-1 lg:col-span-3">
                    <BlogList blogs={blogs.data} />
                    {blogs.last_page > 1 && (
                    <div className="mt-8">
                        <Pagination
                            currentPage={blogs.current_page}
                            lastPage={blogs.last_page}
                            from={blogs.from}
                            to={blogs.to}
                            total={blogs.total}
                            links={blogs.links}
                        />
                    </div>
                    )}
                </div>
                <div className="order-1 lg:order-2">
                    <BlogSidebar
                        categories={categories}
                        tags={tags}
                        popularBlogs={popularBlogs}
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

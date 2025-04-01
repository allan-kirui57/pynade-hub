import React from 'react';
import { Link } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Clock, Eye } from 'lucide-react';

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
    image: string;
    published_at: string;
    read_time: string;
    views: number;
}

interface BlogSidebarProps {
    categories: Category[];
    tags: Tag[];
    popularBlogs: Blog[];
}

export default function BlogSidebar({ categories, tags, popularBlogs }: BlogSidebarProps) {
    return (
        <div className="space-y-6">
            {/* Categories Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Top Categories</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {categories.map((category) => (
                            <div key={category.id} className="flex items-center justify-between">
                                <Link
                                    href={route('blogs.category', category.slug)}
                                    className="text-sm hover:text-primary"
                                >
                                    {category.name}
                                </Link>
                                <Badge variant="secondary" className="text-xs">
                                    {category.count}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Popular Posts Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Popular Posts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {popularBlogs?.map((blog) => (
                            <div key={blog.id}>
                                <div className="flex gap-3">
                                    <img
                                        src={blog.image || '/placeholder.svg?height=60&width=60'}
                                        alt={blog.title}
                                        className="h-16 w-16 rounded-md object-cover"
                                    />
                                    <div className="flex flex-col">
                                        <Link
                                            href={route('blogs.show', blog.slug)}
                                            className="line-clamp-2 text-sm font-medium hover:text-primary"
                                        >
                                            {blog.title}
                                        </Link>
                                        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                                            <div className="flex items-center gap-1">
                                                <Clock className="h-3 w-3" />
                                                <span>{blog.read_time}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Eye className="h-3 w-3" />
                                                <span>{blog.views} views</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Separator className="mt-4" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Tags Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Popular Tags</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {tags?.map((tag) => (
                            <Link key={tag.id} href={route('blogs.tag', tag.slug)}>
                                <Badge variant="outline" className="hover:bg-secondary">
                                    {tag.name} ({tag.count})
                                </Badge>
                            </Link>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Newsletter Subscription */}
            <Card>
                <CardHeader>
                    <CardTitle>Subscribe to Newsletter</CardTitle>
                </CardHeader>
                <CardContent>
                    <form className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Get the latest posts delivered right to your inbox.
                        </p>
                        <div className="space-y-2">
                            <input
                                type="email"
                                placeholder="Your email address"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                required
                            />
                            <button
                                type="submit"
                                className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                            >
                                Subscribe
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

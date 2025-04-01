import React from 'react';
import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, Eye } from 'lucide-react';

interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
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

interface BlogListProps {
    blogs: Blog[];
}

export default function BlogList({ blogs }: BlogListProps) {
    if (blogs.length === 0) {
        return (
            <div className="flex h-40 items-center justify-center rounded-lg border border-dashed bg-background p-8 text-center">
                <div>
                    <p className="text-muted-foreground">No blog posts found.</p>
                    <p className="mt-2 text-sm text-muted-foreground">Try adjusting your search or filter criteria.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {blogs.map((blog) => (
                <Card key={blog.id} className="overflow-hidden transition-all hover:shadow-md">
                    <div className="grid grid-cols-1 md:grid-cols-3">
                        <div className="aspect-video relative md:col-span-1">
                            <img
                                src={blog.image || '/placeholder.svg?height=200&width=300'}
                                alt={blog.title}
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex flex-col md:col-span-2">
                            <CardHeader>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Link
                                        href={route('blogs.category', blog.category.slug)}
                                        className="hover:text-foreground"
                                    >
                                        <Badge variant="secondary">{blog.category.name}</Badge>
                                    </Link>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>{blog.published_at}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-3.5 w-3.5" />
                                        <span>{blog.read_time}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Eye className="h-3.5 w-3.5" />
                                        <span>{blog.views} views</span>
                                    </div>
                                </div>
                                <CardTitle className="mt-2 line-clamp-2 hover:text-primary">
                                    <Link href={route('blogs.show', blog.slug)}>{blog.title}</Link>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex-grow">
                                <p className="line-clamp-3 text-muted-foreground">{blog.excerpt}</p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between">
                                <div className="flex flex-wrap gap-2">
                                    {blog.tags.slice(0, 3).map((tag) => (
                                        <Link key={tag.id} href={route('blogs.tag', tag.slug)}>
                                            <Badge variant="outline" className="hover:bg-secondary">
                                                {tag.name}
                                            </Badge>
                                        </Link>
                                    ))}
                                    {blog.tags.length > 3 && (
                                        <Badge variant="outline">+{blog.tags.length - 3}</Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <img
                                        src={blog.author.avatar || '/placeholder.svg?height=32&width=32'}
                                        alt={blog.author.name}
                                        className="h-6 w-6 rounded-full object-cover"
                                    />
                                    <span className="text-sm text-muted-foreground">{blog.author.name}</span>
                                </div>
                            </CardFooter>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    );
}

import React from 'react';
import { Link } from '@inertiajs/react';
import { Badge } from '@/components/ui/badge';

interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    published_at: string;
    read_time: string;
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
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
                <article key={blog.id} className="group flex flex-col">
                    {/* Thumbnail */}
                    <Link
                        href={route('frontend.blogs.show', blog.slug)}
                        className="block overflow-hidden rounded-xl"
                    >
                        <img
                            src={blog.image || '/placeholder.svg?height=400&width=600'}
                            alt={blog.title}
                            className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    </Link>

                    {/* Content */}
                    <div className="mt-4 flex flex-1 flex-col">

                        {/* Title */}
                        <h2 className="text-lg font-bold leading-snug tracking-tight text-foreground">
                            <Link
                                href={route('frontend.blogs.show', blog.slug)}
                                className="hover:text-primary transition-colors duration-150 line-clamp-2"
                            >
                                {blog.title}
                            </Link>
                        </h2>

                        {/* Excerpt */}
                        <p className="mt-2 flex-1 line-clamp-3 text-sm text-muted-foreground leading-relaxed">
                            {blog.excerpt}
                        </p>

                        {/* Footer: author + date */}
                        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                            <img
                                src={blog.author?.avatar || '/placeholder.svg?height=24&width=24'}
                                alt={blog.author?.name}
                                className="h-6 w-6 rounded-full object-cover"
                            />
                            <span className="font-medium text-foreground">{blog.author?.name}</span>
                            <span>·</span>
                            <span>{blog.published_at}</span>
                            <span>·</span>
                            <span>{blog.read_time}</span>
                        </div>
                    </div>
                </article>
            ))}
        </div>
    );
}

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent} from '@/components/ui/tabs';
import { Blog } from '@/types/blog';
import { Link, usePage } from '@inertiajs/react';
import React from 'react';
import { SharedData } from '@/types';

interface Props extends SharedData {
    blogs: Blog[];
}
export default function BlogSection() {
    const { blogs } = usePage<Props>().props;

    return (
        <section id="blog" className="bg-background w-full py-12 md:py-24">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between md:gap-8">
                    <div className="space-y-2 text-center md:text-left">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Latest Blog Posts</h2>
                        <p className="text-muted-foreground max-w-[700px]">
                            Stay updated with the latest trends, tutorials, and insights in technology and development.
                        </p>
                    </div>
                    <Link
                        href={route('blogs.index')}
                        className="border-input bg-background hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring inline-flex h-10 items-center justify-center rounded-md border px-8 text-sm font-medium shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
                    >
                        View All Posts
                    </Link>
                </div>

                <Tabs defaultValue="All" className="mt-8">

                    <TabsContent value="All" className="mt-0">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {blogs.map((blog) => (
                                <Card key={blog.id} className="overflow-hidden transition-all hover:shadow-lg">
                                    <div className="relative aspect-video">
                                        <img
                                            src={blog.image || '/placeholder.svg'}
                                            alt={blog.title}
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                    </div>
                                    <CardHeader>
                                        <div className="text-muted-foreground flex items-center gap-2 text-sm">
                                            <span>{blog.published_at}</span>
                                            <span>•</span>
                                        </div>
                                        <CardTitle className="hover:text-primary line-clamp-2">
                                            <Link href={route('blogs.show', blog.id)}>{blog.title}</Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-muted-foreground line-clamp-3">{blog.excerpt}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex flex-wrap gap-2">
                                            {blog.tags.map((tag) => (
                                                <Badge key={tag.id} variant="outline" className="hover:bg-secondary">
                                                    {tag.name}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    {/* Other tab contents would be similar */}
                </Tabs>
            </div>
        </section>
    );
}

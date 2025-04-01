import { Link } from '@inertiajs/react';
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import React from 'react';

export default function BlogSection() {
    // Sample blog data
    const blogs = [
        {
            id: 1,
            title: "Getting Started with Next.js 14",
            excerpt: "Learn how to build modern web applications with Next.js 14 and its new features.",
            image: "/placeholder.svg?height=200&width=400",
            date: "Mar 28, 2025",
            readTime: "5 min read",
            category: "Development",
            tags: ["Next.js", "React", "Web Development"],
        },
        {
            id: 2,
            title: "The Future of AI in Software Development",
            excerpt: "Exploring how artificial intelligence is transforming the way we build software.",
            image: "/placeholder.svg?height=200&width=400",
            date: "Mar 25, 2025",
            readTime: "8 min read",
            category: "AI",
            tags: ["Artificial Intelligence", "Machine Learning", "Development"],
        },
        {
            id: 3,
            title: "Building Accessible Web Applications",
            excerpt: "Best practices for creating inclusive and accessible web experiences for all users.",
            image: "/placeholder.svg?height=200&width=400",
            date: "Mar 22, 2025",
            readTime: "6 min read",
            category: "Accessibility",
            tags: ["Accessibility", "Web Development", "UX"],
        },
    ]

    // Categories for filtering
    const categories = ["All", "Development", "AI", "Accessibility", "Design", "DevOps"]

    return (
        <section id="blog" className="w-full py-12 md:py-24 bg-background">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Latest Blog Posts</h2>
                        <p className="max-w-[700px] text-muted-foreground">
                            Stay updated with the latest trends, tutorials, and insights in technology and development.
                        </p>
                    </div>
                    <Link
                        href={route('blogs.index')}
                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        View All Posts
                    </Link>
                </div>

                <Tabs defaultValue="All" className="mt-8">
                    <TabsList className="mb-6 flex flex-wrap">
                        {categories.map((category) => (
                            <TabsTrigger key={category} value={category} className="mb-2">
                                {category}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <TabsContent value="All" className="mt-0">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {blogs.map((blog) => (
                                <Card key={blog.id} className="overflow-hidden transition-all hover:shadow-lg">
                                    <div className="aspect-video relative">
                                        <img
                                            src={blog.image || "/placeholder.svg"}
                                            alt={blog.title}
                                            className="absolute inset-0 h-full w-full object-cover"
                                        />
                                    </div>
                                    <CardHeader>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Badge variant="secondary">{blog.category}</Badge>
                                            <span>{blog.date}</span>
                                            <span>•</span>
                                            <span>{blog.readTime}</span>
                                        </div>
                                        <CardTitle className="line-clamp-2 hover:text-primary">
                                            <Link href="#">{blog.title}</Link>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="line-clamp-3 text-muted-foreground">{blog.excerpt}</p>
                                    </CardContent>
                                    <CardFooter>
                                        <div className="flex flex-wrap gap-2">
                                            {blog.tags.map((tag) => (
                                                <Badge key={tag} variant="outline" className="hover:bg-secondary">
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                    {/* Other tab contents would be similar but filtered by category */}
                </Tabs>
            </div>
        </section>
    )
}


import React from "react";
import { Head, Link } from "@inertiajs/react";
import { SiteHeader } from "@/pages/frontend/components/site-header";
import { SiteFooter } from "@/pages/frontend/components/site-footer";
import BlogSidebar from "@/pages/frontend/components/blog-sidebar";
import { Calendar, Clock, Eye } from "lucide-react";
import BlogContent from "@/pages/frontend/components/markdown/BlogContent";

interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
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

interface Props {
    blog: Blog;
    tags: any[];
    popularBlogs: Blog[];
    relatedBlogs: Blog[];
}

export default function Show({ blog, tags, popularBlogs, relatedBlogs }: Props) {
    return (
        <>
            <Head title={`${blog.title} - TechHub Blog`} />
            <div className="flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1 bg-muted/30">
                    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12 grid grid-cols-1 lg:grid-cols-4 gap-8">

                        {/* Blog Content */}
                        <article className="lg:col-span-3 bg-white rounded-2xl shadow-sm p-6">
                            <img
                                src={blog.image}
                                alt={blog.title}
                                className="w-full rounded-xl mb-6 object-cover"
                            />
                            <h1 className="text-4xl font-bold mb-4">{blog.title}</h1>

                            {/* Metadata */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
                                <div className="flex items-center gap-1"><Calendar className="w-4 h-4" /> {blog.published_at}</div>
                                <div className="flex items-center gap-1"><Clock className="w-4 h-4" /> {blog.read_time}</div>
                                <div className="flex items-center gap-1"><Eye className="w-4 h-4" /> {blog.views} views</div>
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-3 mb-6">
                                <img src={blog.author.avatar} alt={blog.author.name} className="w-10 h-10 rounded-full" />
                                <span className="font-medium">{blog.author.name}</span>
                            </div>

                            {/* Content */}
                            <BlogContent content={blog.content} />

                            {/* Tags */}
                            <div className="mt-8 flex flex-wrap gap-2">
                                {blog.tags.map((tag) => (
                                    <Link
                                        key={tag.id}
                                        href={route("blogs.index", { tag: tag.slug })}
                                        className="px-3 py-1 rounded-full bg-muted hover:bg-primary hover:text-white transition text-sm"
                                    >
                                        #{tag.name}
                                    </Link>
                                ))}
                            </div>

                            {/* Related Blogs */}
                            {relatedBlogs.length > 0 && (
                                <div className="mt-12">
                                    <h2 className="text-2xl font-semibold mb-4">Related Articles</h2>
                                    <div className="grid sm:grid-cols-2 gap-6">
                                        {relatedBlogs.map((rel) => (
                                            <Link
                                                key={rel.id}
                                                href={route("blogs.show", rel.slug)}
                                                className="group block rounded-xl overflow-hidden border hover:shadow-md transition"
                                            >
                                                <img src={rel.image} alt={rel.title} className="w-full h-40 object-cover group-hover:scale-105 transition" />
                                                <div className="p-4">
                                                    <h3 className="text-lg font-semibold group-hover:text-primary">{rel.title}</h3>
                                                    <p className="text-sm text-muted-foreground line-clamp-2">{rel.excerpt}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1">
                            <BlogSidebar tags={tags} popularBlogs={popularBlogs} />
                        </aside>
                    </div>
                </main>
                <SiteFooter />
            </div>
        </>
    );
}

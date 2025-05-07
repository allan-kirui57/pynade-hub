import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Blog } from '@/types/blog';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Blog',
        href: '/blog',
    },
];

interface Props {
    blogs: Blog[];
}

export default function BlogIndex({ blogs }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog Posts" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Blog Posts</h1>
                    <Button asChild>
                        <Link href="/admin/blogs/create">Create New Post</Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>All Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {blogs.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground">No blog posts found.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/*{blogs.map((blog) => (*/}
                                {/*    <div key={blog.id} className="border-b pb-4 last:border-b-0">*/}
                                {/*        <Link href={`/blog/${blog.id}`} className="hover:underline">*/}
                                {/*            <h2 className="text-xl font-semibold">{blog.title}</h2>*/}
                                {/*        </Link>*/}
                                {/*        <p className="text-muted-foreground mt-1 line-clamp-2">*/}
                                {/*            {blog.excerpt || blog.content.substring(0, 150)}...*/}
                                {/*        </p>*/}
                                {/*        <div className="flex items-center justify-between mt-2">*/}
                                {/*            <span className="text-sm text-muted-foreground">*/}
                                {/*                {new Date(blog.created_at).toLocaleDateString()}*/}
                                {/*            </span>*/}
                                {/*        </div>*/}
                                {/*    </div>*/}
                                {/*))}*/}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

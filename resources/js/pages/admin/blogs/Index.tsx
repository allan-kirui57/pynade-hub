import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { MoreHorizontal, Pencil, Trash2, Eye, PlusCircle } from 'lucide-react';
import { type Blog } from '@/types/blog';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Blog', href: '/admin/blogs' },
];

interface PaginatedBlogs {
    data: Blog[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    next_page_url: string | null;
    prev_page_url: string | null;
}

interface Props {
    blogs: PaginatedBlogs;
}

export default function BlogIndex({ blogs }: Props) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this post?')) {
            router.delete(`/admin/blogs/${id}`);
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Blog Posts" />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Blog Posts</h1>
                        <p className="text-muted-foreground text-sm mt-1">
                            {blogs.total} post{blogs.total !== 1 ? 's' : ''} total
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/blogs/create">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Post
                        </Link>
                    </Button>
                </div>

                {/* Table Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Posts</CardTitle>
                        <CardDescription>
                            Showing {blogs.data.length} of {blogs.total} posts
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {blogs.data.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <p className="text-muted-foreground text-sm">No blog posts yet.</p>
                                <Button asChild variant="outline" className="mt-4">
                                    <Link href="/admin/blogs/create">Create your first post</Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Slug</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {blogs.data.map((blog: Blog) => (
                                            <TableRow key={blog.id}>
                                                <TableCell className="font-medium max-w-xs truncate">
                                                    {blog.title}
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm font-mono">
                                                    {blog.slug}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={blog.published_at ? 'default' : 'secondary'}
                                                    >
                                                        {blog.published_at ? 'Published' : 'Draft'}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {new Date(blog?.created_at).toLocaleDateString('en-US', {
                                                        year: 'numeric',
                                                        month: 'short',
                                                        day: 'numeric',
                                                    })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" size="icon">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Actions</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/blogs/${blog.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/blogs/${blog.id}/edit`}>
                                                                    <Pencil className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                className="text-destructive focus:text-destructive"
                                                                onClick={() => handleDelete(blog.id)}
                                                            >
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                {/* Pagination */}
                                {blogs.last_page > 1 && (
                                    <div className="flex items-center justify-between mt-6 pt-4 border-t">
                                        <p className="text-sm text-muted-foreground">
                                            Page {blogs.current_page} of {blogs.last_page}
                                        </p>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={!blogs.prev_page_url}
                                                onClick={() =>
                                                    blogs.prev_page_url &&
                                                    router.visit(blogs.prev_page_url)
                                                }
                                            >
                                                Previous
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                disabled={!blogs.next_page_url}
                                                onClick={() =>
                                                    blogs.next_page_url &&
                                                    router.visit(blogs.next_page_url)
                                                }
                                            >
                                                Next
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

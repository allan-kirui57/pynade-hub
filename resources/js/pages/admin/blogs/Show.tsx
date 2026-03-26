import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
    Calendar,
    Clock,
    Tag,
    FolderOpen,
    Star,
    Pencil,
    Trash2,
    ArrowLeft,
    Globe,
    FileText,
} from 'lucide-react';

interface Tag {
    id: number;
    name: string;
}

interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featured_image: string | null;
    tags: Tag[];
    published_at: string | null;
    is_featured: boolean;
    read_time: string | null;
    created_at: string;
    updated_at: string;
}

interface Props {
    blog: Blog;
}

export default function BlogShow({ blog }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Blogs', href: '/admin/blogs' },
        { title: blog.title, href: `/admin/blogs/${blog.id}` },
    ];

    const isPublished = !!blog.published_at;

    const handleDelete = () => {
        router.delete(`/admin/blogs/${blog.id}`, {
            onSuccess: () => router.visit('/admin/blogs'),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={blog.title} />

            <div className="flex flex-1 flex-col gap-6 p-6">
                {/* Top bar */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="/admin/blogs">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight line-clamp-1">
                                {blog.title}
                            </h1>
                            <p className="text-sm text-muted-foreground mt-0.5">
                                yourdomain.com/blog/{blog.slug}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Badge variant={isPublished ? 'default' : 'secondary'} className="text-sm">
                            {isPublished ? (
                                <><Globe className="h-3 w-3 mr-1" /> Published</>
                            ) : (
                                <><FileText className="h-3 w-3 mr-1" /> Draft</>
                            )}
                        </Badge>

                        <Button variant="outline" asChild>
                            <Link href={`/admin/blogs/${blog.id}/edit`}>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </Link>
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button variant="destructive">
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Delete this post?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This will permanently delete <strong>{blog.title}</strong>. This
                                        action cannot be undone.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleDelete}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                        Delete
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Main content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Featured image */}
                        {blog.featured_image && (
                            <Card className="overflow-hidden p-0">
                                <div className="aspect-video w-full overflow-hidden">
                                    <img
                                        src={`/storage/${blog.featured_image}`}
                                        alt={blog.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </Card>
                        )}

                        {/* Article body */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base text-muted-foreground font-medium">
                                    Content
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className="prose prose-neutral dark:prose-invert max-w-none"
                                    dangerouslySetInnerHTML={{ __html: blog.content }}
                                />
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">

                        {/* Meta */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Post Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4 text-sm">

                                <div className="flex items-start gap-3">
                                    <Globe className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                    <div>
                                        <p className="font-medium">Status</p>
                                        <p className="text-muted-foreground">
                                            {isPublished ? 'Published' : 'Draft'}
                                        </p>
                                    </div>
                                </div>

                                {blog.published_at && (
                                    <div className="flex items-start gap-3">
                                        <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                        <div>
                                            <p className="font-medium">Published</p>
                                            <p className="text-muted-foreground">
                                                {new Date(blog.published_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start gap-3">
                                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                    <div>
                                        <p className="font-medium">Created</p>
                                        <p className="text-muted-foreground">
                                            {new Date(blog.created_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                    <div>
                                        <p className="font-medium">Last Updated</p>
                                        <p className="text-muted-foreground">
                                            {new Date(blog.updated_at).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                {blog.read_time && (
                                    <div className="flex items-start gap-3">
                                        <Clock className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                        <div>
                                            <p className="font-medium">Read Time</p>
                                            <p className="text-muted-foreground">{blog.read_time}</p>
                                        </div>
                                    </div>
                                )}

                                {blog.is_featured && (
                                    <div className="flex items-center gap-3">
                                        <Star className="h-4 w-4 text-yellow-500 shrink-0" />
                                        <p className="font-medium">Featured Post</p>
                                    </div>
                                )}

                                <Separator />

                                {blog.tags?.length > 0 && (
                                    <div className="flex items-start gap-3">
                                        <Tag className="h-4 w-4 mt-0.5 text-muted-foreground shrink-0" />
                                        <div>
                                            <p className="font-medium mb-2">Tags</p>
                                            <div className="flex flex-wrap gap-1">
                                                {blog.tags.map((tag) => (
                                                    <Badge key={tag.id} variant="secondary">
                                                        {tag.name}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Excerpt */}
                        {blog.excerpt && (
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">Excerpt</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground leading-relaxed">
                                        {blog.excerpt}
                                    </p>
                                </CardContent>
                            </Card>
                        )}

                        {/* SEO preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">SEO Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1 border rounded-md p-3 bg-muted/30">
                                    <p className="text-blue-600 font-medium text-sm line-clamp-1">
                                        {blog.title}
                                    </p>
                                    <p className="text-green-700 text-xs">
                                        yourdomain.com/blog/{blog.slug}
                                    </p>
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                        {blog.excerpt ?? 'No excerpt available.'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

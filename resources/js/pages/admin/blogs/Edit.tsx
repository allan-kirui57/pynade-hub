"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Head, useForm, Link } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, ImageIcon, Loader2 } from "lucide-react"
import { Editor } from "@/components/editor"
import { cn } from "@/lib/utils"
import { MultiSelect } from "@/components/ui/multi-select"
import axios from "axios"

interface Tag {
    id: number
    name: string
}

interface Blog {
    id: number
    title: string
    slug: string
    excerpt: string | null
    content: string
    featured_image: string | null
    tags: Tag[]
    published_at: string | null
    is_featured: boolean
    read_time: string | null
}

interface Props {
    blog: Blog
    tags?: Tag[]
}

export default function BlogEdit({ blog, tags: propTags }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Blogs', href: '/admin/blogs' },
        { title: blog.title, href: `/admin/blogs/${blog.id}` },
        { title: 'Edit', href: `/admin/blogs/${blog.id}/edit` },
    ]

    const [tags, setTags] = useState<Tag[]>(propTags || [])
    const [isLoadingTags, setIsLoadingTags] = useState(false)
    const [tagError, setTagError] = useState<string | null>(null)

    // Pre-populate selectedTags from the existing blog tags
    const [selectedTags, setSelectedTags] = useState<string[]>(
        blog.tags?.map((t) => t.id.toString()) ?? []
    )

    const [previewImage, setPreviewImage] = useState<string | null>(
        blog.featured_image ? `/storage/${blog.featured_image}` : null
    )
    const [removeImage, setRemoveImage] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',                                 // Laravel method spoofing
        title: blog.title,
        slug: blog.slug,
        excerpt: blog.excerpt ?? '',
        content: blog.content,
        tags: blog.tags?.map((t) => t.id.toString()) ?? [] as string[],
        featured_image: null as File | null,
        remove_featured_image: false,
        published_at: blog.published_at
            ? new Date(blog.published_at).toISOString().slice(0, 16)
            : '',
        is_featured: blog.is_featured,
        read_time: blog.read_time ?? '',
    })

    useEffect(() => {
        if (!propTags) fetchTags()
    }, [])

    useEffect(() => {
        setData('tags', selectedTags)
    }, [selectedTags])

    const fetchTags = async () => {
        setIsLoadingTags(true)
        setTagError(null)
        try {
            const res = await axios.get('/admin/tags')
            setTags(res.data)
        } catch {
            setTagError('Failed to load tags. Please try again.')
        } finally {
            setIsLoadingTags(false)
        }
    }

    const generateSlug = (title: string) =>
        title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()

    const calculateReadTime = (content: string) => {
        const text = content.replace(/<[^>]*>/g, '')
        const words = text.split(/\s+/).filter(Boolean).length
        const minutes = Math.ceil(words / 225)
        return minutes > 0 ? `${minutes} min read` : '1 min read'
    }

    const generateExcerpt = (content: string) => {
        const text = content.replace(/<[^>]*>/g, '')
        const words = text.split(/\s+/).filter(Boolean).slice(0, 100)
        return words.join(' ') + (words.length >= 100 ? '...' : '')
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        setData((prev) => ({ ...prev, title, slug: generateSlug(title) }))
    }

    const handleContentChange = (content: string) => {
        setData((prev) => {
            const shouldUpdateExcerpt =
                !prev.excerpt || prev.excerpt === generateExcerpt(prev.content)
            return {
                ...prev,
                content,
                excerpt: shouldUpdateExcerpt ? generateExcerpt(content) : prev.excerpt,
            }
        })
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        if (file) {
            setData('featured_image', file)
            setRemoveImage(false)
            setData('remove_featured_image', false)
            const reader = new FileReader()
            reader.onload = (e) => setPreviewImage(e.target?.result as string)
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveImage = () => {
        setPreviewImage(null)
        setRemoveImage(true)
        setData('featured_image', null)
        setData('remove_featured_image', true)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setData('read_time', calculateReadTime(data.content))

        // POST with _method: PUT for Inertia + Laravel
        post(`/admin/blogs/${blog.id}`, {
            forceFormData: true,
            onError: (e) => console.error(e),
        })
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit — ${blog.title}`} />

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Edit Blog Post</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href={`/admin/blogs/${blog.id}`}>Cancel</Link>
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={processing}
                            className="gap-2"
                        >
                            {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Main — 2/3 */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Post Content</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={handleTitleChange}
                                        placeholder="Enter post title"
                                    />
                                    {errors.title && (
                                        <p className="text-sm text-destructive">{errors.title}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug</Label>
                                    <Input
                                        id="slug"
                                        value={data.slug}
                                        onChange={(e) => setData('slug', e.target.value)}
                                        placeholder="post-url-slug"
                                    />
                                    {errors.slug && (
                                        <p className="text-sm text-destructive">{errors.slug}</p>
                                    )}
                                </div>

                                <Tabs defaultValue="write" className="w-full">
                                    <TabsList className="grid w-full grid-cols-2">
                                        <TabsTrigger value="write">Write</TabsTrigger>
                                        <TabsTrigger value="preview">Preview</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="write" className="mt-4">
                                        <div className="space-y-2">
                                            <Label>Content</Label>
                                            <Editor
                                                content={data.content}
                                                onChange={handleContentChange}
                                            />
                                            {errors.content && (
                                                <p className="text-sm text-destructive">
                                                    {errors.content}
                                                </p>
                                            )}
                                        </div>
                                    </TabsContent>
                                    <TabsContent value="preview" className="mt-4">
                                        <div className="rounded-md border p-4 min-h-[300px] prose max-w-none">
                                            {data.content ? (
                                                <div
                                                    dangerouslySetInnerHTML={{ __html: data.content }}
                                                />
                                            ) : (
                                                <p className="text-muted-foreground italic">
                                                    No content to preview yet.
                                                </p>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>

                                <div className="space-y-2">
                                    <Label htmlFor="excerpt">Excerpt</Label>
                                    <Textarea
                                        id="excerpt"
                                        value={data.excerpt}
                                        onChange={(e) => setData('excerpt', e.target.value)}
                                        placeholder="Brief summary of your post"
                                        rows={3}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Auto-generated from content. Edit for a custom excerpt.
                                    </p>
                                    {errors.excerpt && (
                                        <p className="text-sm text-destructive">{errors.excerpt}</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Featured image */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Featured Image</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div
                                    className={cn(
                                        'border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors',
                                        previewImage ? 'border-muted' : 'border-muted-foreground/25',
                                    )}
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    {previewImage ? (
                                        <div className="relative aspect-video w-full overflow-hidden rounded-md">
                                            <img
                                                src={previewImage}
                                                alt="Featured image preview"
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    ) : (
                                        <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                                            <ImageIcon className="h-12 w-12 mb-2" />
                                            <p className="text-sm">Click to upload a featured image</p>
                                            <p className="text-xs mt-1">
                                                Recommended: 1200 × 630px
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleImageChange}
                                    />
                                </div>

                                {errors.featured_image && (
                                    <p className="text-sm text-destructive">{errors.featured_image}</p>
                                )}

                                {previewImage && (
                                    <Button variant="outline" size="sm" onClick={handleRemoveImage}>
                                        Remove Image
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar — 1/3 */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Post Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {/* Tags */}
                                <div className="space-y-2">
                                    <Label>Tags</Label>
                                    {isLoadingTags ? (
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground py-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Loading tags...
                                        </div>
                                    ) : tagError ? (
                                        <div className="space-y-2">
                                            <p className="text-sm text-destructive">{tagError}</p>
                                            <Button variant="outline" size="sm" onClick={fetchTags}>
                                                Retry
                                            </Button>
                                        </div>
                                    ) : (
                                        <MultiSelect
                                            options={tags.map((t) => ({
                                                label: t.name,
                                                value: t.id.toString(),
                                            }))}
                                            selected={selectedTags}
                                            onChange={setSelectedTags}
                                            placeholder="Select tags"
                                        />
                                    )}
                                    {errors.tags && (
                                        <p className="text-sm text-destructive">{errors.tags}</p>
                                    )}
                                </div>

                                {/* Publish date */}
                                <div className="space-y-2">
                                    <Label htmlFor="published_at">Publish Date & Time</Label>
                                    <Input
                                        id="published_at"
                                        type="datetime-local"
                                        value={data.published_at}
                                        onChange={(e) => setData('published_at', e.target.value)}
                                    />
                                    {errors.published_at && (
                                        <p className="text-sm text-destructive">{errors.published_at}</p>
                                    )}
                                </div>

                                {/* Read time */}
                                <div className="space-y-2">
                                    <Label>Estimated Read Time</Label>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{calculateReadTime(data.content)}</span>
                                    </div>
                                </div>

                                {/* Featured toggle */}
                                <div className="flex items-center gap-2 pt-2">
                                    <Switch
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onCheckedChange={(v) => setData('is_featured', v)}
                                    />
                                    <Label htmlFor="is_featured">Featured Post</Label>
                                </div>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <p className="text-xs text-muted-foreground">
                                    Posts can be published immediately or scheduled for later.
                                </p>
                            </CardFooter>
                        </Card>

                        {/* SEO preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle>SEO Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-1 border rounded-md p-3 bg-muted/30">
                                    <p className="text-blue-600 font-medium text-sm line-clamp-1">
                                        {data.title || 'Post Title'}
                                    </p>
                                    <p className="text-green-700 text-xs">
                                        yourdomain.com/blog/{data.slug || 'post-slug'}
                                    </p>
                                    <p className="text-xs text-gray-600 line-clamp-2">
                                        {data.excerpt ||
                                            'Your excerpt will appear here in search results.'}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

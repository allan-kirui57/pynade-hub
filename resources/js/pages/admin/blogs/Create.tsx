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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, ImageIcon, Loader2 } from "lucide-react"
import { Editor } from "@/components/editor"
import { cn } from "@/lib/utils"
import { MultiSelect } from "@/components/ui/multi-select"
import axios from "axios"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Blog",
        href: "/blog",
    },
    {
        title: "Create",
        href: "/blog/create",
    },
]

// Define types for categories and tags
interface Category {
    id: number
    name: string
}

interface Tag {
    id: number
    name: string
}

export default function BlogCreate(props: { categories?: Category[]; tags?: Tag[] }) {
    // State for categories and tags
    const [categories, setCategories] = useState<Category[]>(props.categories || [])
    const [tags, setTags] = useState<Tag[]>(props.tags || [])
    const [isLoadingCategories, setIsLoadingCategories] = useState(false)
    const [isLoadingTags, setIsLoadingTags] = useState(false)
    const [categoryError, setCategoryError] = useState<string | null>(null)
    const [tagError, setTagError] = useState<string | null>(null)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    console.log("Pros:", selectedTags)
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category_id: "",
        tags: [] as string[],
        featured_image: null as File | null,
        published_at: null as Date | null,
        is_featured: false,
    })

    // Fetch categories and tags from the server
    useEffect(() => {
        // Only fetch if not provided as props
        if (!props.categories) {
            fetchCategories()
        }

        if (!props.tags) {
            fetchTags()
        }
    }, [props.categories, props.tags])

    // Fetch categories from the server
    const fetchCategories = async () => {
        setIsLoadingCategories(true)
        setCategoryError(null)

        try {
            const response = await axios.get("/admin/categories")
            console.log("Categories:", response.data)
            setCategories(response.data)
        } catch (error) {
            console.error("Error fetching categories:", error)
            setCategoryError("Failed to load categories. Please try again.")
        } finally {
            setIsLoadingCategories(false)
        }
    }

    // Fetch tags from the server
    const fetchTags = async () => {
        setIsLoadingTags(true)
        setTagError(null)

        try {
            const response = await axios.get("/admin/tags")
            setTags(response.data)
        } catch (error) {
            console.error("Error fetching tags:", error)
            setTagError("Failed to load tags. Please try again.")
        } finally {
            setIsLoadingTags(false)
        }
    }

    // Sync the form data with the selectedTags state
    useEffect(() => {
        setData("tags", selectedTags)
    }, [selectedTags, setData])

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()
    }

    const calculateReadTime = (content: string) => {
        // Strip HTML tags to get plain text
        const text = content.replace(/<[^>]*>/g, "")
        // Count words (split by spaces and filter out empty strings)
        const words = text.split(/\s+/).filter(Boolean).length
        // Average reading speed: 225 words per minute
        const minutes = Math.ceil(words / 225)
        return minutes > 0 ? `${minutes} min read` : "1 min read"
    }

    // Change the generateExcerpt function to limit to 100 words
    const generateExcerpt = (content: string) => {
        // Strip HTML tags to get plain text
        const text = content.replace(/<[^>]*>/g, "")
        // Get first 100 words
        const words = text.split(/\s+/).filter(Boolean).slice(0, 100)
        return words.join(" ") + (words.length >= 100 ? "..." : "")
    }

    const handleContentChange = (content: string) => {
        setData((prev) => {
            // Only auto-generate excerpt if it hasn't been manually edited
            const shouldUpdateExcerpt = !prev.excerpt || prev.excerpt === generateExcerpt(prev.content)
            return {
                ...prev,
                content,
                excerpt: shouldUpdateExcerpt ? generateExcerpt(content) : prev.excerpt,
            }
        })
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value
        setData((prev) => ({
            ...prev,
            title,
            slug: generateSlug(title),
        }))
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        if (file) {
            setData("featured_image", file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleTagsChange = (selected: string[]) => {
        console.log("Tags changed:", selected)
        setSelectedTags(selected)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Calculate read time before submitting
        const readTime = calculateReadTime(data.content)
        setData("read_time", readTime)

        post("/admin/blogs", {
            onSuccess: () => {
                setIsSubmitting(false)
                // Handle success - Inertia typically handles redirect
                //help write a code to redirect and notification success
            },
            onError: () => {
                setIsSubmitting(false)
            },
            forceFormData: true,
        })
    }

    // Function to retry loading if there was an error
    const retryLoading = (type: "categories" | "tags") => {
        if (type === "categories") {
            fetchCategories()
        } else {
            fetchTags()
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Blog Post" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create New Blog Post</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/blog">Cancel</Link>
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing || isSubmitting} className="gap-2">
                            {(processing || isSubmitting) && <Loader2 className="h-4 w-4 animate-spin" />}
                            {processing || isSubmitting ? "Creating..." : "Publish Post"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Main content - 2/3 width on large screens */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Post Content</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title">Title</Label>
                                        <Input id="title" value={data.title} onChange={handleTitleChange} placeholder="Enter post title" />
                                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) => setData("slug", e.target.value)}
                                            placeholder="post-url-slug"
                                        />
                                        {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                                    </div>

                                    <Tabs defaultValue="write" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="write">Write</TabsTrigger>
                                            <TabsTrigger value="preview">Preview</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="write" className="mt-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="content">Content</Label>
                                                <Editor content={data.content} onChange={handleContentChange} />
                                                {errors.content && <p className="text-sm text-destructive">{errors.content}</p>}
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="preview" className="mt-4">
                                            <div className="rounded-md border p-4 min-h-[300px] prose max-w-none">
                                                {data.content ? (
                                                    <div dangerouslySetInnerHTML={{ __html: data.content }} />
                                                ) : (
                                                    <p className="text-muted-foreground italic">No content to preview yet.</p>
                                                )}
                                            </div>
                                        </TabsContent>
                                    </Tabs>

                                    <div className="space-y-2 mt-4">
                                        <Label htmlFor="excerpt">Excerpt (First 100 words)</Label>
                                        <Textarea
                                            id="excerpt"
                                            value={data.excerpt}
                                            onChange={(e) => setData("excerpt", e.target.value)}
                                            placeholder="Brief summary of your post (shown in previews)"
                                            rows={3}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Auto-generated from your content. Edit if you want a custom excerpt.
                                        </p>
                                        {errors.excerpt && <p className="text-sm text-destructive">{errors.excerpt}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Featured Image</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div
                                        className={cn(
                                            "border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors",
                                            previewImage ? "border-muted" : "border-muted-foreground/25",
                                        )}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {previewImage ? (
                                            <div className="relative aspect-video w-full overflow-hidden rounded-md">
                                                <img
                                                    src={previewImage || "/placeholder.svg"}
                                                    alt="Featured image preview"
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ) : (
                                            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                                                <ImageIcon className="h-12 w-12 mb-2" />
                                                <p className="text-sm">Click to upload a featured image</p>
                                                <p className="text-xs mt-1">Recommended size: 1200 x 630px</p>
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
                                    {errors.featured_image && <p className="text-sm text-destructive">{errors.featured_image}</p>}
                                    {previewImage && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setPreviewImage(null)
                                                setData("featured_image", null)
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = ""
                                                }
                                            }}
                                        >
                                            Remove Image
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - 1/3 width on large screens */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Post Settings</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    {isLoadingCategories ? (
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground py-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Loading categories...</span>
                                        </div>
                                    ) : categoryError ? (
                                        <div className="space-y-2">
                                            <p className="text-sm text-destructive">{categoryError}</p>
                                            <Button variant="outline" size="sm" onClick={() => retryLoading("categories")}>
                                                Retry
                                            </Button>
                                        </div>
                                    ) : (
                                        <Select
                                            value={data.category_id ? data.category_id.toString() : ""}
                                            onValueChange={(value) => setData("category_id", value)}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id.toString()}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                    {errors.category_id && <p className="text-sm text-destructive">{errors.category_id}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="tags">Tags</Label>
                                    {isLoadingTags ? (
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground py-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Loading tags...</span>
                                        </div>
                                    ) : tagError ? (
                                        <div className="space-y-2">
                                            <p className="text-sm text-destructive">{tagError}</p>
                                            <Button variant="outline" size="sm" onClick={() => retryLoading("tags")}>
                                                Retry
                                            </Button>
                                        </div>
                                    ) : (
                                        <MultiSelect
                                            options={tags.map((tag) => ({ label: tag.name, value: tag.id.toString() }))}
                                            selected={selectedTags}
                                            onChange={handleTagsChange}
                                            placeholder="Select tags"
                                        />
                                    )}
                                    {errors.tags && <p className="text-sm text-destructive">{errors.tags}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="published_at">Publish Date & Time</Label>
                                    <Input
                                        id="published_at"
                                        type="datetime-local"
                                        value={data.published_at ? new Date(data.published_at).toISOString().slice(0, 16) : ""}
                                        onChange={(e) => {
                                            const date = e.target.value ? new Date(e.target.value) : null
                                            setData("published_at", date)
                                        }}
                                        className="w-full"
                                    />
                                    {errors.published_at && <p className="text-sm text-destructive">{errors.published_at}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="read_time">Estimated Read Time</Label>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                        <Clock className="h-4 w-4" />
                                        <span>{calculateReadTime(data.content)}</span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <Switch
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => setData("is_featured", checked)}
                                    />
                                    <Label htmlFor="is_featured">Featured Post</Label>
                                    {errors.is_featured && <p className="text-sm text-destructive">{errors.is_featured}</p>}
                                </div>
                            </CardContent>
                            <CardFooter className="border-t px-6 py-4">
                                <p className="text-xs text-muted-foreground">
                                    Posts can be published immediately or scheduled for later.
                                </p>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>SEO Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 border rounded-md p-3">
                                    <h3 className="text-blue-600 text-lg font-medium truncate">{data.title || "Post Title"}</h3>
                                    <p className="text-green-700 text-sm">yourdomain.com/blog/{data.slug || "post-slug"}</p>
                                    <p className="text-sm text-gray-600 line-clamp-2">
                                        {data.excerpt ||
                                            "Your post excerpt will appear here. This is what users will see in search results."}
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

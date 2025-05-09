"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Head, useForm, Link } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, ImageIcon, Github, Globe, Star, AlertCircle, X, ArrowRight } from "lucide-react"
import { Editor } from "@/components/editor"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import axios from "axios"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Products",
        href: "/admin/products",
    },
    {
        title: "Create",
        href: "/admin/products/create",
    },
]

// Define types for categories
interface Category {
    id: number
    name: string
}

// Pricing type options
const PRICING_TYPES = [
    { value: "free", label: "Free" },
    { value: "freemium", label: "Freemium" },
    { value: "paid", label: "Paid" },
    { value: "subscription", label: "Subscription" },
    { value: "open_source", label: "Open Source" },
]

export default function ProductCreate(props: { categories?: Category[] }) {
    // State for categories
    const [categories, setCategories] = useState<Category[]>(props.categories || [])
    const [isLoadingCategories, setIsLoadingCategories] = useState(false)
    const [categoryError, setCategoryError] = useState<string | null>(null)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [previewImage, setPreviewImage] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form data state
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        slug: "",
        description: "",
        image: null as File | null,
        pricing_type: "free",
        is_open_source: false,
        repo_url: "",
        website_url: "",
        stars_count: 0,
        is_featured: false,
        primary_category_id: "",
    })

    // Fetch categories from the server if not provided
    useEffect(() => {
        if (!props.categories || props.categories.length === 0) {
            fetchCategories()
        }
    }, [props.categories])

    // Fetch categories from the server
    const fetchCategories = async () => {
        setIsLoadingCategories(true)
        setCategoryError(null)

        try {
            const response = await axios.get("/admin/categories")
            setCategories(response.data)
        } catch (error) {
            console.error("Error fetching categories:", error)
            setCategoryError("Failed to load categories. Please try again.")
        } finally {
            setIsLoadingCategories(false)
        }
    }

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()
    }

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const name = e.target.value
        setData((prev) => ({
            ...prev,
            name,
            slug: generateSlug(name),
        }))
    }

    const handleDescriptionChange = (content: string) => {
        setData("description", content)
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        if (file) {
            setData("image", file)
            const reader = new FileReader()
            reader.onload = (e) => {
                setPreviewImage(e.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        post("/admin/products", {
            onSuccess: () => {
                setIsSubmitting(false)
                // Handle success - redirect is typically handled by Inertia
            },
            onError: () => {
                setIsSubmitting(false)
            },
            forceFormData: true,
        })
    }

    // Function to retry loading if there was an error
    const retryLoading = () => {
        fetchCategories()
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Add New Product</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/admin/products">Cancel</Link>
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing || isSubmitting} className="gap-2">
                            {(processing || isSubmitting) && <Loader2 className="h-4 w-4 animate-spin" />}
                            {processing || isSubmitting ? "Creating..." : "Publish Product"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Main content - 2/3 width on large screens */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                                <CardDescription>
                                    Enter the core details about the product you're adding to the directory.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Product Name</Label>
                                        <Input id="name" value={data.name} onChange={handleNameChange} placeholder="Enter product name" />
                                        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="slug">Slug</Label>
                                        <Input
                                            id="slug"
                                            value={data.slug}
                                            onChange={(e) => setData("slug", e.target.value)}
                                            placeholder="product-url-slug"
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            This will be used in the URL: yourdomain.com/products/
                                            <span className="font-mono">{data.slug || "product-slug"}</span>
                                        </p>
                                        {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website_url">Product Website</Label>
                                        <div className="flex items-center space-x-2">
                                            <Globe className="h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="website_url"
                                                value={data.website_url}
                                                onChange={(e) => setData("website_url", e.target.value)}
                                                placeholder="https://example.com"
                                                type="url"
                                            />
                                        </div>
                                        {errors.website_url && <p className="text-sm text-destructive">{errors.website_url}</p>}
                                    </div>

                                    <Tabs defaultValue="write" className="w-full">
                                        <TabsList className="grid w-full grid-cols-2">
                                            <TabsTrigger value="write">Write</TabsTrigger>
                                            <TabsTrigger value="preview">Preview</TabsTrigger>
                                        </TabsList>
                                        <TabsContent value="write" className="mt-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="description">Description</Label>
                                                <Editor content={data.description} onChange={handleDescriptionChange} />
                                                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="preview" className="mt-4">
                                            <div className="rounded-md border p-4 min-h-[300px] prose max-w-none">
                                                {data.description ? (
                                                    <div dangerouslySetInnerHTML={{ __html: data.description }} />
                                                ) : (
                                                    <p className="text-muted-foreground italic">No description to preview yet.</p>
                                                )}
                                            </div>
                                        </TabsContent>
                                    </Tabs>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Product Image</CardTitle>
                                <CardDescription>
                                    Upload a high-quality image that represents your product. This will be displayed in listings and on
                                    the product page.
                                </CardDescription>
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
                                                    alt="Product image preview"
                                                    className="object-cover w-full h-full"
                                                />
                                            </div>
                                        ) : (
                                            <div className="py-12 flex flex-col items-center justify-center text-muted-foreground">
                                                <ImageIcon className="h-12 w-12 mb-2" />
                                                <p className="text-sm">Click to upload a product image</p>
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
                                    {errors.image && <p className="text-sm text-destructive">{errors.image}</p>}
                                    {previewImage && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setPreviewImage(null)
                                                setData("image", null)
                                                if (fileInputRef.current) {
                                                    fileInputRef.current.value = ""
                                                }
                                            }}
                                        >
                                            <X className="h-4 w-4 mr-2" />
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
                                <CardTitle>Publishing Options</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="primary_category_id">Category</Label>
                                    {isLoadingCategories ? (
                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground py-2">
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            <span>Loading categories...</span>
                                        </div>
                                    ) : categoryError ? (
                                        <div className="space-y-2">
                                            <p className="text-sm text-destructive">{categoryError}</p>
                                            <Button variant="outline" size="sm" onClick={retryLoading}>
                                                Retry
                                            </Button>
                                        </div>
                                    ) : (
                                        <Select
                                            value={data.primary_category_id ? data.primary_category_id.toString() : ""}
                                            onValueChange={(value) => setData("primary_category_id", value)}
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
                                    {errors.primary_category_id && (
                                        <p className="text-sm text-destructive">{errors.primary_category_id}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pricing_type">Pricing Type</Label>
                                    <Select value={data.pricing_type} onValueChange={(value) => setData("pricing_type", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select pricing type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {PRICING_TYPES.map((type) => (
                                                <SelectItem key={type.value} value={type.value}>
                                                    {type.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.pricing_type && <p className="text-sm text-destructive">{errors.pricing_type}</p>}
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Switch
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => setData("is_featured", checked)}
                                    />
                                    <Label htmlFor="is_featured">Featured Product</Label>
                                    {errors.is_featured && <p className="text-sm text-destructive">{errors.is_featured}</p>}
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col items-start border-t px-6 py-4">
                                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                    <AlertCircle className="h-4 w-4" />
                                    <p>Only featured products will appear on the homepage.</p>
                                </div>
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Repository Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="repo_url">Repository URL</Label>
                                    <div className="flex items-center space-x-2">
                                        <Github className="h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="repo_url"
                                            value={data.repo_url}
                                            onChange={(e) => setData("repo_url", e.target.value)}
                                            placeholder="https://github.com/username/repo"
                                        />
                                    </div>
                                    {errors.repo_url && <p className="text-sm text-destructive">{errors.repo_url}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="stars_count">GitHub Stars</Label>
                                    <div className="flex items-center space-x-2">
                                        <Star className="h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="stars_count"
                                            type="number"
                                            min="0"
                                            value={data.stars_count}
                                            onChange={(e) => setData("stars_count", Number.parseInt(e.target.value) || 0)}
                                            placeholder="0"
                                        />
                                    </div>
                                    {errors.stars_count && <p className="text-sm text-destructive">{errors.stars_count}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Preview</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 border rounded-md p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                            {previewImage ? (
                                                <div className="h-10 w-10 rounded-md overflow-hidden">
                                                    <img src={previewImage || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                                                </div>
                                            ) : (
                                                <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center">
                                                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                            )}
                                            <div>
                                                <h3 className="font-medium">{data.name || "Product Name"}</h3>
                                                <p className="text-xs text-muted-foreground">
                                                    {categories.find((c) => c.id.toString() === data.primary_category_id)?.name || "Category"}
                                                </p>
                                            </div>
                                        </div>
                                        {data.is_featured && <Badge>Featured</Badge>}
                                    </div>

                                    <div className="text-sm">
                                        <p className="line-clamp-2 text-muted-foreground">
                                            {data.description ? (
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: data.description.replace(/<[^>]*>/g, " ").substring(0, 100) + "...",
                                                    }}
                                                />
                                            ) : (
                                                "Product description will appear here..."
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <Badge variant="outline" className="font-normal">
                                                {PRICING_TYPES.find((t) => t.value === data.pricing_type)?.label || "Free"}
                                            </Badge>
                                            {data.repo_url && (
                                                <Badge variant="outline" className="font-normal">
                                                    Open Source
                                                </Badge>
                                            )}
                                        </div>
                                        <Button variant="ghost" size="sm" className="gap-1">
                                            View <ArrowRight className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Need Help?</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground space-y-4">
                                    <p>Here are some tips for creating a great product listing:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>Use a clear, descriptive name</li>
                                        <li>Provide a detailed description of features and benefits</li>
                                        <li>Upload a high-quality image</li>
                                        <li>Select the most relevant category</li>
                                        <li>Include the correct pricing model</li>
                                    </ul>
                                    <Button variant="outline" className="w-full mt-2">
                                        View Submission Guidelines
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

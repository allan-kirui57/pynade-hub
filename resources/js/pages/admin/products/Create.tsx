"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Head, useForm, Link } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, DollarSign, PlusCircle, X, AlertCircle } from "lucide-react"
import { Editor } from "@/components/editor"
import { MultiSelect } from "@/components/ui/multi-select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import axios from "axios"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Products",
        href: "/products",
    },
    {
        title: "Create",
        href: "/products/create",
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

export default function ProductCreate(props: { categories?: Category[]; tags?: Tag[] }) {
    // State for categories and tags
    const [categories, setCategories] = useState<Category[]>(props.categories || [])
    const [tags, setTags] = useState<Tag[]>(props.tags || [])
    const [isLoadingCategories, setIsLoadingCategories] = useState(false)
    const [isLoadingTags, setIsLoadingTags] = useState(false)
    const [categoryError, setCategoryError] = useState<string | null>(null)
    const [tagError, setTagError] = useState<string | null>(null)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [productImages, setProductImages] = useState<string[]>([])
    const [selectedTags, setSelectedTags] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form data state
    const { data, setData, post, processing, errors } = useForm({
        name: "",
        slug: "",
        description: "",
        short_description: "",
        price: "",
        sale_price: "",
        cost: "",
        sku: "",
        barcode: "",
        stock_quantity: "0",
        category_id: "",
        tags: [] as string[],
        weight: "",
        dimensions: {
            length: "",
            width: "",
            height: "",
        },
        is_featured: false,
        is_digital: false,
        status: "draft",
        images: [] as File[],
        meta_title: "",
        meta_description: "",
    })

    // Fetch categories and tags from the server
    useEffect(() => {
        // Only fetch if not provided as props
        if (!props.categories || props.categories.length === 0) {
            fetchCategories()
        }

        if (!props.tags || props.tags.length === 0) {
            fetchTags()
        }
    }, [props.categories, props.tags])

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

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^\w\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()
    }

    const generateShortDescription = (content: string) => {
        // Strip HTML tags to get plain text
        const text = content.replace(/<[^>]*>/g, "")
        // Get first 100 words
        const words = text.split(/\s+/).filter(Boolean).slice(0, 30)
        return words.join(" ") + (words.length >= 30 ? "..." : "")
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
        setData((prev) => {
            // Only auto-generate short description if it hasn't been manually edited
            const shouldUpdateShortDesc =
                !prev.short_description || prev.short_description === generateShortDescription(prev.description)

            return {
                ...prev,
                description: content,
                short_description: shouldUpdateShortDesc ? generateShortDescription(content) : prev.short_description,
            }
        })
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        // Update the form data with the new images
        const newImages = [...data.images]
        const newImagePreviews = [...productImages]

        for (let i = 0; i < files.length; i++) {
            const file = files[i]
            newImages.push(file)

            // Create preview URL
            const reader = new FileReader()
            reader.onload = (e) => {
                newImagePreviews.push(e.target?.result as string)
                setProductImages([...newImagePreviews])
            }
            reader.readAsDataURL(file)
        }

        setData("images", newImages)

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const removeImage = (index: number) => {
        const newImages = [...data.images]
        const newImagePreviews = [...productImages]

        newImages.splice(index, 1)
        newImagePreviews.splice(index, 1)

        setData("images", newImages)
        setProductImages(newImagePreviews)
    }

    const handleTagsChange = (selected: string[]) => {
        setSelectedTags(selected)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        post("/products", {
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
    const retryLoading = (type: "categories" | "tags") => {
        if (type === "categories") {
            fetchCategories()
        } else {
            fetchTags()
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Create Product" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Create New Product</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" asChild>
                            <Link href="/products">Cancel</Link>
                        </Button>
                        <Button onClick={handleSubmit} disabled={processing || isSubmitting} className="gap-2">
                            {(processing || isSubmitting) && <Loader2 className="h-4 w-4 animate-spin" />}
                            {processing || isSubmitting ? "Creating..." : "Save Product"}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
                    {/* Main content - 2/3 width on large screens */}
                    <div className="lg:col-span-2 space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
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
                                        {errors.slug && <p className="text-sm text-destructive">{errors.slug}</p>}
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

                                    <div className="space-y-2 mt-4">
                                        <Label htmlFor="short_description">Short Description</Label>
                                        <Textarea
                                            id="short_description"
                                            value={data.short_description}
                                            onChange={(e) => setData("short_description", e.target.value)}
                                            placeholder="Brief summary of your product (shown in listings)"
                                            rows={3}
                                        />
                                        <p className="text-xs text-muted-foreground">
                                            Auto-generated from your description. Edit if you want a custom summary.
                                        </p>
                                        {errors.short_description && <p className="text-sm text-destructive">{errors.short_description}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Regular Price</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="pl-8"
                                                value={data.price}
                                                onChange={(e) => setData("price", e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="sale_price">Sale Price (Optional)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="sale_price"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="pl-8"
                                                value={data.sale_price}
                                                onChange={(e) => setData("sale_price", e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.sale_price && <p className="text-sm text-destructive">{errors.sale_price}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="cost">Cost (Optional)</Label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="cost"
                                                type="number"
                                                min="0"
                                                step="0.01"
                                                className="pl-8"
                                                value={data.cost}
                                                onChange={(e) => setData("cost", e.target.value)}
                                                placeholder="0.00"
                                            />
                                        </div>
                                        {errors.cost && <p className="text-sm text-destructive">{errors.cost}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Inventory</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="sku">SKU (Stock Keeping Unit)</Label>
                                        <Input
                                            id="sku"
                                            value={data.sku}
                                            onChange={(e) => setData("sku", e.target.value)}
                                            placeholder="SKU123"
                                        />
                                        {errors.sku && <p className="text-sm text-destructive">{errors.sku}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="barcode">Barcode (ISBN, UPC, GTIN, etc.)</Label>
                                        <Input
                                            id="barcode"
                                            value={data.barcode}
                                            onChange={(e) => setData("barcode", e.target.value)}
                                            placeholder="123456789012"
                                        />
                                        {errors.barcode && <p className="text-sm text-destructive">{errors.barcode}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="stock_quantity">Stock Quantity</Label>
                                        <Input
                                            id="stock_quantity"
                                            type="number"
                                            min="0"
                                            step="1"
                                            value={data.stock_quantity}
                                            onChange={(e) => setData("stock_quantity", e.target.value)}
                                            placeholder="0"
                                        />
                                        {errors.stock_quantity && <p className="text-sm text-destructive">{errors.stock_quantity}</p>}
                                    </div>

                                    <div className="flex items-center space-x-2 pt-8">
                                        <Switch
                                            id="is_digital"
                                            checked={data.is_digital}
                                            onCheckedChange={(checked) => setData("is_digital", checked)}
                                        />
                                        <Label htmlFor="is_digital">This is a digital product</Label>
                                        {errors.is_digital && <p className="text-sm text-destructive">{errors.is_digital}</p>}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="weight">Weight (kg)</Label>
                                        <Input
                                            id="weight"
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={data.weight}
                                            onChange={(e) => setData("weight", e.target.value)}
                                            placeholder="0.00"
                                        />
                                        {errors.weight && <p className="text-sm text-destructive">{errors.weight}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="length">Length (cm)</Label>
                                        <Input
                                            id="length"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={data.dimensions.length}
                                            onChange={(e) => setData("dimensions", { ...data.dimensions, length: e.target.value })}
                                            placeholder="0.0"
                                        />
                                        {errors["dimensions.length"] && (
                                            <p className="text-sm text-destructive">{errors["dimensions.length"]}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="width">Width (cm)</Label>
                                        <Input
                                            id="width"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={data.dimensions.width}
                                            onChange={(e) => setData("dimensions", { ...data.dimensions, width: e.target.value })}
                                            placeholder="0.0"
                                        />
                                        {errors["dimensions.width"] && (
                                            <p className="text-sm text-destructive">{errors["dimensions.width"]}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="height">Height (cm)</Label>
                                        <Input
                                            id="height"
                                            type="number"
                                            min="0"
                                            step="0.1"
                                            value={data.dimensions.height}
                                            onChange={(e) => setData("dimensions", { ...data.dimensions, height: e.target.value })}
                                            placeholder="0.0"
                                        />
                                        {errors["dimensions.height"] && (
                                            <p className="text-sm text-destructive">{errors["dimensions.height"]}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center mt-4 pt-2 border-t">
                                    <AlertCircle className="h-4 w-4 text-muted-foreground mr-2" />
                                    <p className="text-xs text-muted-foreground">
                                        Leave the dimensions empty if they don't apply to this product.
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Images</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {/* Image thumbnails */}
                                        {productImages.map((image, index) => (
                                            <div key={index} className="relative border rounded-md overflow-hidden group">
                                                <img
                                                    src={image || "/placeholder.svg"}
                                                    alt={`Product image ${index + 1}`}
                                                    className="object-cover w-full h-32"
                                                />
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => removeImage(index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                                {index === 0 && <Badge className="absolute top-2 left-2 bg-primary">Main</Badge>}
                                            </div>
                                        ))}

                                        {/* Upload button */}
                                        <div
                                            className="border-2 border-dashed rounded-md p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors h-32"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            <PlusCircle className="h-8 w-8 text-muted-foreground mb-2" />
                                            <p className="text-sm text-muted-foreground">Add Image</p>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                className="hidden"
                                                onChange={handleImageChange}
                                            />
                                        </div>
                                    </div>

                                    {errors.images && <p className="text-sm text-destructive">{errors.images}</p>}

                                    <div className="text-xs text-muted-foreground mt-2">
                                        <p>
                                            💡 <strong>Tips:</strong>
                                        </p>
                                        <ul className="list-disc pl-5 space-y-1">
                                            <li>The first image will be the main product image</li>
                                            <li>Use high-quality images with aspect ratio 1:1</li>
                                            <li>Recommended size: 1000 x 1000 pixels</li>
                                            <li>Maximum 8 images per product</li>
                                        </ul>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar - 1/3 width on large screens */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Status</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="status">Status</Label>
                                    <Select value={data.status} onValueChange={(value) => setData("status", value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="draft">Draft</SelectItem>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="archived">Archived</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.status && <p className="text-sm text-destructive">{errors.status}</p>}
                                    <p className="text-xs text-muted-foreground">Only "Active" products are visible to customers.</p>
                                </div>

                                <div className="flex items-center space-x-2 pt-2">
                                    <Switch
                                        id="is_featured"
                                        checked={data.is_featured}
                                        onCheckedChange={(checked) => setData("is_featured", checked)}
                                    />
                                    <Label htmlFor="is_featured">Featured Product</Label>
                                    {errors.is_featured && <p className="text-sm text-destructive">{errors.is_featured}</p>}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Organization</CardTitle>
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
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>SEO</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible defaultValue="seo">
                                    <AccordionItem value="seo">
                                        <AccordionTrigger>Search Engine Optimization</AccordionTrigger>
                                        <AccordionContent className="space-y-4 pt-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="meta_title">Meta Title</Label>
                                                <Input
                                                    id="meta_title"
                                                    value={data.meta_title}
                                                    onChange={(e) => setData("meta_title", e.target.value)}
                                                    placeholder={data.name || "Product title"}
                                                />
                                                <p className="text-xs text-muted-foreground">Leave blank to use product name</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="meta_description">Meta Description</Label>
                                                <Textarea
                                                    id="meta_description"
                                                    value={data.meta_description}
                                                    onChange={(e) => setData("meta_description", e.target.value)}
                                                    placeholder={data.short_description || "Brief description for search results"}
                                                    rows={3}
                                                />
                                                <p className="text-xs text-muted-foreground">Leave blank to use short description</p>
                                            </div>

                                            <div className="border rounded p-3 bg-muted/50">
                                                <h3 className="text-sm font-medium mb-1">Google Search Preview</h3>
                                                <div className="space-y-1">
                                                    <p className="text-blue-600 text-sm font-medium truncate">
                                                        {data.meta_title || data.name || "Product Title"}
                                                    </p>
                                                    <p className="text-green-700 text-xs">
                                                        yourdomain.com/products/{data.slug || "product-slug"}
                                                    </p>
                                                    <p className="text-xs text-gray-600 line-clamp-2">
                                                        {data.meta_description ||
                                                            data.short_description ||
                                                            "Product description will appear here..."}
                                                    </p>
                                                </div>
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    )
}

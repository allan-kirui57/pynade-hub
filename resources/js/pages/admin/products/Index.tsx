"use client"

import { useState } from "react"
import { Head, Link, useForm } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Search,
    Plus,
    Filter,
    MoreVertical,
    Edit,
    Trash2,
    Copy,
    Eye,
    ArrowUpDown,
    ChevronLeft,
    ChevronRight,
    Tag,
    ShoppingCart,
} from "lucide-react"

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: "Products",
        href: "/products",
    },
]

// Define the Product type based on common fields
interface Product {
    id: number
    name: string
    slug: string
    description: string
    price: number
    sale_price: number | null
    sku: string
    stock_quantity: number
    status: "active" | "draft" | "archived"
    is_featured: boolean
    category_id: number
    category_name: string
    created_at: string
    updated_at: string
    image_url: string
}

// Pagination type
interface Pagination {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

// Update the component props and destructuring to match the Laravel/Inertia structure
export default function ProductIndex({
                                         products,
                                         categories = [],
                                         filters = {},
                                     }: {
    products: {
        data: Product[]
        current_page: number
        last_page: number
        per_page: number
        total: number
    }
    categories: { id: number; name: string }[]
    filters: Record<string, any>
}) {
    const [searchTerm, setSearchTerm] = useState(filters.search || "")
    const [categoryFilter, setCategoryFilter] = useState<string>(filters.category || "")
    const [statusFilter, setStatusFilter] = useState<string>(filters.pricing_type || "")
    const [sortField, setSortField] = useState<string>("created_at")
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

    // Form for handling search and filters
    const { get } = useForm({
        search: searchTerm,
        category: categoryFilter,
        pricing_type: statusFilter,
        sort_field: sortField,
        sort_direction: sortDirection,
        page: products?.current_page || 1,
    })

    // Update the handleSort function to use the correct pagination property
    const handleSort = (field: string) => {
        const direction = field === sortField && sortDirection === "asc" ? "desc" : "asc"
        setSortField(field)
        setSortDirection(direction)
        get("/admin/products", {
            data: {
                search: searchTerm,
                category: categoryFilter,
                pricing_type: statusFilter,
                sort_field: field,
                sort_direction: direction,
                page: products?.current_page || 1,
            },
            preserveState: true,
        })
    }

    // Update the goToPage function to use the correct route
    const goToPage = (page: number) => {
        get("/admin/products", {
            data: {
                search: searchTerm,
                category: categoryFilter,
                pricing_type: statusFilter,
                sort_field: sortField,
                sort_direction: sortDirection,
                page,
            },
            preserveState: true,
        })
    }

    // Update the search handler to use the correct route
    const handleSearch = () => {
        get("/admin/products", {
            preserveState: true,
        })
    }

    // Function to format price
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(price)
    }

    // Function to determine the status badge color
    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-green-500">Active</Badge>
            case "draft":
                return <Badge variant="outline">Draft</Badge>
            case "archived":
                return <Badge variant="secondary">Archived</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />
            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Products</h1>
                    <Button asChild>
                        <Link href="/admin/products/create" className="flex items-center gap-1">
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Inventory</CardTitle>
                        <CardDescription>Manage your product catalog, update inventory, and track performance.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Filters and search */}
                        <div className="flex flex-col gap-4 mb-6 sm:flex-row">
                            <div className="relative flex-grow">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="w-[180px]">
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-4 w-4" />
                                            <span>
                        {categoryFilter
                            ? "Category: " +
                            (categories.find((c) => c.id.toString() === categoryFilter)?.name || categoryFilter)
                            : "All Categories"}
                      </span>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>

                                <Select value={statusFilter} onValueChange={setStatusFilter}>
                                    <SelectTrigger className="w-[150px]">
                                        <div className="flex items-center gap-2">
                                            <Filter className="h-4 w-4" />
                                            <span>{statusFilter ? "Status: " + statusFilter : "All Status"}</span>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="archived">Archived</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button variant="secondary" onClick={handleSearch}>
                                    Apply Filters
                                </Button>
                            </div>
                        </div>

                        {/* Products table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[80px]">Image</TableHead>
                                        <TableHead className="w-[300px]">
                                            <div className="flex items-center cursor-pointer" onClick={() => handleSort("name")}>
                                                Product
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center cursor-pointer" onClick={() => handleSort("price")}>
                                                Price
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className="flex items-center cursor-pointer" onClick={() => handleSort("stock_quantity")}>
                                                Stock
                                                <ArrowUpDown className="ml-2 h-4 w-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead>Category</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-[100px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {!products?.data || products.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-24 text-center">
                                                No products found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        products.data.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell>
                                                    <div className="h-12 w-12 rounded-md border overflow-hidden">
                                                        {product.image ? (
                                                            <img
                                                                src={product.image || "/placeholder.svg"}
                                                                alt={product.name}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center bg-muted">
                                                                <ShoppingCart className="h-6 w-6 text-muted-foreground" />
                                                            </div>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{product.name}</div>
                                                    <div className="text-sm text-muted-foreground">Slug: {product.slug}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="font-medium">{product.pricing_type}</div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                            <span className="font-medium">
                              {product.is_open_source ? "Open Source" : "Closed Source"}
                            </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-normal">
                                                        {product.primaryCategory?.name || "Uncategorized"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    {product.is_featured ? (
                                                        <Badge className="bg-green-500">Featured</Badge>
                                                    ) : (
                                                        <Badge variant="outline">Standard</Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Open menu</span>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/products/${product.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    View
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/products/${product.id}/edit`}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Edit
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem>
                                                                <Copy className="mr-2 h-4 w-4" />
                                                                Duplicate
                                                            </DropdownMenuItem>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuItem className="text-red-600">
                                                                <Trash2 className="mr-2 h-4 w-4" />
                                                                Delete
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {products && products.last_page > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <div className="text-sm text-muted-foreground">
                                    Showing <span className="font-medium">{(products.current_page - 1) * products.per_page + 1}</span> to{" "}
                                    <span className="font-medium">
                    {Math.min(products.current_page * products.per_page, products.total)}
                  </span>{" "}
                                    of <span className="font-medium">{products.total}</span> results
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(products.current_page - 1)}
                                        disabled={products.current_page === 1}
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => goToPage(products.current_page + 1)}
                                        disabled={products.current_page === products.last_page}
                                    >
                                        Next
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    )
}

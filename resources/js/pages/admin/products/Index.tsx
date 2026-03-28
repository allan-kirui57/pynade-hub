import { useState } from "react"
import { Head, Link, router } from "@inertiajs/react"
import AppLayout from "@/layouts/app-layout"
import type { BreadcrumbItem } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
    Package,
} from "lucide-react"

// ── Types ─────────────────────────────────────────────────────────────────────

type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Subscription'

type SortField = 'name' | 'pricing_type' | 'created_at' | 'updated_at'
type SortDirection = 'asc' | 'desc'

interface Product {
    id: number
    user_id: number
    name: string
    slug: string
    description: string
    image: string | null          // column is `image`, not `image_url`
    pricing_type: PricingType
    is_open_source: boolean
    repo_url: string | null
    website_url: string | null
    stars_count: number
    forks_count: number
    watchers_count: number
    last_synced_at: string | null
    is_featured: boolean
    created_at: string
    updated_at: string
    deleted_at: string | null
}

interface PaginatedProducts {
    data: Product[]
    current_page: number
    last_page: number
    per_page: number
    total: number
}

interface Filters {
    search?: string
    pricing_type?: string
    sort_field?: SortField
    sort_direction?: SortDirection
}

interface Props {
    products: PaginatedProducts
    filters: Filters
}

// ── Constants ─────────────────────────────────────────────────────────────────

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Products', href: '/admin/products' },
]

const PRICING_BADGE: Record<PricingType, { label: string; className: string }> = {
    Free:         { label: 'Free',         className: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400' },
    Freemium:     { label: 'Freemium',     className: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400' },
    Paid:         { label: 'Paid',         className: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400' },
    Subscription: { label: 'Subscription', className: 'bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400' },
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    })
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ProductIndex({ products, filters = {} }: Props) {
    const [searchTerm, setSearchTerm]     = useState<string>(filters.search ?? '')
    const [pricingFilter, setPricingFilter] = useState<string>(filters.pricing_type ?? '')
    const [sortField, setSortField]       = useState<SortField>(filters.sort_field ?? 'created_at')
    const [sortDirection, setSortDirection] = useState<SortDirection>(filters.sort_direction ?? 'desc')

    // Single source-of-truth for all Inertia navigation in this page.
    // router.get() accepts query params directly — no `data` wrapper needed.
    function navigate(overrides: Partial<{
        search: string
        pricing_type: string
        sort_field: SortField
        sort_direction: SortDirection
        page: number
    }> = {}): void {
        router.get(
            '/admin/products',
            {
                search:         searchTerm,
                pricing_type:   pricingFilter,
                sort_field:     sortField,
                sort_direction: sortDirection,
                page:           products.current_page,
                ...overrides,   // caller can override any of the above
            },
            { preserveState: true, replace: true },
        )
    }

    function handleSort(field: SortField): void {
        const direction: SortDirection =
            field === sortField && sortDirection === 'asc' ? 'desc' : 'asc'
        setSortField(field)
        setSortDirection(direction)
        navigate({ sort_field: field, sort_direction: direction, page: 1 })
    }

    function handleSearch(): void {
        navigate({ page: 1 })
    }

    function handlePricingChange(value: string): void {
        const normalised = value === 'all' ? '' : value
        setPricingFilter(normalised)
        navigate({ pricing_type: normalised, page: 1 })
    }

    function goToPage(page: number): void {
        navigate({ page })
    }

    const SortButton = ({ field, label }: { field: SortField; label: string }) => (
        <div
            className="flex cursor-pointer items-center select-none"
            onClick={() => handleSort(field)}
        >
            {label}
            <ArrowUpDown className="ml-1.5 h-3.5 w-3.5 text-muted-foreground" />
        </div>
    )

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Products" />

            <div className="flex flex-1 flex-col gap-4 p-4">
                {/* Page header */}
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Products</h1>
                    <Button asChild>
                        <Link href="/admin/products/create" className="flex items-center gap-1.5">
                            <Plus className="h-4 w-4" />
                            Add Product
                        </Link>
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Product Catalog</CardTitle>
                        <CardDescription>
                            {products.total} product{products.total !== 1 ? 's' : ''} total
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        {/* Filters */}
                        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search by name or slug..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                            </div>

                            <div className="flex gap-2">
                                <Select
                                    value={pricingFilter || 'all'}
                                    onValueChange={handlePricingChange}
                                >
                                    <SelectTrigger className="w-[160px]">
                                        <div className="flex items-center gap-2">
                                            <Filter className="h-3.5 w-3.5" />
                                            <SelectValue placeholder="Pricing" />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Pricing</SelectItem>
                                        <SelectItem value="Free">Free</SelectItem>
                                        <SelectItem value="Freemium">Freemium</SelectItem>
                                        <SelectItem value="Paid">Paid</SelectItem>
                                        <SelectItem value="Subscription">Subscription</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Button variant="secondary" onClick={handleSearch}>
                                    Search
                                </Button>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[60px]">Image</TableHead>
                                        <TableHead><SortButton field="name" label="Product" /></TableHead>
                                        <TableHead><SortButton field="pricing_type" label="Pricing" /></TableHead>
                                        <TableHead>Source</TableHead>
                                        <TableHead>Featured</TableHead>
                                        <TableHead><SortButton field="created_at" label="Added" /></TableHead>
                                        <TableHead className="w-[60px]">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {products.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                                                No products found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        products.data.map((product) => {
                                            const pricing = PRICING_BADGE[product.pricing_type]

                                            return (
                                                <TableRow key={product.id}>
                                                    {/* Image */}
                                                    <TableCell>
                                                        <div className="h-11 w-11 overflow-hidden rounded-md border bg-muted flex items-center justify-center shrink-0">
                                                            {product.image ? (
                                                                <img
                                                                    src={product.image}
                                                                    alt={product.name}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                <Package className="h-5 w-5 text-muted-foreground" />
                                                            )}
                                                        </div>
                                                    </TableCell>

                                                    {/* Name + slug */}
                                                    <TableCell>
                                                        <div className="font-medium leading-tight">{product.name}</div>
                                                        <div className="text-xs text-muted-foreground mt-0.5">
                                                            /{product.slug}
                                                        </div>
                                                    </TableCell>

                                                    {/* Pricing type */}
                                                    <TableCell>
                                                        <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${pricing.className}`}>
                                                            {pricing.label}
                                                        </span>
                                                    </TableCell>

                                                    {/* Open source */}
                                                    <TableCell>
                                                        <Badge variant={product.is_open_source ? 'secondary' : 'outline'} className="text-xs whitespace-nowrap">
                                                            {product.is_open_source ? '🔓 Open Source' : '🔒 Closed'}
                                                        </Badge>
                                                    </TableCell>

                                                    {/* Featured */}
                                                    <TableCell>
                                                        {product.is_featured ? (
                                                            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                                                                ✦ Featured
                                                            </Badge>
                                                        ) : (
                                                            <span className="text-xs text-muted-foreground">—</span>
                                                        )}
                                                    </TableCell>

                                                    {/* Date added */}
                                                    <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                                        {fmtDate(product.created_at)}
                                                    </TableCell>

                                                    {/* Actions */}
                                                    <TableCell>
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="icon" className="h-8 w-8">
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
                                                                <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Delete
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        {products.last_page > 1 && (
                            <div className="mt-4 flex items-center justify-between">
                                <p className="text-sm text-muted-foreground">
                                    Showing{' '}
                                    <span className="font-medium">
                                        {(products.current_page - 1) * products.per_page + 1}
                                    </span>
                                    {' – '}
                                    <span className="font-medium">
                                        {Math.min(products.current_page * products.per_page, products.total)}
                                    </span>
                                    {' of '}
                                    <span className="font-medium">{products.total}</span>
                                </p>

                                <div className="flex items-center gap-2">
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

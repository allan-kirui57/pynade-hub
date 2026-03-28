import { Link, usePage } from '@inertiajs/react';
import {
    ExternalLink,
    Star,
    GitFork,
    Globe,
    GitBranch,
    Lock,
    Triangle,
    ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SharedData } from '@/types';

// ── Types ─────────────────────────────────────────────────────────────────────

type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Subscription';

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string;
    image: string | null;
    pricing_type: PricingType;
    is_open_source: boolean;
    repo_url: string | null;
    website_url: string | null;
    stars_count: number;
    forks_count: number;
    watchers_count: number;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

interface Props extends SharedData {
    products: Product[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function firstSentence(html: string): string {
    const plain = html.replace(/<[^>]*>/g, '').trim();
    const match = plain.match(/^[^.!?]*[.!?]/);
    return match ? match[0].trim() : plain.slice(0, 120);
}

function fmtNumber(n: number): string {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
}

const PRICING_STYLES: Record<PricingType, string> = {
    Free:         'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    Freemium:     'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
    Paid:         'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
    Subscription: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800',
};

// ── Product Row (same layout as ProductList) ──────────────────────────────────

function ProductRow({ product, rank }: { product: Product; rank: number }) {
    const sentence = firstSentence(product.description);

    return (
        <div className="group flex items-start gap-4 px-4 py-4 sm:px-6 transition-colors hover:bg-muted/40">

            {/* Rank */}
            <span className="hidden sm:flex w-5 shrink-0 pt-1 text-sm font-medium text-muted-foreground/50 tabular-nums">
                {rank}.
            </span>

            {/* Thumbnail */}
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border bg-muted flex items-center justify-center shadow-sm">
                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span className="text-xl font-bold text-muted-foreground select-none">
                        {product.name.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href={route('products.show', product.slug)}
                        className="text-base font-semibold leading-tight hover:text-primary transition-colors"
                    >
                        {product.name}
                    </Link>

                    {product.is_featured && (
                        <span className="inline-flex items-center rounded-full bg-primary/10 border border-primary/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                            ✦ Featured
                        </span>
                    )}
                </div>

                <p className="mt-0.5 text-sm text-muted-foreground line-clamp-1">
                    {sentence}
                </p>

                {/* Meta */}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${PRICING_STYLES[product.pricing_type]}`}>
                        {product.pricing_type}
                    </span>

                    {product.is_open_source ? (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <GitBranch className="h-3 w-3" />
                            Open Source
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Lock className="h-3 w-3" />
                            Closed Source
                        </span>
                    )}


                    {product.website_url && (
                        <a
                            href={product.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <Globe className="h-3 w-3" />
                            Website
                        </a>
                    )}

                    {product.repo_url && (
                        <a
                            href={product.repo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ExternalLink className="h-3 w-3" />
                            Repo
                        </a>
                    )}
                </div>
            </div>

        </div>
    );
}

// ── Section ───────────────────────────────────────────────────────────────────

export default function ProductsSection() {
    const { products } = usePage<Props>().props;

    return (
        <section id="products" className="w-full py-12 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">

                {/* Header */}
                <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between mb-8">
                    <div className="space-y-1.5">
                        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
                            Featured Products
                        </h2>
                        <p className="text-muted-foreground max-w-[600px]">
                            Discover innovative tech products and open source projects from the community.
                        </p>
                    </div>
                    <Link
                        href={route('products.index')}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline shrink-0"
                    >
                        View all products
                        <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                </div>

                {/* List */}
                {!products || products.length === 0 ? (
                    <div className="flex h-40 flex-col items-center justify-center rounded-xl border border-dashed bg-background gap-2 text-center">
                        <p className="text-sm text-muted-foreground">No products yet.</p>
                    </div>
                ) : (
                    <div className="flex flex-col divide-y rounded-none border bg-background overflow-hidden">
                        {products.map((product, index) => (
                            <ProductRow
                                key={product.id}
                                product={product}
                                rank={index + 1}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

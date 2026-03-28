import { Link } from '@inertiajs/react';
import { ExternalLink, GitBranch, Globe, Lock } from 'lucide-react';
import { Product, PricingType } from '@/types/product';

interface ProductListProps {
    products: Product[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Return only the first sentence of a description string, stripping HTML tags. */
function firstSentence(html: string): string {
    const plain = html.replace(/<[^>]*>/g, '').trim();
    const match = plain.match(/^[^.!?]*[.!?]/);
    return match ? match[0].trim() : plain.slice(0, 120);
}

const PRICING_STYLES: Record<PricingType, string> = {
    Free: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    Freemium: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
    Paid: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
    // Subscription: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800',
};

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyState() {
    return (
        <div className="bg-background flex h-48 flex-col items-center justify-center gap-2 rounded-xl border border-dashed px-6 text-center">
            <p className="text-muted-foreground text-sm font-medium">No products found.</p>
            <p className="text-muted-foreground text-xs">Try adjusting your search or filter criteria.</p>
        </div>
    );
}

// ── Product row ───────────────────────────────────────────────────────────────

function ProductRow({ product, rank }: { product: Product; rank: number }) {
    const sentence = firstSentence(product.description);

    return (
        <div className="group hover:bg-muted/40 flex items-start gap-4 rounded-none px-4 py-4 transition-colors sm:px-6">
            {/* Rank number */}
            <span className="text-muted-foreground/50 hidden w-6 shrink-0 pt-1 text-sm font-medium tabular-nums sm:flex">{rank}.</span>

            {/* Product thumbnail */}
            <div className="bg-muted flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-none border shadow-sm">
                <Link
                    href={route('products.show', product.id)}
                    className="hover:text-primary text-base leading-tight font-semibold transition-colors"
                >
                    {product.image ? (
                        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-muted-foreground text-xl font-bold select-none">{product.name.charAt(0).toUpperCase()}</span>
                    )}
                </Link>
            </div>

            {/* Main info */}
            <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                    <Link
                        href={route('products.show', product.id)}
                        className="hover:text-primary text-base leading-tight font-semibold transition-colors"
                    >
                        {product.name}
                    </Link>

                    {product.is_featured && (
                        <span className="bg-primary/10 border-primary/20 text-primary inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase">
                            ✦ Featured
                        </span>
                    )}
                </div>

                {/* One-sentence description */}
                <p className="text-muted-foreground mt-0.5 line-clamp-1 text-sm leading-snug">{sentence}</p>

                {/* Meta row */}
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
                    {/* Pricing badge */}
                    <span
                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${PRICING_STYLES[product.pricing_type]}`}
                    >
                        {product.pricing_type}
                    </span>

                    {/* Open source tag */}
                    {product.is_open_source ? (
                        <span className="text-muted-foreground flex items-center gap-1 text-xs">
                            <GitBranch className="h-3 w-3" />
                            Open Source
                        </span>
                    ) : (
                        <span className="text-muted-foreground flex items-center gap-1 text-xs">
                            <Lock className="h-3 w-3" />
                            Closed Source
                        </span>
                    )}

                    {/* External links */}
                    {product.website_url && (
                        <a
                            href={product.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
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
                            className="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
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

// ── Main component ────────────────────────────────────────────────────────────

export default function ProductList({ products }: ProductListProps) {
    if (products.length === 0) {
        return <EmptyState />;
    }

    return (
        <div className="bg-background flex flex-col divide-y overflow-hidden rounded-none border">
            {products.map((product, index) => (
                <ProductRow key={product.id} product={product} rank={index + 1} />
            ))}
        </div>
    );
}

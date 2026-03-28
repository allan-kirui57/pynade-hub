import { Link } from '@inertiajs/react';
import { SiteHeader } from "@/pages/frontend/components/site-header";
import { SiteFooter } from "@/pages/frontend/components/site-footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    ExternalLink,
    CalendarDays,
    RefreshCw,
    User,
    Tag,
    GitFork,
    Star,
    Eye,
    Globe,
    GitBranch,
    ChevronRight,
    ArrowLeft,
    Lock,
} from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

type PricingType = 'Free' | 'Freemium' | 'Paid' | 'Subscription';

interface ProductUser {
    id: number;
    name: string;
    username?: string;         // add to your UserResource if you expose it
    avatar?: string | null;    // profile photo URL
}

interface Product {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    description: string;           // may be HTML from a rich-text editor
    image: string | null;
    pricing_type: PricingType;
    is_open_source: boolean;
    repo_url: string | null;
    website_url: string | null;
    stars_count: number;
    forks_count: number;
    watchers_count: number;
    last_synced_at: string | null; // ISO datetime
    is_featured: boolean;
    created_at: string;            // ISO datetime
    updated_at: string;            // ISO datetime
    deleted_at: string | null;
    user: ProductUser;
}

interface Props {
    product: Product;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtDate(iso: string): string {
    return new Date(iso).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

const PRICING_STYLES: Record<PricingType, string> = {
    Free:         'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800',
    Freemium:     'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800',
    Paid:         'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800',
    Subscription: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-400 dark:border-violet-800',
};

// ── Component ────────────────────────────────────────────────────────────────

export default function ProductShow({ product }: Props) {
    const authorHandle = product.user?.username
        ?? product.user?.name.toLowerCase().replace(/\s+/g, '');

    const hasGitStats =
        product.is_open_source &&
        (product.stars_count > 0 || product.forks_count > 0 || product.watchers_count > 0);

    return (
        <div className="flex min-h-screen flex-col bg-background">
            <SiteHeader />

            <main className="flex-1">
                {/* Breadcrumb */}
                <div className="border-b bg-muted/40">
                    <div className="container mx-auto px-4 md:px-6 py-3">
                        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                            <ChevronRight className="h-3.5 w-3.5" />
                            <Link href="/products" className="hover:text-foreground transition-colors">Products</Link>
                            <ChevronRight className="h-3.5 w-3.5" />
                            <span className="text-foreground font-medium truncate max-w-[200px]">
                                {product.name}
                            </span>
                        </nav>
                    </div>
                </div>

                {/* Page body */}
                <div className="container mx-auto px-4 md:px-6 py-8 md:py-12">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">

                        {/* ══ LEFT — main content ══ */}
                        <div className="flex flex-col gap-8 min-w-0">

                            {/* Title block */}
                            <div>
                                <Link
                                    href="/products"
                                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
                                >
                                    <ArrowLeft className="h-3.5 w-3.5" />
                                    Back to Products
                                </Link>

                                <div className="flex flex-wrap items-start gap-3">
                                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl leading-tight flex-1">
                                        {product.name}
                                    </h1>
                                    {product.is_featured && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary border border-primary/20 mt-1">
                                            ✦ Featured
                                        </span>
                                    )}
                                </div>

                                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                                    <span>
                                        By{' '}
                                        <span className="font-medium text-foreground">
                                            @{authorHandle}
                                        </span>
                                    </span>
                                    <span className="hidden sm:inline text-border">·</span>
                                    <span className="flex items-center gap-1">
                                        <CalendarDays className="h-3.5 w-3.5" />
                                        Added {fmtDate(product.created_at)}
                                    </span>
                                    {product.is_open_source && (
                                        <>
                                            <span className="hidden sm:inline text-border">·</span>
                                            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                                                <GitBranch className="h-3.5 w-3.5" />
                                                Open Source
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Cover image */}
                            {product.image ? (
                                <div className="overflow-hidden rounded-xl border bg-muted shadow-sm">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full object-cover max-h-[480px]"
                                    />
                                </div>
                            ) : (
                                <div className="flex h-52 w-full items-center justify-center rounded-xl border bg-muted text-muted-foreground text-sm">
                                    No cover image
                                </div>
                            )}

                            {/* Mobile CTAs */}
                            <div className="flex flex-wrap gap-2 lg:hidden">
                                {product.website_url && (
                                    <a
                                        href={product.website_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow transition-all hover:bg-primary/90 active:scale-[0.98]"
                                    >
                                        <Globe className="h-4 w-4" />
                                        Visit Website
                                    </a>
                                )}
                                {product.repo_url && (
                                    <a
                                        href={product.repo_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 h-10 px-5 rounded-lg border bg-background text-foreground text-sm font-semibold shadow-sm transition-all hover:bg-accent active:scale-[0.98]"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                        Repository
                                    </a>
                                )}
                            </div>

                            {/* Description */}
                            <div className="rounded-xl border bg-card p-6 md:p-8">
                                <h2 className="text-lg font-semibold mb-4">Description</h2>
                                <div
                                    className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: product.description }}
                                />
                            </div>

                            {/* GitHub stats (only for open source with data) */}
                            {hasGitStats && (
                                <div className="rounded-xl border bg-card p-5">
                                    <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
                                        <GitBranch className="h-4 w-4 text-muted-foreground" />
                                        Repository Stats
                                        {product.last_synced_at && (
                                            <span className="ml-auto text-xs font-normal text-muted-foreground">
                                                Synced {fmtDate(product.last_synced_at)}
                                            </span>
                                        )}
                                    </h2>
                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { icon: Star,  label: 'Stars',    value: product.stars_count },
                                            { icon: GitFork, label: 'Forks',  value: product.forks_count },
                                            { icon: Eye,   label: 'Watchers', value: product.watchers_count },
                                        ].map(({ icon: Icon, label, value }) => (
                                            <div
                                                key={label}
                                                className="flex flex-col items-center justify-center rounded-lg bg-muted/60 py-4 gap-1"
                                            >
                                                <Icon className="h-4 w-4 text-muted-foreground mb-1" />
                                                <span className="text-xl font-bold tabular-nums">
                                                    {value.toLocaleString()}
                                                </span>
                                                <span className="text-xs text-muted-foreground">{label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* ══ RIGHT — sidebar ══ */}
                        <div className="flex flex-col gap-4">

                            {/* Pricing / CTA card */}
                            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between gap-3 px-5 py-5 border-b">
                                    <div>
                                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-1.5">
                                            Pricing
                                        </p>
                                        <span
                                            className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-semibold ${PRICING_STYLES[product.pricing_type]}`}
                                        >
                                            {product.pricing_type}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted shrink-0">
                                        {product.is_open_source
                                            ? <GitBranch className="h-4 w-4 text-muted-foreground" />
                                            : <Lock className="h-4 w-4 text-muted-foreground" />
                                        }
                                    </div>
                                </div>

                                <div className="px-5 py-4 flex flex-col gap-2">
                                    {product.website_url && (
                                        <a
                                            href={product.website_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 h-10 w-full rounded-lg bg-primary text-primary-foreground text-sm font-semibold shadow transition-all hover:bg-primary/90 active:scale-[0.98]"
                                        >
                                            <Globe className="h-4 w-4" />
                                            Visit Website
                                        </a>
                                    )}
                                    {product.repo_url && (
                                        <a
                                            href={product.repo_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 h-10 w-full rounded-lg border bg-background text-foreground text-sm font-semibold shadow-sm transition-all hover:bg-accent active:scale-[0.98]"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            View Repository
                                        </a>
                                    )}
                                    {!product.website_url && !product.repo_url && (
                                        <p className="text-xs text-muted-foreground text-center py-1">
                                            No links available
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Meta card */}
                            <div className="rounded-xl border bg-card shadow-sm divide-y">

                                {/* Author */}
                                <div className="flex items-center gap-3 px-5 py-4">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted border overflow-hidden">
                                        {product.user?.avatar ? (
                                            <img
                                                src={product.user?.avatar}
                                                alt={product.user?.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <User className="h-4 w-4 text-muted-foreground" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-xs text-muted-foreground">Author</p>
                                        <p className="text-sm font-semibold text-foreground truncate">
                                            {product.user?.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            @{authorHandle}
                                        </p>
                                    </div>
                                </div>

                                {/* Dates */}
                                <div className="px-5 py-4 flex flex-col gap-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                                            <span className="text-xs">Date Added</span>
                                        </div>
                                        <span className="text-xs font-medium text-foreground">
                                            {fmtDate(product.created_at)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <RefreshCw className="h-3.5 w-3.5 shrink-0" />
                                            <span className="text-xs">Last Updated</span>
                                        </div>
                                        <span className="text-xs font-medium text-foreground">
                                            {fmtDate(product.updated_at)}
                                        </span>
                                    </div>
                                    {product.last_synced_at && (
                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center gap-2 text-muted-foreground">
                                                <GitBranch className="h-3.5 w-3.5 shrink-0" />
                                                <span className="text-xs">Repo Synced</span>
                                            </div>
                                            <span className="text-xs font-medium text-foreground">
                                                {fmtDate(product.last_synced_at)}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* License / open source badge */}
                                <div className="px-5 py-4">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Tag className="h-3.5 w-3.5 text-muted-foreground" />
                                        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                                            Source
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2">
                                        <Badge variant={product.is_open_source ? 'secondary' : 'outline'} className="text-xs">
                                            {product.is_open_source ? '🔓 Open Source' : '🔒 Closed Source'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* ══ end sidebar ══ */}

                    </div>
                </div>
            </main>

            <SiteFooter />
        </div>
    );
}

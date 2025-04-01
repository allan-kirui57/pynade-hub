import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    from: number;
    to: number;
    total: number;
    links: PaginationLink[];
}

export function Pagination({ currentPage, lastPage, from, to, total, links }: PaginationProps) {
    return (
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{from}</span> to{' '}
                <span className="font-medium">{to}</span> of{' '}
                <span className="font-medium">{total}</span> results
            </div>
            <div className="flex items-center gap-1">
                {links.map((link, i) => {
                    // Skip "prev" and "next" text links since we'll use icons
                    if (i === 0) {
                        return (
                            <Button
                                key="prev"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={!link.url}
                                asChild={link.url ? true : false}
                            >
                                {link.url ? (
                                    <Link href={link.url}>
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="sr-only">Previous page</span>
                                    </Link>
                                ) : (
                                    <span>
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous page</span>
                  </span>
                                )}
                            </Button>
                        );
                    }

                    if (i === links.length - 1) {
                        return (
                            <Button
                                key="next"
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={!link.url}
                                asChild={link.url ? true : false}
                            >
                                {link.url ? (
                                    <Link href={link.url}>
                                        <ChevronRight className="h-4 w-4" />
                                        <span className="sr-only">Next page</span>
                                    </Link>
                                ) : (
                                    <span>
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next page</span>
                  </span>
                                )}
                            </Button>
                        );
                    }

                    // Regular page links
                    if (link.url) {
                        return (
                            <Button
                                key={i}
                                variant={link.active ? "default" : "outline"}
                                size="icon"
                                className="h-8 w-8"
                                asChild={!link.active}
                            >
                                {!link.active ? (
                                    <Link href={link.url}>
                                        <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                    </Link>
                                ) : (
                                    <span dangerouslySetInnerHTML={{ __html: link.label }} />
                                )}
                            </Button>
                        );
                    }

                    return null;
                })}
            </div>
        </div>
    );
}

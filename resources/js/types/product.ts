export type PricingType = 'Free' | 'Freemium' | 'Paid'; // 'Subscription';

export interface Product {
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
    language?: string;
    link: string;
    created_at: string;
    updated_at: string;
}
// interface Product {
//     id: number;
//     title: string;
//     slug: string;
//     description: string;
//     image: string;
//     pricing: "Free" | "Freemium" | "Paid";
//     stars?: number;
//     language?: string;
//     repoUrl?: string;
//     comments: number;
//     upvotes: number;
//     downvotes: number;
//     link: string;
//     isOpenSource: boolean;
//     created_at: string;
// }

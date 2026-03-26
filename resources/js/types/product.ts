export interface Product {
    id: number;
    title: string;
    description: string;
    image: string;
    pricing: "Free" | "Freemium" | "Paid";
    stars?: number;
    language?: string;
    repoUrl?: string;
    comments: number;
    upvotes: number;
    downvotes: number;
    link: string;
    isOpenSource: boolean;
}

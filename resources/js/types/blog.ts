export interface Blog {
    id: number;
    user_id: number;
    category_id: number | null;
    primary_category_id: number | null;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    featured_image: string | null;
    published_at: string | null;
    read_time: string | null;
    is_featured: boolean;
    created_at: string;
    updated_at: string;
}

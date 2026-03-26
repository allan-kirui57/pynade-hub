export interface Blog {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    image: string;
    published_at: string;
    read_time: string;
    created_at: string;
    tags: {
        id: number;
        name: string;
        slug: string;
    }[];
    author: {
        id: number;
        name: string;
        avatar: string;
    };
    views: number;
}

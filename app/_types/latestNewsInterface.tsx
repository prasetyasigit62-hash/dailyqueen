export interface LatestNewsArticle {
    id: number;
    id_mall: number;
    title: string;
    slug: string;
    image: string;
    sosmed_url: string;
    content: string;
    meta_description: string;
    created_by: number;
    updated_by: string | null;
    deleted_at: string | null;
    created_at: string | null;
    updated_at: string | null;
}

// Domain Entity: Brand
// Pure business logic, framework-independent

export interface Brand {
    id: string;
    user_id: string;
    name: string;
    description?: string;
    website?: string;
    tax_id?: string;
    instagram?: string;
    logo_url?: string;
    logo_base64?: string;
    created_at: string;
    updated_at: string;
}

export interface BrandDiagnostic {
    brand_id: string;
    brand_name: string | null;
    domain: string | null;
    description: string | null;
    colors_detected: Array<{ hex: string; name: string }>;
    brand_keywords: string[];
    products_detected: string[];
    seo_keywords: string[];
    logo: {
        url: string | null;
        base64: string | null;
        mime_type: string | null;
    };
    product_images: string[];
    social_media_detected: {
        website?: string | null;
        instagram?: string | null;
        facebook?: string | null;
        tiktok?: string | null;
        youtube?: string | null;
        whatsapp?: string | null;
        linkedin?: string | null;
    };
    sources: any[];
    created_at: string;
}

export interface CreateBrandDTO {
    website: string;
    tax_id: string;
    instagram: string;
}

export interface UpdateBrandDTO {
    name?: string;
    description?: string;
    logo_url?: string;
    logo_base64?: string;
    website?: string;
    tax_id?: string;
    instagram?: string;
}

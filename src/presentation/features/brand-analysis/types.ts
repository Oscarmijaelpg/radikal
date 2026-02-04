// Feature Types: Brand Analysis
// Type definitions specific to the brand analysis feature

export interface BrandAnalysisData {
    brandName: string;
    description: string;
    socials: {
        website: string;
        instagram: string;
        facebook: string;
        tiktok: string;
    };
    productTags: string[];
    colors: string[];
    brandKeywords: string[];
    seoKeywords: string[];
    logo: {
        url: string | null;
        base64: string | null;
    };
    // Branding (expandido)
    typography?: string[];
    visual_style?: string[];
    palette_named?: string;
    logo_notes?: string;
    // Positioning
    slogan?: string;
    identity_message?: string;
    value_proposition?: string;
    differentiators?: string[];
    brand_personality?: string[];
    key_messages?: string[];
    // History
    history_summary?: string;
    origin?: string;
    timeline?: Array<{ date: string; event: string }>;
    milestones?: string[];
    // Audience
    audience_segments?: string[];
    demographics?: string;
    psychographics?: string;
    // Operations
    locations?: string[];
    employees?: string;
    production_capacity?: string;
    technology?: string[];
    b2b_services?: string[];
}

export interface DiagnosticResponse {
    brand_id: string;
    brand_name: string;
    status: string;
    completed_at: string | null;
    has_diagnostic: boolean;
    diagnostic?: {
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
            mime_type?: string | null;
            mimeType?: string | null;
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
        // Nested objects from n8n
        social?: {
            website?: string | null;
            instagram?: string | null;
            facebook?: string | null;
            tiktok?: string | null;
            youtube?: string | null;
            whatsapp?: string | null;
            linkedin?: string | null;
        };
        branding?: {
            colors_detected?: string[];
            brand_keywords?: string[];
            typography?: string[];
            visual_style?: string[];
            palette_named?: string;
            logo_notes?: string;
        };
        positioning?: {
            slogan?: string;
            identity_message?: string;
            value_proposition?: string;
            differentiators?: string[];
            brand_personality?: string[];
            key_messages?: string[];
        };
        history?: {
            summary?: string;
            origin?: string;
            timeline?: Array<{ date: string; event: string }>;
            milestones?: string[];
        };
        audience?: {
            segments?: string[];
            demographics?: string;
            psychographics?: string;
        };
        operations?: {
            locations?: string[];
            employees?: string;
            production_capacity?: string;
            technology?: string[];
            b2b_services?: string[];
        };
        sources: any[];
        // Flat fields (for backward compatibility)
        typography?: string[];
        visual_style?: string[];
        palette_named?: string;
        logo_notes?: string;
        slogan?: string;
        identity_message?: string;
        value_proposition?: string;
        differentiators?: string[];
        brand_personality?: string[];
        key_messages?: string[];
        history_summary?: string;
        origin?: string;
        timeline?: Array<{ date: string; event: string }>;
        milestones?: string[];
        audience_segments?: string[];
        demographics?: string;
        psychographics?: string;
        locations?: string[];
        employees?: string;
        production_capacity?: string;
        technology?: string[];
        b2b_services?: string[];
        created_at: string;
    };
}


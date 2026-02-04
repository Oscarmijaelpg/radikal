// Feature Types: Radar Results - Updated for new n8n structure
// Type definitions for radar results feature

export interface RadarAnalysis {
    id?: string;
    brand_id: string;
    generated_at: string;
    radikal_ia_report: RadikalIAReport;
    raw_response?: any;
}

export interface RadikalIAReport {
    meta: {
        generated_at: string;
        has_analysis: boolean;
        competitors_detected: number;
        company_profiles_detected: number;
        market_intelligence_blocks: number;
        warnings?: Array<{
            type: string;
            keys: string[];
        }>;
    };
    analysis: {
        summary: {
            overall_status: 'por_encima' | 'por_debajo' | 'igual';
            main_competitor: string;
            key_problem: string;
            main_opportunity: string;
        };
        weekly_comparison: WeeklyComparison[];
        top_posts_analysis: TopPostsAnalysis;
        correlations: Correlation[];
        recommendations: Recommendations;
    };
    raw_competition_data: RawCompetitionData[];
    company_profiles: CompanyProfile[];
    market_intelligence: MarketIntelligence[];
}

export interface WeeklyComparison {
    week: string;
    user_posts: number;
    competitors: Array<{
        brand: string;
        posts: number;
        status_vs_user: 'usuario_por_encima' | 'usuario_por_debajo' | 'igual';
    }>;
    insight: string;
}

export interface TopPostsAnalysis {
    user: {
        average_engagement_top3: number;
        formats: string[];
        content_pattern: string;
    };
    competitors: Array<{
        brand: string;
        average_engagement_top3: number;
        content_pattern: string;
        gap_vs_user: 'alto' | 'medio' | 'bajo';
    }>;
}

export interface Correlation {
    type: string;
    finding: string;
    weeks_affected: string[];
}

export interface Recommendations {
    frequency: {
        ideal_posts_per_week: string;
        weeks_to_focus: string[];
    };
    content: string[];
    engagement: string[];
}

export interface RawCompetitionData {
    [key: string]: {
        platform?: string;
        postsPerWeekSeries?: Array<{
            label: string;
            posts: number;
        }>;
        totals?: {
            totalPosts: number;
            totalEngagement: number;
        };
        engagementRateAvg?: number | null;
        top3?: Array<{
            url: string;
            type: string;
            caption: string;
            engagement: number;
        }>;
        total_posts?: number;
        posts?: Array<{
            post_link: string;
            likes: number;
            comments: number;
        }>;
    };
}

export interface CompanyProfile {
    company_info: {
        name: string;
        industry: string;
        business_type: string;
        description: string;
        main_products_or_services: string[];
        operational_scope: string;
        official_website: string;
        key_sections_detected: string[];
    };
    relevant_links: Array<{
        title: string;
        url: string;
        category: string;
    }>;
    confidence_level: 'alta' | 'media' | 'baja';
}

export interface MarketIntelligence {
    company_user?: {
        titulo: string;
        tipo: string;
        fecha: string;
        fuente: string;
        resumen: string;
        relevancia: 'alta' | 'media' | 'baja';
    };
    row_materials?: NewsItem;
    risk?: NewsItem;
    opportunity?: NewsItem;
    regulation?: NewsItem;
    macro?: NewsItem;
    social?: NewsItem;
    media?: NewsItem;
}

export interface NewsItem {
    title: string;
    source: string;
    link: string;
    date: string;
    detected_year: number;
    date_inferred: boolean;
    type?: string;
    snippet: string;
    extracted_at: string;
}

// Legacy types for backward compatibility
export interface Competitor {
    id: string;
    name: string;
    website: string;
    instagram?: string;
    relevance_score?: number;
}

export interface InstagramData {
    [key: string]: any;
}

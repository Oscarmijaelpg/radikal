export interface ContentRecommendation {
    id: string;
    recommendation_type: string;
    title: string;
    paragraph: string;
    recommended_format: string;
    recommended_objective: string;
    recommended_idea: string;
    required_elements: string[];
    ai_brief: string;
    image_url?: string;
    status: string;
    created_at: string;
}

export interface Platform {
    name: string;
    icon: React.ReactNode;
}

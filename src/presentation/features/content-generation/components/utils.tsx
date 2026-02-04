import {
    MessageSquare,
    TrendingUp,
    Calendar,
    Radar,
    Sparkles,
} from 'lucide-react';

export const getRecommendationIcon = (type: string) => {
    switch (type) {
        case 'comentarios':
            return <MessageSquare className="w-5 h-5" />;
        case 'mejores_post':
            return <TrendingUp className="w-5 h-5" />;
        case 'proximas_fechas':
            return <Calendar className="w-5 h-5" />;
        case 'radar_tendencias':
            return <Radar className="w-5 h-5" />;
        default:
            return <Sparkles className="w-5 h-5" />;
    }
};

export const getRecommendationColor = (type: string) => {
    switch (type) {
        case 'comentarios':
            return 'border-l-primary';
        case 'mejores_post':
            return 'border-l-blue-400';
        case 'proximas_fechas':
            return 'border-l-emerald-400';
        case 'radar_tendencias':
            return 'border-l-indigo-400';
        default:
            return 'border-l-slate-400';
    }
};

export const getRecommendationLabel = (type: string) => {
    switch (type) {
        case 'comentarios':
            return 'Comentarios';
        case 'mejores_post':
            return 'Mejores Posts';
        case 'proximas_fechas':
            return 'Próximas Fechas';
        case 'radar_tendencias':
            return 'Tendencias';
        default:
            return type;
    }
};

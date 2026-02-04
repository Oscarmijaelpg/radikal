import React from 'react';
import { ContentRecommendation } from "@core/types";
import { getRecommendationIcon, getRecommendationColor, getRecommendationLabel } from './utils';

interface RecommendationCardProps {
    recommendation: ContentRecommendation;
    isSelected: boolean;
    onClick: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
    recommendation,
    isSelected,
    onClick,
}) => {
    return (
        <button
            onClick={onClick}
            className={`glass-card p-5 rounded-2xl shadow-xl border-l-4 ${getRecommendationColor(recommendation.recommendation_type)} 
        transform transition hover:scale-105 duration-300 bg-white/70 text-left
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        >
            <div className="flex items-center gap-2 mb-3">
                <div className="text-primary">
                    {getRecommendationIcon(recommendation.recommendation_type)}
                </div>
                {recommendation.image_url && (
                    <img
                        src={recommendation.image_url}
                        alt=""
                        className="w-8 h-8 rounded-lg object-cover ml-auto"
                    />
                )}
                {!recommendation.image_url && (
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 ml-auto">
                        {getRecommendationLabel(recommendation.recommendation_type)}
                    </h3>
                )}
                {recommendation.image_url && (
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 hidden">
                        {/* Ocultar texto si hay imagen para ahorrar espacio, o mostrar ambos? Mejor ambos si cabe. */}
                        {getRecommendationLabel(recommendation.recommendation_type)}
                    </h3>
                )}
            </div>
            {recommendation.image_url && (
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-1">
                    {getRecommendationLabel(recommendation.recommendation_type)}
                </h3>
            )}
            <div className="space-y-2">
                <p className="text-sm font-bold text-slate-900 line-clamp-2">{recommendation.title}</p>
                <p className="text-xs text-slate-600 line-clamp-2">{recommendation.paragraph}</p>
                <div className="flex gap-2 pt-1">
                    <span className="px-2 py-1 bg-primary/10 text-[10px] rounded-lg text-primary font-bold">
                        {recommendation.recommended_format}
                    </span>
                    <span className="px-2 py-1 bg-blue-50 text-[10px] rounded-lg text-blue-600 font-bold">
                        {recommendation.recommended_objective}
                    </span>
                </div>
            </div>
        </button>
    );
};

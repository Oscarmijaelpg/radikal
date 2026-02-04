import React from 'react';
import { Target, FileText } from 'lucide-react';
import { ContentRecommendation } from "@core/types";
import { getRecommendationIcon } from './utils';

interface SelectedCardDetailsProps {
    recommendation: ContentRecommendation;
}

export const SelectedCardDetails: React.FC<SelectedCardDetailsProps> = ({ recommendation }) => {
    return (
        <div className="bg-gradient-to-r from-primary/5 to-blue-50 p-6 rounded-2xl border border-primary/20">
            <div className="flex flex-col md:flex-row gap-6">
                {/* Text Content Column */}
                <div className="flex-1 order-2 md:order-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="text-primary">
                            {getRecommendationIcon(recommendation.recommendation_type)}
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {recommendation.title}
                        </h2>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-bold text-primary border border-primary/20">
                            <Target className="w-3 h-3" />
                            {recommendation.recommended_objective}
                        </span>
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-bold text-blue-600 border border-blue-200">
                            <FileText className="w-3 h-3" />
                            {recommendation.recommended_format}
                        </span>
                    </div>

                    <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                        {recommendation.paragraph}
                    </p>
                </div>

                {/* Image Column - Square & Aside */}
                {recommendation.image_url && (
                    <div className="w-full md:w-48 xl:w-56 shrink-0 order-1 md:order-2">
                        <div className="aspect-square rounded-xl overflow-hidden shadow-lg border border-slate-200 group relative bg-white">
                            <img
                                src={recommendation.image_url}
                                alt={recommendation.title}
                                className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <a
                                    href={recommendation.image_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white text-xs font-bold uppercase tracking-widest px-3 py-2 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/30 transition-colors border border-white/50"
                                >
                                    Ver
                                </a>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Sections */}
            <div className="mt-2 space-y-4">
                <div className="bg-white/60 p-4 rounded-xl">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Elementos necesarios:
                    </h3>
                    <ul className="space-y-1">
                        {recommendation.required_elements.map((element, idx) => (
                            <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                                <span className="text-primary mt-0.5">•</span>
                                <span>{element}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
                        💡 Idea de contenido:
                    </h3>
                    <p className="text-xs text-amber-900 italic leading-relaxed">
                        {recommendation.recommended_idea}
                    </p>
                </div>
            </div>
        </div>
    );
};

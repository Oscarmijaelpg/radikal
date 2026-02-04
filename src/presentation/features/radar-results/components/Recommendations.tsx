// Component: Recommendations
// Displays actionable recommendations from radar analysis

import React from 'react';
import { Recommendations } from '../types';
import { Calendar, FileText, Heart, CheckCircle } from 'lucide-react';

interface RecommendationsProps {
    recommendations: Recommendations;
}

export const RecommendationsComponent: React.FC<RecommendationsProps> = ({ recommendations }) => {
    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-6">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Recomendaciones Estratégicas
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    Acciones clave para mejorar tu presencia
                </p>
            </div>

            <div className="space-y-6">
                {/* Frequency Recommendations */}
                <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 rounded-2xl border border-purple-200 dark:border-purple-800">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="bg-purple-100 dark:bg-purple-900/30 p-2 rounded-lg">
                            <Calendar className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-1">
                                Frecuencia de Publicación
                            </p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white">
                                {recommendations.frequency.ideal_posts_per_week}
                            </p>
                        </div>
                    </div>

                    {recommendations.frequency.weeks_to_focus.length > 0 && (
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                                Semanas Críticas
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {recommendations.frequency.weeks_to_focus.map((week, index) => (
                                    <span
                                        key={index}
                                        className="px-3 py-1.5 bg-white dark:bg-slate-700 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300 border border-purple-200 dark:border-purple-700"
                                    >
                                        {week}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Recommendations */}
                <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="bg-blue-100 dark:bg-blue-900/30 p-2 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
                                Estrategia de Contenido
                            </p>
                        </div>
                    </div>

                    <ul className="space-y-3">
                        {recommendations.content.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Engagement Recommendations */}
                <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl border border-green-200 dark:border-green-800">
                    <div className="flex items-start gap-3 mb-4">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                            <Heart className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-green-600 dark:text-green-400">
                                Optimización de Engagement
                            </p>
                        </div>
                    </div>

                    <ul className="space-y-3">
                        {recommendations.engagement.map((item, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                                <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {item}
                                </span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

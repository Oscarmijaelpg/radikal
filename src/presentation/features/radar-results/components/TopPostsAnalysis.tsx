// Component: Top Posts Analysis
// Displays engagement analysis and content patterns

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TopPostsAnalysis } from '../types';
import { Heart, MessageCircle, TrendingUp, Video, Image as ImageIcon } from 'lucide-react';

interface TopPostsAnalysisProps {
    analysis: TopPostsAnalysis;
}

export const TopPostsAnalysisComponent: React.FC<TopPostsAnalysisProps> = ({ analysis }) => {
    // Prepare data for chart
    const chartData = [
        {
            name: 'Mi Marca',
            engagement: Math.round(analysis.user.average_engagement_top3),
        },
        ...analysis.competitors.map((comp) => ({
            name: comp.brand,
            engagement: Math.round(comp.average_engagement_top3),
        })),
    ];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-6">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Análisis de Top Posts
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    Engagement promedio de los 3 mejores posts
                </p>
            </div>

            {/* Chart */}
            <div className="mb-8" style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis dataKey="name" stroke="#94a3b8" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#fff',
                            }}
                        />
                        <Legend />
                        <Bar
                            dataKey="engagement"
                            fill="#d946ef"
                            radius={[8, 8, 0, 0]}
                            name="Engagement Promedio"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* User Analysis */}
            <div className="mb-6 p-6 bg-gradient-to-br from-primary/5 to-pink-50 dark:from-primary/10 dark:to-pink-900/10 rounded-2xl border border-primary/20">
                <div className="flex items-start gap-3 mb-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <Heart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                            Tu Rendimiento
                        </p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">
                            {Math.round(analysis.user.average_engagement_top3)} <span className="text-sm font-normal text-slate-500">eng. promedio</span>
                        </p>
                    </div>
                </div>

                <div className="space-y-3">
                    {/* Formats */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                            Formatos Exitosos
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {analysis.user.formats.map((format, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-600"
                                >
                                    {format.toLowerCase().includes('video') ? (
                                        <Video className="w-4 h-4 text-primary" />
                                    ) : (
                                        <ImageIcon className="w-4 h-4 text-primary" />
                                    )}
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                        {format}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Pattern */}
                    <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                            Patrón de Contenido
                        </p>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                            {analysis.user.content_pattern}
                        </p>
                    </div>
                </div>
            </div>

            {/* Competitors Analysis */}
            <div className="space-y-4">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Análisis de Competidores
                </p>

                {analysis.competitors.map((comp, index) => {
                    const gapColor =
                        comp.gap_vs_user === 'alto'
                            ? 'from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 border-red-200 dark:border-red-800'
                            : comp.gap_vs_user === 'medio'
                                ? 'from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border-yellow-200 dark:border-yellow-800'
                                : 'from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border-green-200 dark:border-green-800';

                    const gapIcon =
                        comp.gap_vs_user === 'alto' ? (
                            <TrendingUp className="w-5 h-5 text-red-600" />
                        ) : comp.gap_vs_user === 'medio' ? (
                            <TrendingUp className="w-5 h-5 text-yellow-600" />
                        ) : (
                            <TrendingUp className="w-5 h-5 text-green-600" />
                        );

                    return (
                        <div
                            key={index}
                            className={`p-4 rounded-xl border bg-gradient-to-br ${gapColor}`}
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">
                                        @{comp.brand}
                                    </p>
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        {Math.round(comp.average_engagement_top3)} engagement promedio
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {gapIcon}
                                    <span className="text-xs font-bold uppercase tracking-wider">
                                        Gap: {comp.gap_vs_user}
                                    </span>
                                </div>
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                {comp.content_pattern}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

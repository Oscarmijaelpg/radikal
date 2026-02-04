// Component: Weekly Comparison Chart
// Displays weekly posting activity comparison with competitors

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { WeeklyComparison } from '../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface WeeklyComparisonChartProps {
    weeklyData: WeeklyComparison[];
}

export const WeeklyComparisonChart: React.FC<WeeklyComparisonChartProps> = ({ weeklyData }) => {
    // Transform data for recharts
    const chartData = weeklyData.map((week) => {
        const dataPoint: any = {
            week: week.week.replace(/Semana \d+ \(/, '').replace(/\)/, ''),
            "Mi Marca": week.user_posts,
        };

        // Add each competitor's data
        week.competitors.forEach((comp) => {
            dataPoint[comp.brand] = comp.posts;
        });

        return dataPoint;
    });

    // Get unique competitor names for lines
    const competitorNames = Array.from(
        new Set(weeklyData.flatMap((week) => week.competitors.map((c) => c.brand)))
    );

    // Color palette
    const colors = ['#d946ef', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-6">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Comparación Semanal
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    Frecuencia de publicaciones por semana
                </p>
            </div>

            {/* Chart */}
            <div className="mb-6" style={{ height: '400px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                            dataKey="week"
                            stroke="#94a3b8"
                            style={{ fontSize: '12px' }}
                            angle={-45}
                            textAnchor="end"
                            height={100}
                        />
                        <YAxis stroke="#94a3b8" style={{ fontSize: '12px' }} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#1e293b',
                                border: 'none',
                                borderRadius: '12px',
                                color: '#fff',
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />

                        {/* User line */}
                        <Line
                            type="monotone"
                            dataKey="Mi Marca"
                            stroke="#d946ef"
                            strokeWidth={3}
                            dot={{ fill: '#d946ef', r: 6 }}
                            activeDot={{ r: 8 }}
                        />

                        {/* Competitor lines */}
                        {competitorNames.map((name, index) => (
                            <Line
                                key={name}
                                type="monotone"
                                dataKey={name}
                                stroke={colors[(index + 1) % colors.length]}
                                strokeWidth={2}
                                dot={{ fill: colors[(index + 1) % colors.length], r: 4 }}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Weekly Insights */}
            <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">
                    Insights Semanales
                </p>
                {weeklyData.map((week, index) => {
                    // Determine status
                    const userWon = week.competitors.every(c => c.status_vs_user === 'usuario_por_encima');
                    const userLost = week.competitors.some(c => c.status_vs_user === 'usuario_por_debajo');

                    return (
                        <div
                            key={index}
                            className={`p-4 rounded-xl border ${userWon
                                ? 'bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-800'
                                : userLost
                                    ? 'bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-800'
                                    : 'bg-slate-50 border-slate-200 dark:bg-slate-700/50 dark:border-slate-600'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`mt-0.5 ${userWon ? 'text-green-600' : userLost ? 'text-red-600' : 'text-slate-600'
                                    }`}>
                                    {userWon ? (
                                        <TrendingUp className="w-5 h-5" />
                                    ) : userLost ? (
                                        <TrendingDown className="w-5 h-5" />
                                    ) : (
                                        <Minus className="w-5 h-5" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                                        {week.week}
                                    </p>
                                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                        {week.insight}
                                    </p>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                                            Mi Marca: {week.user_posts} posts
                                        </span>
                                        {week.competitors.map((comp, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-full text-xs font-medium"
                                            >
                                                {comp.brand}: {comp.posts} posts
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

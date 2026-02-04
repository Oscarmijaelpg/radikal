// Component: Radar Summary
// Displays key metrics and overall status from radar analysis

import React from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Lightbulb } from 'lucide-react';
import { RadikalIAReport } from '../types';

interface RadarSummaryProps {
    report: RadikalIAReport;
}

export const RadarSummary: React.FC<RadarSummaryProps> = ({ report }) => {
    const { summary } = report.analysis;
    const { meta } = report;

    const getStatusIcon = () => {
        switch (summary.overall_status) {
            case 'por_encima':
                return <TrendingUp className="w-8 h-8 text-green-500" />;
            case 'por_debajo':
                return <TrendingDown className="w-8 h-8 text-red-500" />;
            default:
                return <Minus className="w-8 h-8 text-yellow-500" />;
        }
    };

    const getStatusColor = () => {
        switch (summary.overall_status) {
            case 'por_encima':
                return 'from-green-500 to-emerald-400';
            case 'por_debajo':
                return 'from-red-500 to-pink-400';
            default:
                return 'from-yellow-500 to-amber-400';
        }
    };

    const getStatusText = () => {
        switch (summary.overall_status) {
            case 'por_encima':
                return 'Por Encima del Mercado';
            case 'por_debajo':
                return 'Por Debajo del Mercado';
            default:
                return 'En Paridad con el Mercado';
        }
    };

    return (
        <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
                <div className={`bg-gradient-to-r ${getStatusColor()} p-6 text-white`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest opacity-90 mb-2">
                                Estado General
                            </p>
                            <h2 className="text-3xl font-black">
                                {getStatusText()}
                            </h2>
                        </div>
                        <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                            {getStatusIcon()}
                        </div>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Competitors Detected */}
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                            Competidores
                        </p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">
                            {meta.competitors_detected}
                        </p>
                    </div>

                    {/* Company Profiles */}
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                            Perfiles Analizados
                        </p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">
                            {meta.company_profiles_detected}
                        </p>
                    </div>

                    {/* Intelligence Blocks */}
                    <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
                            Inteligencia de Mercado
                        </p>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">
                            {meta.market_intelligence_blocks}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Competitor */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 p-6">
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-xl">
                        <TrendingUp className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
                            Competidor Principal
                        </p>
                        <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                            @{summary.main_competitor}
                        </p>
                    </div>
                </div>
            </div>

            {/* Problem & Opportunity */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Key Problem */}
                <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10 rounded-2xl border border-red-100 dark:border-red-800 p-6">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-lg">
                            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
                                Problema Clave
                            </p>
                        </div>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {summary.key_problem}
                    </p>
                </div>

                {/* Main Opportunity */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-2xl border border-green-100 dark:border-green-800 p-6">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-lg">
                            <Lightbulb className="w-5 h-5 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <p className="text-xs font-bold uppercase tracking-widest text-green-600 dark:text-green-400">
                                Oportunidad Principal
                            </p>
                        </div>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {summary.main_opportunity}
                    </p>
                </div>
            </div>
        </div>
    );
};

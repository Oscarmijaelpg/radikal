// Component: Resumen Tab
// Summary tab showing overview of radar analysis

import React from 'react';
import { Building2, Globe, Users, Calendar, AlertTriangle, TrendingUp, Newspaper, ArrowUpRight } from 'lucide-react';
import { RadarAnalysis, Competitor } from '../../types';
import { MetricCard } from '../cards/MetricCard';

interface ResumenTabProps {
    analysis: RadarAnalysis;
    competitors: Competitor[];
    onViewCompetitors: () => void;
}

export const ResumenTab: React.FC<ResumenTabProps> = ({ analysis, competitors, onViewCompetitors }) => {
    const hasSignals = analysis.risk_signal || analysis.opportunity_signal ||
        analysis.regulation_signal || analysis.macro_signal ||
        analysis.social_signal || analysis.media_signal;

    return (
        <div className="space-y-6">
            {/* Meta Info */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <MetricCard
                    icon={<Building2 className="w-5 h-5 text-blue-600" />}
                    label="Empresa"
                    value={analysis.company_name || 'N/A'}
                    iconBg="bg-blue-100"
                />
                <MetricCard
                    icon={<Globe className="w-5 h-5 text-emerald-600" />}
                    label="Alcance"
                    value={analysis.company_country || 'N/A'}
                    iconBg="bg-emerald-100"
                />
                <MetricCard
                    icon={<Users className="w-5 h-5 text-purple-600" />}
                    label="Competidores"
                    value={competitors.length.toString()}
                    iconBg="bg-purple-100"
                />
                <MetricCard
                    icon={<Calendar className="w-5 h-5 text-amber-600" />}
                    label="Generado"
                    value={analysis.generated_at
                        ? new Date(analysis.generated_at).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short'
                        })
                        : 'Hoy'}
                    iconBg="bg-amber-100"
                />
            </div>

            {/* Warnings */}
            {analysis.warnings && analysis.warnings.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h3 className="font-bold text-amber-900 mb-2 text-sm">Advertencias</h3>
                            <ul className="space-y-1">
                                {analysis.warnings.map((warning: string, idx: number) => (
                                    <li key={idx} className="text-sm text-amber-800">• {warning}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Latest Signal */}
            {analysis.latest_signal_title && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200/60 shadow-sm">
                    <div className="flex items-start gap-4">
                        <div className="bg-blue-500/10 p-3 rounded-xl backdrop-blur-sm">
                            <TrendingUp className="w-7 h-7 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide">
                                    Última Señal Detectada
                                </h3>
                                {analysis.latest_signal_type && (
                                    <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full font-bold">
                                        {analysis.latest_signal_type}
                                    </span>
                                )}
                            </div>
                            <p className="text-xl font-bold text-slate-900 mb-2">
                                {analysis.latest_signal_title}
                            </p>
                            <p className="text-sm text-slate-600 leading-relaxed mb-3">
                                {analysis.latest_signal_summary}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                {analysis.latest_signal_source && (
                                    <span className="flex items-center gap-1">
                                        <Newspaper className="w-3.5 h-3.5" />
                                        {analysis.latest_signal_source}
                                    </span>
                                )}
                                {analysis.latest_signal_date && (
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3.5 h-3.5" />
                                        {analysis.latest_signal_date}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Top Competitors Preview */}
            {competitors.length > 0 && (
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-slate-900">Principales Competidores</h3>
                        <button
                            onClick={onViewCompetitors}
                            className="text-sm text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                        >
                            Ver todos ({competitors.length})
                            <ArrowUpRight className="w-4 h-4" />
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {competitors.slice(0, 3).map((comp: Competitor, idx: number) => (
                            <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <h4 className="font-bold text-slate-900 mb-2">{comp.name}</h4>
                                {comp.base_domain && (
                                    <a
                                        href={comp.base_domain}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-sm text-primary hover:underline flex items-center gap-1 mb-3"
                                    >
                                        <Globe className="w-3.5 h-3.5" />
                                        Visitar sitio
                                    </a>
                                )}
                                {comp.products_sections && comp.products_sections.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5">
                                        {comp.products_sections.slice(0, 3).map((prod: any, i: number) => (
                                            <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-md">
                                                {prod.title}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

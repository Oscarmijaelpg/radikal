// Component: Market Intelligence
// Displays market opportunities, risks, regulations, and trends

import React, { useState } from 'react';
import { MarketIntelligence } from '../types';
import {
    Lightbulb,
    AlertTriangle,
    Scale,
    TrendingUp,
    Users,
    Newspaper,
    ExternalLink,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

interface MarketIntelligenceProps {
    intelligence: MarketIntelligence[];
}

export const MarketIntelligenceComponent: React.FC<MarketIntelligenceProps> = ({ intelligence }) => {
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

    const toggleSection = (section: string) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(section)) {
            newExpanded.delete(section);
        } else {
            newExpanded.add(section);
        }
        setExpandedSections(newExpanded);
    };

    // Extract all intelligence items
    const allItems = intelligence.flatMap((item: any) => {
        const items: any[] = [];

        // Estructura estándar esperada
        if (item.opportunity) items.push({ type: 'opportunity', data: item.opportunity });
        if (item.risk) items.push({ type: 'risk', data: item.risk });
        if (item.regulation) items.push({ type: 'regulation', data: item.regulation });
        if (item.macro) items.push({ type: 'macro', data: item.macro });
        if (item.social) items.push({ type: 'social', data: item.social });
        if (item.media) items.push({ type: 'media', data: item.media });
        if (item.row_materials) items.push({ type: 'row_materials', data: item.row_materials });

        // Estructura dinámica (companynames como keys)
        Object.keys(item).forEach(key => {
            const val = item[key];
            const standardKeys = ['opportunity', 'risk', 'regulation', 'macro', 'social', 'media', 'row_materials'];

            // Si no es una key estándar y parece ser un objeto de datos válido
            if (!standardKeys.includes(key) && typeof val === 'object' && val !== null && val.titulo) {
                // Mapear tipo recibido a tipo interno
                let type = 'media';
                if (val.tipo === 'riesgo') type = 'risk';
                else if (val.tipo === 'oportunidad') type = 'opportunity';
                else if (val.tipo === 'regulacion') type = 'regulation';
                else if (val.tipo === 'tendencia_social') type = 'social';

                items.push({
                    type: type,
                    data: {
                        title: val.titulo,
                        snippet: val.resumen,
                        source: val.fuente,
                        date: val.fecha,
                        link: '#', // No viene link en este formato
                        relevance: val.relevancia
                    }
                });
            }
        });

        return items;
    });

    const getTypeConfig = (type: string) => {
        switch (type) {
            case 'opportunity':
                return {
                    icon: Lightbulb,
                    label: 'Oportunidad',
                    color: 'green',
                    bgClass: 'from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10',
                    borderClass: 'border-green-200 dark:border-green-800',
                    iconBgClass: 'bg-green-100 dark:bg-green-900/30',
                    iconClass: 'text-green-600 dark:text-green-400',
                    textClass: 'text-green-600 dark:text-green-400',
                };
            case 'risk':
                return {
                    icon: AlertTriangle,
                    label: 'Riesgo',
                    color: 'red',
                    bgClass: 'from-red-50 to-pink-50 dark:from-red-900/10 dark:to-pink-900/10',
                    borderClass: 'border-red-200 dark:border-red-800',
                    iconBgClass: 'bg-red-100 dark:bg-red-900/30',
                    iconClass: 'text-red-600 dark:text-red-400',
                    textClass: 'text-red-600 dark:text-red-400',
                };
            case 'regulation':
                return {
                    icon: Scale,
                    label: 'Regulación',
                    color: 'blue',
                    bgClass: 'from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10',
                    borderClass: 'border-blue-200 dark:border-blue-800',
                    iconBgClass: 'bg-blue-100 dark:bg-blue-900/30',
                    iconClass: 'text-blue-600 dark:text-blue-400',
                    textClass: 'text-blue-600 dark:text-blue-400',
                };
            case 'macro':
                return {
                    icon: TrendingUp,
                    label: 'Tendencia Macro',
                    color: 'purple',
                    bgClass: 'from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10',
                    borderClass: 'border-purple-200 dark:border-purple-800',
                    iconBgClass: 'bg-purple-100 dark:bg-purple-900/30',
                    iconClass: 'text-purple-600 dark:text-purple-400',
                    textClass: 'text-purple-600 dark:text-purple-400',
                };
            case 'social':
                return {
                    icon: Users,
                    label: 'Tendencia Social',
                    color: 'orange',
                    bgClass: 'from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10',
                    borderClass: 'border-orange-200 dark:border-orange-800',
                    iconBgClass: 'bg-orange-100 dark:bg-orange-900/30',
                    iconClass: 'text-orange-600 dark:text-orange-400',
                    textClass: 'text-orange-600 dark:text-orange-400',
                };
            default:
                return {
                    icon: Newspaper,
                    label: 'Noticia',
                    color: 'slate',
                    bgClass: 'from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50',
                    borderClass: 'border-slate-200 dark:border-slate-700',
                    iconBgClass: 'bg-slate-100 dark:bg-slate-700',
                    iconClass: 'text-slate-600 dark:text-slate-400',
                    textClass: 'text-slate-600 dark:text-slate-400',
                };
        }
    };

    if (allItems.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-6">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Inteligencia de Mercado
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    Oportunidades, riesgos y tendencias relevantes
                </p>
            </div>

            <div className="space-y-4">
                {allItems.map((item, index) => {
                    const config = getTypeConfig(item.type);
                    const Icon = config.icon;
                    const isExpanded = expandedSections.has(`${item.type}-${index}`);

                    return (
                        <div
                            key={index}
                            className={`p-4 rounded-xl border bg-gradient-to-br ${config.bgClass} ${config.borderClass}`}
                        >
                            <div className="flex items-start gap-3">
                                <div className={`${config.iconBgClass} p-2 rounded-lg flex-shrink-0`}>
                                    <Icon className={`w-5 h-5 ${config.iconClass}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <div className="flex-1">
                                            <p className={`text-xs font-bold uppercase tracking-widest ${config.textClass} mb-1`}>
                                                {config.label}
                                            </p>
                                            <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                                                {item.data.title}
                                            </h4>
                                        </div>
                                        <button
                                            onClick={() => toggleSection(`${item.type}-${index}`)}
                                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                        >
                                            {isExpanded ? (
                                                <ChevronUp className="w-5 h-5" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
                                        <span className="font-medium">{item.data.source}</span>
                                        <span>•</span>
                                        <span>{item.data.date}</span>
                                    </div>

                                    {isExpanded && (
                                        <div className="mt-3 space-y-3">
                                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                                {item.data.snippet}
                                            </p>
                                            <a
                                                href={item.data.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                            >
                                                Leer más
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

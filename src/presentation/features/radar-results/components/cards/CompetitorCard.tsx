// Component: Competitor Card
// Displays detailed competitor information

import React from 'react';
import { Globe, ExternalLink, LinkIcon, Package, Video, ArrowUpRight } from 'lucide-react';
import { Competitor } from '../../types';

interface CompetitorCardProps {
    competitor: Competitor;
}

export const CompetitorCard: React.FC<CompetitorCardProps> = ({ competitor }) => (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{competitor.name}</h3>
                {competitor.base_domain && (
                    <a
                        href={competitor.base_domain}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1.5 mb-3"
                    >
                        <Globe className="w-4 h-4" />
                        {new URL(competitor.base_domain).hostname}
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                )}
            </div>
            {competitor.relevance_score && (
                <div className="flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xl font-bold text-primary">{competitor.relevance_score}</span>
                    </div>
                    <span className="text-xs text-slate-500 mt-1">Score</span>
                </div>
            )}
        </div>

        {/* Website Links */}
        {competitor.website_links && competitor.website_links.length > 0 && (
            <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                    <LinkIcon className="w-3.5 h-3.5" />
                    Enlaces ({competitor.website_links.length})
                </h4>
                <div className="space-y-1.5">
                    {competitor.website_links.slice(0, 4).map((link: any, i: number) => (
                        <a
                            key={i}
                            href={link.url || link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-slate-600 hover:text-primary truncate flex items-center gap-2 group"
                        >
                            <ArrowUpRight className="w-3.5 h-3.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <span className="truncate">{link.title}</span>
                        </a>
                    ))}
                </div>
            </div>
        )}

        {/* Products/Sections */}
        {competitor.products_sections && competitor.products_sections.length > 0 && (
            <div className="mb-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                    <Package className="w-3.5 h-3.5" />
                    Productos/Servicios
                </h4>
                <div className="flex flex-wrap gap-2">
                    {competitor.products_sections.map((prod: any, i: number) => (
                        <span
                            key={i}
                            className="px-3 py-1.5 bg-slate-100 text-slate-700 text-sm rounded-lg font-medium hover:bg-slate-200 transition-colors"
                        >
                            {prod.title}
                        </span>
                    ))}
                </div>
            </div>
        )}

        {/* Videos */}
        {competitor.videos && competitor.videos.length > 0 && (
            <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                    <Video className="w-3.5 h-3.5" />
                    Videos ({competitor.videos.length})
                </h4>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                    Contenido en video disponible
                </div>
            </div>
        )}
    </div>
);

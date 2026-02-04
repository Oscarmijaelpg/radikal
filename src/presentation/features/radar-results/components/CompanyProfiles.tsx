// Component: Company Profiles
// Displays detailed competitor company profiles

import React from 'react';
import { CompanyProfile } from '../types';
import { Building2, Globe, Package, MapPin, ExternalLink, CheckCircle } from 'lucide-react';

interface CompanyProfilesProps {
    profiles: CompanyProfile[];
}

export const CompanyProfilesComponent: React.FC<CompanyProfilesProps> = ({ profiles }) => {
    if (!profiles || profiles.length === 0) {
        return null;
    }

    const getConfidenceColor = (level: string) => {
        switch (level) {
            case 'alta':
                return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30';
            case 'media':
                return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30';
            default:
                return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700';
        }
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-700 p-6">
            <div className="mb-6">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    Perfiles de Competidores
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    Información detallada de empresas competidoras
                </p>
            </div>

            <div className="space-y-6">
                {profiles.map((profile, index) => (
                    <div
                        key={index}
                        className="p-6 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-700/50 dark:to-gray-700/50 rounded-2xl border border-slate-200 dark:border-slate-600"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-primary/10 p-3 rounded-xl">
                                    <Building2 className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                                        {profile.company_info.name}
                                    </h4>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">
                                        {profile.company_info.business_type} • {profile.company_info.industry}
                                    </p>
                                </div>
                            </div>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${getConfidenceColor(
                                    profile.confidence_level
                                )}`}
                            >
                                Confianza: {profile.confidence_level}
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                            {profile.company_info.description}
                        </p>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            {/* Products/Services */}
                            {profile.company_info.main_products_or_services.length > 0 && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <Package className="w-4 h-4 text-primary" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                            Productos/Servicios
                                        </p>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {profile.company_info.main_products_or_services.map((item, i) => (
                                            <span
                                                key={i}
                                                className="px-2 py-1 bg-white dark:bg-slate-600 rounded-full text-xs font-medium text-slate-700 dark:text-slate-300"
                                            >
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Operational Scope */}
                            {profile.company_info.operational_scope && (
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                            Alcance
                                        </p>
                                    </div>
                                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                                        {profile.company_info.operational_scope}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Key Sections */}
                        {profile.company_info.key_sections_detected.length > 0 && (
                            <div className="mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle className="w-4 h-4 text-primary" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                        Secciones Detectadas
                                    </p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {profile.company_info.key_sections_detected.map((section, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium capitalize"
                                        >
                                            {section}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Links */}
                        {profile.relevant_links.length > 0 && (
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Globe className="w-4 h-4 text-primary" />
                                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                                        Enlaces Relevantes
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    {profile.relevant_links.map((link, i) => (
                                        <a
                                            key={i}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors group"
                                        >
                                            <span className="flex-1 truncate">{link.title}</span>
                                            <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-600 rounded text-xs font-medium text-slate-600 dark:text-slate-300">
                                                {link.category}
                                            </span>
                                            <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

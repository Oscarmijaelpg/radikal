// Component: Positioning Section
// Displays brand positioning information with null-safe rendering

import React from 'react';
import { Target } from 'lucide-react';
import SectionCard from "@shared/components/layout/SectionCard";
import { BrandAnalysisData } from "../types";

interface PositioningSectionProps {
    data: BrandAnalysisData;
    isEditing: boolean;
    loading: boolean;
    onEdit: () => void;
    onSave: () => void;
}

export const PositioningSection: React.FC<PositioningSectionProps> = ({
    data,
    isEditing,
    loading,
    onEdit,
    onSave,
}) => {
    // Check if we have any positioning data
    const hasPositioningData = data.slogan || data.identity_message || data.value_proposition ||
        (data.differentiators && data.differentiators.length > 0) ||
        (data.brand_personality && data.brand_personality.length > 0) ||
        (data.key_messages && data.key_messages.length > 0);

    if (!hasPositioningData) {
        return null; // Don't render if no data
    }

    return (
        <SectionCard
            title="Posicionamiento"
            icon={Target}
            isEditing={isEditing}
            loading={loading}
            onEdit={onEdit}
            onSave={onSave}
            headerContent={null}
        >
            <div className="space-y-6">
                {/* Slogan */}
                {data.slogan && (
                    <div className="bg-gradient-to-r from-primary/10 to-pink-50 p-6 rounded-2xl border border-primary/20">
                        <label className="text-xs font-bold uppercase tracking-widest text-primary mb-2 block">
                            Slogan
                        </label>
                        <p className="text-2xl font-bold text-slate-900 italic">
                            "{data.slogan}"
                        </p>
                    </div>
                )}

                {/* Identity Message */}
                {data.identity_message && (
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                            Mensaje de Identidad
                        </label>
                        <p className="text-lg text-slate-700 leading-relaxed">
                            {data.identity_message}
                        </p>
                    </div>
                )}

                {/* Value Proposition */}
                {data.value_proposition && (
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                            Propuesta de Valor
                        </label>
                        <p className="text-base text-slate-600 leading-relaxed">
                            {data.value_proposition}
                        </p>
                    </div>
                )}

                {/* Differentiators */}
                {data.differentiators && data.differentiators.length > 0 && (
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">
                            Diferenciadores
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {data.differentiators.map((diff, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200"
                                >
                                    {diff}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Brand Personality */}
                {data.brand_personality && data.brand_personality.length > 0 && (
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">
                            Personalidad de Marca
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {data.brand_personality.map((trait, index) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium border border-purple-200"
                                >
                                    {trait}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Key Messages */}
                {data.key_messages && data.key_messages.length > 0 && (
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">
                            Mensajes Clave
                        </label>
                        <ul className="space-y-2">
                            {data.key_messages.map((message, index) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100"
                                >
                                    <span className="flex-shrink-0 w-6 h-6 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-bold">
                                        {index + 1}
                                    </span>
                                    <span className="text-slate-700 leading-relaxed">
                                        {message}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </SectionCard>
    );
};

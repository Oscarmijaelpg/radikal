// Component: Audience Section
// Displays target audience information

import React from 'react';
import { Users } from 'lucide-react';
import SectionCard from "@shared/components/layout/SectionCard";
import { BrandAnalysisData } from "../types";

interface AudienceSectionProps {
    data: BrandAnalysisData;
    isEditing: boolean;
    loading: boolean;
    onEdit: () => void;
    onSave: () => void;
}

export const AudienceSection: React.FC<AudienceSectionProps> = ({
    data,
    isEditing,
    loading,
    onEdit,
    onSave,
}) => {
    // Check if we have any audience data
    const hasAudienceData = (data.audience_segments && data.audience_segments.length > 0) ||
        data.demographics || data.psychographics;

    if (!hasAudienceData) {
        return null; // Don't render if no data
    }

    return (
        <SectionCard
            title="Audiencia"
            icon={Users}
            isEditing={isEditing}
            loading={loading}
            onEdit={onEdit}
            onSave={onSave}
            headerContent={null}
        >
            <div className="space-y-6">
                {/* Segments */}
                {data.audience_segments && data.audience_segments.length > 0 && (
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">
                            Segmentos
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {data.audience_segments.map((segment: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200"
                                >
                                    {segment}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Demographics */}
                {data.demographics && (
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                            Demografía
                        </label>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                            {data.demographics}
                        </p>
                    </div>
                )}

                {/* Psychographics */}
                {data.psychographics && (
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                            Psicografía
                        </label>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-line">
                            {data.psychographics}
                        </p>
                    </div>
                )}
            </div>
        </SectionCard>
    );
};

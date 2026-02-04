// Component: History Section
// Displays brand history with timeline and milestones

import React from 'react';
import { Clock } from 'lucide-react';
import SectionCard from "@shared/components/layout/SectionCard";
import { BrandAnalysisData } from "../types";

interface HistorySectionProps {
    data: BrandAnalysisData;
    isEditing: boolean;
    loading: boolean;
    onEdit: () => void;
    onSave: () => void;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
    data,
    isEditing,
    loading,
    onEdit,
    onSave,
}) => {
    // Check if we have any history data
    const hasHistoryData = data.history_summary || data.origin ||
        (data.timeline && data.timeline.length > 0) ||
        (data.milestones && data.milestones.length > 0);

    if (!hasHistoryData) {
        return null; // Don't render if no data
    }

    return (
        <SectionCard
            title="Historia"
            icon={Clock}
            isEditing={isEditing}
            loading={loading}
            onEdit={onEdit}
            onSave={onSave}
            headerContent={null}
        >
            <div className="space-y-6">
                {/* Origin */}
                {data.origin && (
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                            Origen
                        </label>
                        <p className="text-lg font-semibold text-slate-900">
                            📍 {data.origin}
                        </p>
                    </div>
                )}

                {/* Summary */}
                {data.history_summary && (
                    <div className="prose max-w-none">
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                            Resumen
                        </label>
                        <p className="text-slate-600 leading-relaxed text-base bg-white/50 p-4 rounded-2xl border border-transparent">
                            {data.history_summary}
                        </p>
                    </div>
                )}

                {/* Timeline */}
                {data.timeline && data.timeline.length > 0 && (
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 block">
                            Línea de Tiempo
                        </label>
                        <div className="relative space-y-4 pl-8 border-l-2 border-primary/30">
                            {data.timeline.map((event: any, index: number) => (
                                <div key={index} className="relative">
                                    {/* Timeline dot */}
                                    <div className="absolute -left-[33px] w-4 h-4 bg-primary rounded-full border-4 border-white shadow-md"></div>

                                    <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold">
                                                {event.date}
                                            </span>
                                        </div>
                                        <p className="text-slate-700 leading-relaxed">
                                            {event.event}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Milestones */}
                {data.milestones && data.milestones.length > 0 && (
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">
                            Hitos Importantes
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {data.milestones.map((milestone: string, index: number) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-4 bg-gradient-to-br from-primary/5 to-pink-50 rounded-xl border border-primary/10"
                                >
                                    <span className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs font-bold">
                                        ✓
                                    </span>
                                    <span className="text-slate-700 text-sm leading-relaxed">
                                        {milestone}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </SectionCard>
    );
};

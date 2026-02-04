// Component: Operations Section
// Displays operational information

import React from 'react';
import { Building2 } from 'lucide-react';
import SectionCard from "@shared/components/layout/SectionCard";
import { BrandAnalysisData } from "../types";

interface OperationsSectionProps {
    data: BrandAnalysisData;
    isEditing: boolean;
    loading: boolean;
    onEdit: () => void;
    onSave: () => void;
}

export const OperationsSection: React.FC<OperationsSectionProps> = ({
    data,
    isEditing,
    loading,
    onEdit,
    onSave,
}) => {
    // Check if we have any operations data
    const hasOperationsData = (data.locations && data.locations.length > 0) ||
        data.employees || data.production_capacity ||
        (data.technology && data.technology.length > 0) ||
        (data.b2b_services && data.b2b_services.length > 0);

    if (!hasOperationsData) {
        return null; // Don't render if no data
    }

    return (
        <SectionCard
            title="Operaciones"
            icon={Building2}
            isEditing={isEditing}
            loading={loading}
            onEdit={onEdit}
            onSave={onSave}
            headerContent={null}
        >
            <div className="space-y-6">
                {/* Locations */}
                {data.locations && data.locations.length > 0 && (
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">
                            Ubicaciones
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {data.locations.map((location: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200 flex items-center gap-2"
                                >
                                    📍 {location}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Employees */}
                    {data.employees && (
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-5 rounded-2xl border border-purple-100">
                            <label className="text-xs font-bold uppercase tracking-widest text-purple-600 mb-2 block">
                                Empleados
                            </label>
                            <p className="text-2xl font-bold text-purple-900">
                                {data.employees}
                            </p>
                        </div>
                    )}

                    {/* Production Capacity */}
                    {data.production_capacity && (
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-100">
                            <label className="text-xs font-bold uppercase tracking-widest text-green-600 mb-2 block">
                                Capacidad de Producción
                            </label>
                            <p className="text-2xl font-bold text-green-900">
                                {data.production_capacity}
                            </p>
                        </div>
                    )}
                </div>

                {/* Technology */}
                {data.technology && data.technology.length > 0 && (
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">
                            Tecnología
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {data.technology.map((tech: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-200"
                                >
                                    ⚙️ {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* B2B Services */}
                {data.b2b_services && data.b2b_services.length > 0 && (
                    <div>
                        <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3 block">
                            Servicios B2B
                        </label>
                        <ul className="space-y-2">
                            {data.b2b_services.map((service: string, index: number) => (
                                <li
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-white rounded-xl border border-slate-100"
                                >
                                    <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-bold">
                                        B
                                    </span>
                                    <span className="text-slate-700 leading-relaxed">
                                        {service}
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

// Component: Competidores Tab
// Competitors tab showing all detected competitors

import React from 'react';
import { Users } from 'lucide-react';
import { Competitor } from '../../types';
import { CompetitorCard } from '../cards/CompetitorCard';

interface CompetidoresTabProps {
    competitors: Competitor[];
}

export const CompetidoresTab: React.FC<CompetidoresTabProps> = ({ competitors }) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">
                        Competidores Detectados
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">
                        {competitors.length} competidores identificados en tu mercado
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {competitors.map((comp: Competitor, idx: number) => (
                    <CompetitorCard key={idx} competitor={comp} />
                ))}
            </div>

            {competitors.length === 0 && (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                    <Users className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500 font-medium">No se detectaron competidores</p>
                </div>
            )}
        </div>
    );
};

// Component: Senales Tab
// Signals tab showing market signals

import React from 'react';
import { Newspaper, AlertTriangle, TrendingUp, Shield, DollarSign, Hash } from 'lucide-react';
import { RadarAnalysis } from '../../types';
import { SignalCard } from '../cards/SignalCard';

interface SenalesTabProps {
    analysis: RadarAnalysis;
}

export const SenalesTab: React.FC<SenalesTabProps> = ({ analysis }) => {
    const hasSignals = analysis.risk_signal || analysis.opportunity_signal ||
        analysis.regulation_signal || analysis.macro_signal ||
        analysis.social_signal || analysis.media_signal;

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Señales del Mercado</h2>
                <p className="text-sm text-slate-500">
                    Tendencias, riesgos y oportunidades detectadas para tu industria
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
                {analysis.risk_signal && (
                    <SignalCard
                        title="⚠️ Riesgo"
                        icon={<AlertTriangle className="w-6 h-6" />}
                        color="red"
                        signal={analysis.risk_signal}
                    />
                )}

                {analysis.opportunity_signal && (
                    <SignalCard
                        title="✨ Oportunidad"
                        icon={<TrendingUp className="w-6 h-6" />}
                        color="green"
                        signal={analysis.opportunity_signal}
                    />
                )}

                {analysis.regulation_signal && (
                    <SignalCard
                        title="📋 Regulación"
                        icon={<Shield className="w-6 h-6" />}
                        color="blue"
                        signal={analysis.regulation_signal}
                    />
                )}

                {analysis.macro_signal && (
                    <SignalCard
                        title="💰 Macro Económico"
                        icon={<DollarSign className="w-6 h-6" />}
                        color="purple"
                        signal={analysis.macro_signal}
                    />
                )}

                {analysis.social_signal && (
                    <SignalCard
                        title="💬 Social"
                        icon={<Hash className="w-6 h-6" />}
                        color="pink"
                        signal={analysis.social_signal}
                    />
                )}

                {analysis.media_signal && (
                    <SignalCard
                        title="📰 Medios"
                        icon={<Newspaper className="w-6 h-6" />}
                        color="amber"
                        signal={analysis.media_signal}
                    />
                )}
            </div>

            {!hasSignals && (
                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                    <Newspaper className="w-16 h-16 mx-auto mb-4 text-slate-300" />
                    <p className="text-slate-500 font-medium">No hay señales disponibles</p>
                </div>
            )}
        </div>
    );
};

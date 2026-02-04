// Shared Component: Metric Card
// Reusable card for displaying metrics

import React from 'react';

interface MetricCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    iconBg: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({ icon, label, value, iconBg }) => (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
            <div className={`${iconBg} p-2.5 rounded-lg`}>
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 font-medium mb-0.5">{label}</p>
                <p className="text-lg font-bold text-slate-900 truncate">{value}</p>
            </div>
        </div>
    </div>
);

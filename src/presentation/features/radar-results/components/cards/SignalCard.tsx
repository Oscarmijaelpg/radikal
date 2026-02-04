// Component: Signal Card
// Displays market signal information

import React from 'react';
import { Newspaper, Calendar, ExternalLink } from 'lucide-react';
import { Signal } from '../../types';

interface SignalCardProps {
    title: string;
    icon: React.ReactNode;
    color: string;
    signal: Signal;
}

export const SignalCard: React.FC<SignalCardProps> = ({ title, icon, color, signal }) => {
    const colorClasses = {
        red: 'bg-red-50 border-red-200',
        green: 'bg-emerald-50 border-emerald-200',
        blue: 'bg-blue-50 border-blue-200',
        purple: 'bg-purple-50 border-purple-200',
        pink: 'bg-pink-50 border-pink-200',
        amber: 'bg-amber-50 border-amber-200',
    };

    const iconColorClasses = {
        red: 'bg-red-100 text-red-600',
        green: 'bg-emerald-100 text-emerald-600',
        blue: 'bg-blue-100 text-blue-600',
        purple: 'bg-purple-100 text-purple-600',
        pink: 'bg-pink-100 text-pink-600',
        amber: 'bg-amber-100 text-amber-600',
    };

    return (
        <div className={`rounded-2xl p-6 border-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
            <div className="flex items-start gap-4 mb-4">
                <div className={`p-3 rounded-xl ${iconColorClasses[color as keyof typeof iconColorClasses]}`}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
                    {signal.title && (
                        <p className="text-base font-bold text-slate-800 mb-2">{signal.title}</p>
                    )}
                </div>
            </div>

            {signal.snippet && (
                <p className="text-sm text-slate-700 leading-relaxed mb-4 pl-16">
                    {signal.snippet}
                </p>
            )}

            <div className="flex items-center gap-4 text-xs text-slate-600 pl-16">
                {signal.source && (
                    <span className="flex items-center gap-1.5">
                        <Newspaper className="w-4 h-4" />
                        {signal.source}
                    </span>
                )}
                {signal.date && (
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {signal.date}
                    </span>
                )}
            </div>

            {signal.link && (
                <div className="mt-4 pl-16">
                    <a
                        href={signal.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 group"
                    >
                        Leer más
                        <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </a>
                </div>
            )}
        </div>
    );
};

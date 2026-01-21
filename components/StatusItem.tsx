import React from 'react';
import { Check } from 'lucide-react';

interface StatusItemProps {
    title: string;
    subtitle: string;
    status: 'pending' | 'active' | 'completed';
    icon: any;
}

const StatusItem: React.FC<StatusItemProps> = ({ title, subtitle, status, icon: Icon }) => {
    const getStyles = () => {
        switch (status) {
            case 'completed': return 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-800/30';
            case 'active': return 'bg-white dark:bg-slate-800 border-primary shadow-lg shadow-primary/5 scale-[1.02]';
            case 'pending': return 'bg-slate-50 dark:bg-slate-800/30 border-transparent opacity-60';
        }
    }

    const getIconStyles = () => {
        switch (status) {
            case 'completed': return 'bg-emerald-500 text-white';
            case 'active': return 'bg-primary text-white animate-pulse-slow';
            case 'pending': return 'bg-slate-200 dark:bg-slate-700 text-slate-400';
        }
    }

    return (
        <div className={`flex items-center gap-5 p-5 rounded-2xl border-2 transition-all duration-300 ${getStyles()}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md transition-colors duration-300 ${getIconStyles()}`}>
                {status === 'completed' ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
            </div>
            <div className="flex-1">
                <h4 className={`font-bold text-base mb-0.5 ${status === 'active' ? 'text-primary' : 'text-slate-900 dark:text-white'}`}>
                    {title}
                </h4>
                <p className="text-sm text-slate-500 font-medium leading-tight">
                    {subtitle}
                </p>
            </div>
            {status === 'active' && (
                <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            )}
        </div>
    )
}

export default StatusItem;

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
    icon?: LucideIcon;
    message: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, message }) => {
    return (
        <div className="text-center py-8 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
            {Icon && (
                <div className="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Icon className="w-6 h-6" />
                </div>
            )}
            <p className="text-slate-400 text-sm italic">{message}</p>
        </div>
    );
};

export default EmptyState;

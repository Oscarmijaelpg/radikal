// Component: Tab Button
// Reusable tab button component

import React from 'react';

interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
    badge?: number;
}

export const TabButton: React.FC<TabButtonProps> = ({ active, onClick, icon, label, badge }) => (
    <button
        onClick={onClick}
        className={`px-5 py-3.5 text-sm font-bold whitespace-nowrap transition-all flex items-center gap-2 relative ${active
                ? 'text-primary border-b-2 border-primary'
                : 'text-slate-500 hover:text-slate-800 border-b-2 border-transparent'
            }`}
    >
        {icon}
        {label}
        {badge !== undefined && badge > 0 && (
            <span className="ml-1 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                {badge}
            </span>
        )}
    </button>
);

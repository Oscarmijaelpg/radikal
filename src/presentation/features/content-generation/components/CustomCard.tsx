import React from 'react';
import { Edit3 } from 'lucide-react';

interface CustomCardProps {
    isSelected: boolean;
    onClick: () => void;
}

export const CustomCard: React.FC<CustomCardProps> = ({ isSelected, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`glass-card p-5 rounded-2xl shadow-xl border-l-4 border-l-amber-400
        transform transition hover:scale-105 duration-300 bg-white/70 text-left
        ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}`}
        >
            <div className="flex items-center gap-2 mb-3">
                <Edit3 className="text-amber-400 w-5 h-5" />
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                    Personalizado
                </h3>
            </div>
            <div className="space-y-2">
                <p className="text-sm font-bold text-slate-900">Crea tu propio contenido</p>
                <p className="text-xs text-slate-600">Escribe un prompt personalizado y genera contenido único.</p>
            </div>
        </button>
    );
};

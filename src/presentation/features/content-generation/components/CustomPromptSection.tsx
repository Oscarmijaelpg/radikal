import React from 'react';
import { Edit3 } from 'lucide-react';

interface CustomPromptSectionProps {
    value: string;
    onChange: (value: string) => void;
}

export const CustomPromptSection: React.FC<CustomPromptSectionProps> = ({ value, onChange }) => {
    return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
            <div className="flex items-center gap-3 mb-4">
                <Edit3 className="text-amber-500 w-6 h-6" />
                <h2 className="text-xl font-bold text-slate-900">
                    Contenido Personalizado
                </h2>
            </div>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Describe el contenido que quieres generar..."
                className="w-full h-32 p-4 bg-white border border-amber-200 rounded-xl resize-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm"
            />
        </div>
    );
};

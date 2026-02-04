import React from 'react';
import { Edit2, Save, LucideIcon } from 'lucide-react';

interface SectionCardProps {
    title: string;
    icon: LucideIcon;
    isEditing: boolean;
    onEdit: () => void;
    onSave: () => void;
    loading?: boolean;
    children: React.ReactNode;
    headerContent?: React.ReactNode;
}

const SectionCard: React.FC<SectionCardProps> = ({
    title,
    icon: Icon,
    isEditing,
    onEdit,
    onSave,
    loading = false,
    children,
    headerContent
}) => {
    return (
        <div className="glass-card p-8 rounded-3xl shadow-sm border border-slate-200 bg-white/70 relative group transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                    <Icon className="text-primary w-5 h-5" />
                    <h2 className="text-xl font-bold text-slate-900">{title}</h2>
                </div>

                <div className="flex items-center gap-4">
                    {headerContent}
                    <button
                        onClick={isEditing ? onSave : onEdit}
                        disabled={loading}
                        className={`p-2 rounded-lg transition-all duration-200 flex items-center gap-2 
              ${isEditing
                                ? 'bg-primary text-white hover:bg-primary/90 shadow-sm'
                                : 'text-slate-400 hover:text-primary hover:bg-primary/5'
                            } ${loading ? 'opacity-70 cursor-wait' : ''}`}
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white/50 border-t-white rounded-full animate-spin" />
                        ) : (
                            isEditing ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />
                        )}
                        {isEditing && (
                            <span className="text-sm font-semibold uppercase tracking-wider">
                                {loading ? 'Guardando...' : 'Guardar'}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            <div className="animate-in fade-in duration-300">
                {children}
            </div>
        </div>
    );
};

export default SectionCard;

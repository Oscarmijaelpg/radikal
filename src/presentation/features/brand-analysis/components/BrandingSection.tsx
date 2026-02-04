// Component: Branding Section
// Displays and edits brand colors and keywords

import React from 'react';
import { Palette } from 'lucide-react';
import SectionCard from "@shared/components/layout/SectionCard";
import ColorPicker from "@shared/components/forms/ColorPicker";
import TagInput from "@shared/components/forms/TagInput";

interface BrandingSectionProps {
    colors: string[];
    brandKeywords: string[];
    isEditing: boolean;
    loading: boolean;
    onEdit: () => void;
    onSave: () => void;
    onColorsChange: (colors: string[]) => void;
    onAddKeyword: (keyword: string) => void;
    onRemoveKeyword: (keyword: string) => void;
}

export const BrandingSection: React.FC<BrandingSectionProps> = ({
    colors,
    brandKeywords,
    isEditing,
    loading,
    onEdit,
    onSave,
    onColorsChange,
    onAddKeyword,
    onRemoveKeyword,
}) => {
    return (
        <SectionCard
            title="Identidad de Marca"
            icon={Palette}
            isEditing={isEditing}
            loading={loading}
            onEdit={onEdit}
            onSave={onSave}
        >
            <div className="space-y-8">
                {/* Color Palette */}
                <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                        Paleta de Colores
                    </p>
                    <ColorPicker
                        colors={colors}
                        onChange={onColorsChange}
                        isEditing={isEditing}
                    />
                </div>

                {/* Brand Keywords */}
                <div className="pt-6 border-t border-slate-100">
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                        Palabras Clave
                    </p>
                    {isEditing ? (
                        <TagInput
                            tags={brandKeywords}
                            onAdd={onAddKeyword}
                            onRemove={onRemoveKeyword}
                            placeholder="Nueva palabra clave..."
                            title="Keywords"
                        />
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {brandKeywords.length > 0 ? (
                                brandKeywords.map(kw => (
                                    <span
                                        key={kw}
                                        className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm"
                                    >
                                        {kw}
                                    </span>
                                ))
                            ) : (
                                <p className="text-slate-400 italic">No se detectaron palabras clave</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </SectionCard>
    );
};

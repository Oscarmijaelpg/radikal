// Component: SEO Section
// Displays and edits SEO keywords

import React from 'react';
import { Search } from 'lucide-react';
import SectionCard from "@shared/components/layout/SectionCard";
import TagInput from "@shared/components/forms/TagInput";

interface SEOSectionProps {
    seoKeywords: string[];
    isEditing: boolean;
    loading: boolean;
    onEdit: () => void;
    onSave: () => void;
    onAddKeyword: (keyword: string) => void;
    onRemoveKeyword: (keyword: string) => void;
}

export const SEOSection: React.FC<SEOSectionProps> = ({
    seoKeywords,
    isEditing,
    loading,
    onEdit,
    onSave,
    onAddKeyword,
    onRemoveKeyword,
}) => {
    return (
        <SectionCard
            title="Estrategia SEO"
            icon={Search}
            isEditing={isEditing}
            loading={loading}
            onEdit={onEdit}
            onSave={onSave}
        >
            {isEditing ? (
                <TagInput
                    tags={seoKeywords}
                    onAdd={onAddKeyword}
                    onRemove={onRemoveKeyword}
                    placeholder="Añadir palabra SEO..."
                    title="SEO Keywords"
                />
            ) : (
                <div className="flex flex-wrap gap-2">
                    {seoKeywords.length > 0 ? (
                        seoKeywords.map((word) => (
                            <span
                                key={word}
                                className="px-3 py-1.5 bg-primary/5 text-primary border border-primary/20 rounded-lg text-xs font-semibold"
                            >
                                {word}
                            </span>
                        ))
                    ) : (
                        <p className="text-slate-400 italic">No se detectaron palabras SEO</p>
                    )}
                </div>
            )}
        </SectionCard>
    );
};

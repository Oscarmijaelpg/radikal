// Component: Products Section
// Displays and edits detected products

import React from 'react';
import { LayoutGrid } from 'lucide-react';
import SectionCard from "@shared/components/layout/SectionCard";
import TagInput from "@shared/components/forms/TagInput";

interface ProductsSectionProps {
    productTags: string[];
    isEditing: boolean;
    loading: boolean;
    onEdit: () => void;
    onSave: () => void;
    onAddTag: (tag: string) => void;
    onRemoveTag: (tag: string) => void;
}

export const ProductsSection: React.FC<ProductsSectionProps> = ({
    productTags,
    isEditing,
    loading,
    onEdit,
    onSave,
    onAddTag,
    onRemoveTag,
}) => {
    return (
        <SectionCard
            title="Productos Detectados"
            icon={LayoutGrid}
            isEditing={isEditing}
            loading={loading}
            onEdit={onEdit}
            onSave={onSave}
        >
            {isEditing ? (
                <TagInput
                    tags={productTags}
                    onAdd={onAddTag}
                    onRemove={onRemoveTag}
                    placeholder="Añadir producto..."
                    title='Productos'
                />
            ) : (
                <div className="flex flex-wrap gap-2">
                    {productTags.length > 0 ? (
                        productTags.map((tag, idx) => (
                            <span
                                key={idx}
                                className="px-4 py-2 bg-slate-100 rounded-full text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors cursor-default"
                            >
                                {tag}
                            </span>
                        ))
                    ) : (
                        <p className="text-slate-400 italic">No se detectaron productos</p>
                    )}
                </div>
            )}
        </SectionCard>
    );
};

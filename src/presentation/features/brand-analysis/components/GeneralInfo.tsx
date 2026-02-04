// Component: General Info Section
// Displays and edits brand name, description, logo, and social links

import React from 'react';
import { FileText } from 'lucide-react';
import SectionCard from "@shared/components/layout/SectionCard";
import LogoEditor from "@shared/components/editors/LogoEditor";
import SocialLinks from "@shared/components/forms/SocialLinks";
import { BrandAnalysisData } from "../types";

interface GeneralInfoProps {
    data: BrandAnalysisData;
    isEditing: boolean;
    loading: boolean;
    socialErrors: { [key: string]: string };
    onEdit: () => void;
    onSave: () => void;
    onBrandNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onLogoChange: (file: File) => void;
    onLogoRemove: () => void;
    onSocialChange: (key: string, value: string) => void;
}

export const GeneralInfo: React.FC<GeneralInfoProps> = ({
    data,
    isEditing,
    loading,
    socialErrors,
    onEdit,
    onSave,
    onBrandNameChange,
    onDescriptionChange,
    onLogoChange,
    onLogoRemove,
    onSocialChange,
}) => {
    return (
        <SectionCard
            title="Información General"
            icon={FileText}
            isEditing={isEditing}
            loading={loading}
            onEdit={onEdit}
            onSave={onSave}
            headerContent={null}
        >
            <div className="space-y-6">
                {/* Brand Name */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                        Nombre de la Marca
                    </label>
                    {isEditing ? (
                        <input
                            type="text"
                            value={data.brandName}
                            onChange={(e) => onBrandNameChange(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Nombre de tu marca"
                        />
                    ) : (
                        <h3 className="text-2xl font-bold text-slate-900">{data.brandName}</h3>
                    )}
                </div>

                {/* Description */}
                <div className="prose max-w-none">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">
                        Descripción
                    </label>
                    {isEditing ? (
                        <textarea
                            value={data.description}
                            onChange={(e) => onDescriptionChange(e.target.value)}
                            rows={5}
                            className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none leading-relaxed text-base"
                            placeholder="Describe tu marca..."
                        />
                    ) : (
                        <p className="text-slate-600 leading-relaxed text-lg bg-white/50 p-4 rounded-2xl border border-transparent">
                            {data.description}
                        </p>
                    )}
                </div>
            </div>

            {/* Logo Section */}
            <div className="pt-6 border-t border-slate-100">
                <LogoEditor
                    logoUrl={data.logo.url}
                    base64={data.logo.base64}
                    isEditing={isEditing}
                    onLogoChange={onLogoChange}
                    onRemove={onLogoRemove}
                />
            </div>

            {/* Social Links Section */}
            <div className="pt-6 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">
                    Redes Sociales
                </p>
                <SocialLinks
                    socials={data.socials}
                    onChange={onSocialChange}
                    isEditing={isEditing}
                    errors={socialErrors}
                />
            </div>
        </SectionCard>
    );
};

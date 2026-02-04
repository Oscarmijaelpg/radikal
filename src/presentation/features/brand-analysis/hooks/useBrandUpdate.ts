// Custom Hook: Brand Update Operations
// Handles saving brand analysis changes

import { useState } from 'react';
import { supabase } from "@infrastructure/api/supabase";
import { BrandAnalysisData } from "../types";
import { toast } from 'sonner';

export const useBrandUpdate = (brandId: string | null) => {
    const [loadingSection, setLoadingSection] = useState<{ [key: string]: boolean }>({});

    const hasChanges = (
        section: string,
        currentData: BrandAnalysisData,
        originalData: BrandAnalysisData | null
    ): boolean => {
        if (!originalData) return false;

        switch (section) {
            case 'description':
                return currentData.brandName !== originalData.brandName ||
                    currentData.description !== originalData.description ||
                    JSON.stringify(currentData.socials) !== JSON.stringify(originalData.socials) ||
                    currentData.logo.base64 !== originalData.logo.base64 ||
                    currentData.logo.url !== originalData.logo.url;
            case 'products':
                return JSON.stringify(currentData.productTags) !== JSON.stringify(originalData.productTags);
            case 'branding':
                return JSON.stringify(currentData.colors) !== JSON.stringify(originalData.colors) ||
                    JSON.stringify(currentData.brandKeywords) !== JSON.stringify(originalData.brandKeywords);
            case 'seo':
                return JSON.stringify(currentData.seoKeywords) !== JSON.stringify(originalData.seoKeywords);
            default:
                return false;
        }
    };

    const validateSocials = (socials: BrandAnalysisData['socials']): { [key: string]: string } => {
        const errors: { [key: string]: string } = {};
        const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

        Object.entries(socials).forEach(([key, value]) => {
            if (value && !urlPattern.test(value)) {
                errors[key] = 'URL inválida';
            }
        });

        return errors;
    };

    const save = async (
        section: string,
        currentData: BrandAnalysisData,
        originalData: BrandAnalysisData | null,
        onSuccess: (updatedData: BrandAnalysisData) => void
    ): Promise<boolean> => {
        if (!brandId) {
            toast.error('No se encontró el ID de la marca');
            return false;
        }

        if (!hasChanges(section, currentData, originalData)) {
            toast.info("No hay cambios para guardar.");
            return true;
        }

        // Validation
        if (section === 'description') {
            if (!currentData.brandName.trim()) {
                toast.error("El nombre de la marca es obligatorio");
                return false;
            }
            const socialErrors = validateSocials(currentData.socials);
            if (Object.keys(socialErrors).length > 0) {
                toast.error("Por favor corrige los errores en las redes sociales");
                return false;
            }
        }

        setLoadingSection(prev => ({ ...prev, [section]: true }));

        try {
            // 1. Update 'brands' table for basic info
            if (section === 'description') {
                const { error: brandError } = await supabase
                    .from('brands')
                    .update({
                        name: currentData.brandName,
                        description: currentData.description,
                        logo_base64: currentData.logo.base64,
                        logo_url: currentData.logo.url,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', brandId);

                if (brandError) throw brandError;
            }

            // 2. Prepare diagnostic update
            const diagnosticUpdate: any = {
                brand_id: brandId,
                updated_at: new Date().toISOString()
            };

            if (section === 'description') {
                diagnosticUpdate.brand_name = currentData.brandName;
                diagnosticUpdate.description = currentData.description;
                diagnosticUpdate.social_media_detected = currentData.socials;
                diagnosticUpdate.logo_base64 = currentData.logo.base64;
                diagnosticUpdate.logo_url = currentData.logo.url;
            }

            if (section === 'products') {
                diagnosticUpdate.products_detected = currentData.productTags;
            }

            if (section === 'branding') {
                diagnosticUpdate.colors_detected = currentData.colors.map(c => ({ hex: c, name: '' }));
                diagnosticUpdate.brand_keywords = currentData.brandKeywords;
            }

            if (section === 'seo') {
                diagnosticUpdate.seo_keywords = currentData.seoKeywords;
            }

            // 3. UPSERT to initial_diagnostics
            const { error: diagError } = await supabase
                .from('initial_diagnostics')
                .upsert(diagnosticUpdate, {
                    onConflict: 'brand_id'
                });

            if (diagError) throw diagError;

            toast.success("Cambios guardados correctamente");
            onSuccess(currentData);
            return true;

        } catch (err: any) {
            console.error("Error saving:", err);
            toast.error("Error al guardar: " + (err.message || 'Error desconocido'));
            return false;
        } finally {
            setLoadingSection(prev => ({ ...prev, [section]: false }));
        }
    };

    return { save, loadingSection, hasChanges, validateSocials };
};

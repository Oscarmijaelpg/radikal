// Custom Hook: Brand Analysis Data Fetching
// Handles fetching and managing brand analysis data

import { useState, useEffect } from 'react';
import { supabase } from "@infrastructure/api/supabase";
import { BrandAnalysisData, DiagnosticResponse } from "../types";
import { toast } from 'sonner';

export const useBrandAnalysis = (brandId: string | null) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<BrandAnalysisData | null>(null);
    const [originalState, setOriginalState] = useState<BrandAnalysisData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            let currentBrandId = brandId;

            try {
                // 1. Si no se proporcionó brandId, intentar obtenerlo del usuario actual
                if (!currentBrandId) {
                    const { data: { user }, error: userError } = await supabase.auth.getUser();
                    if (userError || !user) {
                        throw new Error('Usuario no autenticado');
                    }

                    const { data: brandData, error: brandError } = await supabase
                        .from('brands')
                        .select('id')
                        .eq('user_id', user.id)
                        .maybeSingle(); // Usar maybeSingle para evitar error si no existe
                    if (brandError) throw brandError;

                    if (!brandData) {
                        // Usuario no tiene marca aún
                        setIsLoading(false);
                        return;
                    }

                    currentBrandId = brandData.id;
                }

                if (!currentBrandId) {
                    // Si falló todo intento de obtener ID
                    throw new Error('No se pudo identificar la marca');
                }

                // 2. Teniendo el ID, invocar la Edge Function
                const { data: response, error: fetchError } = await supabase.functions.invoke(
                    `get-diagnostic?brand_id=${currentBrandId}`,
                    { method: 'GET' }
                );

                if (fetchError) throw fetchError;
                if (!response) throw new Error('No se recibieron datos del diagnóstico');

                const diagnosticData = response as DiagnosticResponse;

                if (diagnosticData.has_diagnostic && diagnosticData.diagnostic) {
                    const diag = diagnosticData.diagnostic;

                    const sanitizeBase64 = (b64: string | null, mimeType?: string | null) => {
                        if (!b64) return null;
                        if (b64.startsWith('data:')) return b64;
                        const mime = mimeType || 'image/png';
                        return `data:${mime};base64,${b64}`;
                    };

                    const initialData: BrandAnalysisData = {
                        brandName: diag.brand_name || diagnosticData.brand_name || 'Marca Detectada',
                        description: diag.description || 'Descripción no disponible.',
                        socials: {
                            website: diag.social?.website || diag.social_media_detected?.website || '',
                            instagram: diag.social?.instagram || diag.social_media_detected?.instagram || '',
                            facebook: diag.social?.facebook || diag.social_media_detected?.facebook || '',
                            tiktok: diag.social?.tiktok || diag.social_media_detected?.tiktok || ''
                        },
                        productTags: diag.products_detected || [],
                        colors: (diag.branding?.colors_detected || diag.colors_detected || []).map((c: any) => (typeof c === 'string' ? c : c.hex)),
                        brandKeywords: diag.branding?.brand_keywords || diag.brand_keywords || [],
                        seoKeywords: diag.seo_keywords || [],
                        logo: {
                            url: diag.logo?.url || null,
                            base64: sanitizeBase64(diag.logo?.base64, diag.logo?.mime_type || diag.logo?.mimeType)
                        },
                        // Branding
                        typography: diag.branding?.typography || diag.typography || [],
                        visual_style: diag.branding?.visual_style || diag.visual_style || [],
                        palette_named: diag.branding?.palette_named || diag.palette_named || undefined,
                        logo_notes: diag.branding?.logo_notes || diag.logo_notes || undefined,
                        // Positioning
                        slogan: diag.positioning?.slogan || diag.slogan || undefined,
                        identity_message: diag.positioning?.identity_message || diag.identity_message || undefined,
                        value_proposition: diag.positioning?.value_proposition || diag.value_proposition || undefined,
                        differentiators: diag.positioning?.differentiators || diag.differentiators || [],
                        brand_personality: diag.positioning?.brand_personality || diag.brand_personality || [],
                        key_messages: diag.positioning?.key_messages || diag.key_messages || [],
                        // History
                        history_summary: diag.history?.summary || diag.history_summary || undefined,
                        origin: diag.history?.origin || diag.origin || undefined,
                        timeline: diag.history?.timeline || diag.timeline || [],
                        milestones: diag.history?.milestones || diag.milestones || [],
                        // Audience
                        audience_segments: diag.audience?.segments || diag.audience_segments || [],
                        demographics: diag.audience?.demographics || diag.demographics || undefined,
                        psychographics: diag.audience?.psychographics || diag.psychographics || undefined,
                        // Operations
                        locations: diag.operations?.locations || diag.locations || [],
                        employees: diag.operations?.employees || diag.employees || undefined,
                        production_capacity: diag.operations?.production_capacity || diag.production_capacity || undefined,
                        technology: diag.operations?.technology || diag.technology || [],
                        b2b_services: diag.operations?.b2b_services || diag.b2b_services || []
                    };

                    setData(initialData);
                    setOriginalState(JSON.parse(JSON.stringify(initialData)));
                } else {
                    // No diagnostic yet
                    const emptyData: BrandAnalysisData = {
                        brandName: diagnosticData.brand_name || 'Marca',
                        description: 'Diagnóstico en proceso o no disponible.',
                        socials: { website: '', instagram: '', facebook: '', tiktok: '' },
                        productTags: [],
                        colors: [],
                        brandKeywords: [],
                        seoKeywords: [],
                        logo: { url: null, base64: null }
                    };
                    setData(emptyData);
                    setOriginalState(emptyData);
                }

                setIsLoading(false);
            } catch (err: any) {
                console.error("Error fetching diagnostic:", err);
                setError(err.message || 'Error al cargar el diagnóstico');
                toast.error("Error al cargar los datos del diagnóstico");
                setIsLoading(false);
            }
        };

        fetchData();
    }, [brandId]);

    return { data, setData, originalState, setOriginalState, isLoading, error };
};

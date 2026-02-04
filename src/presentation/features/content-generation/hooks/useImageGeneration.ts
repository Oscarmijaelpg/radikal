import { useState } from 'react';
import { supabase } from "@infrastructure/api/supabase";
import { toast } from 'sonner';
import { ContentRecommendation } from "@core/types";

interface N8nResponse {
    link: string;
}

export const useImageGeneration = () => {
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isGeneratingImage, setIsGeneratingImage] = useState(false);
    const [imageError, setImageError] = useState<string | null>(null);

    /**
     * Sube una imagen al bucket de Supabase Storage y retorna la URL pública
     */
    const uploadImageToSupabase = async (file: File): Promise<string> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
            const filePath = `urls/${fileName}`;

            console.log('📤 Subiendo imagen a Supabase:', filePath);

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('Images')
                .upload(filePath, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                console.error('❌ Error subiendo imagen:', uploadError);
                throw uploadError;
            }

            // Obtener URL pública
            const { data: { publicUrl } } = supabase.storage
                .from('Images')
                .getPublicUrl(filePath);

            console.log('✅ Imagen subida:', publicUrl);
            return publicUrl;

        } catch (error: any) {
            console.error('❌ Error en uploadImageToSupabase:', error);
            throw new Error(`Error subiendo imagen: ${error.message}`);
        }
    };

    /**
     * Obtiene los datos completos de la marca desde Supabase
     */
    const getBrandData = async (brandId: string) => {
        try {
            const { data, error } = await supabase
                .from('brands')
                .select('*')
                .eq('id', brandId)
                .single();

            if (error) throw error;
            return data;
        } catch (error: any) {
            console.error('❌ Error obteniendo datos de marca:', error);
            throw new Error(`Error obteniendo marca: ${error.message}`);
        }
    };

    /**
     * Construye el payload exacto que n8n espera
     */
    const buildN8nPayload = async (
        recommendation: ContentRecommendation | 'custom',
        customPrompt: string,
        platform: string,
        uploadedFiles: File[],
        brandId: string
    ) => {
        try {
            // 1. Subir imágenes a Supabase Storage
            const uploadedImageUrls: { url: string; name: string; mime: string }[] = [];

            if (uploadedFiles.length > 0) {
                toast.info(`Subiendo ${uploadedFiles.length} imagen(es)...`);

                for (const file of uploadedFiles) {
                    const publicUrl = await uploadImageToSupabase(file);
                    uploadedImageUrls.push({
                        url: publicUrl,
                        name: file.name,
                        mime: file.type
                    });
                }

                toast.success(`${uploadedFiles.length} imagen(es) subida(s)`);
            }

            // 2. Obtener datos de la marca
            const brandData = await getBrandData(brandId);

            // Parsear initial_diagnostic_data si existe
            let diagnosticData: any = {};
            if (brandData.initial_diagnostic_data) {
                try {
                    diagnosticData = typeof brandData.initial_diagnostic_data === 'string'
                        ? JSON.parse(brandData.initial_diagnostic_data)
                        : brandData.initial_diagnostic_data;
                    console.log('📊 Diagnostic data parseada:', diagnosticData);
                } catch (error) {
                    console.warn('⚠️ No se pudo parsear initial_diagnostic_data:', error);
                }
            }

            // 3. Construir estructura "idea"
            let ideaPayload: any;

            if (recommendation === 'custom') {
                // Modo personalizado -> Replicamos la estructura del ejemplo con el prompt
                // El ejemplo muestra que si es custom/prompt, el texto se repite en paragraph, ai_brief e idea
                ideaPayload = {
                    source: 'custom',
                    category: 'contenido_personalizado',
                    title: 'Post personalizado',
                    paragraph: customPrompt,
                    recommended_next_post: {
                        format: platform.toLowerCase(), // ej: 'instagram'
                        objetivo_marketing: 'engagement',
                        idea: customPrompt
                    },
                    elementos_necesarios: [],
                    ai_brief: customPrompt
                };
            } else {
                // Recomendación seleccionada
                ideaPayload = {
                    source: 'recommendation', // O 'database'
                    category: recommendation.recommendation_type || 'contenido_general',
                    title: recommendation.title,
                    paragraph: recommendation.paragraph, // Texto largo de la recomendación
                    recommended_next_post: {
                        format: recommendation.recommended_format?.toLowerCase() || platform.toLowerCase(),
                        objetivo_marketing: recommendation.recommended_objective?.toLowerCase() || 'engagement',
                        idea: recommendation.recommended_idea || recommendation.paragraph
                    },
                    elementos_necesarios: recommendation.required_elements || [],
                    ai_brief: recommendation.ai_brief || recommendation.paragraph
                };
            }

            // 4. Construir estructura "company" usando datos de initial_diagnostic_data cuando estén disponibles
            // Prioridad: 1. initial_diagnostic_data (JSON), 2. columnas planas de brands
            const companyPayload = {
                brand_name: diagnosticData.brand_name || brandData.name || 'Mi Marca',
                domain: diagnosticData.domain || brandData.website_url || '',
                description: diagnosticData.description || brandData.description || '',
                website: diagnosticData.website || brandData.website_url || '',
                social: diagnosticData.social || {
                    website: brandData.website_url || null,
                    instagram: brandData.instagram || null,
                    facebook: brandData.facebook || null,
                    tiktok: brandData.tiktok || null,
                    youtube: null,
                    whatsapp: null,
                    linkedin: brandData.linkedin || null
                },
                ai_company_report: diagnosticData.ai_company_report || diagnosticData.description || brandData.description || 'Información de la marca',
                branding: diagnosticData.branding || {
                    colors_detected: [],
                    brand_keywords: []
                },
                products_detected: diagnosticData.products_detected || [],
                seo_keywords: diagnosticData.seo_keywords || [],
                logo: {
                    url: diagnosticData.logo?.url || brandData.logo_url || null,
                    base64: diagnosticData.logo?.base64 || null, // Asegurar que sacamos el base64 si existe en json o db
                    mimeType: diagnosticData.logo?.mimeType || 'image/png'
                },
                downloaded_product_images: diagnosticData.downloaded_product_images || [],
                sources: diagnosticData.sources || []
            };

            // Asegurar user_context
            const userContext = `Usuario enfocado en ${brandData.category || 'negocio general'}`;

            console.log('🏢 Company payload construido:', companyPayload);

            // 5. Payload completo para n8n
            return {
                idea: ideaPayload,
                user_context: userContext,
                imagenes_adjuntas: uploadedImageUrls,
                company: companyPayload
            };

        } catch (error: any) {
            console.error('❌ Error construyendo payload:', error);
            throw error;
        }
    };

    /**
     * Genera las imágenes llamando al webhook de n8n
     */
    const generateImage = async (
        selectedCard: ContentRecommendation | 'custom',
        customPrompt: string,
        activePlatform: string,
        uploadedFiles: File[] = [],
        brandId: string
    ) => {
        setIsGeneratingImage(true);
        setImageError(null);
        setGeneratedImages([]);

        try {
            console.log('🚀 Iniciando generación de imágenes...');
            console.log('📋 Card seleccionada:', selectedCard);
            console.log('📝 Prompt personalizado:', customPrompt);
            console.log('📱 Plataforma:', activePlatform);
            console.log('🖼️ Archivos:', uploadedFiles.length);

            // 1. Construir payload
            toast.info('Preparando datos...');
            const payload = await buildN8nPayload(
                selectedCard,
                customPrompt,
                activePlatform,
                uploadedFiles,
                brandId
            );

            console.log('📦 Payload completo para n8n:', payload);

            // 2. Llamar al webhook de n8n
            toast.info('Generando imágenes con IA...');

            // IMPORTANTE: Asegúrate de usar la Production URL de n8n (no la Test URL)
            const webhookUrl = 'https://prueba-n8n.dpqajs.easypanel.host/webhook/8b50d75c-3a17-4347-bf23-1be1f53a26a8';

            console.log('🌐 Llamando a webhook:', webhookUrl);

            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            console.log('📊 Response status:', response.status);

            if (!response.ok) {
                throw new Error(`Error del servidor: ${response.status}`);
            }

            const result = await response.json();
            console.log('✅ Respuesta de n8n:', result);

            // 3. Extraer URLs de imágenes
            // n8n puede devolver un objeto o un array
            let imageLinks: string[] = [];

            if (Array.isArray(result)) {
                // Si es array: [{link: "..."}, {link: "..."}]
                imageLinks = result.map(item => item.link);
            } else if (result && result.link) {
                // Si es objeto: {link: "..."}
                imageLinks = [result.link];
            } else if (typeof result === 'string') {
                // Si es string directo
                imageLinks = [result];
            }

            console.log('🖼️ Image links extraídos:', imageLinks);

            if (imageLinks.length === 0) {
                throw new Error('No se generaron imágenes');
            }

            setGeneratedImages(imageLinks);
            toast.success(`${imageLinks.length} imagen(es) generada(s) exitosamente`);

            return imageLinks;

        } catch (error: any) {
            console.error('❌ Error generando imágenes:', error);
            const errorMessage = error.message || 'Error al generar las imágenes';
            setImageError(errorMessage);
            toast.error(errorMessage);
            throw error;
        } finally {
            setIsGeneratingImage(false);
        }
    };

    /**
     * Limpia las imágenes generadas
     */
    const clearImages = () => {
        setGeneratedImages([]);
        setImageError(null);
    };

    return {
        generatedImages,
        isGeneratingImage,
        imageError,
        generateImage,
        clearImages,
        setGeneratedImages
    };
};
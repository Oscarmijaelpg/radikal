import { useState, useEffect, useCallback } from 'react';
import { supabase } from "@infrastructure/api/supabase";
import { toast } from 'sonner';
import { ContentRecommendation } from "../components/types";
import { EXAMPLE_RECOMMENDATIONS } from "../components/constants";

export const useRecommendations = (brandId: string | null) => {
    const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    // Consultar recomendaciones existentes (sin generar)
    const fetchExistingRecommendations = useCallback(async () => {
        if (!brandId) return;

        setIsLoading(true);

        try {
            console.log('🔍 Consultando recomendaciones existentes...');

            const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-content-recommendations?brand_id=${brandId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${session?.access_token}`,
                    },
                }
            );

            const result = await response.json();

            console.log('📊 Status:', response.status);
            console.log('📊 Response completa:', result);

            if (!response.ok) {
                console.error('❌ Error del servidor:', result);
                throw new Error(result.error || 'Error al consultar recomendaciones');
            }

            console.log('✅ Resultado:', result);

            if (result.has_recommendations && result.recommendations.length > 0) {
                setRecommendations(result.recommendations);
                toast.success(`${result.recommendations.length} recomendaciones cargadas`);
            } else if (result.is_processing) {
                console.log('🔄 Job en proceso, iniciando polling...');
                setIsGenerating(true);
                if (result.current_job?.id) {
                    pollRecommendations(result.current_job.id);
                }
            } else {
                // Si no hay recomendaciones y no hay job el proceso -> Generar Automáticamente
                console.log('✨ No hay recomendaciones previas. Iniciando generación automática...');
                toast.info('Generando tus primeras ideas de contenido...');
                generateRecommendations();
            }
        } catch (error: any) {
            console.error('❌ Error consultando recomendaciones:', error);
            toast.error(error.message || 'Error al consultar recomendaciones');
        } finally {
            setIsLoading(false);
        }
    }, [brandId]);

    // Polling para esperar las recomendaciones
    const pollRecommendations = useCallback(async (jobId: string) => {
        const maxAttempts = 120; // 6 minutos máximo (120 * 3 segundos)
        let attempts = 0;

        const poll = async () => {
            try {
                attempts++;
                console.log(`🔄 Polling intento ${attempts}/${maxAttempts}`);

                const { data: { session } } = await supabase.auth.getSession();

                const response = await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-content-recommendations?brand_id=${brandId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${session?.access_token}`,
                        },
                    }
                );

                const result = await response.json();

                if (result.has_recommendations && result.recommendations.length > 0) {
                    console.log('✅ Recomendaciones listas:', result.recommendations.length);
                    setRecommendations(result.recommendations);
                    setIsLoading(false);
                    setIsGenerating(false);
                    toast.success('Recomendaciones generadas exitosamente');
                    return;
                }

                // Si aún está procesando
                if (result.is_processing) {
                    if (attempts < maxAttempts) {
                        setTimeout(poll, 3000); // Reintentar en 3 segundos
                    } else {
                        throw new Error('Timeout esperando recomendaciones');
                    }
                } else {
                    // No está procesando pero tampoco tiene recomendaciones
                    if (attempts < maxAttempts) {
                        setTimeout(poll, 3000);
                    } else {
                        throw new Error('No se generaron recomendaciones');
                    }
                }
            } catch (error: any) {
                console.error('❌ Error en polling:', error);
                toast.error(error.message || 'Error al obtener recomendaciones');
                setIsLoading(false);
                setIsGenerating(false);
            }
        };

        poll();
    }, [brandId]);

    // Generar recomendaciones
    const generateRecommendations = useCallback(async () => {
        if (!brandId) return;

        setIsLoading(true);
        setIsGenerating(true);

        try {
            console.log('🚀 Iniciando generación de recomendaciones...');

            // Llamar a la Edge Function
            const { data: { session } } = await supabase.auth.getSession();

            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content-recommendations`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${session?.access_token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ brand_id: brandId }),
                }
            );

            console.log('📊 Response status:', response.status);
            console.log('📊 Response ok:', response.ok);
            console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));

            const result = await response.json();
            console.log('📊 Response body:', result);

            if (!response.ok) {
                console.error('❌ Error completo:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: result
                });
                throw new Error(result.error || 'Error al generar recomendaciones');
            }

            console.log('✅ Job creado:', result.job_id);
            toast.success('Generando recomendaciones...');

            // Iniciar polling
            pollRecommendations(result.job_id);
        } catch (error: any) {
            console.error('❌ Error generando recomendaciones:', error);
            toast.error(error.message || 'Error al generar recomendaciones');
            setIsLoading(false);
            setIsGenerating(false);
        }
    }, [brandId, pollRecommendations]);

    // Cargar recomendaciones al montar
    useEffect(() => {
        if (brandId) {
            fetchExistingRecommendations();
        }
    }, [brandId, fetchExistingRecommendations]);

    return {
        recommendations,
        isLoading,
        isGenerating,
        fetchExisting: fetchExistingRecommendations,
        generate: generateRecommendations,
    };
};

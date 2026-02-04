// Custom Hook: Radar Analysis Data Fetching
// Handles fetching radar analysis and competitor data

import { useState, useEffect } from 'react';
import { supabase } from "@infrastructure/api/supabase";
import { RadarAnalysis, Competitor, InstagramData } from "../types";
import { toast } from 'sonner';

export const useRadarAnalysis = (brandId: string | null) => {
    const [analysis, setAnalysis] = useState<RadarAnalysis | null>(null);
    const [competitors, setCompetitors] = useState<Competitor[]>([]);
    const [instagramData, setInstagramData] = useState<InstagramData | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!brandId) {
            setIsLoading(false);
            return;
        }

        const fetchAnalysis = async () => {
            setIsLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();

                const response = await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-competitor-analysis?brand_id=${brandId}`,
                    {
                        headers: {
                            'Authorization': `Bearer ${session?.access_token}`,
                        },
                    }
                );

                const result = await response.json();

                console.log('🔍 Radar analysis response:', result);

                if (!response.ok || !result.has_analysis) {
                    console.log('ℹ️ No se encontró análisis de radar');
                    setIsLoading(false);
                    return;
                }

                // Extract radikal_ia_report (Try root property first, then inside raw_report)
                let reportData = result.analysis?.radikal_ia_report;

                // Fallback: Check inside raw_report column
                if (!reportData && result.analysis?.raw_report?.radikal_ia_report) {
                    console.log('🔄 Extrayendo radikal_ia_report desde raw_report (Fallback frontend)');
                    reportData = result.analysis.raw_report.radikal_ia_report;
                }

                if (result.analysis && reportData) {
                    const radarAnalysis: RadarAnalysis = {
                        id: result.analysis.id,
                        brand_id: brandId,
                        generated_at: result.analysis.generated_at,
                        radikal_ia_report: reportData,
                        // Mapeamos raw_report de la DB a la propiedad raw_response del tipo
                        raw_response: result.analysis.raw_report || result.analysis.raw_response
                    };

                    setAnalysis(radarAnalysis);
                    console.log('✅ Radar analysis loaded successfully');
                } else {
                    console.warn('⚠️ No radikal_ia_report found in analysis (ni en root ni en raw_report). Keys:', result.analysis ? Object.keys(result.analysis) : 'null');
                    // Debug raw_report content if exists
                    if (result.analysis?.raw_report) {
                        console.log('Contenido raw_report:', JSON.stringify(result.analysis.raw_report).substring(0, 200));
                    }
                }

                setCompetitors(result.competitors || []);

                // Extract Instagram data from raw_competition_data if available
                if (result.analysis?.radikal_ia_report?.raw_competition_data) {
                    const rawData = result.analysis.radikal_ia_report.raw_competition_data;
                    if (Array.isArray(rawData) && rawData.length > 0) {
                        setInstagramData(rawData[0]);
                    }
                }

            } catch (error) {
                console.error('❌ Error cargando análisis de radar:', error);
                toast.error('Error al cargar análisis de radar');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalysis();
    }, [brandId]);

    return { analysis, competitors, instagramData, isLoading };
};


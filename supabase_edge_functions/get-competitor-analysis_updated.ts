import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Manejar CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Crear cliente de Supabase con auth del usuario
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! }
                }
            }
        )

        // Verificar autenticación
        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

        if (authError || !user) {
            console.error('❌ Error de autenticación:', authError)
            return new Response(
                JSON.stringify({
                    error: 'No autorizado',
                    has_analysis: false,
                    analysis: null,
                    competitors: [],
                    current_job: null,
                    is_processing: false
                }),
                {
                    status: 200,
                    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
                }
            )
        }

        // Obtener brand_id del query string
        const url = new URL(req.url)
        const brandId = url.searchParams.get('brand_id')

        if (!brandId) {
            throw new Error('brand_id es requerido')
        }

        console.log('🔍 Consultando análisis para brand:', brandId)

        // Verificar que el brand pertenece al usuario
        const { data: brand, error: brandError } = await supabaseClient
            .from('brands')
            .select('id, user_id')
            .eq('id', brandId)
            .single()

        if (brandError || !brand) {
            throw new Error('Marca no encontrada')
        }

        if (brand.user_id !== user.id) {
            throw new Error('No tienes permiso para esta marca')
        }

        // Buscar análisis más reciente
        const { data: analysis, error: analysisError } = await supabaseClient
            .from('competitor_analysis')
            .select('*')
            .eq('brand_id', brandId)
            .order('generated_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (analysisError) {
            console.error('Error consultando análisis:', analysisError)
        }

        // Buscar competidores si hay análisis
        let competitors = []
        if (analysis) {
            const { data: competitorsData } = await supabaseClient
                .from('competitors')
                .select('*')
                .eq('analysis_id', analysis.id)
                .eq('is_active', true)
                .order('relevance_score', { ascending: false })

            competitors = competitorsData || []
        }

        // Buscar job en proceso
        const { data: currentJob } = await supabaseClient
            .from('job_queue')
            .select('*')
            .eq('brand_id', brandId)
            .eq('job_type', 'competitor_analysis')
            .in('status', ['pending', 'processing'])
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        const isProcessing = !!currentJob && ['pending', 'processing'].includes(currentJob.status)

        // ✅ NUEVO: Parsear radikal_ia_report desde raw_report si existe
        let enrichedAnalysis = analysis
        if (analysis && analysis.raw_report) {
            try {
                let rawData = analysis.raw_report

                // Si raw_report es string, parsearlo
                if (typeof rawData === 'string') {
                    rawData = JSON.parse(rawData)
                }

                // Si es un array, tomar el primer elemento
                if (Array.isArray(rawData)) {
                    rawData = rawData[0]
                }

                // Extraer radikal_ia_report
                if (rawData && rawData.radikal_ia_report) {
                    enrichedAnalysis = {
                        ...analysis,
                        radikal_ia_report: rawData.radikal_ia_report,
                        meta: rawData.meta || null
                    }
                    console.log('✅ radikal_ia_report extraído correctamente')
                }
            } catch (parseError) {
                console.warn('⚠️ Error parseando raw_report:', parseError)
            }
        }

        console.log('✅ Resultado:', {
            has_analysis: !!analysis,
            has_radikal_ia_report: !!(enrichedAnalysis && enrichedAnalysis.radikal_ia_report),
            competitors_count: competitors.length,
            is_processing: isProcessing
        })

        return new Response(
            JSON.stringify({
                brand_id: brandId,
                has_analysis: !!analysis,
                analysis: enrichedAnalysis || null,
                competitors: competitors,
                current_job: currentJob || null,
                is_processing: isProcessing
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        console.error('❌ Error en get-competitor-analysis:', error)

        return new Response(
            JSON.stringify({
                error: error.message,
                has_analysis: false,
                analysis: null,
                competitors: [],
                current_job: null,
                is_processing: false
            }),
            {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            {
                global: {
                    headers: { Authorization: req.headers.get('Authorization')! }
                }
            }
        )

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

        if (authError || !user) {
            throw new Error('Usuario no autenticado')
        }

        const url = new URL(req.url)
        const brandId = url.searchParams.get('brand_id')

        if (!brandId) {
            throw new Error('brand_id es requerido')
        }

        console.log('🔍 Consultando diagnóstico para brand:', brandId)

        // 1. Verificar que el brand pertenece al usuario
        const { data: brand, error: brandError } = await supabaseClient
            .from('brands')
            .select('id, user_id, name, description, logo_url, logo_base64, initial_diagnostic_status, initial_diagnostic_completed_at')
            .eq('id', brandId)
            .single()

        if (brandError || !brand) {
            throw new Error('Marca no encontrada')
        }

        if (brand.user_id !== user.id) {
            throw new Error('No tienes permiso para ver esta marca')
        }

        // 2. Obtener el diagnóstico
        const { data: diagnostic, error: diagnosticError } = await supabaseClient
            .from('initial_diagnostics')
            .select('*')
            .eq('brand_id', brandId)
            .single()

        // 3. Obtener el job actual (si existe)
        const { data: currentJob } = await supabaseClient
            .from('job_queue')
            .select('id, status, created_at, started_at, completed_at, error_message')
            .eq('brand_id', brandId)
            .eq('job_type', 'initial_diagnostic')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        // 4. Preparar respuesta normalizada
        const response: any = {
            brand_id: brandId,
            brand_name: brand.name || 'Marca',
            status: brand.initial_diagnostic_status || 'pending',
            completed_at: brand.initial_diagnostic_completed_at,
            has_diagnostic: !!diagnostic,
            current_job: currentJob || null
        }

        // Si tiene diagnóstico completado, incluir los datos NORMALIZADOS
        if (diagnostic) {
            // Intentar parsear raw_response si existe
            let rawData = null
            try {
                if (diagnostic.raw_response && typeof diagnostic.raw_response === 'string') {
                    rawData = JSON.parse(diagnostic.raw_response)
                } else if (diagnostic.raw_response && typeof diagnostic.raw_response === 'object') {
                    rawData = diagnostic.raw_response
                }
            } catch (e) {
                console.warn('No se pudo parsear raw_response:', e)
            }

            response.diagnostic = {
                brand_id: brandId,
                brand_name: diagnostic.brand_name || rawData?.brand_name || brand.name || 'Marca Detectada',
                domain: diagnostic.domain || rawData?.domain || null,
                description: diagnostic.description || rawData?.description || brand.description || 'Descripción no disponible.',

                // Campos básicos con fallback a rawData
                colors_detected: (diagnostic.colors_detected && diagnostic.colors_detected.length > 0) ? diagnostic.colors_detected : (rawData?.branding?.colors_detected || rawData?.colors_detected || []),
                brand_keywords: (diagnostic.brand_keywords && diagnostic.brand_keywords.length > 0) ? diagnostic.brand_keywords : (rawData?.branding?.brand_keywords || rawData?.brand_keywords || []),
                products_detected: (diagnostic.products_detected && diagnostic.products_detected.length > 0) ? diagnostic.products_detected : (rawData?.products_detected || []),
                seo_keywords: (diagnostic.seo_keywords && diagnostic.seo_keywords.length > 0) ? diagnostic.seo_keywords : (rawData?.seo_keywords || []),

                logo: {
                    url: diagnostic.logo_url || rawData?.logo?.url || brand.logo_url || null,
                    base64: diagnostic.logo_base64 || rawData?.logo?.base64 || brand.logo_base64 || null,
                    mime_type: diagnostic.logo_mime_type || rawData?.logo?.mime_type || rawData?.logo?.mimeType || null,
                    mimeType: diagnostic.logo_mime_type || rawData?.logo?.mimeType || rawData?.logo?.mime_type || null
                },

                product_images: (diagnostic.product_images && diagnostic.product_images.length > 0) ? diagnostic.product_images : (rawData?.product_images || rawData?.downloaded_product_images || []),
                social_media_detected: diagnostic.social_media_detected || rawData?.social_media_detected || rawData?.social || {},
                sources: diagnostic.sources || rawData?.sources || [],

                // NUEVOS CAMPOS - Objetos anidados desde raw_response
                social: rawData?.social || diagnostic.social_media_detected || null,

                branding: {
                    colors_detected: (diagnostic.colors_detected && diagnostic.colors_detected.length > 0) ? diagnostic.colors_detected : (rawData?.branding?.colors_detected || []),
                    brand_keywords: (diagnostic.brand_keywords && diagnostic.brand_keywords.length > 0) ? diagnostic.brand_keywords : (rawData?.branding?.brand_keywords || []),
                    typography: (diagnostic.typography && diagnostic.typography.length > 0) ? diagnostic.typography : (rawData?.branding?.typography || []),
                    visual_style: (diagnostic.visual_style && diagnostic.visual_style.length > 0) ? diagnostic.visual_style : (rawData?.branding?.visual_style || []),
                    palette_named: diagnostic.palette_named || rawData?.branding?.palette_named || null,
                    logo_notes: diagnostic.logo_notes || rawData?.branding?.logo_notes || null
                },

                positioning: {
                    slogan: diagnostic.slogan || rawData?.positioning?.slogan || null,
                    identity_message: diagnostic.identity_message || rawData?.positioning?.identity_message || null,
                    value_proposition: diagnostic.value_proposition || rawData?.positioning?.value_proposition || null,
                    differentiators: (diagnostic.differentiators && diagnostic.differentiators.length > 0) ? diagnostic.differentiators : (rawData?.positioning?.differentiators || []),
                    brand_personality: (diagnostic.brand_personality && diagnostic.brand_personality.length > 0) ? diagnostic.brand_personality : (rawData?.positioning?.brand_personality || []),
                    key_messages: (diagnostic.key_messages && diagnostic.key_messages.length > 0) ? diagnostic.key_messages : (rawData?.positioning?.key_messages || [])
                },

                history: {
                    summary: diagnostic.history_summary || rawData?.history?.summary || null,
                    origin: diagnostic.origin || rawData?.history?.origin || null,
                    timeline: (diagnostic.timeline && diagnostic.timeline.length > 0) ? diagnostic.timeline : (rawData?.history?.timeline || []),
                    milestones: (diagnostic.milestones && diagnostic.milestones.length > 0) ? diagnostic.milestones : (rawData?.history?.milestones || [])
                },

                audience: {
                    segments: (diagnostic.audience_segments && diagnostic.audience_segments.length > 0) ? diagnostic.audience_segments : (rawData?.audience?.segments || []),
                    demographics: diagnostic.demographics || rawData?.audience?.demographics || null,
                    psychographics: diagnostic.psychographics || rawData?.audience?.psychographics || null
                },

                operations: {
                    locations: (diagnostic.locations && diagnostic.locations.length > 0) ? diagnostic.locations : (rawData?.operations?.locations || []),
                    employees: diagnostic.employees || rawData?.operations?.employees || null,
                    production_capacity: diagnostic.production_capacity || rawData?.operations?.production_capacity || null,
                    technology: (diagnostic.technology && diagnostic.technology.length > 0) ? diagnostic.technology : (rawData?.operations?.technology || []),
                    b2b_services: (diagnostic.b2b_services && diagnostic.b2b_services.length > 0) ? diagnostic.b2b_services : (rawData?.operations?.b2b_services || [])
                },

                // También incluir campos planos para backward compatibility
                typography: diagnostic.typography || [],
                visual_style: diagnostic.visual_style || [],
                palette_named: diagnostic.palette_named || null,
                logo_notes: diagnostic.logo_notes || null,
                slogan: diagnostic.slogan || null,
                identity_message: diagnostic.identity_message || null,
                value_proposition: diagnostic.value_proposition || null,
                differentiators: diagnostic.differentiators || [],
                brand_personality: diagnostic.brand_personality || [],
                key_messages: diagnostic.key_messages || [],
                history_summary: diagnostic.history_summary || null,
                origin: diagnostic.origin || null,
                timeline: diagnostic.timeline || [],
                milestones: diagnostic.milestones || [],
                audience_segments: diagnostic.audience_segments || [],
                demographics: diagnostic.demographics || null,
                psychographics: diagnostic.psychographics || null,
                locations: diagnostic.locations || [],
                employees: diagnostic.employees || null,
                production_capacity: diagnostic.production_capacity || null,
                technology: diagnostic.technology || [],
                b2b_services: diagnostic.b2b_services || [],

                created_at: diagnostic.created_at
            }
        }

        console.log('✅ Diagnóstico consultado:', response.status)

        return new Response(
            JSON.stringify(response),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        console.error('❌ Error en get-diagnostic:', error)

        return new Response(
            JSON.stringify({
                success: false,
                error: error.message
            }),
            {
                status: 400,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})

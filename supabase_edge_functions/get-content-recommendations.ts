// Pega aquí tu código para get-content-recommendations
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

        console.log('🔍 Consultando recomendaciones para brand:', brandId)

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
            throw new Error('No tienes permiso para ver esta marca')
        }

        // Obtener las 4 recomendaciones activas
        const { data: recommendations, error: recError } = await supabaseClient
            .from('content_recommendations')
            .select('*')
            .eq('brand_id', brandId)
            .eq('status', 'active')
            .order('created_at', { ascending: false })

        if (recError) throw recError

        // Verificar si hay un job en proceso
        const { data: currentJob } = await supabaseClient
            .from('job_queue')
            .select('id, status, created_at')
            .eq('brand_id', brandId)
            .eq('job_type', 'content_recommendations')
            .order('created_at', { ascending: false })
            .limit(1)
            .single()

        const response = {
            brand_id: brandId,
            has_recommendations: recommendations && recommendations.length > 0,
            recommendations: recommendations || [],
            current_job: currentJob || null,
            is_processing: currentJob?.status === 'processing'
        }

        console.log('✅ Recomendaciones consultadas:', recommendations?.length || 0)

        return new Response(
            JSON.stringify(response),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        console.error('❌ Error en get-content-recommendations:', error)

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

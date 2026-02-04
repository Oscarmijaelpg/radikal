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

        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { data: { user }, error: authError } = await supabaseClient.auth.getUser()

        if (authError || !user) {
            throw new Error('Usuario no autenticado')
        }

        // ✅ Recibir competitor_links, news_feeds y instagram del request body
        const { brand_id, competitor_links, news_feeds, instagram: instagramFromFront } = await req.json()

        if (!brand_id) {
            throw new Error('brand_id es requerido')
        }

        console.log('🔍 Generando análisis de competencia para brand:', brand_id)
        console.log('📊 Competitor links recibidos:', competitor_links)
        console.log('📰 News feeds recibidos:', news_feeds)

        const { data: brand, error: brandError } = await supabaseClient
            .from('brands')
            .select('id, user_id, name, website_url, category, country, instagram')
            .eq('id', brand_id)
            .single()

        if (brandError || !brand) {
            throw new Error('Marca no encontrada')
        }

        if (brand.user_id !== user.id) {
            throw new Error('No tienes permiso para esta marca')
        }

        await supabaseAdmin
            .from('competitor_analysis')
            .delete()
            .eq('brand_id', brand_id)

        console.log('🗑️ Análisis anteriores eliminados')

        // ✅ Usar los datos que vienen del frontend
        let finalCompetitorLinks = competitor_links || []

        // Fallback: si no vienen del frontend, buscar en competitor_suggestions
        if (!finalCompetitorLinks || finalCompetitorLinks.length === 0) {
            const { data: competitorData } = await supabaseAdmin
                .from('competitor_suggestions')
                .select('link')
                .eq('brand_id', brand_id)
                .order('created_at', { ascending: false })

            if (competitorData && competitorData.length > 0) {
                finalCompetitorLinks = competitorData.map(c => c.link).filter(Boolean)
            }
        }

        console.log('🎯 Competitor links finales:', finalCompetitorLinks)

        // Crear job en la cola
        const { data: job, error: jobError } = await supabaseAdmin
            .from('job_queue')
            .insert({
                user_id: user.id,
                brand_id: brand_id,
                job_type: 'competitor_analysis',
                entity_type: 'brand',
                entity_id: brand_id,
                status: 'processing',
                priority: 5,
                params: {
                    brand_name: brand.name,
                    website_url: brand.website_url,
                    category: brand.category,
                    country: brand.country,
                    instagram: brand.instagram || instagramFromFront, // Guardar en params también
                    competitor_links: finalCompetitorLinks,
                    news_feeds: news_feeds || []
                },
                started_at: new Date().toISOString()
            })
            .select()
            .single()

        if (jobError) throw jobError

        console.log('📋 Job creado:', job.id)

        // Enviar a n8n en el formato correcto CON job_id
        const n8nWebhookUrl = Deno.env.get('N8N_COMPETITOR_ANALYSIS_WEBHOOK_URL') ?? ''
        const callbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/n8n-callback`

        console.log('🚀 Enviando a n8n:', n8nWebhookUrl)

        // ✅ Body con job_id incluido y arrays completos
        const webhookBody = {
            job_id: job.id,
            brand_id: brand_id,
            user_id: user.id,
            callback_url: callbackUrl,
            company_link: brand.website_url || '',
            instagram: brand.instagram || instagramFromFront || '', // Prioridad DB
            competitor_links: finalCompetitorLinks,
            news_feeds: news_feeds || []
        }

        console.log('📤 Body del webhook:', JSON.stringify(webhookBody, null, 2))

        const n8nResponse = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(webhookBody)
        })

        if (!n8nResponse.ok) {
            const errorText = await n8nResponse.text()
            console.error('❌ Error de n8n:', errorText)

            await supabaseAdmin
                .from('job_queue')
                .update({
                    status: 'failed',
                    error_message: `n8n error: ${n8nResponse.status} - ${errorText}`,
                    completed_at: new Date().toISOString()
                })
                .eq('id', job.id)

            throw new Error('Error al procesar con n8n')
        }

        console.log('✅ Enviado a n8n exitosamente')

        return new Response(
            JSON.stringify({
                success: true,
                job_id: job.id,
                message: 'Generando análisis de competencia...'
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        console.error('❌ Error en generate-competitor-analysis:', error)

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
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
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('No autorizado')
        }

        const { brand_id } = await req.json()
        if (!brand_id) {
            throw new Error('brand_id es requerido')
        }

        console.log('🎨 Generando recomendaciones para brand:', brand_id)

        // Verificar que el brand existe
        const { data: brand, error: brandError } = await supabase
            .from('brands')
            .select('id, user_id, name, website_url, instagram')
            .eq('id', brand_id)
            .single()

        if (brandError || !brand) {
            throw new Error('Marca no encontrada')
        }

        console.log('✅ Marca encontrada:', brand.name)

        // Limpiar recomendaciones anteriores
        const { error: deleteError } = await supabase
            .from('content_recommendations')
            .delete()
            .eq('brand_id', brand_id)

        if (deleteError) {
            console.error('Error limpiando recomendaciones:', deleteError)
        }

        // Crear job
        const { data: job, error: jobError } = await supabase
            .from('job_queue')
            .insert({
                user_id: brand.user_id,
                brand_id: brand_id,
                job_type: 'content_recommendations',
                entity_type: 'brand',
                entity_id: brand_id,
                status: 'processing',
                priority: 5,
                params: {
                    brand_name: brand.name,
                    website_url: brand.website_url,
                    instagram: brand.instagram
                },
                started_at: new Date().toISOString()
            })
            .select()
            .single()

        if (jobError) {
            console.error('Error creando job:', jobError)
            throw jobError
        }

        console.log('📋 Job creado:', job.id)

        // Enviar a n8n de forma asíncrona (fire and forget)
        const n8nUrl = Deno.env.get('N8N_CONTENT_RECOMMENDATIONS_WEBHOOK_URL')

        if (!n8nUrl) {
            throw new Error('N8N_CONTENT_RECOMMENDATIONS_WEBHOOK_URL no configurado')
        }

        console.log('🚀 Enviando a n8n...')

        // NO ESPERAR la respuesta de n8n
        fetch(n8nUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                job_id: job.id,
                brand_id: brand_id,
                user_id: brand.user_id,
                callback_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/n8n-callback`,
                brand_name: brand.name || '',
                website_url: brand.website_url || '',
                instagram: brand.instagram || ''
            })
        }).catch(error => {
            console.error('❌ Error enviando a n8n:', error)
            // Actualizar job como fallido
            supabase
                .from('job_queue')
                .update({
                    status: 'failed',
                    error_message: error.message,
                    completed_at: new Date().toISOString()
                })
                .eq('id', job.id)
        })

        // Responder inmediatamente sin esperar n8n
        return new Response(
            JSON.stringify({
                success: true,
                job_id: job.id,
                message: 'Generando recomendaciones de contenido...'
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        console.error('❌ Error:', error)

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
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // 1. Crear cliente de Supabase con el token del usuario
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! }
        }
      }
    )

    // Cliente con service role para operaciones privilegiadas
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 2. Verificar autenticación
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    
    if (authError || !user) {
      throw new Error('Usuario no autenticado')
    }

    // 3. Obtener datos del body
    const { website, tax_id, linkedin, twitter, instagram, facebook, tiktok } = await req.json()

    if (!website) {
      throw new Error('El sitio web es obligatorio')
    }

    console.log('📝 Iniciando onboarding para usuario:', user.id)

    // 4. Verificar si el usuario ya tiene una marca
    const { data: existingBrand } = await supabaseClient
      .from('brands')
      .select('id, initial_diagnostic_status')
      .eq('user_id', user.id)
      .single()

    let brandId: string

    if (existingBrand) {
      // Si ya tiene una marca, actualizamos sus datos
      brandId = existingBrand.id
      
      const { error: updateError } = await supabaseClient
        .from('brands')
        .update({
          website_url: website,
          tax_id,
          linkedin,
          twitter,
          instagram,
          facebook,
          tiktok,
          initial_diagnostic_status: 'processing',
          updated_at: new Date().toISOString()
        })
        .eq('id', brandId)

      if (updateError) throw updateError

      console.log('✏️ Marca actualizada:', brandId)
    } else {
      // Crear nueva marca
      const { data: userData } = await supabaseClient
        .from('users')
        .select('company_name')
        .eq('id', user.id)
        .single()

      const { data: newBrand, error: brandError } = await supabaseClient
        .from('brands')
        .insert({
          user_id: user.id,
          name: userData?.company_name || 'Mi Marca',
          website_url: website,
          tax_id,
          linkedin,
          twitter,
          instagram,
          facebook,
          tiktok,
          initial_diagnostic_status: 'processing',
          is_primary: true,
          status: 'active'
        })
        .select()
        .single()

      if (brandError) throw brandError
      brandId = newBrand.id

      console.log('✨ Nueva marca creada:', brandId)
    }

    // 5. Preparar payload para n8n
    const n8nPayload = {
      website,
      social_media: {
        facebook: facebook || null,
        instagram: instagram || null,
        x: twitter || null,
        tiktok: tiktok || null,
        linkedin: linkedin || null
      }
    }

    // 6. Crear job en la cola
    const { data: job, error: jobError } = await supabaseAdmin
      .from('job_queue')
      .insert({
        user_id: user.id,
        brand_id: brandId,
        job_type: 'initial_diagnostic',
        entity_type: 'brand',
        entity_id: brandId,
        status: 'processing',
        priority: 5, // Alta prioridad para onboarding
        params: n8nPayload,
        started_at: new Date().toISOString()
      })
      .select()
      .single()

    if (jobError) throw jobError

    console.log('📋 Job creado:', job.id)

    // 7. Enviar a n8n inmediatamente
    const n8nWebhookUrl = Deno.env.get('N8N_WEBHOOK_URL') ?? ''
    const supabaseCallbackUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/n8n-callback`

    console.log('🚀 Enviando a n8n:', n8nWebhookUrl)

    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        job_id: job.id,
        brand_id: brandId,
        user_id: user.id,
        callback_url: supabaseCallbackUrl,
        ...n8nPayload
      })
    })

    if (!n8nResponse.ok) {
      console.error('❌ Error de n8n:', await n8nResponse.text())
      
      // Marcar job como failed
      await supabaseAdmin
        .from('job_queue')
        .update({ 
          status: 'failed',
          error_message: `n8n error: ${n8nResponse.status}`,
          completed_at: new Date().toISOString()
        })
        .eq('id', job.id)

      // Actualizar brand status
      await supabaseAdmin
        .from('brands')
        .update({ initial_diagnostic_status: 'failed' })
        .eq('id', brandId)

      throw new Error('Error al procesar con n8n')
    }

    console.log('✅ Enviado a n8n exitosamente')

    // 8. Marcar onboarding como completado
    await supabaseClient
      .from('users')
      .update({ onboarding_completed: true })
      .eq('id', user.id)

    // 9. Responder al cliente
    return new Response(
      JSON.stringify({ 
        success: true,
        job_id: job.id,
        brand_id: brandId,
        message: 'Diagnóstico en proceso. Te notificaremos cuando esté listo.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('❌ Error en complete-onboarding:', error)
    
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
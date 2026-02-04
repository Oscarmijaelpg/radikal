import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        // Cliente admin
        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 1. Leer el body con manejo de errores
        const text = await req.text()
        console.log('📨 Raw body recibido:', text.substring(0, 500) + '...')

        if (!text || text.trim() === '') {
            throw new Error('Body vacío recibido de n8n')
        }

        let payload
        try {
            payload = JSON.parse(text)
        } catch (parseError) {
            console.error('❌ Error parseando JSON:', parseError)
            throw new Error(`JSON inválido: ${parseError.message}`)
        }

        // --- CORRECCIÓN: Manejo de Array ---
        if (Array.isArray(payload)) {
            console.log('ℹ️ Payload es un array, tomando el primer elemento')
            payload = payload[0]
        }

        const {
            job_id,
            status,
            error,
            execution_id
        } = payload

        // --- CORRECCIÓN: Determinar result ---
        let result = payload.result
        if (!result && (payload.radikal_ia_report || payload.diagnosis_result)) {
            console.log('ℹ️ No hay propiedad "result" explícita, usando payload como result')
            result = payload
        }

        console.log('📨 Callback procesado:', { job_id, status, hasResult: !!result })

        if (!job_id || job_id === 'unknown') {
            console.warn('⚠️ job_id es unknown o undefined')
        }

        // 2. Obtener información del job
        const { data: job, error: jobError } = await supabase
            .from('job_queue')
            .select('id, user_id, brand_id, job_type, entity_id')
            .eq('id', job_id)
            .single()

        if (jobError || !job) {
            console.error('❌ Job no encontrado:', job_id, jobError)
            throw new Error(`Job no encontrado: ${job_id}`)
        }

        console.log('📋 Job encontrado:', job.job_type)

        // 3. Procesar según el estado
        if (status === 'success' || status === 'completed') {

            const { error: updateJobError } = await supabase
                .from('job_queue')
                .update({
                    status: 'completed',
                    completed_at: new Date().toISOString(),
                    n8n_execution_id: execution_id || null
                })
                .eq('id', job_id)

            if (updateJobError) {
                console.error('❌ Error actualizando job:', updateJobError)
            }

            if (job.job_type === 'initial_diagnostic') {
                await processInitialDiagnostic(supabase, job, result)
            }
            if (job.job_type === 'content_recommendations') {
                await processContentRecommendations(supabase, job, result)
            }
            if (job.job_type === 'competitor_analysis') {
                await processCompetitorAnalysis(supabase, job, result)
            }

            console.log('✅ Resultados guardados exitosamente')

            // Crear notificación
            await supabase
                .from('notifications')
                .insert({
                    user_id: job.user_id,
                    type: 'job_completed',
                    title: '¡Análisis completado!',
                    message: 'Tu análisis ha finalizado exitosamente.',
                    link: getLinkForJobType(job),
                    metadata: { job_id: job.id, job_type: job.job_type }
                })

            console.log('🔔 Notificación creada')

        } else {
            // ERROR
            await supabase
                .from('job_queue')
                .update({
                    status: 'failed',
                    completed_at: new Date().toISOString(),
                    error_message: error || 'Error desconocido desde n8n'
                })
                .eq('id', job_id)

            if (job.job_type === 'initial_diagnostic') {
                await supabase
                    .from('brands')
                    .update({ initial_diagnostic_status: 'failed' })
                    .eq('id', job.brand_id)
            }

            await supabase
                .from('notifications')
                .insert({
                    user_id: job.user_id,
                    type: 'error',
                    title: 'Error en el proceso',
                    message: 'Hubo un problema procesando tu solicitud.',
                    link: `/brands/${job.brand_id}`,
                    metadata: { job_id: job.id, error }
                })

            console.log('❌ Job marcado como fallido')
        }

        return new Response(
            JSON.stringify({ success: true, message: 'Callback procesado correctamente' }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
            }
        )

    } catch (error) {
        console.error('❌ Error en n8n-callback (Fatal):', error)

        return new Response(
            JSON.stringify({
                success: false,
                error: error.message
            }),
            {
                status: 500,
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            }
        )
    }
})

function getLinkForJobType(job: any) {
    if (job.job_type === 'initial_diagnostic') return `/brands/${job.brand_id}/diagnostic`
    if (job.job_type === 'competitor_analysis') return `/radar-results`
    return `/brands/${job.brand_id}`
}

async function processInitialDiagnostic(supabase: any, job: any, result: any) {
    // ... (Mismo código de antes)
    console.log('🔍 Procesando diagnóstico inicial...')
    const diagnosticData = Array.isArray(result) ? result[0] : result

    if (!diagnosticData) {
        throw new Error('Datos de diagnóstico inválidos o vacíos')
    }

    const { error: diagnosticError } = await supabase
        .from('initial_diagnostics')
        .upsert({
            brand_id: job.brand_id,
            job_id: job.id,
            raw_response: diagnosticData,
            brand_name: diagnosticData.brand_name || null,
            updated_at: new Date().toISOString()
        }, {
            onConflict: 'brand_id'
        })

    if (diagnosticError) {
        console.error('❌ Error guardando diagnostic:', diagnosticError)
        throw diagnosticError
    }

    await supabase
        .from('brands')
        .update({
            initial_diagnostic_status: 'completed',
            initial_diagnostic_completed_at: new Date().toISOString()
        })
        .eq('id', job.brand_id)

    console.log('✅ Diagnóstico guardado')
}

async function processContentRecommendations(supabase: any, job: any, result: any) {
    console.log('🎨 Procesando recomendaciones (Estructura Compleja v3)...');

    const rows = [];
    const categories = ['comentarios', 'mejores_post', 'proximas_fechas', 'radar_tendencias'];

    // Mapeo de nombres descriptivos para el tipo
    const typeMapping: { [key: string]: string } = {
        'comentarios': 'Respuesta a Comunidad',
        'mejores_post': 'Potenciar Éxito',
        'proximas_fechas': 'Oportunidad Estacional',
        'radar_tendencias': 'Tendencia Detectada'
    };

    for (const key of categories) {
        // Verificar si la categoría existe en el result
        const categoryData = result[key];

        if (categoryData && categoryData.ok && categoryData.data) {
            const data = categoryData.data;
            const msgKey = `user_message_${key}`;
            const messageData = data[msgKey];

            if (messageData) {
                console.log(`   - Procesando categoría: ${key}`);

                // Extraer campos con sufijos dinámicos
                const title = messageData[`title_${key}`];
                const paragraph = messageData[`paragraph_${key}`];

                const nextPostKey = `recommended_next_post_${key}`;
                const nextPost = messageData[nextPostKey] || {};

                const format = nextPost[`format_${key}`];
                const objective = nextPost[`objetivo_marketing_${key}`];
                const idea = nextPost[`idea_${key}`];

                const elementsKey = `elementos_necesarios_${key}`;
                const requiredElements = messageData[elementsKey] || [];

                const briefKey = `ai_brief_${key}`;
                const aiBrief = data[briefKey] || '';

                const imageUrl = data.image_url || null;

                rows.push({
                    brand_id: job.brand_id,
                    job_id: job.id,
                    recommendation_type: typeMapping[key] || key,
                    title: title || 'Recomendación',
                    paragraph: paragraph || '',
                    recommended_format: format || 'Post',
                    recommended_objective: objective || 'General',
                    recommended_idea: idea || '',
                    required_elements: requiredElements,
                    ai_brief: aiBrief,
                    status: 'active', // Importante para que se muestren
                    // Intentamos guardar image_url.
                    image_url: imageUrl,
                    // Guardamos el fragmento original para referencia futura
                    raw_data: messageData,
                    created_at: new Date().toISOString()
                });
            }
        }
    }

    if (rows.length === 0) {
        console.warn('⚠️ No se pudieron extraer filas válidas de la estructura n8n:', JSON.stringify(result).substring(0, 200));
        // Intentar fallback a estructura simple por si acaso el formato cambia
        if (Array.isArray(result) || result.recommendations) {
            console.log('🔄 Intentando fallback a estructura simple/array...');
            // ... (Lógica anterior simplificada podría ir aquí, pero por ahora lanzamos error)
        }
        throw new Error('No se encontraron datos válidos en las categorías esperadas (comentarios, mejores_post, etc.)');
    }

    console.log(`📝 Insertando ${rows.length} recomendaciones...`);

    const { error } = await supabase
        .from('content_recommendations')
        .insert(rows);

    if (error) {
        console.error('❌ Error guardando recomendaciones:', error);
        // Si el error es por columna image_url inexistente, reintentar sin ella
        if (error.message?.includes('image_url')) {
            console.warn('⚠️ Error de columna image_url, reintentando sin imágenes...');
            const rowsNoImage = rows.map(({ image_url, ...rest }) => rest);
            const { error: retryError } = await supabase.from('content_recommendations').insert(rowsNoImage);
            if (retryError) throw retryError;
            console.log('✅ Guardado exitoso (SIN imágenes)');
            return;
        }
        throw error;
    }

    console.log(`✅ ${rows.length} recomendaciones guardadas correctamente`);
}

async function processCompetitorAnalysis(supabase: any, job: any, result: any) {
    console.log('🔍 Procesando análisis de competencia...')

    // Normalizar result
    let dataObj = result
    if (Array.isArray(dataObj)) {
        dataObj = dataObj[0]
    }

    const reportData = dataObj.radikal_ia_report

    // --- CORRECCIÓN CRÍTICA: No usar .data ---
    if (!reportData) {
        if (dataObj.result && dataObj.result.radikal_ia_report) {
            await processCompetitorAnalysis(supabase, job, dataObj.result)
            return
        }
        console.error('Estructura recibida:', JSON.stringify(dataObj).substring(0, 200))
        throw new Error('No se encontró el reporte de Radikal IA (radikal_ia_report)')
    }

    console.log('📄 Reporte encontrado')

    // --- CORRECCIÓN: Acceso directo a propiedades ---
    // El JSON muestra que estas propiedades están DIRECTAMENTE en radikal_ia_report
    const companyInfos = reportData.company_profiles || []
    const marketIntel = reportData.market_intelligence || []

    // Extraer señales de market_intelligence
    // market_intelligence es un array de objetos, buscamos el que tenga company_user u otras keys
    const ventoliniData = marketIntel.find((item: any) => item.company_user)

    const mainCompany = companyInfos[0]?.company_info || { name: 'Empresa Analizada', official_website: '' }

    console.log('🏢 Empresa principal:', mainCompany.name)
    console.log('📊 Competidores detectados:', companyInfos.length)

    // Extraer señales de manera segura
    const signals = {
        risk: ventoliniData?.risk || null,
        opportunity: ventoliniData?.opportunity || null,
        regulation: ventoliniData?.regulation || null,
        macro: ventoliniData?.macro || null,
        social: ventoliniData?.social || null,
        media: ventoliniData?.media || null,
    }

    // Guardar análisis principal
    const { data: analysis, error: analysisError } = await supabase
        .from('competitor_analysis')
        .insert({
            brand_id: job.brand_id,
            job_id: job.id,

            analysis_type: 'radar_market',
            generated_at: reportData.meta?.generated_at || new Date().toISOString(),
            warnings: reportData.meta?.warnings || [],

            company_name: mainCompany.name,
            company_website: mainCompany.official_website,

            // Señales
            risk_signal: signals.risk,
            opportunity_signal: signals.opportunity,
            regulation_signal: signals.regulation,
            macro_signal: signals.macro,
            social_signal: signals.social,
            media_signal: signals.media,

            // Raw completo (importante guardar 'result' original o normalizado)
            raw_report: result,

            status: 'completed'
        })
        .select()
        .single()

    if (analysisError) {
        console.error('❌ Error guardando análisis:', analysisError)
        throw analysisError
    }

    console.log('✅ Análisis guardado:', analysis.id)

    if (companyInfos.length > 0) {
        console.log(`ℹ️ Detectados ${companyInfos.length} perfiles de competidores`)
    }
}

async function processInitialDiagnostic(supabase: any, job: any, result: any) {
    console.log('🔍 Procesando diagnóstico inicial...')

    const diagnosticData = Array.isArray(result) ? result[0] : result

    if (!diagnosticData) {
        throw new Error('Datos de diagnóstico inválidos')
    }

    const { error: diagnosticError } = await supabase
        .from('initial_diagnostics')
        .upsert({
            brand_id: job.brand_id,
            job_id: job.id,
            raw_response: diagnosticData,

            // Campos básicos
            brand_name: diagnosticData.brand_name || null,
            domain: diagnosticData.domain || null,
            description: diagnosticData.description || null,

            // Branding (expandido)
            colors_detected: diagnosticData.branding?.colors_detected || [],
            brand_keywords: diagnosticData.branding?.brand_keywords || [],
            typography: diagnosticData.branding?.typography || [],
            visual_style: diagnosticData.branding?.visual_style || [],
            palette_named: diagnosticData.branding?.palette_named || null,
            logo_notes: diagnosticData.branding?.logo_notes || null,

            // Productos y SEO
            products_detected: diagnosticData.products_detected || [],
            seo_keywords: diagnosticData.seo_keywords || [],

            // Logo
            logo_url: diagnosticData.logo?.url || null,
            logo_base64: diagnosticData.logo?.base64 || null,
            logo_mime_type: diagnosticData.logo?.mimeType || null,

            // Positioning (nuevo)
            slogan: diagnosticData.positioning?.slogan || null,
            identity_message: diagnosticData.positioning?.identity_message || null,
            value_proposition: diagnosticData.positioning?.value_proposition || null,
            differentiators: diagnosticData.positioning?.differentiators || [],
            brand_personality: diagnosticData.positioning?.brand_personality || [],
            key_messages: diagnosticData.positioning?.key_messages || [],

            // History (nuevo)
            history_summary: diagnosticData.history?.summary || null,
            origin: diagnosticData.history?.origin || null,
            timeline: diagnosticData.history?.timeline || [],
            milestones: diagnosticData.history?.milestones || [],

            // Audience (nuevo)
            audience_segments: diagnosticData.audience?.segments || [],
            demographics: diagnosticData.audience?.demographics || null,
            psychographics: diagnosticData.audience?.psychographics || null,

            // Operations (nuevo)
            locations: diagnosticData.operations?.locations || [],
            employees: diagnosticData.operations?.employees || null,
            production_capacity: diagnosticData.operations?.production_capacity || null,
            technology: diagnosticData.operations?.technology || [],
            b2b_services: diagnosticData.operations?.b2b_services || [],

            // Otros
            product_images: diagnosticData.downloaded_product_images || [],
            social_media_detected: diagnosticData.social || {},
            sources: diagnosticData.sources || [],

            updated_at: new Date().toISOString()
        }, {
            onConflict: 'brand_id'
        })

    if (diagnosticError) {
        console.error('❌ Error guardando diagnostic:', diagnosticError)
        throw diagnosticError
    }

    const updateData: any = {
        initial_diagnostic_status: 'completed',
        initial_diagnostic_completed_at: new Date().toISOString(),
        initial_diagnostic_data: diagnosticData
    }

    if (diagnosticData.brand_name) {
        updateData.name = diagnosticData.brand_name
    }

    if (diagnosticData.description) {
        updateData.description = diagnosticData.description
    }

    if (diagnosticData.logo?.url) {
        updateData.logo_url = diagnosticData.logo.url
    }

    const { error: brandError } = await supabase
        .from('brands')
        .update(updateData)
        .eq('id', job.brand_id)

    if (brandError) {
        console.error('❌ Error actualizando brand:', brandError)
        throw brandError
    }

    console.log('✅ Diagnóstico guardado y brand actualizado')
}

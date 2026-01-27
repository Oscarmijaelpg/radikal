import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { CheckCircle, FileText, Globe, LayoutGrid, Palette, Search, RefreshCw } from 'lucide-react';
import TagInput from '../components/TagInput';
import SectionCard from '../components/SectionCard';
import ColorPicker from '../components/ColorPicker';
import SocialLinks from '../components/SocialLinks';
import LogoEditor from '../components/LogoEditor';
import { toast } from 'sonner';

interface DiagnosticData {
  brand_id: string;
  brand_name: string;
  status: string;
  completed_at: string | null;
  has_diagnostic: boolean;
  diagnostic?: {
    brand_name: string | null;
    domain: string | null;
    description: string | null;
    colors_detected: Array<{ hex: string; name: string }>;
    brand_keywords: string[];
    products_detected: string[];
    seo_keywords: string[];
    logo: {
      url: string | null;
      base64: string | null;
      mime_type: string | null;
    };
    product_images: string[];
    social_media_detected: {
      website?: string | null;
      instagram?: string | null;
      facebook?: string | null;
      tiktok?: string | null;
      youtube?: string | null;
      whatsapp?: string | null;
      linkedin?: string | null;
    };
    sources: any[];
    created_at: string;
  };
}

const BrandAnalysisSkeleton = () => (
  <div className="p-6 lg:p-10 animate-fade-in font-display max-w-7xl mx-auto">
    <div className="mb-10 flex items-center gap-6">
      <div className="w-16 h-16 bg-slate-200 dark:bg-slate-700 rounded-2xl animate-pulse"></div>
      <div className="space-y-3">
        <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
        <div className="h-5 w-96 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse"></div>
      </div>
    </div>

    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-7 space-y-6">
        <div className="h-[600px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse shadow-sm"></div>
        <div className="h-40 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse shadow-sm"></div>
      </div>
      <div className="col-span-12 lg:col-span-5 space-y-6">
        <div className="h-[400px] bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse shadow-sm"></div>
        <div className="h-40 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 animate-pulse shadow-sm"></div>
      </div>
    </div>
  </div>
);


const BrandAnalysis: React.FC = () => {
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
  const [loadingSection, setLoadingSection] = useState<{ [key: string]: boolean }>({});

  const location = useLocation();
  const navigate = useNavigate();
  const { brand_id: stateBrandId } = location.state || {};
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [brandId, setBrandId] = useState<string | null>(stateBrandId || null);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);

  // State for Logo
  const [logoData, setLogoData] = useState<{ url: string | null; base64: string | null }>({ url: null, base64: null });

  // Original state for diffing
  const [originalState, setOriginalState] = useState<any>(null);

  // Form State
  const [brandName, setBrandName] = useState('');
  const [description, setDescription] = useState('');
  const [socials, setSocials] = useState({
    website: '',
    instagram: '',
    facebook: '',
    tiktok: ''
  });
  const [productTags, setProductTags] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [brandKeywords, setBrandKeywords] = useState<string[]>([]);
  const [seoKeywords, setSeoKeywords] = useState<string[]>([]);
  const [socialErrors, setSocialErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Si no tenemos brand_id, intentar obtenerlo
        if (!brandId) {
          console.log('🔍 No hay brand_id en state, obteniendo del usuario...');

          const { data: { user }, error: userError } = await supabase.auth.getUser();
          if (userError || !user) {
            throw new Error('Usuario no autenticado');
          }

          const { data: brandData, error: brandError } = await supabase
            .from('brands')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (brandError || !brandData) {
            throw new Error('No se encontró tu marca');
          }

          console.log('✅ Brand ID obtenido:', brandData.id);
          setBrandId(brandData.id);
          // IMPORTANTE: No marcamos isLoading(false) aquí. 
          // Esperamos a que el useEffect se dispare de nuevo con el ID para buscar la data.
          return;
        }

        const { data, error } = await supabase.functions.invoke(
          `get-diagnostic?brand_id=${brandId}`,
          { method: 'GET' }
        );

        if (error) throw error;
        if (!data) throw new Error('No se recibieron datos del diagnóstico');

        const diagnosticData = data as DiagnosticData;

        if (diagnosticData.has_diagnostic && diagnosticData.diagnostic) {
          const diag = diagnosticData.diagnostic;

          // Helper para asegurar que el base64 tenga el prefijo correcto
          const sanitizeBase64 = (b64: string | null, mimeType?: string | null) => {
            if (!b64) return null;
            if (b64.startsWith('data:')) return b64;
            // Si el backend no devuelve mime_type, asumimos png que es lo más común para logos
            const mime = mimeType || 'image/png';
            return `data:${mime};base64,${b64}`;
          };

          const initialData = {
            brandName: diag.brand_name || diagnosticData.brand_name || 'Marca Detectada',
            description: diag.description || 'Descripción no disponible.',
            socials: {
              website: diag.social_media_detected?.website || '',
              instagram: diag.social_media_detected?.instagram || '',
              facebook: diag.social_media_detected?.facebook || '',
              tiktok: diag.social_media_detected?.tiktok || ''
            },
            productTags: diag.products_detected || [],
            colors: (diag.colors_detected || []).map((c: any) => (typeof c === 'string' ? c : c.hex)),
            brandKeywords: diag.brand_keywords || [],
            seoKeywords: diag.seo_keywords || [],
            logo: {
              url: diag.logo?.url || null,
              base64: sanitizeBase64(diag.logo?.base64, diag.logo?.mime_type)
            }
          };

          setBrandName(initialData.brandName);
          setDescription(initialData.description);
          setSocials(initialData.socials);
          setProductTags(initialData.productTags);
          setColors(initialData.colors);
          setBrandKeywords(initialData.brandKeywords);
          setSeoKeywords(initialData.seoKeywords);
          setLogoData(initialData.logo);

          setOriginalState(JSON.parse(JSON.stringify(initialData)));

        } else {
          // No hay diagnóstico aún
          setBrandName(diagnosticData.brand_name || 'Marca');
          setDescription('Diagnóstico en proceso o no disponible.');

          // Set empty original state
          const emptyState = {
            brandName: diagnosticData.brand_name || 'Marca',
            description: 'Diagnóstico en proceso o no disponible.',
            socials: { website: '', instagram: '', facebook: '', tiktok: '' },
            productTags: [],
            colors: [],
            brandKeywords: [],
            seoKeywords: [],
            logo: { url: null, base64: null }
          };
          setOriginalState(emptyState);
        }

        // Solo aquí terminamos la carga
        setIsLoading(false);

      } catch (err: any) {
        console.error("Error fetching diagnostic:", err);
        setError(err.message || 'Error al cargar el diagnóstico');
        toast.error("Error al cargar los datos del diagnóstico");
        setIsLoading(false); // También terminamos si hay error
      }
    };

    fetchData();
  }, [brandId]);

  const toggleEdit = (section: string) => {
    setIsEditing(prev => ({ ...prev, [section]: !prev[section] }));
    if (section === 'description' && !isEditing[section]) {
      setSocialErrors({});
    }
  };

  const validateSocials = () => {
    const errors: { [key: string]: string } = {};
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;

    Object.entries(socials).forEach(([key, value]) => {
      if (value && !urlPattern.test(value)) {
        errors[key] = 'URL inválida';
      }
    });

    setSocialErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const hasChanges = (section: string) => {
    if (!originalState) return false;

    switch (section) {
      case 'description':
        return brandName !== originalState.brandName ||
          description !== originalState.description ||
          JSON.stringify(socials) !== JSON.stringify(originalState.socials) ||
          logoData.base64 !== originalState.logo.base64 ||
          logoData.url !== originalState.logo.url;
      case 'products':
        return JSON.stringify(productTags) !== JSON.stringify(originalState.productTags);
      case 'branding':
        return JSON.stringify(colors) !== JSON.stringify(originalState.colors) ||
          JSON.stringify(brandKeywords) !== JSON.stringify(originalState.brandKeywords);
      case 'seo':
        return JSON.stringify(seoKeywords) !== JSON.stringify(originalState.seoKeywords);
      default:
        return false;
    }
  };

  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleLogoChange = async (file: File) => {
    try {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("El archivo es demasiado grande. Máximo 2MB.");
        return;
      }
      const base64 = await toBase64(file);
      setLogoData({ base64: base64, url: null });
    } catch (e) {
      toast.error("Error procesando la imagen");
    }
  };

  const handleRemoveLogo = () => {
    setLogoData({ url: null, base64: null });
  };

  const handleRunDiagnostic = async () => {
    if (!brandId) {
      toast.error('No se encontró el ID de la marca');
      return;
    }

    setIsRunningDiagnostic(true);

    try {
      console.log('🚀 Iniciando nuevo diagnóstico...');

      // Usar los datos actuales del estado en lugar de consultar la base de datos
      // Esto evita errores de columnas inexistentes y usa la información más reciente
      const diagnosticData = {
        website: socials.website,
        linkedin: socials.instagram, // Nota: parece que linkedin se mapea a instagram en el estado
        instagram: socials.instagram,
        facebook: socials.facebook,
        tiktok: socials.tiktok,
      };

      console.log('📤 Enviando datos al edge function:', diagnosticData);

      // Llamar al edge function complete-onboarding
      const { data, error } = await supabase.functions.invoke(
        'complete-onboarding',
        {
          body: diagnosticData,
        }
      );

      if (error) {
        console.error('❌ Error del Edge Function:', error);
        throw new Error(error.message || 'Error al procesar la solicitud');
      }

      console.log('✅ Respuesta del edge function:', data);
      console.log('🔍 Tipo de data:', typeof data);
      console.log('🔍 data completo (JSON):', JSON.stringify(data, null, 2));

      if (!data?.success) {
        console.error('❌ Edge function retornó success=false');
        console.error('❌ data.success:', data?.success);
        console.error('❌ data.error:', data?.error);
        throw new Error(data?.error || 'Error desconocido en el servidor');
      }

      console.log('🔍 Verificando brand_id y job_id...');
      console.log('🔍 data.brand_id:', data.brand_id, '(tipo:', typeof data.brand_id, ')');
      console.log('🔍 data.job_id:', data.job_id, '(tipo:', typeof data.job_id, ')');

      if (!data?.brand_id || !data?.job_id) {
        console.error('❌ Respuesta del servidor incompleta');
        console.error('❌ Falta brand_id:', !data?.brand_id);
        console.error('❌ Falta job_id:', !data?.job_id);
        throw new Error('Respuesta del servidor incompleta: faltan brand_id o job_id');
      }

      toast.success('¡Diagnóstico iniciado!');

      // Navegar a la pantalla de Scanning con los IDs
      console.log('🚀 Preparando navegación a Scanning...');
      console.log('📦 State a enviar:', {
        brand_id: data.brand_id,
        job_id: data.job_id,
      });

      navigate('/scanning', {
        state: {
          brand_id: data.brand_id,
          job_id: data.job_id,
        },
      });

      console.log('✅ Navegación ejecutada');
    } catch (error: any) {
      console.error('❌ Error en diagnóstico:', error);
      toast.error(error.message || 'Error al iniciar el diagnóstico. Por favor intenta nuevamente.');
    } finally {
      setIsRunningDiagnostic(false);
    }
  };


  const handleSave = async (section: string) => {
    if (!brandId) return;

    if (!hasChanges(section)) {
      toast.info("No hay cambios para guardar.");
      toggleEdit(section);
      return;
    }

    // Validation
    if (section === 'description') {
      if (!brandName.trim()) {
        toast.error("El nombre de la marca es obligatorio");
        return;
      }
      if (!validateSocials()) {
        toast.error("Por favor corrige los errores en las redes sociales");
        return;
      }
    }

    setLoadingSection(prev => ({ ...prev, [section]: true }));

    try {
      // 1. Update 'brands' table for basic info
      if (section === 'description') {
        console.log('📝 Actualizando tabla brands...');
        const { error: brandError } = await supabase
          .from('brands')
          .update({
            name: brandName,
            description: description,
            logo_base64: logoData.base64,
            logo_url: logoData.url,
            updated_at: new Date().toISOString()
          })
          .eq('id', brandId);

        if (brandError) {
          console.error('❌ Error actualizando brands:', brandError);
          throw brandError;
        }
        console.log('✅ Tabla brands actualizada');
      }

      // 2. Prepare diagnostic update
      const diagnosticUpdate: any = {
        brand_id: brandId,
        updated_at: new Date().toISOString()
      };

      if (section === 'description') {
        diagnosticUpdate.brand_name = brandName;
        diagnosticUpdate.description = description;
        diagnosticUpdate.social_media_detected = socials;
        diagnosticUpdate.logo_base64 = logoData.base64;
        diagnosticUpdate.logo_url = logoData.url;
      }

      if (section === 'products') {
        diagnosticUpdate.products_detected = productTags;
      }

      if (section === 'branding') {
        diagnosticUpdate.colors_detected = colors.map(c => ({ hex: c, name: '' }));
        diagnosticUpdate.brand_keywords = brandKeywords;
      }

      if (section === 'seo') {
        diagnosticUpdate.seo_keywords = seoKeywords;
      }

      // 3. UPSERT to initial_diagnostics
      console.log('📝 Guardando en initial_diagnostics:', diagnosticUpdate);

      const { data: diagData, error: diagError } = await supabase
        .from('initial_diagnostics')
        .upsert(diagnosticUpdate, {
          onConflict: 'brand_id'
        })
        .select();

      if (diagError) {
        console.error('❌ Error en initial_diagnostics:', diagError);
        throw diagError;
      }

      console.log('✅ Datos guardados correctamente en initial_diagnostics:', diagData);

      // 4. Update original state
      setOriginalState((prev: any) => {
        const newState = { ...prev };
        if (section === 'description') {
          newState.brandName = brandName;
          newState.description = description;
          newState.socials = { ...socials };
          newState.logo = { ...logoData };
        }
        if (section === 'products') newState.productTags = [...productTags];
        if (section === 'branding') {
          newState.colors = [...colors];
          newState.brandKeywords = [...brandKeywords];
        }
        if (section === 'seo') newState.seoKeywords = [...seoKeywords];
        return newState;
      });

      toast.success("Cambios guardados correctamente");
      toggleEdit(section);

    } catch (err: any) {
      console.error("❌ Error completo:", err);
      toast.error("Error al guardar: " + (err.message || 'Error desconocido'));
    } finally {
      setLoadingSection(prev => ({ ...prev, [section]: false }));
    }
  };

  // Tag Helpers
  const handleAddTag = (stateSetter: React.Dispatch<React.SetStateAction<string[]>>, tags: string[], tag: string) => {
    if (tag.trim() && !tags.includes(tag)) {
      stateSetter([...tags, tag.trim()]);
    }
  };

  const handleRemoveTag = (stateSetter: React.Dispatch<React.SetStateAction<string[]>>, tags: string[], tag: string) => {
    stateSetter(tags.filter(t => t !== tag));
  };

  if (isLoading) {
    return <BrandAnalysisSkeleton />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Error al cargar</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors w-full">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-10 animate-fade-in font-display max-w-7xl mx-auto">
      <header className="mb-10 flex items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-2xl shadow-sm border border-primary/20">
            <CheckCircle className="text-primary w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Análisis de Marca</h1>
            <p className="text-slate-500 mt-1 text-lg">Resultados del diagnóstico para <span className="font-bold text-slate-900">{brandName}</span>.</p>
          </div>
        </div>

        {/* Botón de Nuevo Diagnóstico */}
        <button
          onClick={handleRunDiagnostic}
          disabled={isRunningDiagnostic}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-primary"
        >
          {isRunningDiagnostic ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Iniciando...
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              Nuevo Diagnóstico
            </>
          )}
        </button>
      </header>

      <div className="grid grid-cols-12 gap-6">

        {/* Left Column */}
        <div className="col-span-12 lg:col-span-7 space-y-6">

          {/* Brand Description & Name */}
          <SectionCard
            title="Información General"
            icon={FileText}
            isEditing={isEditing['description'] || false}
            loading={loadingSection['description']}
            onEdit={() => toggleEdit('description')}
            onSave={() => handleSave('description')}
            headerContent={null}
          >
            <div className="space-y-6">
              {/* Brand Name */}
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Nombre de la Marca</label>
                {isEditing['description'] ? (
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    placeholder="Nombre de tu marca"
                  />
                ) : (
                  <h3 className="text-2xl font-bold text-slate-900">{brandName}</h3>
                )}
              </div>

              {/* Description */}
              <div className="prose max-w-none">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Descripción</label>
                {isEditing['description'] ? (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none leading-relaxed text-base"
                    placeholder="Describe tu marca..."
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed text-lg bg-white/50 p-4 rounded-2xl border border-transparent">
                    {description}
                  </p>
                )}
              </div>

            </div>

            <div className="pt-6 border-t border-slate-100">
              <LogoEditor
                logoUrl={logoData.url}
                base64={logoData.base64}
                isEditing={isEditing['description'] || false}
                onLogoChange={handleLogoChange}
                onRemove={handleRemoveLogo}
              />
            </div>

            <div className="pt-6 border-t border-slate-100">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Redes Sociales</p>
              <SocialLinks
                socials={socials}
                onChange={(key, value) => {
                  setSocials(prev => ({ ...prev, [key]: value }));
                  if (socialErrors[key]) setSocialErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[key];
                    return newErrors;
                  });
                }}
                isEditing={isEditing['description'] || false}
                errors={socialErrors}
              />
            </div>
          </SectionCard>

          {/* Detected Products */}
          <SectionCard
            title="Productos Detectados"
            icon={LayoutGrid}
            isEditing={isEditing['products'] || false}
            loading={loadingSection['products']}
            onEdit={() => toggleEdit('products')}
            onSave={() => handleSave('products')}
          >
            {isEditing['products'] ? (
              <TagInput
                tags={productTags}
                onAdd={(tag) => handleAddTag(setProductTags, productTags, tag)}
                onRemove={(tag) => handleRemoveTag(setProductTags, productTags, tag)}
                placeholder="Añadir producto..."
                title='Productos'
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {productTags.length > 0 ? (
                  productTags.map((tag, idx) => (
                    <span key={idx} className="px-4 py-2 bg-slate-100 rounded-full text-sm font-semibold text-slate-700 border border-slate-200 hover:bg-slate-200 transition-colors cursor-default">
                      {tag}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No se detectaron productos</p>
                )}
              </div>
            )}
          </SectionCard>
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-5 space-y-6">

          {/* Branding */}
          <SectionCard
            title="Identidad de Marca"
            icon={Palette}
            isEditing={isEditing['branding'] || false}
            loading={loadingSection['branding']}
            onEdit={() => toggleEdit('branding')}
            onSave={() => handleSave('branding')}
          >
            <div className="space-y-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Paleta de Colores</p>
                <ColorPicker
                  colors={colors}
                  onChange={setColors}
                  isEditing={isEditing['branding'] || false}
                />
              </div>

              <div className="pt-6 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Palabras Clave</p>
                {isEditing['branding'] ? (
                  <TagInput
                    tags={brandKeywords}
                    onAdd={(tag) => handleAddTag(setBrandKeywords, brandKeywords, tag)}
                    onRemove={(tag) => handleRemoveTag(setBrandKeywords, brandKeywords, tag)}
                    placeholder="Nueva palabra clave..."
                    title="Keywords"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {brandKeywords.length > 0 ? (
                      brandKeywords.map(kw => (
                        <span key={kw} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 shadow-sm">{kw}</span>
                      ))
                    ) : (
                      <p className="text-slate-400 italic">No se detectaron palabras clave</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </SectionCard>

          {/* SEO */}
          <SectionCard
            title="Estrategia SEO"
            icon={Search}
            isEditing={isEditing['seo'] || false}
            loading={loadingSection['seo']}
            onEdit={() => toggleEdit('seo')}
            onSave={() => handleSave('seo')}
          >
            {isEditing['seo'] ? (
              <TagInput
                tags={seoKeywords}
                onAdd={(tag) => handleAddTag(setSeoKeywords, seoKeywords, tag)}
                onRemove={(tag) => handleRemoveTag(setSeoKeywords, seoKeywords, tag)}
                placeholder="Añadir palabra SEO..."
                title="SEO Keywords"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {seoKeywords.length > 0 ? (
                  seoKeywords.map((word) => (
                    <span key={word} className="px-3 py-1.5 bg-primary/5 text-primary border border-primary/20 rounded-lg text-xs font-semibold">
                      {word}
                    </span>
                  ))
                ) : (
                  <p className="text-slate-400 italic">No se detectaron palabras SEO</p>
                )}
              </div>
            )}
          </SectionCard>
        </div>

      </div>
    </div>
  );
};

export default BrandAnalysis;
// BrandAnalysis Screen - Refactored with Clean Architecture
// Orchestrator component using feature-based components and hooks

import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@infrastructure/api/supabase';
import { toast } from 'sonner';

// Feature imports
import { useBrandAnalysis } from '../hooks/useBrandAnalysis';
import { useBrandUpdate } from '../hooks/useBrandUpdate';
import { GeneralInfo } from '../components/GeneralInfo';
import { ProductsSection } from '../components/ProductsSection';
import { BrandingSection } from '../components/BrandingSection';
import { SEOSection } from '../components/SEOSection';
import { PositioningSection } from '../components/PositioningSection';
import { HistorySection } from '../components/HistorySection';
import { AudienceSection } from '../components/AudienceSection';
import { OperationsSection } from '../components/OperationsSection';

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
  const location = useLocation();
  const navigate = useNavigate();
  const { brand_id: stateBrandId } = location.state || {};
  const [brandId] = useState<string | null>(stateBrandId || null);

  // Custom hooks for data and updates
  const { data, setData, originalState, setOriginalState, isLoading, error } = useBrandAnalysis(brandId);
  const { save, loadingSection, hasChanges, validateSocials } = useBrandUpdate(brandId);

  // UI state
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});
  const [socialErrors, setSocialErrors] = useState<{ [key: string]: string }>({});
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);

  // Toggle edit mode
  const toggleEdit = (section: string) => {
    setIsEditing(prev => ({ ...prev, [section]: !prev[section] }));
    if (section === 'description' && !isEditing[section]) {
      setSocialErrors({});
    }
  };

  // Save handler
  const handleSave = async (section: string) => {
    if (!data) return;

    const success = await save(section, data, originalState, (updatedData) => {
      // Update original state after successful save
      setOriginalState(JSON.parse(JSON.stringify(updatedData)));
    });

    if (success) {
      toggleEdit(section);
    }
  };

  // Logo handlers
  const toBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleLogoChange = async (file: File) => {
    if (!data) return;
    try {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("El archivo es demasiado grande. Máximo 2MB.");
        return;
      }
      const base64 = await toBase64(file);
      setData({ ...data, logo: { base64, url: null } });
    } catch (e) {
      toast.error("Error procesando la imagen");
    }
  };

  const handleRemoveLogo = () => {
    if (!data) return;
    setData({ ...data, logo: { url: null, base64: null } });
  };

  // Tag handlers
  const handleAddTag = (setter: (tags: string[]) => void, tags: string[], tag: string) => {
    if (tag.trim() && !tags.includes(tag)) {
      setter([...tags, tag.trim()]);
    }
  };

  const handleRemoveTag = (setter: (tags: string[]) => void, tags: string[], tag: string) => {
    setter(tags.filter(t => t !== tag));
  };

  // Social change handler
  const handleSocialChange = (key: string, value: string) => {
    if (!data) return;
    setData({
      ...data,
      socials: { ...data.socials, [key]: value }
    });
    if (socialErrors[key]) {
      const newErrors = { ...socialErrors };
      delete newErrors[key];
      setSocialErrors(newErrors);
    }
  };

  // Run new diagnostic
  const handleRunDiagnostic = async () => {
    if (!brandId) {
      toast.error('No se encontró el ID de la marca');
      return;
    }

    setIsRunningDiagnostic(true);

    try {
      const diagnosticData = {
        website: data?.socials.website || '',
        instagram: data?.socials.instagram || '',
        tax_id: '', // Not stored in diagnostic data
      };

      const { data: response, error } = await supabase.functions.invoke(
        'complete-onboarding',
        { body: diagnosticData }
      );

      if (error) throw new Error(error.message || 'Error al procesar la solicitud');
      if (!response?.success) throw new Error(response?.error || 'Error desconocido en el servidor');
      if (!response?.brand_id || !response?.job_id) throw new Error('Respuesta del servidor incompleta');

      toast.success('¡Diagnóstico iniciado!');
      navigate('/scanning', {
        state: {
          brand_id: response.brand_id,
          job_id: response.job_id,
        },
      });
    } catch (error: any) {
      console.error('Error en diagnóstico:', error);
      toast.error(error.message || 'Error al iniciar el diagnóstico');
    } finally {
      setIsRunningDiagnostic(false);
    }
  };

  // Loading state
  if (isLoading) {
    return <BrandAnalysisSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Error al cargar</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors w-full"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="p-6 lg:p-10 animate-fade-in font-display max-w-7xl mx-auto">
      <header className="mb-10 flex items-center justify-between gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-primary/10 flex items-center justify-center rounded-2xl shadow-sm border border-primary/20">
            <CheckCircle className="text-primary w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Análisis de Marca</h1>
            <p className="text-slate-500 mt-1 text-lg">
              Resultados del diagnóstico para <span className="font-bold text-slate-900">{data.brandName}</span>.
            </p>
          </div>
        </div>

        {/* New Diagnostic Button */}
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
          <GeneralInfo
            data={data}
            isEditing={isEditing['description'] || false}
            loading={loadingSection['description'] || false}
            socialErrors={socialErrors}
            onEdit={() => toggleEdit('description')}
            onSave={() => handleSave('description')}
            onBrandNameChange={(value) => setData({ ...data, brandName: value })}
            onDescriptionChange={(value) => setData({ ...data, description: value })}
            onLogoChange={handleLogoChange}
            onLogoRemove={handleRemoveLogo}
            onSocialChange={handleSocialChange}
          />

          <ProductsSection
            productTags={data.productTags}
            isEditing={isEditing['products'] || false}
            loading={loadingSection['products'] || false}
            onEdit={() => toggleEdit('products')}
            onSave={() => handleSave('products')}
            onAddTag={(tag) => handleAddTag((tags) => setData({ ...data, productTags: tags }), data.productTags, tag)}
            onRemoveTag={(tag) => handleRemoveTag((tags) => setData({ ...data, productTags: tags }), data.productTags, tag)}
          />
        </div>

        {/* Right Column */}
        <div className="col-span-12 lg:col-span-5 space-y-6">
          <BrandingSection
            colors={data.colors}
            brandKeywords={data.brandKeywords}
            isEditing={isEditing['branding'] || false}
            loading={loadingSection['branding'] || false}
            onEdit={() => toggleEdit('branding')}
            onSave={() => handleSave('branding')}
            onColorsChange={(colors) => setData({ ...data, colors })}
            onAddKeyword={(kw) => handleAddTag((tags) => setData({ ...data, brandKeywords: tags }), data.brandKeywords, kw)}
            onRemoveKeyword={(kw) => handleRemoveTag((tags) => setData({ ...data, brandKeywords: tags }), data.brandKeywords, kw)}
          />

          <SEOSection
            seoKeywords={data.seoKeywords}
            isEditing={isEditing['seo'] || false}
            loading={loadingSection['seo'] || false}
            onEdit={() => toggleEdit('seo')}
            onSave={() => handleSave('seo')}
            onAddKeyword={(kw) => handleAddTag((tags) => setData({ ...data, seoKeywords: tags }), data.seoKeywords, kw)}
            onRemoveKeyword={(kw) => handleRemoveTag((tags) => setData({ ...data, seoKeywords: tags }), data.seoKeywords, kw)}
          />
        </div>
      </div>

      {/* New Sections - Full Width */}
      <div className="mt-6 space-y-6">
        <PositioningSection
          data={data}
          isEditing={isEditing['positioning'] || false}
          loading={loadingSection['positioning'] || false}
          onEdit={() => toggleEdit('positioning')}
          onSave={() => handleSave('positioning')}
        />

        <HistorySection
          data={data}
          isEditing={isEditing['history'] || false}
          loading={loadingSection['history'] || false}
          onEdit={() => toggleEdit('history')}
          onSave={() => handleSave('history')}
        />

        <AudienceSection
          data={data}
          isEditing={isEditing['audience'] || false}
          loading={loadingSection['audience'] || false}
          onEdit={() => toggleEdit('audience')}
          onSave={() => handleSave('audience')}
        />

        <OperationsSection
          data={data}
          isEditing={isEditing['operations'] || false}
          loading={loadingSection['operations'] || false}
          onEdit={() => toggleEdit('operations')}
          onSave={() => handleSave('operations')}
        />
      </div>
    </div>
  );
};

export default BrandAnalysis;
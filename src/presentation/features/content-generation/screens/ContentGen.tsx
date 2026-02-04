import React, { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from "@context/AuthContext";
import { toast } from 'sonner';

// Hooks
import { useBrandData } from "../hooks/useBrandData";
import { useRecommendations } from "../hooks/useRecommendations";
import { useImageGeneration } from "../hooks/useImageGeneration";

// Components
import { RecommendationCard } from "../components/RecommendationCard";
import { CustomCard } from "../components/CustomCard";
import { SelectedCardDetails } from "../components/SelectedCardDetails";
import { CustomPromptSection } from "../components/CustomPromptSection";
import { PlatformSelector } from "../components/PlatformSelector";
import { MediaUpload } from "../components/MediaUpload";

// Types & Constants
import { ContentRecommendation } from "../components/types";
import { PLATFORMS } from "../components/constants";

const ContentGen: React.FC = () => {
  const { user } = useAuth();

  // Custom Hooks
  const { brandId } = useBrandData(user?.id);
  const { recommendations, isLoading, isGenerating, generate } = useRecommendations(brandId);
  const {
    generatedImages,
    isGeneratingImage,
    imageError,
    generateImage,
    clearImages
  } = useImageGeneration();

  // Local State
  const [selectedCard, setSelectedCard] = useState<ContentRecommendation | 'custom' | null>(null);
  const [customPrompt, setCustomPrompt] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [activePlatform, setActivePlatform] = useState('Instagram');

  // Handlers
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const onGenerate = async () => {
    if (!selectedCard) {
      toast.error('Selecciona una recomendación o personalizada');
      return;
    }

    if (selectedCard === 'custom' && !customPrompt.trim()) {
      toast.error('Escribe un prompt personalizado');
      return;
    }

    if (!brandId) {
      toast.error('No se encontró la marca');
      return;
    }

    await generateImage(
      selectedCard,
      customPrompt,
      activePlatform,
      uploadedFiles,
      brandId
    );
  };

  const handleRegenerate = () => {
    clearImages();
    onGenerate();
  };

  const handleDownloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `radikal-image-${index + 1}.jpg`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-theme(spacing.20))]">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[80px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 bg-blue-400/20 rounded-full blur-[80px] pointer-events-none z-0"></div>

      <div className="p-6 lg:p-12 relative z-10 animate-fade-in">
        {/* Floating regenerate button */}
        {!isGenerating && (
          <button
            onClick={generate}
            className="fixed bottom-8 right-8 bg-gradient-to-r from-primary to-pink-500 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform z-50 flex items-center gap-2"
            title="Regenerar recomendaciones"
          >
            <Sparkles className="w-6 h-6" />
            <span className="font-bold text-sm hidden md:inline">Regenerar</span>
          </button>
        )}

        <header className="max-w-6xl mx-auto mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">
            Generación Radikal <span className="text-primary">Insights v3</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg">
            Inteligencia competitiva avanzada para tu contenido.
          </p>
        </header>

        <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

          {/* Left Column - Recommendations Cards */}
          <div className="xl:col-span-4 flex flex-col gap-4">
            {isLoading ? (
              // Skeleton loading
              <>
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="glass-card p-5 rounded-2xl shadow-xl border-l-4 border-l-slate-200 bg-white/70 animate-pulse">
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* Recommendation cards */}
                {recommendations.map((rec) => (
                  <RecommendationCard
                    key={rec.id}
                    recommendation={rec}
                    isSelected={selectedCard !== null && typeof selectedCard !== 'string' && selectedCard.id === rec.id}
                    onClick={() => setSelectedCard(rec)}
                  />
                ))}

                {/* Custom card */}
                <CustomCard
                  isSelected={selectedCard === 'custom'}
                  onClick={() => setSelectedCard('custom')}
                />
              </>
            )}

            {/* Loading indicator */}
            {isGenerating && (
              <div className="glass-card p-5 rounded-2xl shadow-xl bg-primary/10 border-l-4 border-l-primary flex items-center gap-3">
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                <p className="text-sm font-bold text-primary">Generando recomendaciones...</p>
              </div>
            )}
          </div>

          {/* Center Column - Main Form */}
          <div className="xl:col-span-8">
            <div className="glass-card p-8 lg:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group bg-white/80 border border-white/60">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all duration-700 rounded-full"></div>

              <form className="space-y-8 relative z-10" onSubmit={(e) => { e.preventDefault(); onGenerate(); }}>

                {/* Selected Card Details */}
                {selectedCard && selectedCard !== 'custom' && (
                  <SelectedCardDetails recommendation={selectedCard as ContentRecommendation} />
                )}

                {/* Custom Prompt */}
                {selectedCard === 'custom' && (
                  <CustomPromptSection
                    value={customPrompt}
                    onChange={setCustomPrompt}
                  />
                )}

                {/* Platforms */}
                <PlatformSelector
                  platforms={PLATFORMS}
                  activePlatform={activePlatform}
                  onSelect={setActivePlatform}
                />

                {/* Media Upload */}
                <MediaUpload
                  uploadedFiles={uploadedFiles}
                  onFileUpload={handleFileUpload}
                  onRemoveFile={removeFile}
                />

                {/* Submit */}
                <div className="pt-4 text-center">
                  <button
                    type="submit"
                    disabled={!selectedCard || isGeneratingImage}
                    className={`w-full font-bold py-5 rounded-[1.5rem] shadow-xl transform hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3
                      ${selectedCard && !isGeneratingImage
                        ? 'bg-primary hover:bg-primary/90 text-white shadow-primary/30'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'}`}
                  >
                    {isGeneratingImage ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Generando Imágenes...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        Generar Contenido Ahora
                      </>
                    )}
                  </button>
                  <p className="mt-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Potenciado por Radikal AI Intelligence + n8n
                  </p>
                </div>

                {/* Generated Images Display */}
                {generatedImages.length > 0 && (
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-slate-900">
                        Imágenes Generadas ({generatedImages.length})
                      </h3>
                      <button
                        onClick={handleRegenerate}
                        className="px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Sparkles className="w-4 h-4" />
                        Regenerar
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {generatedImages.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Generada ${index + 1}`}
                            className="w-full h-auto rounded-2xl shadow-lg"
                            onError={() => toast.error(`Error cargando imagen ${index + 1}`)}
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center gap-3">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDownloadImage(imageUrl, index);
                              }}
                              className="px-4 py-2 bg-white text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                            >
                              Descargar
                            </button>
                            <a
                              href={imageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-white text-primary rounded-lg font-semibold hover:bg-primary hover:text-white transition-colors"
                            >
                              Ver
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {imageError && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-red-700 font-medium">❌ {imageError}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentGen;
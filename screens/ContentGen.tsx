import React, { useState, useEffect } from 'react';
import {
  Camera,
  Music,
  Facebook,
  MonitorPlay,
  Sparkles,
  CloudUpload,
  MessageSquare,
  TrendingUp,
  Calendar,
  Radar,
  Edit3,
  Loader2,
  Target,
  FileText,
  X,
  Download,
  RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/context/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';

interface ContentRecommendation {
  id: string;
  recommendation_type: string;
  title: string;
  paragraph: string;
  recommended_format: string;
  recommended_objective: string;
  recommended_idea: string;
  required_elements: string[];
  ai_brief: string;
  status: string;
  created_at: string;
}

// Datos de ejemplo para cuando no hay recomendaciones
const EXAMPLE_RECOMMENDATIONS: ContentRecommendation[] = [
  {
    id: 'example-1',
    recommendation_type: 'comentarios',
    title: 'Oportunidad detectada: Interacción con audiencia',
    paragraph: 'Analizando los comentarios de tus publicaciones, hemos detectado que tu audiencia tiene gran interés en conocer más sobre tu proceso de producción y los ingredientes que utilizas.',
    recommended_format: 'carrusel',
    recommended_objective: 'engagement',
    recommended_idea: 'Carrusel mostrando el "detrás de cámaras" de tu proceso de creación, destacando ingredientes premium y técnicas artesanales.',
    required_elements: [
      'Fotos del proceso de producción',
      'Lista de ingredientes principales',
      'Testimonios de clientes satisfechos',
      'Call to action invitando a preguntar'
    ],
    ai_brief: 'Crear contenido educativo que responda a las preguntas frecuentes de tu audiencia, mostrando transparencia en el proceso y generando confianza mediante storytelling visual.',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'example-2',
    recommendation_type: 'mejores_post',
    title: 'Replica el éxito de tus mejores publicaciones',
    paragraph: 'Tus publicaciones con mayor engagement comparten un patrón: contenido emocional auténtico que conecta con la nostalgia y experiencias compartidas de tu audiencia.',
    recommended_format: 'video corto',
    recommended_objective: 'viralidad',
    recommended_idea: 'Video corto estilo "throwback" mostrando la evolución de tu marca, desde los inicios hasta hoy, con música emotiva.',
    required_elements: [
      'Fotos antiguas de tu negocio',
      'Video clips de momentos importantes',
      'Música nostálgica de fondo',
      'Texto overlay con hitos clave'
    ],
    ai_brief: 'Aprovechar el poder del storytelling y la nostalgia para crear conexión emocional con la audiencia, replicando el formato de tus posts más exitosos.',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'example-3',
    recommendation_type: 'proximas_fechas',
    title: 'Oportunidad: San Valentín se acerca',
    paragraph: 'El Día de San Valentín es una fecha clave para tu sector. Es momento de posicionar tus productos como el regalo perfecto para celebrar el amor en todas sus formas.',
    recommended_format: 'carrusel',
    recommended_objective: 'ventas',
    recommended_idea: 'Carrusel temático "Endulza tu San Valentín" mostrando diferentes opciones de regalo, combos especiales y packaging romántico.',
    required_elements: [
      '4-5 fotos de productos con ambientación romántica',
      'Precios y combos especiales',
      'Información de pedidos anticipados',
      'Canales de contacto (WhatsApp/teléfono)'
    ],
    ai_brief: 'Crear campaña de San Valentín que posicione tus productos como la elección perfecta para celebrar, con énfasis en calidad, sabor único y experiencia compartida.',
    status: 'active',
    created_at: new Date().toISOString()
  },
  {
    id: 'example-4',
    recommendation_type: 'radar_tendencias',
    title: 'Tendencia detectada: Contenido educativo en auge',
    paragraph: 'El contenido educativo tipo "tips" y "sabías que" está generando alto engagement en tu nicho. Tu audiencia valora aprender mientras se entretiene.',
    recommended_format: 'reel',
    recommended_objective: 'alcance',
    recommended_idea: 'Reel educativo estilo "3 secretos que no sabías sobre [tu producto]" con texto dinámico y música trending.',
    required_elements: [
      'Datos interesantes o curiosidades',
      'Visual atractivo y dinámico',
      'Música trending de TikTok/Reels',
      'Texto en pantalla fácil de leer'
    ],
    ai_brief: 'Aprovechar la tendencia de contenido educativo entretenido para aumentar alcance y posicionarse como experto en el tema, usando formatos virales actuales.',
    status: 'active',
    created_at: new Date().toISOString()
  }
];

const ContentGen: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados
  const [brandId, setBrandId] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [selectedCard, setSelectedCard] = useState<ContentRecommendation | 'custom' | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [activePlatform, setActivePlatform] = useState('Instagram');

  // Estados para generación de imágenes
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);

  const platforms = [
    { name: 'Instagram', icon: <Camera className="w-8 h-8 mb-1" /> },
    { name: 'TikTok', icon: <Music className="w-8 h-8 mb-1" /> },
    { name: 'Facebook', icon: <Facebook className="w-8 h-8 mb-1" /> },
    { name: 'YouTube', icon: <MonitorPlay className="w-8 h-8 mb-1" /> },
  ];

  // Iconos para cada tipo de recomendación
  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case 'comentarios':
        return <MessageSquare className="w-5 h-5" />;
      case 'mejores_post':
        return <TrendingUp className="w-5 h-5" />;
      case 'proximas_fechas':
        return <Calendar className="w-5 h-5" />;
      case 'radar_tendencias':
        return <Radar className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  // Colores para cada tipo
  const getRecommendationColor = (type: string) => {
    switch (type) {
      case 'comentarios':
        return 'border-l-primary';
      case 'mejores_post':
        return 'border-l-blue-400';
      case 'proximas_fechas':
        return 'border-l-emerald-400';
      case 'radar_tendencias':
        return 'border-l-indigo-400';
      default:
        return 'border-l-slate-400';
    }
  };

  // Títulos legibles
  const getRecommendationLabel = (type: string) => {
    switch (type) {
      case 'comentarios':
        return 'Comentarios';
      case 'mejores_post':
        return 'Mejores Posts';
      case 'proximas_fechas':
        return 'Próximas Fechas';
      case 'radar_tendencias':
        return 'Tendencias';
      default:
        return type;
    }
  };

  // 1. Obtener brand_id del usuario
  useEffect(() => {
    const fetchBrandId = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (error) throw error;

        if (data) {
          setBrandId(data.id);
        } else {
          toast.error('No se encontró una marca asociada');
        }
      } catch (error) {
        console.error('Error obteniendo brand_id:', error);
        toast.error('Error al cargar la marca');
      }
    };

    fetchBrandId();
  }, [user]);

  // 2. Consultar recomendaciones cuando se tenga el brand_id
  useEffect(() => {
    if (!brandId) return;

    // Por ahora solo consultamos, no generamos
    fetchExistingRecommendations();
  }, [brandId]);

  // Consultar recomendaciones existentes (sin generar)
  const fetchExistingRecommendations = async () => {
    if (!brandId) return;

    setIsLoading(true);

    try {
      console.log('🔍 Consultando recomendaciones existentes...');

      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-content-recommendations?brand_id=${brandId}`,
        {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al consultar recomendaciones');
      }

      console.log('✅ Resultado:', result);

      if (result.has_recommendations && result.recommendations.length > 0) {
        setRecommendations(result.recommendations);
        toast.success(`${result.recommendations.length} recomendaciones cargadas`);
      } else {
        // Usar datos de ejemplo
        console.log('⚠️ No hay recomendaciones, usando datos de ejemplo');
        setRecommendations(EXAMPLE_RECOMMENDATIONS);
        toast.info('Mostrando recomendaciones de ejemplo. Configura n8n para generar recomendaciones personalizadas.');
      }
    } catch (error: any) {
      console.error('❌ Error consultando recomendaciones:', error);
      toast.error(error.message || 'Error al consultar recomendaciones');
    } finally {
      setIsLoading(false);
    }
  };

  // Generar recomendaciones
  const generateRecommendations = async () => {
    if (!brandId) return;

    setIsLoading(true);
    setIsGenerating(true);

    try {
      console.log('🚀 Iniciando generación de recomendaciones...');

      // Llamar a la Edge Function
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/generate-content-recommendations`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ brand_id: brandId }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al generar recomendaciones');
      }

      console.log('✅ Job creado:', result.job_id);
      toast.success('Generando recomendaciones...');

      // Iniciar polling
      pollRecommendations(result.job_id);
    } catch (error: any) {
      console.error('❌ Error generando recomendaciones:', error);
      toast.error(error.message || 'Error al generar recomendaciones');
      setIsLoading(false);
      setIsGenerating(false);
    }
  };

  // Polling para esperar las recomendaciones
  const pollRecommendations = async (jobId: string) => {
    const maxAttempts = 40; // 2 minutos máximo (40 * 3 segundos)
    let attempts = 0;

    const poll = async () => {
      try {
        attempts++;
        console.log(`🔄 Polling intento ${attempts}/${maxAttempts}`);

        const { data: { session } } = await supabase.auth.getSession();

        const response = await fetch(
          `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-content-recommendations?brand_id=${brandId}`,
          {
            headers: {
              'Authorization': `Bearer ${session?.access_token}`,
            },
          }
        );

        const result = await response.json();

        if (result.has_recommendations && result.recommendations.length > 0) {
          console.log('✅ Recomendaciones listas:', result.recommendations.length);
          setRecommendations(result.recommendations);
          setIsLoading(false);
          setIsGenerating(false);
          toast.success('Recomendaciones generadas exitosamente');
          return;
        }

        // Si aún está procesando
        if (result.is_processing) {
          if (attempts < maxAttempts) {
            setTimeout(poll, 3000); // Reintentar en 3 segundos
          } else {
            throw new Error('Timeout esperando recomendaciones');
          }
        } else {
          // No está procesando pero tampoco tiene recomendaciones
          if (attempts < maxAttempts) {
            setTimeout(poll, 3000);
          } else {
            throw new Error('No se generaron recomendaciones');
          }
        }
      } catch (error: any) {
        console.error('❌ Error en polling:', error);
        toast.error(error.message || 'Error al obtener recomendaciones');
        setIsLoading(false);
        setIsGenerating(false);
      }
    };

    poll();
  };

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files]);
  };

  // Remove file
  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Handle generate - Genera imagen usando OpenRouter
  const onGenerate = async () => {
    if (!selectedCard) {
      toast.error('Selecciona una recomendación o personalizada');
      return;
    }

    if (selectedCard === 'custom' && !customPrompt.trim()) {
      toast.error('Escribe un prompt personalizado');
      return;
    }

    setIsGeneratingImage(true);
    setImageError(null);
    setGeneratedImage(null);

    try {
      // Construir el prompt usando los datos de la tarjeta
      let imagePrompt = '';

      if (selectedCard === 'custom') {
        imagePrompt = customPrompt;
      } else {
        // Usar los datos de la recomendación para crear un prompt rico
        const card = selectedCard as ContentRecommendation;
        imagePrompt = `Create a ${card.recommended_format} image for ${activePlatform}. 
Theme: ${card.title}
Context: ${card.paragraph}
Idea: ${card.recommended_idea}
Objective: ${card.recommended_objective}
Style: Professional, modern, eye-catching for social media
Required elements: ${card.required_elements.join(', ')}`;
      }

      console.log('🎨 Generando imagen con OpenRouter...');
      console.log('📝 Prompt:', imagePrompt);

      // Llamar a OpenRouter directamente (o a tu edge function si la tienes)
      const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

      if (!OPENROUTER_API_KEY) {
        throw new Error('VITE_OPENROUTER_API_KEY no está configurada en .env.local');
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Radikal AI'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3.5-sonnet', // Usar modelo de texto para generar descripción
          messages: [
            {
              role: 'user',
              content: `Based on this content brief, create a detailed image generation prompt for DALL-E:\n\n${imagePrompt}\n\nRespond ONLY with the optimized image generation prompt, nothing else.`
            }
          ],
          max_tokens: 500
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Error al generar imagen');
      }

      const result = await response.json();
      console.log('✅ Respuesta de OpenRouter:', result);

      // Extraer el prompt optimizado de Claude
      const optimizedPrompt = result.choices?.[0]?.message?.content?.trim();

      if (!optimizedPrompt) {
        throw new Error('No se pudo generar el prompt optimizado');
      }

      console.log('📝 Prompt optimizado:', optimizedPrompt);

      // Usar Pollinations.ai para generar la imagen (gratis, sin API key)
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(optimizedPrompt)}?width=1024&height=1024&nologo=true&enhance=true`;

      setGeneratedImage(imageUrl);
      toast.success('¡Imagen generada exitosamente!');

    } catch (error: any) {
      console.error('❌ Error generando imagen:', error);
      setImageError(error.message || 'Error al generar imagen');
      toast.error(error.message || 'Error al generar imagen. Verifica tu API key de OpenRouter.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[calc(100vh-theme(spacing.20))]">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[80px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 bg-blue-400/20 rounded-full blur-[80px] pointer-events-none z-0"></div>

      <div className="p-6 lg:p-12 relative z-10 animate-fade-in">
        {/* Botón flotante para regenerar */}
        {!isGenerating && (
          <button
            onClick={generateRecommendations}
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
                {/* 4 Recomendaciones del backend */}
                {recommendations.map((rec) => (
                  <button
                    key={rec.id}
                    onClick={() => setSelectedCard(rec)}
                    className={`glass-card p-5 rounded-2xl shadow-xl border-l-4 ${getRecommendationColor(rec.recommendation_type)} 
                      transform transition hover:scale-105 duration-300 bg-white/70 text-left
                      ${selectedCard && typeof selectedCard !== 'string' && selectedCard.id === rec.id ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="text-primary">
                        {getRecommendationIcon(rec.recommendation_type)}
                      </div>
                      <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                        {getRecommendationLabel(rec.recommendation_type)}
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-slate-900 line-clamp-2">{rec.title}</p>
                      <p className="text-xs text-slate-600 line-clamp-2">{rec.paragraph}</p>
                      <div className="flex gap-2 pt-1">
                        <span className="px-2 py-1 bg-primary/10 text-[10px] rounded-lg text-primary font-bold">
                          {rec.recommended_format}
                        </span>
                        <span className="px-2 py-1 bg-blue-50 text-[10px] rounded-lg text-blue-600 font-bold">
                          {rec.recommended_objective}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}

                {/* 5ta tarjeta: Personalizado */}
                <button
                  onClick={() => setSelectedCard('custom')}
                  className={`glass-card p-5 rounded-2xl shadow-xl border-l-4 border-l-amber-400
                    transform transition hover:scale-105 duration-300 bg-white/70 text-left
                    ${selectedCard === 'custom' ? 'ring-2 ring-primary ring-offset-2' : ''}`}
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Edit3 className="text-amber-400 w-5 h-5" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">
                      Personalizado
                    </h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-slate-900">Crea tu propio contenido</p>
                    <p className="text-xs text-slate-600">Escribe un prompt personalizado y genera contenido único.</p>
                  </div>
                </button>
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
                  <div className="bg-gradient-to-r from-primary/5 to-blue-50 p-6 rounded-2xl border border-primary/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-primary">
                        {getRecommendationIcon(selectedCard.recommendation_type)}
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">
                        {selectedCard.title}
                      </h2>
                    </div>

                    <div className="flex gap-2 mb-4">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-bold text-primary border border-primary/20">
                        <Target className="w-3 h-3" />
                        {selectedCard.recommended_objective}
                      </span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-white rounded-full text-xs font-bold text-blue-600 border border-blue-200">
                        <FileText className="w-3 h-3" />
                        {selectedCard.recommended_format}
                      </span>
                    </div>

                    <p className="text-sm text-slate-700 mb-4 leading-relaxed">
                      {selectedCard.paragraph}
                    </p>

                    <div className="bg-white/60 p-4 rounded-xl">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                        Elementos necesarios:
                      </h3>
                      <ul className="space-y-1">
                        {selectedCard.required_elements.map((element, idx) => (
                          <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                            <span className="text-primary mt-0.5">•</span>
                            <span>{element}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mt-4 bg-amber-50 p-4 rounded-xl border border-amber-200">
                      <h3 className="text-xs font-bold uppercase tracking-wider text-amber-700 mb-2">
                        💡 Idea de contenido:
                      </h3>
                      <p className="text-xs text-amber-900 italic leading-relaxed">
                        {selectedCard.recommended_idea}
                      </p>
                    </div>
                  </div>
                )}

                {/* Custom Prompt */}
                {selectedCard === 'custom' && (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-200">
                    <div className="flex items-center gap-3 mb-4">
                      <Edit3 className="text-amber-500 w-6 h-6" />
                      <h2 className="text-xl font-bold text-slate-900">
                        Contenido Personalizado
                      </h2>
                    </div>
                    <textarea
                      value={customPrompt}
                      onChange={(e) => setCustomPrompt(e.target.value)}
                      placeholder="Describe el contenido que quieres generar..."
                      className="w-full h-32 p-4 bg-white border border-amber-200 rounded-xl resize-none focus:ring-2 focus:ring-amber-400 focus:border-amber-400 outline-none text-sm"
                    />
                  </div>
                )}

                {/* Platforms */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">
                    Plataformas de Publicación
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {platforms.map((platform) => (
                      <button
                        key={platform.name}
                        type="button"
                        onClick={() => setActivePlatform(platform.name)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${activePlatform === platform.name
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-primary/30 hover:text-primary'
                          }`}
                      >
                        {platform.icon}
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                          {platform.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Media Upload */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">
                    Media Assets
                  </label>
                  <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-primary/50 transition-all cursor-pointer group/upload">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover/upload:scale-110 transition-transform shadow-sm">
                        <CloudUpload className="text-primary w-8 h-8" />
                      </div>
                      <p className="font-bold text-slate-700">Arrastra y suelta archivos aquí</p>
                      <p className="text-xs text-slate-400 mt-1 italic font-medium">
                        JPG, MP4 o RAW (Máx 500MB)
                      </p>
                    </label>
                  </div>

                  {/* Uploaded Files */}
                  {uploadedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {uploadedFiles.map((file, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200"
                        >
                          <span className="text-sm text-slate-700 truncate">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(idx)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

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
                        Generando Imagen...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-6 h-6" />
                        Generar Contenido Ahora
                      </>
                    )}
                  </button>
                  <p className="mt-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    Potenciado por Radikal AI Intelligence + OpenRouter
                  </p>
                </div>

                {/* Generated Image Display */}
                {generatedImage && (
                  <div className="mt-8 bg-gradient-to-br from-primary/5 to-purple-50 p-6 rounded-2xl border border-primary/20 animate-fade-in">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Imagen Generada
                    </h3>
                    <div className="relative rounded-xl overflow-hidden shadow-2xl mb-4">
                      <img
                        src={generatedImage}
                        alt="Generated content"
                        className="w-full h-auto"
                        onError={() => {
                          setImageError('Error al cargar la imagen');
                          setGeneratedImage(null);
                        }}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          // Descargar imagen
                          const link = document.createElement('a');
                          link.href = generatedImage;
                          link.download = `radikal-${activePlatform}-${Date.now()}.png`;
                          link.target = '_blank';
                          link.click();
                          toast.success('Descargando imagen...');
                        }}
                        className="flex-1 bg-white border-2 border-primary text-primary py-3 px-4 rounded-xl font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Descargar
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setGeneratedImage(null);
                          onGenerate();
                        }}
                        className="flex-1 bg-primary text-white py-3 px-4 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        Regenerar
                      </button>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {imageError && (
                  <div className="mt-6 bg-red-50 border border-red-200 p-4 rounded-xl animate-fade-in">
                    <p className="text-sm text-red-700 flex items-center gap-2">
                      <X className="w-4 h-4" />
                      {imageError}
                    </p>
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
import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Search,
  Bell,
  TrendingUp,
  Users,
  Newspaper,
  BarChart3,
  Globe,
  ExternalLink,
  AlertTriangle,
  TrendingDown,
  Shield,
  DollarSign,
  Hash,
  Video,
  Loader2
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/src/lib/supabase';
import { toast } from 'sonner';

// Datos de ejemplo para cuando no hay análisis o falla
const EXAMPLE_ANALYSIS = {
  company_name: 'Ventolini',
  company_website: 'https://ventolini.com',
  company_country: 'Colombia',
  warnings: ['Análisis de ejemplo - Configura n8n para datos reales'],
  latest_signal_title: 'Crecimiento del mercado de pasteles en LATAM',
  latest_signal_date: 'Enero 2026',
  latest_signal_summary: 'El mercado de pasteles en Latinoamérica muestra un crecimiento del 8% anual.',
  risk_signal: {
    title: 'Aumento del salario mínimo impacta costos operativos',
    source: 'El Tiempo',
    date: 'Ene 2, 2026',
    snippet: 'Incremento de 23% del salario mínimo aumentaría costos laborales significativamente.'
  },
  opportunity_signal: {
    title: 'Mercado global de pasteles crecerá a $128B para 2034',
    source: 'Fortune Business Insights',
    date: 'Ene 5, 2026',
    snippet: 'Se proyecta que el mercado crecerá de $89.69B en 2026 a $128.31B en 2034.'
  },
  regulation_signal: {
    title: 'Actualización normas de etiquetado en alimentos',
    source: 'OlarteMoure',
    date: 'Abr 21, 2025',
    snippet: 'Ampliación del plazo de autorización para el agotamiento de etiquetas de 6 a 12 meses.'
  },
  macro_signal: {
    title: 'Pequeños negocios ajustan decisiones tras aumento salarial',
    source: 'El Tiempo',
    date: 'Ene 2, 2026',
    snippet: 'El incremento salarial afectaría el déficit fiscal en 5.3 billones de pesos.'
  },
  social_signal: {
    title: 'Top 40 influencers de comida colombiana 2026',
    source: 'FeedSpot',
    date: 'Enero 2026',
    snippet: 'Influencers como Los de Nam, Juanes Sánchez lideran el contenido gastronómico.'
  },
  media_signal: {
    title: 'Cobertura mediática sobre tendencias de pastelería',
    source: 'Varios',
    date: 'Enero 2026',
    snippet: 'Incremento del 15% en menciones de pastelería artesanal en medios digitales.'
  }
};

const EXAMPLE_COMPETITORS = [
  {
    name: 'Venecia',
    base_domain: 'https://www.venecia.com.co/',
    website_links: [
      { title: 'Tienda Online', link: 'https://www.venecia.com.co/tienda' }
    ],
    products_sections: [
      { title: 'Productos', description: 'Tortas, pasteles, postres, helados y galletas' }
    ],
    videos: [
      { title: 'Clásicas, sencillas y deliciosas', platform: 'Instagram' }
    ]
  },
  {
    name: 'Yanuba',
    base_domain: 'https://yanubapasteleria.com/',
    website_links: [
      { title: 'Pastelería Online', link: 'https://yanubapasteleria.com/' }
    ],
    products_sections: [
      { title: 'Tortas Decoradas', description: 'Especialidad en tortas personalizadas' }
    ],
    videos: []
  },
  {
    name: 'Tejaditos',
    base_domain: 'https://www.tejaditos.com/',
    website_links: [
      { title: 'Tienda Virtual', link: 'https://www.tejaditos.com/shop' }
    ],
    products_sections: [
      { title: 'Tortas Clásicas', description: 'Tradición de 40 años' }
    ],
    videos: []
  }
];

const RadarResults: React.FC = () => {
  const location = useLocation();
  const { brand_id, error: hasError } = location.state || {};

  const [activeTab, setActiveTab] = useState<'resumen' | 'competidores' | 'senales' | 'mercado'>('resumen');
  const [analysis, setAnalysis] = useState<any>(null);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [usingExampleData, setUsingExampleData] = useState(false);

  useEffect(() => {
    // Si viene con error, usar datos de ejemplo directamente
    if (hasError) {
      loadExampleData();
      return;
    }

    if (brand_id) {
      fetchAnalysis();
    } else {
      // Si no hay brand_id, usar datos de ejemplo
      loadExampleData();
    }
  }, [brand_id, hasError]);

  const fetchAnalysis = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-competitor-analysis?brand_id=${brand_id}`,
        {
          headers: {
            'Authorization': `Bearer ${session?.access_token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok || !result.has_analysis) {
        console.warn('⚠️ No hay análisis, usando datos de ejemplo');
        loadExampleData();
        return;
      }

      setAnalysis(result.analysis);
      setCompetitors(result.competitors || []);
      setUsingExampleData(false);
      console.log('✅ Análisis cargado:', result.analysis);

    } catch (error) {
      console.error('❌ Error cargando análisis:', error);
      toast.error('Error al cargar análisis, mostrando datos de ejemplo');
      loadExampleData();
    } finally {
      setIsLoading(false);
    }
  };

  const loadExampleData = () => {
    setAnalysis(EXAMPLE_ANALYSIS);
    setCompetitors(EXAMPLE_COMPETITORS);
    setUsingExampleData(true);
    setIsLoading(false);
    toast.info('Mostrando datos de ejemplo. Configura n8n para análisis real.');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-slate-600 font-medium">Cargando análisis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f3f4f6] min-h-screen text-slate-800 font-display">
      {/* Sticky Header */}
      <header className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 sticky top-0 z-40 shadow-sm">
        <div className="px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <Sparkles className="text-radikal-fuchsia w-6 h-6" />
            <h1 className="text-xl font-bold font-display text-slate-800 tracking-tight">
              Radar de Mercado - {analysis?.company_name || 'Tu Marca'}
            </h1>
            {usingExampleData && (
              <span className="ml-3 px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                DEMO
              </span>
            )}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-200/60 transition-all">
                <Search className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-400 hover:text-slate-600 border border-slate-200/60 transition-all">
                <Bell className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 lg:px-8 border-t border-slate-100">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setActiveTab('resumen')}
              className={`px-6 py-4 text-[14px] font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'resumen' ? 'nav-tab-active' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <TrendingUp className="w-5 h-5" />
              Resumen
            </button>
            <button
              onClick={() => setActiveTab('competidores')}
              className={`px-6 py-4 text-[14px] font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'competidores' ? 'nav-tab-active' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <Users className="w-5 h-5" />
              Competidores ({competitors.length})
            </button>
            <button
              onClick={() => setActiveTab('senales')}
              className={`px-6 py-4 text-[14px] font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'senales' ? 'nav-tab-active' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <Newspaper className="w-5 h-5" />
              Señales
            </button>
            <button
              onClick={() => setActiveTab('mercado')}
              className={`px-6 py-4 text-[14px] font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'mercado' ? 'nav-tab-active' : 'text-slate-500 hover:text-slate-800'
                }`}
            >
              <BarChart3 className="w-5 h-5" />
              Mercado
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto w-full animate-fade-in">

        {/* Tab: Resumen */}
        {activeTab === 'resumen' && (
          <div className="space-y-6">
            {/* Warnings */}
            {analysis?.warnings && analysis.warnings.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-bold text-amber-900 mb-2">Advertencias del Análisis</h3>
                    <ul className="space-y-1">
                      {analysis.warnings.map((warning: string, idx: number) => (
                        <li key={idx} className="text-sm text-amber-800">• {warning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Company Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-slate-600 text-sm uppercase tracking-wider">Empresa</h3>
                </div>
                <p className="text-2xl font-bold text-slate-900">{analysis?.company_name || 'N/A'}</p>
                {analysis?.company_website && (
                  <a
                    href={analysis.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1 mt-2"
                  >
                    Ver sitio web <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-5 h-5 text-blue-500" />
                  <h3 className="font-bold text-slate-600 text-sm uppercase tracking-wider">País</h3>
                </div>
                <p className="text-2xl font-bold text-slate-900">{analysis?.company_country || 'N/A'}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <h3 className="font-bold text-slate-600 text-sm uppercase tracking-wider">Generado</h3>
                </div>
                <p className="text-2xl font-bold text-slate-900">
                  {analysis?.generated_at
                    ? new Date(analysis.generated_at).toLocaleDateString('es-ES')
                    : 'Hoy'}
                </p>
              </div>
            </div>

            {/* Última Señal Pública */}
            {analysis?.latest_signal_title && (
              <div className="bg-gradient-to-br from-primary/10 to-blue-50 rounded-2xl p-8 border border-primary/20">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/20 p-3 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-2">
                      Última Señal Pública Detectada
                    </h3>
                    <p className="text-xl font-bold text-primary mb-2">
                      {analysis.latest_signal_title}
                    </p>
                    <p className="text-sm text-slate-600 mb-3">
                      {analysis.latest_signal_summary}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      {analysis.latest_signal_source && (
                        <span>📰 {analysis.latest_signal_source}</span>
                      )}
                      {analysis.latest_signal_date && (
                        <span>📅 {analysis.latest_signal_date}</span>
                      )}
                      {analysis.latest_signal_type && (
                        <span className="px-2 py-1 bg-white rounded-full font-bold">
                          {analysis.latest_signal_type}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Competidores */}
        {activeTab === 'competidores' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Competidores Detectados ({competitors.length})
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competitors.map((comp: any, idx: number) => (
                <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 mb-1">{comp.name}</h3>
                      <a
                        href={comp.base_domain}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline flex items-center gap-1"
                      >
                        {comp.base_domain} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    {comp.relevance_score && (
                      <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full">
                        {comp.relevance_score}/10
                      </span>
                    )}
                  </div>

                  {/* Website Links */}
                  {comp.website_links && comp.website_links.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Enlaces</h4>
                      <div className="space-y-1">
                        {comp.website_links.slice(0, 3).map((link: any, i: number) => (
                          <a
                            key={i}
                            href={link.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block text-sm text-slate-600 hover:text-primary truncate"
                          >
                            → {link.title}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Products/Sections */}
                  {comp.products_sections && comp.products_sections.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Productos</h4>
                      <div className="flex flex-wrap gap-2">
                        {comp.products_sections.slice(0, 3).map((prod: any, i: number) => (
                          <span key={i} className="px-2 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg">
                            {prod.title}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Videos */}
                  {comp.videos && comp.videos.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1">
                        <Video className="w-3 h-3" />
                        Videos ({comp.videos.length})
                      </h4>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {competitors.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No se detectaron competidores</p>
              </div>
            )}
          </div>
        )}

        {/* Tab: Señales */}
        {activeTab === 'senales' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Señales del Mercado</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Risk Signal */}
              {analysis?.risk_signal && (
                <SignalCard
                  title="Riesgo"
                  icon={<AlertTriangle className="w-6 h-6" />}
                  color="red"
                  signal={analysis.risk_signal}
                />
              )}

              {/* Opportunity Signal */}
              {analysis?.opportunity_signal && (
                <SignalCard
                  title="Oportunidad"
                  icon={<TrendingUp className="w-6 h-6" />}
                  color="green"
                  signal={analysis.opportunity_signal}
                />
              )}

              {/* Regulation Signal */}
              {analysis?.regulation_signal && (
                <SignalCard
                  title="Regulación"
                  icon={<Shield className="w-6 h-6" />}
                  color="blue"
                  signal={analysis.regulation_signal}
                />
              )}

              {/* Macro Signal */}
              {analysis?.macro_signal && (
                <SignalCard
                  title="Macro Económico"
                  icon={<DollarSign className="w-6 h-6" />}
                  color="purple"
                  signal={analysis.macro_signal}
                />
              )}

              {/* Social Signal */}
              {analysis?.social_signal && (
                <SignalCard
                  title="Social"
                  icon={<Hash className="w-6 h-6" />}
                  color="pink"
                  signal={analysis.social_signal}
                />
              )}

              {/* Media Signal */}
              {analysis?.media_signal && (
                <SignalCard
                  title="Medios"
                  icon={<Newspaper className="w-6 h-6" />}
                  color="amber"
                  signal={analysis.media_signal}
                />
              )}
            </div>
          </div>
        )}

        {/* Tab: Mercado */}
        {activeTab === 'mercado' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Análisis de Mercado</h2>

            {/* Market Interest */}
            {analysis?.market_interest && analysis.market_interest.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Interés de Mercado</h3>
                <div className="space-y-3">
                  {analysis.market_interest.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <span className="font-medium text-slate-700">{item.keyword || item}</span>
                      {item.volume && (
                        <span className="text-sm text-slate-500">{item.volume} búsquedas</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Related Searches */}
            {analysis?.related_searches && analysis.related_searches.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Búsquedas Relacionadas</h3>
                <div className="flex flex-wrap gap-2">
                  {analysis.related_searches.map((search: any, idx: number) => (
                    <span key={idx} className="px-3 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
                      {search.query || search}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Key Signals */}
            {analysis?.key_signals && analysis.key_signals.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Señales Clave</h3>
                <div className="space-y-4">
                  {analysis.key_signals.map((signal: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-primary pl-4 py-2">
                      <p className="font-bold text-slate-900">{signal.title || signal}</p>
                      {signal.description && (
                        <p className="text-sm text-slate-600 mt-1">{signal.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!analysis?.market_interest?.length &&
              !analysis?.related_searches?.length &&
              !analysis?.key_signals?.length && (
                <div className="text-center py-12 text-slate-400">
                  <BarChart3 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No hay datos de mercado disponibles</p>
                </div>
              )}
          </div>
        )}
      </main>
    </div>
  );
};

// Componente auxiliar para señales
const SignalCard: React.FC<{
  title: string;
  icon: React.ReactNode;
  color: string;
  signal: any;
}> = ({ title, icon, color, signal }) => {
  const colorClasses = {
    red: 'bg-red-50 border-red-200 text-red-700',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    purple: 'bg-purple-50 border-purple-200 text-purple-700',
    pink: 'bg-pink-50 border-pink-200 text-pink-700',
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
  };

  const iconColorClasses = {
    red: 'text-red-500',
    green: 'text-emerald-500',
    blue: 'text-blue-500',
    purple: 'text-purple-500',
    pink: 'text-pink-500',
    amber: 'text-amber-500',
  };

  return (
    <div className={`rounded-2xl p-6 border ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="flex items-start gap-3 mb-4">
        <div className={iconColorClasses[color as keyof typeof iconColorClasses]}>
          {icon}
        </div>
        <h3 className="text-lg font-bold flex-1">{title}</h3>
      </div>

      {signal.title && (
        <p className="font-bold text-slate-900 mb-2">{signal.title}</p>
      )}

      {signal.snippet && (
        <p className="text-sm text-slate-700 mb-3">{signal.snippet}</p>
      )}

      <div className="flex items-center gap-3 text-xs text-slate-600 mt-3">
        {signal.source && <span>📰 {signal.source}</span>}
        {signal.date && <span>📅 {signal.date}</span>}
      </div>

      {signal.link && (
        <a
          href={signal.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
        >
          Ver más <ExternalLink className="w-3 h-3" />
        </a>
      )}
    </div>
  );
};

export default RadarResults;
import React, { useState, useEffect } from 'react';
import CustomDropdown from '@shared/components/forms/CustomDropdown';
import DynamicList from '@shared/components/forms/DynamicList';
import { Search, Globe, Rss, CalendarClock, Mail, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { supabase } from '@infrastructure/api/supabase';
import { toast } from 'sonner';

const RadarConfig: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { forceNew } = location.state || {}; // Check if forced new analysis

  // Brand ID
  const [brandId, setBrandId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State for dynamic lists
  const [competitors, setCompetitors] = useState<string[]>([]);
  // const [newsChannels, setNewsChannels] = useState<string[]>([]); // Removed
  // const [emails, setEmails] = useState<string[]>(['usuario@empresa.com']); // Removed
  // const [emailErrors, setEmailErrors] = useState<(string | undefined)[]>([]); // Removed
  // const [timeframe, setTimeframe] = useState<string>('diaria'); // Removed
  // const [timeframe, setTimeframe] = useState<string>('diaria'); // Removed

  // timeframeOptions removed

  // validateEmail and handleSetEmails removed

  // Obtener brand_id al montar
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

          // Verificar si ya existe un análisis completado, si no estamos forzando uno nuevo
          if (!forceNew) {
            const { data: existingAnalysis } = await supabase
              .from('competitor_analysis')
              .select('id, raw_report')
              .eq('brand_id', data.id)
              .eq('status', 'completed')
              .order('generated_at', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (existingAnalysis) {
              // Validar que tenga la estructura nueva antes de redirigir
              const raw = existingAnalysis.raw_report;
              const hasReport = raw && (
                raw.radikal_ia_report ||
                (Array.isArray(raw) && raw[0]?.radikal_ia_report)
              );

              if (hasReport) {
                console.log('✅ Análisis válido encontrado, redirigiendo a resultados');
                navigate('/radar-results', { state: { brand_id: data.id } });
                return;
              } else {
                console.warn('⚠️ Análisis encontrado pero sin formato correcto (legacy), permitiendo nuevo análisis');
              }
            }
          }

          // Cargar settings existentes si hay
          loadExistingSettings(data.id);
        }
      } catch (error) {
        console.error('Error obteniendo brand_id:', error);
      }
    };

    fetchBrandId();
  }, [user, navigate, forceNew]);

  // Cargar settings existentes
  const loadExistingSettings = async (brand_id: string) => {
    console.log('🔍 Cargando settings para brand_id:', brand_id);

    // Cargar competidores desde competitor suggestions
    try {
      const { data: competitorData, error: competitorError } = await supabase
        .from('competitor suggestions')
        .select('link')
        .eq('brand_id', brand_id)
        .order('created_at', { ascending: false });

      console.log('📊 Respuesta de competidores:', {
        data: competitorData,
        error: competitorError,
        count: competitorData?.length
      });

      if (competitorError) {
        console.error('❌ Error cargando competidores:', competitorError);
      } else if (competitorData && competitorData.length > 0) {
        const competitorLinks = competitorData.map(c => c.link).filter(Boolean) as string[];
        if (competitorLinks.length > 0) {
          setCompetitors(competitorLinks);
          console.log('✅ Competidores cargados:', competitorLinks);
        }
      } else {
        console.log('ℹ️ No hay competidores guardados');
      }
    } catch (error) {
      console.error('❌ Error al cargar competidores:', error);
    }

    // Cargar otros settings desde radar_settings
    try {
      const { data: settingsData, error: settingsError } = await supabase
        .from('radar_settings')
        .select('*') // Removed specific selection
        .eq('brand_id', brand_id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (settingsError) {
        console.error('❌ Error cargando settings:', settingsError);
      } else if (settingsData) {
        // if (settingsData.news_channels && settingsData.news_channels.length > 0) {
        //   setNewsChannels(settingsData.news_channels);
        // }
        // if (settingsData.emails && settingsData.emails.length > 0) {
        //   setEmails(settingsData.emails);
        // }
        // if (settingsData.timeframe) {
        //   setTimeframe(settingsData.timeframe);
        // }
        console.log('✅ Settings cargados:', settingsData);
      } else {
        console.log('ℹ️ No hay settings guardados, usando valores por defecto');
      }
    } catch (error) {
      console.error('❌ Error al cargar settings:', error);
    }
  };

  const onSearch = async () => {
    // Email validation removed

    if (!brandId) {
      toast.error('No se encontró una marca asociada');
      return;
    }

    // Navegar inmediatamente a scanning con todos los datos
    // RadarScanning se encargará de guardar settings y generar análisis
    const navigationData = {
      brand_id: brandId,
      settings: {
        competitors: competitors.filter(c => c.trim()),
        news_channels: [], // Empty
        emails: [], // Empty
        timeframe: 'diaria' // Default value, as UI is removed
      }
    };

    console.log('🚀 Navegando a RadarScanning con:', navigationData);
    console.log('🚀 Competitors filtrados:', navigationData.settings.competitors);

    navigate('/radar-scanning', { state: navigationData });
  };

  return (
    <div className="flex flex-col items-center justify-start p-6 lg:p-12 animate-fade-in font-sans">
      <div className="w-full max-w-3xl">
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            AI Industry Intelligence
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4 tracking-tight font-display">
            Radar de <span className="text-primary">Mercado</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
            Configuración avanzada para el análisis de competencia y tendencias del sector.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 lg:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]">
          <div className="space-y-10">

            {/* Dynamic Competitors List */}
            <div>
              <DynamicList
                label="Monitorear Competidores"
                items={competitors}
                setItems={setCompetitors}
                placeholder="https://competidor.com"
                icon={Globe}
                type="url"
                // maxItems={3} // Removed limit
                minItems={0}
                addButtonLabel="Añadir otro competidor"
              />
              {competitors.length === 0 && (
                <p className="text-xs text-amber-500 font-medium mt-2 ml-1">
                  * Opcional: Si no inserta dato, se buscará con IA.
                </p>
              )}
            </div>

            {/* Dynamic News Channels List REMOVED */}

            {/* Custom Timeframe Dropdown REMOVED */}
            {/* <CustomDropdown
              label="Temporalidad de Búsqueda Automática"
              options={timeframeOptions}
              value={timeframe}
              onChange={setTimeframe}
              icon={CalendarClock}
            /> */}

            {/* Dynamic Emails List REMOVED */}

            {/* Action Button */}
            <div className="pt-6">
              <button
                onClick={onSearch}
                className="w-full bg-primary hover:opacity-90 active:scale-[0.98] text-white py-5 px-8 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 group"
              >
                <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Iniciar Búsqueda Automática
              </button>
              <p className="text-center text-xs text-slate-400 font-medium mt-4">
                Se enviará un resumen al finalizar el análisis a los correos configurados.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-slate-400 dark:text-slate-600 text-sm font-medium">
          Radikal AI © 2025 · Inteligencia de Mercado Premium
        </p>
      </div>
    </div>
  );
};

export default RadarConfig;
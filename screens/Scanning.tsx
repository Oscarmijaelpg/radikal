import React, { useEffect, useState, useRef } from 'react';
import { Terminal, Globe, Search, Palette, Brain, Zap, AlertCircle } from 'lucide-react';
import StatusItem from '../components/StatusItem';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../src/lib/supabase';
import { toast } from 'sonner';

const Scanning: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { brand_id, job_id } = location.state || {};

  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<React.ReactNode[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const logsEndRef = useRef<HTMLDivElement>(null);
  const hasNavigatedRef = useRef(false);

  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const logSteps = [
    { pct: 5, content: <><span className="text-slate-400 font-mono"><span className="text-slate-600 mr-2">&gt;</span> [INIT] Conectando servidores Radikal...</span></> },
    { pct: 15, content: <><span className="text-slate-400 font-mono"><span className="text-slate-600 mr-2">&gt;</span> [AUTH] Validando token de acceso... OK</span></> },
    { pct: 25, content: <><span className="text-emerald-400 font-mono"><span className="text-slate-600 mr-2">&gt;</span> [CONNECT] Conexión establecida (14ms)</span></> },
    { pct: 35, content: <><span className="text-slate-400 font-mono"><span className="text-slate-600 mr-2">&gt;</span> [CRAWL] Iniciando spider v2.4 en target...</span></> },
    { pct: 45, content: <><span className="text-slate-400 font-mono"><span className="text-slate-600 mr-2">&gt;</span> [DOM] Estructura HTML analizada. Nodos: 1,240</span></> },
    { pct: 60, content: <><span className="text-yellow-400 font-mono"><span className="text-slate-600 mr-2">&gt;</span> [WARN] Tiempo de carga LCP &gt; 2.5s</span></> },
    { pct: 70, content: <><span className="text-slate-400 font-mono"><span className="text-slate-600 mr-2">&gt;</span> [SEO] Extrayendo metadatos y keywords...</span></> },
    { pct: 85, content: <><span className="text-primary font-mono"><span className="text-slate-600 mr-2">&gt;</span> [AI] Generando perfil de marca...</span></> },
    { pct: 95, content: <><span className="text-white font-mono flex items-center gap-1"><span className="text-slate-600 mr-2">&gt;</span> Finalizando reporte... <span className="w-2 h-4 bg-emerald-400 animate-blink inline-block"></span></span></> },
  ];

  // Validar datos requeridos
  useEffect(() => {
    if (!brand_id || !job_id) {
      console.error('❌ Faltan brand_id o job_id en Scanning');
      toast.error('Datos de sesión inválidos. Redirigiendo...');
      setTimeout(() => navigate('/dashboard'), 2000);
    }
  }, [brand_id, job_id, navigate]);

  // Suscripción a cambios en el job
  useEffect(() => {
    if (!job_id || !brand_id) return;

    console.log('📡 Suscribiéndose a job updates:', job_id);
    setLogs([<div key="init" className="text-emerald-400 font-bold font-mono">$ radikal-cli analyze --target=current --deep</div>]);

    const channel = supabase
      .channel(`job-${job_id}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'job_queue',
          filter: `id=eq.${job_id}`,
        },
        (payload) => {
          console.log('📨 Job update recibido:', payload);
          const newStatus = payload.new.status;

          if (newStatus === 'completed' && !hasNavigatedRef.current) {
            hasNavigatedRef.current = true;
            setProgress(100);
            setLogs(prev => [...prev, <div key="done" className="text-emerald-400 font-bold font-mono">$ FINISHED: Analysis complete.</div>]);

            toast.success('¡Diagnóstico completado!');

            setTimeout(() => {
              navigate('/brand', {
                state: { brand_id },
                replace: true
              });
            }, 1500);
          } else if (newStatus === 'failed' && !hasNavigatedRef.current) {
            hasNavigatedRef.current = true;
            setLogs(prev => [...prev, <div key="error" className="text-red-500 font-bold font-mono">$ ERROR: Analysis failed.</div>]);

            toast.error('El análisis falló. Por favor intenta nuevamente.');

            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 2000);
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Suscrito correctamente al canal');
          setIsSubscribed(true);
        }
      });

    // Animación visual de progreso
    let currentStepIndex = 0;
    const interval = setInterval(() => {
      if (currentStepIndex >= logSteps.length) {
        clearInterval(interval);
        return;
      }

      const step = logSteps[currentStepIndex];
      if (step.pct <= 90) {
        setProgress(step.pct);
        setLogs(prev => [...prev, <div key={currentStepIndex} className="animate-fade-in">{step.content}</div>]);
      }
      currentStepIndex++;
    }, 1500);

    // Cleanup
    return () => {
      clearInterval(interval);
      console.log('🧹 Limpiando suscripción');
      supabase.removeChannel(channel);
    };
  }, [job_id, brand_id, navigate]);

  // Auto scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Mostrar error si no hay datos
  if (!brand_id || !job_id) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 mb-2">Error de sesión</h2>
          <p className="text-slate-600">Datos de diagnóstico no encontrados. Redirigiendo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 dark:bg-[#0F172A] min-h-screen text-slate-900 dark:text-white font-display transition-colors duration-500 overflow-hidden relative">

      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-secondary/10 rounded-full blur-[120px] animate-pulse-slow"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">

        {/* Header */}
        <header className="mb-16 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4 leading-tight">
            Analizando tu <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
              Potencial Digital
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl font-medium max-w-2xl">
            Nuestro motor de IA está auditando tus activos digitales en tiempo real para generar un diagnóstico estratégico personalizado.
          </p>

          {/* Connection Status */}
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
            <span className={`w-2 h-2 rounded-full ${isSubscribed ? 'bg-emerald-500 animate-pulse' : 'bg-yellow-500'}`}></span>
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
              {isSubscribed ? 'Conectado en tiempo real' : 'Conectando...'}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* Left Column: Metrics & Terminal */}
          <div className="lg:col-span-5 space-y-6">

            {/* Progress Metric Card */}
            <div className="bg-white dark:bg-slate-800/80 backdrop-blur-xl p-8 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-slate-50 dark:bg-slate-700/30 rounded-full blur-2xl"></div>

              <div className="flex justify-between items-start mb-8 relative z-10">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Progreso Total</p>
                  <div className="flex items-baseline">
                    <span className="text-7xl font-black text-slate-900 dark:text-white tracking-tighter">{progress}</span>
                    <span className="text-2xl font-bold text-primary ml-1">%</span>
                  </div>
                </div>

                {/* Progress Ring SVG */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="50%" cy="50%" r={radius}
                      className="text-slate-100 dark:text-slate-700"
                      strokeWidth="6"
                      fill="none"
                      stroke="currentColor"
                    />
                    <circle
                      cx="50%" cy="50%" r={radius}
                      className="text-primary transition-all duration-500 ease-out"
                      strokeWidth="6"
                      fill="none"
                      stroke="currentColor"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-primary animate-pulse">
                    <Zap className="w-8 h-8" fill="currentColor" />
                  </div>
                </div>
              </div>

              {/* Linear Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mb-4 overflow-hidden relative z-10">
                <div
                  className="bg-gradient-to-r from-primary to-purple-500 h-full rounded-full transition-all duration-500 ease-out shadow-[0_0_10px_rgba(217,70,239,0.5)]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-wider relative z-10">
                <span>Tiempo: 00:0{Math.floor(progress / 12)}</span>
                <span>Estimado: 24s</span>
              </div>
            </div>

            {/* Terminal Window */}
            <div className="bg-[#0f1117] rounded-2xl overflow-hidden shadow-2xl border border-slate-800 terminal-glow h-[320px] flex flex-col font-mono">
              <div className="bg-[#1a1b26] px-4 py-3 flex items-center justify-between border-b border-white/5 select-none">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                </div>
                <div className="text-[10px] text-slate-500 font-bold flex items-center gap-2">
                  <Terminal className="w-3 h-3" />
                  radikal-engine
                </div>
              </div>
              <div className="p-6 overflow-y-auto custom-scrollbar flex-1 text-sm space-y-2">
                {logs.map((log, index) => (
                  <div key={index} className="break-all">{log}</div>
                ))}
                <div ref={logsEndRef} />
              </div>
            </div>

          </div>

          {/* Right Column: Steps Checklist */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-700/50 shadow-xl">
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100 dark:border-slate-700/50">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Terminal className="w-6 h-6 text-primary" />
                  Estado del Análisis
                </h3>
                <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-500 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  En Progreso
                </span>
              </div>

              <div className="space-y-4">
                <StatusItem
                  title="Análisis de Estructura Web"
                  subtitle="Validando DOM, velocidad de carga y mobile responsive"
                  status={progress > 30 ? 'completed' : progress > 5 ? 'active' : 'pending'}
                  icon={Globe}
                />
                <StatusItem
                  title="Auditoría de Contenido & SEO"
                  subtitle="Keywords, meta tags y coherencia semántica"
                  status={progress > 60 ? 'completed' : progress > 30 ? 'active' : 'pending'}
                  icon={Search}
                />
                <StatusItem
                  title="Identidad de Marca & Diseño"
                  subtitle="Extracción de paleta de colores, tipografía y logos"
                  status={progress > 80 ? 'completed' : progress > 60 ? 'active' : 'pending'}
                  icon={Palette}
                />
                <StatusItem
                  title="Generación de Estrategia IA"
                  subtitle="Procesando insights y oportunidades de crecimiento"
                  status={progress >= 100 ? 'completed' : progress > 80 ? 'active' : 'pending'}
                  icon={Brain}
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Scanning;
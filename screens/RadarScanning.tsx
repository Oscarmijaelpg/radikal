import React, { useEffect, useState, useRef } from 'react';
import { Zap, Loader2, CheckCircle, Hourglass, Radio, ShieldCheck } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const RadarScanning: React.FC = () => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<React.ReactNode[]>([]);
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Status items configuration
  const statusItems = [
    { id: 1, label: 'Buscando noticias relevantes', threshold: 10 },
    { id: 2, label: 'Encontrando tendencias', threshold: 20 },
    { id: 3, label: 'Analizando competidores propuestos', threshold: 30 },
    { id: 4, label: 'Analizando otros posibles competidores', threshold: 40 },
    { id: 5, label: 'Analizando noticias internacionales', threshold: 50 },
    { id: 6, label: 'Analizando políticas internas', threshold: 55 },
    { id: 7, label: 'Encontrando oportunidades de mercado', threshold: 65 },
    { id: 8, label: 'Analizando redes sociales de competidores', threshold: 75 },
    { id: 9, label: 'Analizando comportamiento de público objetivo', threshold: 82 },
    { id: 10, label: 'Analizando épocas de oportunidad', threshold: 90 },
    { id: 11, label: 'Analizando inversión internacional', threshold: 95 },
    { id: 12, label: 'Analizando eventos y influencers', threshold: 98 },
  ];

  useEffect(() => {
    // Terminal simulation
    const initialLogs = [
      <p key="1" className="text-secondary/80 mb-1"><span className="opacity-50">$</span> scan_init --v2</p>,
      <p key="2" className="text-slate-500 italic">[OK] Nodes active</p>,
      <p key="3" className="text-secondary/90">SCAN: Filtrando RSS...</p>
    ];
    setTerminalLogs(initialLogs);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => navigate('/radar-results'), 1000);
          return 100;
        }

        // Add random logs based on progress
        if (Math.random() > 0.7) {
          setTerminalLogs(prevLogs => [
            ...prevLogs,
            <p key={Date.now()} className="text-slate-400 text-[10px]">&gt; Processing data chunk...</p>
          ]);
        }

        return prev + 0.5; // Slow progress for demo
      });
    }, 50);

    return () => clearInterval(interval);
  }, [navigate]);

  // Scroll terminal
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [terminalLogs]);

  const getStatusState = (threshold: number) => {
    if (progress >= threshold + 5) return 'completed';
    if (progress >= threshold) return 'processing';
    return 'queued';
  };

  // SVG Calculations
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="bg-[#F9FAFB] dark:bg-[#0F172A] font-display text-slate-800 dark:text-slate-100 min-h-screen transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 font-display">
            Escaneando el horizonte del <span className="bg-gradient-to-r from-fuchsia-600 to-pink-500 bg-clip-text text-transparent animate-pulse">mercado...</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
            Nuestra IA está procesando miles de datos globales para identificar tus próximas oportunidades estratégicas y ventajas competitivas.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-6">

            {/* Progress Card */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-700">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Progreso Total</p>
                  <h2 className="text-5xl font-black text-slate-900 dark:text-white">{Math.floor(progress)}<span className="text-primary">%</span></h2>
                </div>
                <div className="relative flex items-center justify-center w-20 h-20">
                  <svg className="w-full h-full transform -rotate-90">
                    <defs>
                      <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#d946ef" />
                        <stop offset="100%" stopColor="#e879f9" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx="50%" cy="50%" r={radius}
                      className="text-slate-100 dark:text-slate-700"
                      fill="transparent"
                      stroke="currentColor"
                      strokeWidth="6"
                    />
                    <circle
                      cx="50%" cy="50%" r={radius}
                      fill="transparent"
                      stroke="url(#progressGradient)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      className="transition-all duration-300 ease-linear"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Zap className="text-primary w-6 h-6 animate-pulse" fill="currentColor" />
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-400 rounded-full shadow-[0_0_10px_rgba(217,70,239,0.3)] transition-all duration-300 ease-linear"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                  <span>T: 00:{Math.floor(progress * 0.6).toString().padStart(2, '0')}s</span>
                  <span>Est: 18s</span>
                </div>
              </div>
            </div>

            {/* Terminal */}
            <div className="bg-[#0B0F1A] rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
              <div className="bg-slate-800/50 px-4 py-2 flex items-center justify-between border-b border-slate-800">
                <div className="flex space-x-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
                </div>
                <span className="text-[9px] font-mono text-slate-500 tracking-wider">radikal-radar.engine</span>
              </div>
              <div className="p-4 h-48 overflow-y-auto font-mono text-xs leading-relaxed text-slate-300 custom-scrollbar">
                {terminalLogs}
                <div className="flex items-center space-x-2 mt-2">
                  <span className="w-1.5 h-3 bg-secondary animate-pulse"></span>
                  <span className="text-slate-500 italic text-[10px]">Processing...</span>
                </div>
                <div ref={logsEndRef} />
              </div>
            </div>
          </div>

          {/* Right Column - Status Grid */}
          <div className="lg:col-span-8">
            <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-slate-200/60 dark:shadow-none border border-slate-100 dark:border-slate-700 overflow-hidden">
              <div className="px-8 py-5 border-b border-slate-50 dark:border-slate-700 flex justify-between items-center bg-white dark:bg-slate-800">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">Estado del análisis</h3>
                  <p className="text-xs text-slate-400 font-medium">12 Módulos de inteligencia activos</p>
                </div>
                <div className="flex items-center space-x-2 bg-secondary/10 text-secondary text-[10px] font-bold px-4 py-1.5 rounded-full border border-secondary/20">
                  <span className="w-2 h-2 bg-secondary rounded-full animate-ping"></span>
                  <span className="tracking-widest">REAL-TIME</span>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {statusItems.map((item) => {
                    const status = getStatusState(item.threshold);
                    return (
                      <div
                        key={item.id}
                        className={`flex items-center p-3 rounded-xl border transition-all duration-300 h-full ${status === 'completed' ? 'bg-teal-50/50 border-teal-100 text-teal-900 dark:bg-teal-900/10 dark:border-teal-800 dark:text-teal-100' :
                          status === 'processing' ? 'bg-fuchsia-50/50 border-fuchsia-200 text-fuchsia-900 ring-1 ring-fuchsia-200 dark:bg-fuchsia-900/10 dark:border-fuchsia-800 dark:text-fuchsia-100 scale-[1.02] shadow-sm' :
                            'bg-slate-50/50 border-slate-100 text-slate-500 opacity-80 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400'
                          }`}
                      >
                        <div className={`mr-3 ${status === 'completed' ? 'text-teal-500' :
                          status === 'processing' ? 'text-fuchsia-500 animate-spin' :
                            'text-slate-300 dark:text-slate-600'
                          }`}>
                          {status === 'completed' ? <CheckCircle className="w-5 h-5" /> :
                            status === 'processing' ? <Loader2 className="w-5 h-5" /> :
                              <Hourglass className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold leading-none mb-1">{item.label}</h4>
                          <p className="text-[10px] opacity-70">
                            {status === 'completed' ? 'Finalizado correctamente' : status === 'processing' ? 'En proceso...' : 'En espera'}
                          </p>
                        </div>
                      </div>
                    );
                  })}

                </div>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-widest font-bold text-slate-400 dark:text-slate-500 gap-6">
          <div className="flex items-center space-x-3">
            <div className="bg-primary p-1.5 rounded-lg shadow-md shadow-fuchsia-200">
              <Radio className="text-white w-4 h-4" />
            </div>
            <span>Radikal Engine v2.4.8 — Mercado Radar</span>
          </div>
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
              <span>Infraestructura Global</span>
            </div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Procesamiento Seguro</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default RadarScanning;

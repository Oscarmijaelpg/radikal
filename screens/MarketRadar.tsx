import React from 'react';
import { Calendar, SlidersHorizontal, Globe, Brain, TrendingUp, Sparkles } from 'lucide-react';

const MarketRadar: React.FC = () => {
  return (
    <div className="p-6 lg:p-10 space-y-8 animate-fade-in font-display">

      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-[10px] font-bold rounded-full tracking-widest uppercase flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Live Intelligence
            </span>
          </div>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight">
            Radar de <span className="text-primary">Noticias</span>
          </h1>
          <p className="text-slate-500 text-lg mt-2 font-medium max-w-xl">
            Dashboard editorial con oportunidades estratégicas detectadas para hoy.
          </p>
        </div>

        <div className="flex gap-3">
          <button className="px-5 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold flex items-center gap-2 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm text-slate-600 group">
            <Calendar className="text-slate-400 group-hover:text-primary transition-colors w-5 h-5" />
            Hoy, 24 Oct
          </button>
          <button className="px-5 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold flex items-center gap-2 shadow-lg shadow-slate-900/20 hover:shadow-xl hover:-translate-y-0.5 transition-all">
            <SlidersHorizontal className="w-5 h-5" />
            Filtros
          </button>
        </div>
      </header>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Card 1: News Article */}
        <article className="bg-white rounded-[32px] overflow-hidden group hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] transition-all duration-500 flex flex-col h-full border border-slate-100 relative">
          <div className="h-64 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?auto=format&fit=crop&w=800&q=80"
              alt="Cacao"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-primary shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                Economía
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
          </div>

          <div className="p-8 flex flex-col flex-grow relative">
            <div className="flex items-center gap-3 text-slate-400 text-[11px] font-bold mb-4 uppercase tracking-wider font-tech">
              <span className="flex items-center gap-1"><Globe className="w-4 h-4" /> Bloomberg News</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>Hace 2h</span>
            </div>

            <h3 className="text-2xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors text-slate-900 tracking-tight">
              Tratado Cacao USA-COL: Auge del Dólar impulsa exportaciones
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
              La TRM actual de $4,185.20 sumada al arancel preferencial del 0% abre una ventana histórica para subproductos de cacao.
            </p>

            <div className="mt-auto">
              <button className="w-full bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all group/btn border border-slate-100 hover:border-slate-900">
                <Brain className="w-5 h-5 text-primary group-hover/btn:text-white transition-colors" />
                Generar Estrategia
              </button>
            </div>
          </div>
        </article>

        {/* Card 2: Event Article */}
        <article className="bg-white rounded-[32px] overflow-hidden group hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.12)] transition-all duration-500 flex flex-col h-full border border-slate-100 relative">
          <div className="h-64 relative overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors z-10"></div>
            <img
              src="https://images.unsplash.com/photo-1575372587796-764953930e44?auto=format&fit=crop&w=800&q=80"
              alt="Chocolate Event"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute top-4 left-4 z-20">
              <span className="px-3 py-1.5 bg-white/95 backdrop-blur-md rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-sm flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span>
                Eventos
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
          </div>

          <div className="p-8 flex flex-col flex-grow relative">
            <div className="flex items-center gap-3 text-slate-400 text-[11px] font-bold mb-4 uppercase tracking-wider font-tech">
              <span className="flex items-center gap-1"><Calendar className="w-4 h-4" /> Agenda Radikal</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span className="text-primary">Próximamente</span>
            </div>

            <h3 className="text-2xl font-bold leading-tight mb-4 group-hover:text-primary transition-colors text-slate-900 tracking-tight">
              Temporada de Ferias Gastronómicas y el fenómeno "Wonka"
            </h3>

            <p className="text-slate-500 text-sm leading-relaxed mb-8 line-clamp-3 font-medium">
              Diciembre se perfila como el mes del chocolate con la Feria de Medellín y el estreno mundial de la película de Willy Wonka.
            </p>

            <div className="mt-auto">
              <button className="w-full bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-900 py-4 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all group/btn border border-slate-100 hover:border-slate-900">
                <Brain className="w-5 h-5 text-primary group-hover/btn:text-white transition-colors" />
                Generar Estrategia
              </button>
            </div>
          </div>
        </article>

        {/* Card 3: Magic Flow Stats */}
        <div className="bg-white rounded-[32px] p-10 flex flex-col h-full relative overflow-hidden shadow-glass-lg border border-slate-100 group">
          {/* Background Decorations */}
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] transform rotate-12 group-hover:rotate-0 transition-transform duration-700">
            <TrendingUp className="w-40 h-40" />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-lg bg-radikal-fuchsia/10 flex items-center justify-center text-radikal-fuchsia">
                <Sparkles className="w-5 h-5" />
              </span>
              <h3 className="text-2xl font-bold text-slate-900">Magic Flow</h3>
            </div>
            <p className="text-slate-500 text-sm mb-10 font-medium pl-10">Flujo dinámico de KPIs predictivos de mercado.</p>

            <div className="space-y-8 flex-grow">

              {/* Stat Bar 1 */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider font-tech">
                  <span className="text-slate-500">Tráfico Orgánico</span>
                  <span className="text-radikal-fuchsia">88%</span>
                </div>
                <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <div className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-500 w-[88%] rounded-full shadow-[0_0_15px_rgba(236,72,153,0.4)] relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                  </div>
                </div>
              </div>

              {/* Stat Bar 2 */}
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold uppercase tracking-wider font-tech">
                  <span className="text-slate-500">Sentimiento AI</span>
                  <span className="text-emerald-500">Positivo</span>
                </div>
                <div className="h-4 bg-slate-50 rounded-full overflow-hidden border border-slate-100 p-0.5">
                  <div className="h-full bg-slate-900 w-[72%] rounded-full relative">
                    <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/20"></div>
                  </div>
                </div>
              </div>

              {/* Circular Chart */}
              <div className="flex items-center justify-center py-6 mt-auto">
                <div className="relative w-48 h-48 group-hover:scale-105 transition-transform duration-500">
                  <svg className="w-full h-full transform -rotate-90 drop-shadow-xl">
                    <defs>
                      <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#d946ef" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                    {/* Track */}
                    <circle cx="96" cy="96" r="80" fill="none" stroke="#f1f5f9" strokeWidth="16" strokeLinecap="round" />
                    {/* Progress */}
                    <circle
                      cx="96" cy="96" r="80"
                      fill="none"
                      stroke="url(#circleGradient)"
                      strokeWidth="16"
                      strokeDasharray="502"
                      strokeDashoffset="95"
                      strokeLinecap="round"
                      className="filter drop-shadow-[0_0_10px_rgba(217,70,239,0.3)]"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black font-display text-slate-900 tracking-tighter">81<span className="text-2xl text-slate-300">%</span></span>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-[0.2em] mt-2">Efectividad</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default MarketRadar;

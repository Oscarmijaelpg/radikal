import React from 'react';
import { MOCK_INSIGHTS } from "@core/config/constants";
import { ScreenName } from "@core/types";
import { PenTool, ArrowRight, Radio, Compass } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6 lg:p-12 animate-fade-in">
      <header className="mb-12">
        <h1 className="text-4xl lg:text-6xl font-display font-bold text-black mb-3 tracking-tight">
          ¡Hola, <span className="text-primary">Ventolini!</span>
        </h1>
        <p className="text-xl text-slate-500 font-medium max-w-2xl">
          Hoy es un gran día para crecer. Mira lo que hemos descubierto para tu marca.
        </p>
      </header>

      {/* Insights Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {MOCK_INSIGHTS.map((insight, idx) => (
          <div
            key={idx}
            className={`bg-white p-10 rounded-[2.5rem] relative overflow-hidden group transition-all hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-slate-100 ${insight.type === 'insight'
              ? 'shadow-[0_10px_30px_-10px_rgba(236,72,153,0.2)]'
              : 'shadow-xl shadow-slate-200/50'
              }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-transparent rounded-bl-[100px]" />

            <div className="flex items-start justify-between mb-6">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${insight.type === 'insight' ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-black text-white shadow-lg'
                }`}>
                <insight.icon className="w-6 h-6" />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-[0.2em] py-2 px-4 rounded-full ${insight.type === 'insight' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'
                }`}>
                {insight.label}
              </span>
            </div>

            <p className="text-slate-800 text-xl font-medium leading-relaxed mb-4 relative z-10">
              {insight.text}
            </p>

          </div>
        ))}
      </section>

      {/* Action Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Generation Card - Pink/White Theme */}
        <div className="bg-white rounded-[3rem] p-12 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-start transition-transform hover:scale-[1.01] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-opacity opacity-50 group-hover:opacity-100" />

          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mb-8 shadow-xl shadow-primary/20 rotate-3 group-hover:rotate-6 transition-transform">
            <PenTool className="text-white w-8 h-8" />
          </div>
          <h2 className="text-4xl font-display font-bold text-black mb-4">
            Generación de Contenido
          </h2>
          <p className="text-slate-500 text-lg mb-12 leading-relaxed max-w-md font-medium">
            Crea campañas creativas y copys de alto rendimiento optimizados por IA.
          </p>
          <button
            onClick={() => navigate('/generation')}
            className="mt-auto w-full py-5 bg-black hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 group/btn relative z-10"
          >
            Comenzar Ahora
            <ArrowRight className="w-6 h-6 group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Radar Card - White/Black Theme */}
        <div className="bg-white rounded-[3rem] p-12 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-start transition-transform hover:scale-[1.01] relative overflow-hidden group">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-slate-100 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 transition-opacity opacity-50 group-hover:opacity-100" />

          <div className="w-16 h-16 bg-white border-2 border-slate-100 rounded-2xl flex items-center justify-center mb-8 shadow-lg -rotate-3 group-hover:-rotate-6 transition-transform">
            <Radio className="text-black w-8 h-8" />
          </div>
          <h2 className="text-4xl font-display font-bold text-black mb-4">
            Radar de Mercado
          </h2>
          <p className="text-slate-500 text-lg mb-12 leading-relaxed max-w-md font-medium">
            Analiza tendencias en tiempo real y detecta oportunidades de negocio.
          </p>
          <button
            onClick={() => navigate('/radar')}
            className="mt-auto w-full py-5 bg-white border-2 border-slate-100 hover:border-slate-300 text-black rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-3 group/btn hover:shadow-lg relative z-10"
          >
            Explorar Radar
            <Compass className="w-6 h-6 group-hover/btn:rotate-45 transition-transform" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
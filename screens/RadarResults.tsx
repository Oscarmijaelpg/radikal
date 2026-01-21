import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import StatCard from '../components/StatCard';
import RadarChart from '../components/RadarChart';
import RadarComparisons from '../components/RadarComparisons';
import RadarCompetitors from '../components/RadarCompetitors';
import RadarNews from '../components/RadarNews';
import RadarTrends from '../components/RadarTrends';
import {
  Sparkles,
  Search,
  Bell,
  TrendingUp,
  ArrowLeftRight,
  Newspaper,
  LineChart,
  HelpCircle,
} from 'lucide-react';

const RadarResults: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'crecimiento' | 'competidores' | 'noticias' | 'tendencias'>('crecimiento');

  return (
    <div className="bg-[#f3f4f6] min-h-screen text-slate-800 font-display" style={{ background: 'radial-gradient(circle at 0% 0%, #fdfcfd 0%, #f3f4f6 100%)' }}>

      {/* Sticky Header */}
      <header className="bg-white/80 backdrop-blur-2xl border-b border-slate-200/50 sticky top-0 z-40 shadow-sm">
        <div className="px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center gap-2">
            <Sparkles className="text-radikal-fuchsia w-6 h-6" />
            <h1 className="text-xl font-bold font-display text-slate-800 tracking-tight">Radar de Reputación y Satisfacción Ventolini</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-4 border-r border-slate-200 pr-6 mr-2">
              <img alt="Google Maps" className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-NzAudTzMqiLBnZxigm86SWNAr8Qtj-sFZnVOQ1jTjPsSoVTMH3GFF5ztXml00rp5iDxvHjWvyy8Y1iZAhDkdZAQomB1Balr2jI-Vlu_I-JmEXftd08fhBzEB1PYeljXvmAHIIEPX89bdAj-vD2z0ILmCZ6buCkBk0CIJGLiOgKgMr7ELEEWSrNv15Jnker21GERqcqaxRM6qBvNMgdWB-GU8Kydz4f7j1Qeqhd00W_Qs-VfznF8byIfChJ1dCCplioX2JZbHRg" />
              <img alt="Facebook" className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCfAmM1Ut7F_1CU6VQKY2kzKZdkUbiwQ9L_0lo7D6gBjyFRh1cFoGW0DXFarespz4LXNyq4H_qYKFgQ0GUSKdyH_yteVS3lilD1k1PkCMuqm_c8D8HIeUnP2p9OYZrRFgRChgHrGsBPFp4GiS92w3sinnxhtFJwH2vDeAMqTnzQsLRG7-RLAT1fFatjwnDkth2XOLsSOuQtMAiuLa1YmDFACYjm1X1J5U-YkC-NQyeEIjJAQ1XXbgAcTMMCDnmrvlIDdmJF8JfSBg" />
              <img alt="WhatsApp" className="w-5 h-5 opacity-50 hover:opacity-100 transition-opacity cursor-pointer grayscale hover:grayscale-0" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAPjsHEXV8JkNLahwfTGJQrrPiMXLiZ5o95nKj5lBCtgIVI-dRpnY52PZchF9wCKxnc2hIvPHeqvAqh8Nsn6B-m8kiJXl794X16U9DJ5fH7PvuMJ13VcdEbkfhULhOXzGegS6W4eztvXkjRioYU9sm1j0TYXpXUHvFRE3LMkthT6MEhreDwv3wDwI-TEwS2EzWEy9TgGmgpoY0Uv5LepVp9_iyWB3ivrqaGbIA9h6rlWYe8ByxTZEBPnEWk1lSWU-g1G1Jvfld_Jw" />
            </div>
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
        <div className="px-6 lg:px-8 border-t border-slate-100">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setActiveTab('crecimiento')}
              className={`px-6 py-4 text-[14px] font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'crecimiento' ? 'nav-tab-active' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <TrendingUp className={`w-5 h-5 ${activeTab === 'crecimiento' ? '' : 'text-slate-400 group-hover:text-slate-600'}`} />
              Crecimiento y Sentimiento
            </button>
            <button
              onClick={() => setActiveTab('competidores')}
              className={`px-6 py-4 text-[14px] font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'competidores' ? 'nav-tab-active' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <ArrowLeftRight className={`w-5 h-5 ${activeTab === 'competidores' ? '' : 'text-slate-400 group-hover:text-slate-600'}`} />
              Análisis de los competidores propuestos
            </button>
            <button
              onClick={() => setActiveTab('noticias')}
              className={`px-6 py-4 text-[14px] font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'noticias' ? 'nav-tab-active' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <Newspaper className={`w-5 h-5 ${activeTab === 'noticias' ? '' : 'text-slate-400 group-hover:text-slate-600'}`} />
              Noticias de canales
            </button>
            <button
              onClick={() => setActiveTab('tendencias')}
              className={`px-6 py-4 text-[14px] font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeTab === 'tendencias' ? 'nav-tab-active' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <LineChart className={`w-5 h-5 ${activeTab === 'tendencias' ? '' : 'text-slate-400 group-hover:text-slate-600'}`} />
              Tendencias
            </button>
          </div>
        </div>
      </header>

      <main className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto w-full animate-fade-in">

        {/* Dynamic Content based on Active Tab */}
        {activeTab === 'crecimiento' && (
          <>
            {/* KPI Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Rating Promedio"
                value="4.6"
                subValue="/ 5"
                trend="+0.2"
                trendLabel="vs mes ant."
                trendPositive={true}
              />
              <StatCard
                title="Volumen de Reseñas"
                value="2.4k"
                trend="+15%"
                trendLabel="vs mes ant."
                trendPositive={true}
              />
              <StatCard
                title="SLA Resolución"
                value="1.2"
                subValue="hrs"
                trend="-15 min"
                trendLabel="vs prom."
                trendPositive={true}
              />
              <StatCard
                title="NPS Estimado"
                value="72"
                trend="+5 pts"
                trendLabel="vs compet."
                trendPositive={true}
              />
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Main Chart Section */}
              <div className="lg:col-span-8">
                <RadarChart />
              </div>

              {/* Right Column: Insights & Comparisons */}
              <div className="lg:col-span-4 space-y-8">
                <RadarComparisons />
              </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Thematic Classification */}
              <GlassCard className="rounded-[32px] p-10">
                <div className="flex items-center gap-2 mb-8">
                  <h2 className="text-2xl font-bold font-display text-slate-800 tracking-tight">Clasificación Temática de Reseñas</h2>
                  <HelpCircle className="text-slate-300 w-5 h-5 cursor-help" />
                </div>

                <div className="space-y-6">
                  {[
                    { label: 'Precio', pos: 82, neu: 10, neg: 8 },
                    { label: 'Calidad', pos: 94, neu: 4, neg: 2 },
                    { label: 'Servicio', pos: 75, neu: 15, neg: 10 },
                    { label: 'Logística', pos: 68, neu: 20, neg: 12 },
                    { label: 'Facturación', pos: 55, neu: 30, neg: 15 },
                  ].map((item) => (
                    <div key={item.label} className="space-y-2">
                      <div className="flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase font-tech">
                        <span>{item.label}</span>
                        <span>{item.pos}% Positivo</span>
                      </div>
                      <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden flex">
                        <div className="h-full bg-radikal-mint" style={{ width: `${item.pos}%` }}></div>
                        <div className="h-full bg-slate-200" style={{ width: `${item.neu}%` }}></div>
                        <div className="h-full bg-rose-400" style={{ width: `${item.neg}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex gap-4">
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-radikal-mint"></div><span className="text-[9px] font-bold text-slate-400 uppercase">Positivo</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-slate-200"></div><span className="text-[9px] font-bold text-slate-400 uppercase">Neutral</span></div>
                  <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-rose-400"></div><span className="text-[9px] font-bold text-slate-400 uppercase">Crítico</span></div>
                </div>
              </GlassCard>

              {/* SLA Gauges */}
              <GlassCard className="rounded-[32px] p-10">
                <div className="flex items-center gap-2 mb-8">
                  <h2 className="text-2xl font-bold font-display text-slate-800 tracking-tight">SLA de Respuesta y Resolución</h2>
                  <HelpCircle className="text-slate-300 w-5 h-5 cursor-help" />
                </div>

                <div className="grid grid-cols-2 gap-8 h-full">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                        <circle cx="64" cy="64" fill="transparent" r="56" stroke="#f1f5f9" strokeWidth="8"></circle>
                        <circle cx="64" cy="64" fill="transparent" r="56" stroke="#E889E2" strokeDasharray="351.8" strokeDashoffset="40" strokeLinecap="round" strokeWidth="8"></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold font-tech text-slate-800">88%</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Meta</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-600 font-display">Respuesta Inicial</p>
                      <p className="text-[11px] text-slate-400 font-medium">&lt; 15 mins prom.</p>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                        <circle cx="64" cy="64" fill="transparent" r="56" stroke="#f1f5f9" strokeWidth="8"></circle>
                        <circle cx="64" cy="64" fill="transparent" r="56" stroke="#2DD4BF" strokeDasharray="351.8" strokeDashoffset="75" strokeLinecap="round" strokeWidth="8"></circle>
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-2xl font-bold font-tech text-slate-800">79%</span>
                        <span className="text-[9px] text-slate-400 font-bold uppercase">Meta</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-bold text-slate-600 font-display">Resolución Final</p>
                      <p className="text-[11px] text-slate-400 font-medium">&lt; 4 horas prom.</p>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </>
        )}

        {activeTab === 'competidores' && <RadarCompetitors />}
        {activeTab === 'noticias' && <RadarNews />}
        {activeTab === 'tendencias' && <RadarTrends />}

      </main>
    </div>
  );
};

export default RadarResults;

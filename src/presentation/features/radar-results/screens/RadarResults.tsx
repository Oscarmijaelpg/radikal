// RadarResults Screen - Refactored for new n8n Data Structure
// Orchestrator component using new rich visual components

import React, { useState } from 'react';
import { Sparkles, Search, Bell, BarChart3, Users, Lightbulb, LineChart, Target, Shield, CheckCircle2, Loader2, AlertTriangle, RefreshCw } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

// Feature imports
import { useRadarAnalysis } from "../hooks/useRadarAnalysis";
import { TabButton } from "../components/TabButton";

// New Components
import { RadarSummary } from "../components/RadarSummary";
import { WeeklyComparisonChart } from "../components/WeeklyComparisonChart";
import { TopPostsAnalysisComponent } from "../components/TopPostsAnalysis";
import { RecommendationsComponent } from "../components/Recommendations";
import { MarketIntelligenceComponent } from "../components/MarketIntelligence";
import { CompanyProfilesComponent } from "../components/CompanyProfiles";

const RadarResults: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { brand_id } = location.state || {};

  const [activeTab, setActiveTab] = useState<'resumen' | 'comparativo' | 'inteligencia' | 'competidores'>('resumen');

  // Custom hook for data fetching
  const { analysis, isLoading } = useRadarAnalysis(brand_id);

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-400 font-medium">Cargando inteligencia de mercado...</p>
        </div>
      </div>
    );
  }

  // No analysis state
  if (!analysis) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-16 h-16 text-amber-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No hay análisis disponible</h2>
          <p className="text-slate-600 dark:text-slate-400">Ejecuta un análisis de competencia desde el panel de control.</p>
        </div>
      </div>
    );
  }

  // Check if we have the new report format
  const report = analysis.radikal_ia_report;

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="text-center max-w-md p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-xl">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Formato no compatible</h2>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Este análisis fue generado con una versión anterior del motor. Por favor, genera un nuevo análisis para ver los resultados actualizados.
          </p>
        </div>
      </div>
    );
  }

  const { meta } = report;

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen text-slate-800 dark:text-slate-100 font-display transition-colors duration-300">
      {/* Sticky Header */}
      <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-200/50 dark:border-slate-800 sticky top-0 z-40 shadow-sm">
        <div className="px-6 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-purple-600 p-2 rounded-xl shadow-lg shadow-primary/20">
              <Sparkles className="text-white w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 dark:text-white">Radar de Mercado</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Reporte Generado: {new Date(meta.generated_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">Análisis Completo</span>
            </div>

            <button
              onClick={() => navigate('/radar', { state: { brand_id, forceNew: true } })}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm font-bold">Nueva Búsqueda</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 lg:px-8 border-t border-slate-100 dark:border-slate-800">
          <div className="flex gap-2 overflow-x-auto custom-scrollbar pt-2 pb-0.5">
            <TabButton
              active={activeTab === 'resumen'}
              onClick={() => setActiveTab('resumen')}
              icon={<BarChart3 className="w-4 h-4" />}
              label="Resumen Estratégico"
            />
            <TabButton
              active={activeTab === 'comparativo'}
              onClick={() => setActiveTab('comparativo')}
              icon={<LineChart className="w-4 h-4" />}
              label="Comparativo Semanal"
            />
            <TabButton
              active={activeTab === 'inteligencia'}
              onClick={() => setActiveTab('inteligencia')}
              icon={<Shield className="w-4 h-4" />}
              label="Inteligencia de Mercado"
              badge={meta.market_intelligence_blocks}
            />
            <TabButton
              active={activeTab === 'competidores'}
              onClick={() => setActiveTab('competidores')}
              icon={<Users className="w-4 h-4" />}
              label={`Competidores (${report.company_profiles?.length || 0})`}
            />
          </div>
        </div>
      </header >

      <main className="p-6 lg:p-8 space-y-8 max-w-[1600px] mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Tab: Resumen */}
        {activeTab === 'resumen' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7 space-y-8">
              <RadarSummary report={report} />
            </div>
            <div className="lg:col-span-5 space-y-8">
              <RecommendationsComponent recommendations={report.analysis.recommendations} />
            </div>
          </div>
        )}

        {/* Tab: Comparativo */}
        {activeTab === 'comparativo' && (
          <div className="space-y-8">
            <WeeklyComparisonChart weeklyData={report.analysis.weekly_comparison} />
            <TopPostsAnalysisComponent analysis={report.analysis.top_posts_analysis} />
          </div>
        )}

        {/* Tab: Inteligencia */}
        {activeTab === 'inteligencia' && (
          <div className="max-w-4xl mx-auto">
            <MarketIntelligenceComponent intelligence={report.market_intelligence} />
          </div>
        )}

        {/* Tab: Competidores */}
        {activeTab === 'competidores' && (
          <div className="max-w-5xl mx-auto">
            <CompanyProfilesComponent profiles={report.company_profiles} />
          </div>
        )}
      </main>
    </div >
  );
};

export default RadarResults;
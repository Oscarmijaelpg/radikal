import React from 'react';
import { Zap, Globe, Fingerprint, Briefcase, AtSign, Camera, Facebook, Film, Wand2 } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white animate-fade-in font-sans">
      <div className="mb-10 flex flex-col items-center">
        <div className="flex items-center gap-3">
          {/* Placeholder logo if image fails or use component */}
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
            <Zap className="text-white w-6 h-6" fill="currentColor" />
          </div>
          <span className="text-3xl font-extrabold tracking-tighter text-slate-900 font-display">RADIKAL</span>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-[32px] p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
        <div className="relative z-10">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold mb-3 tracking-tight text-slate-900 font-display">Onboarding Mágico</h1>
            <p className="text-slate-500 text-lg">Proporciona los detalles de tu marca para iniciar el análisis inteligente.</p>
          </div>

          <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); navigate('/scanning'); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Sitio Web</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input className="minimal-input !pl-14" placeholder="https://tuempresa.com" type="url" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">NIT / Identificación Fiscal</label>
                <div className="relative">
                  <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input className="minimal-input !pl-14" placeholder="900.000.000-1" type="text" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">LinkedIn</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input className="minimal-input !pl-14" placeholder="linkedin.com/company/..." type="text" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">X (Twitter)</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input className="minimal-input !pl-14" placeholder="@usuario" type="text" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Instagram</label>
                <div className="relative">
                  <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input className="minimal-input !pl-14" placeholder="@tu_marca" type="text" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">Facebook</label>
                <div className="relative">
                  <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input className="minimal-input !pl-14" placeholder="facebook.com/tu_marca" type="text" />
                </div>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">TikTok</label>
                <div className="relative">
                  <Film className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input className="minimal-input !pl-14" placeholder="@tu_tiktok" type="text" />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full py-5 bg-primary text-white font-extrabold text-xl rounded-2xl shadow-xl shadow-fuchsia-200 hover:shadow-fuchsia-300 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
              >
                Iniciar Análisis Mágico
                <Wand2 className="w-5 h-5 font-bold" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="mt-16 w-full max-w-4xl flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm gap-6">
        <div>Radikal AI © 2025 • Edición Empresarial</div>
        <div className="flex items-center gap-8 font-medium">
          <a href="#" className="hover:text-slate-600 transition-colors">Términos de Servicio</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Privacidad</a>
          <a href="#" className="hover:text-slate-600 transition-colors">Protocolo de Seguridad</a>
        </div>
      </footer>
    </main>
  );
};

export default Onboarding;

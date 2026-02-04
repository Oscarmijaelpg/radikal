import React from 'react';
import GlassCard from './GlassCard';
import { HelpCircle, Smile, AlertCircle, AlertTriangle } from 'lucide-react';

const RadarComparisons: React.FC = () => {
    return (
        <div className="space-y-8">
            {/* Einstein Insight */}
            <GlassCard className="rounded-[32px] p-7 border-l-4 border-l-radikal-fuchsia overflow-hidden">
                <div className="absolute top-0 right-0 p-4">
                    <div className="flex items-center gap-1.5 bg-slate-900/5 px-2 py-1 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-blink"></span>
                        <span className="text-[9px] font-bold text-slate-600 tracking-tighter uppercase font-tech">AI Activa</span>
                    </div>
                </div>
                <div className="flex items-center gap-4 mb-6 mt-2">
                    <div className="relative">
                        <div className="absolute -inset-1 bg-radikal-fuchsia/20 blur rounded-2xl"></div>
                        <img alt="Einstein AI" className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-sm relative z-10" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCwwtF_NLycoPZoG9k1piZIKE8EXQuqWLkGpJLJme0rvS5GYk5e4zFEG8q3fp5JWDky1iuT52M3pjymuecCpvVAB-g3g53TJeBUjyQgk9zGyBXXzoXBhkTsdF8dBt9MbATGxH_rUHn54176OYk04GtWMg_cos8Nby2CKcCOdbAdWPYKgh9mjx5W25J_8-rC8LrJ2Le6NJvDggz8JRsiSIua12EaUPS2h1x2csBfwxDs5vrV3Zr4OVLlDd0PxzqMMXpjTGCbDUnPog" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm font-display tracking-tight text-slate-800">Insights de Einstein</h3>
                        <p className="text-radikal-fuchsia text-[9px] uppercase font-bold tracking-[0.2em] font-tech">Análisis de Reputación</p>
                    </div>
                </div>
                <div className="bg-white/50 border border-white rounded-2xl p-4 shadow-sm">
                    <p className="text-[13px] text-slate-600 leading-relaxed font-medium italic">
                        "Tu volumen de reseñas en Google Maps subió <span className="text-radikal-fuchsia font-bold">15%</span>. Se detecta alta satisfacción en 'Calidad' pero ligeras demoras en 'Facturación'."
                    </p>
                </div>
            </GlassCard>

            {/* Comparisons */}
            <GlassCard className="rounded-[32px] p-7">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold font-display text-slate-800">Top Quejas vs Elogios</h3>
                        <HelpCircle className="text-slate-300 w-5 h-5 cursor-help" />
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">vs Competidor</span>
                </div>

                <div className="space-y-4">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Ventolini</p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between bg-emerald-50/50 p-2 rounded-lg border border-emerald-100">
                                <div className="flex items-center gap-2">
                                    <Smile className="text-emerald-500 w-4 h-4" />
                                    <span className="text-[11px] font-bold text-slate-700">Sabor único</span>
                                </div>
                                <span className="text-[10px] font-tech font-bold text-emerald-600">88%</span>
                            </div>
                            <div className="flex items-center justify-between bg-rose-50/50 p-2 rounded-lg border border-rose-100">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="text-rose-400 w-4 h-4" />
                                    <span className="text-[11px] font-bold text-slate-700">Tiempo de espera</span>
                                </div>
                                <span className="text-[10px] font-tech font-bold text-rose-500">12%</span>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100">
                        <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Competidor Líder</p>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between bg-emerald-50/50 p-2 rounded-lg border border-emerald-100 opacity-60">
                                <div className="flex items-center gap-2">
                                    <Smile className="text-emerald-500 w-4 h-4" />
                                    <span className="text-[11px] font-bold text-slate-700">Ubicaciones</span>
                                </div>
                                <span className="text-[10px] font-tech font-bold text-emerald-600">72%</span>
                            </div>
                            <div className="flex items-center justify-between bg-rose-50/50 p-2 rounded-lg border border-rose-100 opacity-60">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="text-rose-400 w-4 h-4" />
                                    <span className="text-[11px] font-bold text-slate-700">Calidad/Precio</span>
                                </div>
                                <span className="text-[10px] font-tech font-bold text-rose-500">28%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default RadarComparisons;

import React, { useState } from 'react';
import { Camera, Music, Facebook, MonitorPlay, TrendingUp, Film, ArrowLeftRight, ArrowUp, Rocket, ChevronDown, CloudUpload, Sparkles, Clock, Lightbulb } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const ContentGen: React.FC = () => {
    const navigate = useNavigate();
    const onGenerate = () => {
        // TODO: Navigate to results or show generation state
        console.log('Generating content...');
        navigate('/dashboard');
    };
    const [activePlatform, setActivePlatform] = useState('Instagram');

    const platforms = [
        { name: 'Instagram', icon: <Camera className="w-8 h-8 mb-1" /> },
        { name: 'TikTok', icon: <Music className="w-8 h-8 mb-1" /> },
        { name: 'Facebook', icon: <Facebook className="w-8 h-8 mb-1" /> },
        { name: 'YouTube', icon: <MonitorPlay className="w-8 h-8 mb-1" /> },
    ];

    return (
        <div className="relative w-full h-full min-h-[calc(100vh-theme(spacing.20))]">
            {/* Background blobs specific to this screen */}
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-[80px] pointer-events-none z-0"></div>
            <div className="absolute bottom-[-5%] right-[-5%] w-80 h-80 bg-blue-400/20 rounded-full blur-[80px] pointer-events-none z-0"></div>

            <div className="p-6 lg:p-12 relative z-10 animate-fade-in">
                <header className="max-w-6xl mx-auto mb-10 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2 text-slate-900 dark:text-white">
                        Generación Radikal <span className="text-primary">Insights v3</span>
                    </h1>
                    <p className="text-slate-500 dark:text-slate-400 text-lg">
                        Inteligencia competitiva avanzada para tu contenido.
                    </p>
                </header>

                <div className="max-w-[1400px] mx-auto grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

                    {/* Left Column - Insights */}
                    <div className="xl:col-span-3 hidden xl:flex flex-col gap-6">
                        {/* Card 1 */}
                        <div className="glass-card p-5 rounded-2xl shadow-xl border-l-4 border-l-primary transform transition hover:scale-105 duration-300 bg-white/70">
                            <div className="flex items-center gap-2 mb-3">
                                <TrendingUp className="text-primary w-4 h-4" />
                                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Tendencias del Sector</h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm font-bold text-slate-900">"Cacao amargo"</p>
                                <p className="text-xs text-emerald-500 font-semibold">+124% este mes</p>
                                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[85%]"></div>
                                </div>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="glass-card p-5 rounded-2xl shadow-xl border-l-4 border-l-blue-400 transform transition hover:scale-105 duration-300 bg-white/70">
                            <div className="flex items-center gap-2 mb-3">
                                <Film className="text-blue-400 w-4 h-4" />
                                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Mejores Formatos</h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs text-slate-600 font-medium">Reels y Videos cortos son tendencia dominante en tu nicho actual.</p>
                                <div className="flex gap-2 pt-1">
                                    <span className="px-2 py-1 bg-blue-50 text-[10px] rounded-lg text-blue-600 font-bold">Reels</span>
                                    <span className="px-2 py-1 bg-blue-50 text-[10px] rounded-lg text-blue-600 font-bold">TikToks</span>
                                </div>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="glass-card p-5 rounded-2xl shadow-xl border-l-4 border-l-indigo-400 transform transition hover:scale-105 duration-300 bg-white/70">
                            <div className="flex items-center gap-2 mb-3">
                                <ArrowLeftRight className="text-indigo-400 w-4 h-4" />
                                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Análisis de Competencia</h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs font-bold text-slate-800">Leños y Carbón</p>
                                <p className="text-[10px] text-slate-400">Aumentó su actividad un 15% en la última semana.</p>
                                <div className="flex items-center gap-1 text-emerald-500">
                                    <ArrowUp className="w-3 h-3" />
                                    <span className="text-[10px] font-bold">Crecimiento agresivo</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center Column - Main Form */}
                    <div className="xl:col-span-6">
                        <div className="glass-card p-8 lg:p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group bg-white/80 border border-white/60">
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-3xl group-hover:bg-primary/20 transition-all duration-700 rounded-full"></div>

                            <form className="space-y-8 relative z-10" onSubmit={(e) => { e.preventDefault(); onGenerate(); }}>
                                {/* Objective */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Objetivo de Campaña</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                            <Rocket className="text-primary w-5 h-5" />
                                        </div>
                                        <select className="block w-full pl-12 pr-10 py-4 bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-2xl transition-all appearance-none cursor-pointer text-slate-700 font-bold outline-none">
                                            <option>Vender (Conversión Directa)</option>
                                            <option>Branding (Alcance y Reconocimiento)</option>
                                            <option>Educación (Lead Nurturing)</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            <ChevronDown className="text-slate-400 w-5 h-5" />
                                        </div>
                                    </div>
                                </div>

                                {/* Platforms */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Plataformas de Publicación</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {platforms.map((platform) => (
                                            <button
                                                key={platform.name}
                                                type="button"
                                                onClick={() => setActivePlatform(platform.name)}
                                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${activePlatform === platform.name
                                                    ? 'border-primary bg-primary/5 text-primary'
                                                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-primary/30 hover:text-primary'
                                                    }`}
                                            >
                                                {platform.icon}
                                                <span className="text-[10px] font-bold uppercase tracking-tighter">{platform.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Media Upload */}
                                <div>
                                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">Media Assets</label>
                                    <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-primary/50 transition-all cursor-pointer group/upload">
                                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover/upload:scale-110 transition-transform shadow-sm">
                                            <CloudUpload className="text-primary w-8 h-8" />
                                        </div>
                                        <p className="font-bold text-slate-700">Arrastra y suelta archivos aquí</p>
                                        <p className="text-xs text-slate-400 mt-1 italic font-medium">JPG, MP4 o RAW (Máx 500MB)</p>
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="pt-4 text-center">
                                    <button
                                        type="submit"
                                        className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-5 rounded-[1.5rem] shadow-xl shadow-primary/30 transform hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center gap-3"
                                    >
                                        <Sparkles className="w-6 h-6" />
                                        Generar Contenido Ahora
                                    </button>
                                    <p className="mt-4 text-[10px] uppercase tracking-widest text-slate-400 font-bold">Potenciado por Radikal AI Intelligence</p>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Right Column - Data & Tips */}
                    <div className="xl:col-span-3 hidden xl:flex flex-col gap-6">
                        {/* Engagement Data */}
                        <div className="glass-card p-5 rounded-2xl shadow-xl border-r-4 border-r-emerald-400 transform transition hover:scale-105 duration-300 bg-white/70">
                            <div className="flex items-center gap-2 mb-3">
                                <Clock className="text-emerald-400 w-4 h-4" />
                                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Datos de Engagement</h3>
                            </div>
                            <div className="space-y-2">
                                <p className="text-xs text-slate-400 italic font-medium">Mejor hora para publicar:</p>
                                <p className="text-xl font-black text-slate-800">07:00 PM</p>
                                <p className="text-[10px] text-emerald-500 font-bold">+18% alcance estimado</p>
                            </div>
                        </div>

                        {/* Success Prediction */}
                        <div className="glass-card p-5 rounded-2xl shadow-xl border-r-4 border-r-amber-400 transform transition hover:scale-105 duration-300 bg-white/70">
                            <div className="flex items-center gap-2 mb-3">
                                <Sparkles className="text-amber-400 w-4 h-4" />
                                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Predicción de Éxito</h3>
                            </div>
                            <div className="flex items-end gap-2">
                                <span className="text-3xl font-black text-slate-800">88%</span>
                                <span className="text-[10px] mb-1.5 text-slate-400 leading-none font-bold">basado en tu historial</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
                                <div className="h-full bg-amber-400 w-[88%]"></div>
                            </div>
                        </div>

                        {/* AI Tip */}
                        <div className="glass-card p-5 rounded-2xl shadow-xl border-r-4 border-r-primary transform transition hover:scale-105 duration-300 bg-white/70">
                            <div className="flex items-center gap-2 mb-3">
                                <Lightbulb className="text-primary w-4 h-4" />
                                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500">Tip de IA</h3>
                            </div>
                            <p className="text-xs italic leading-relaxed text-slate-600 font-medium">
                                "Usa <span className="font-bold text-primary">storytelling</span> al inicio de tu descripción para capturar la atención en los primeros 3 segundos."
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContentGen;
import React from 'react';
import GlassCard from './GlassCard';
import { TrendingUp, ArrowUpRight, Search, Hash, Zap, BarChart3 } from 'lucide-react';

const RadarTrends: React.FC = () => {
    const trends = [
        { name: 'Sabores Exóticos', volume: 'High', growth: '+45%', sentiment: 'Positive', category: 'Producto' },
        { name: 'Empaques Eco', volume: 'Medium', growth: '+22%', sentiment: 'Neutral', category: 'Sostenibilidad' },
        { name: 'Delivery 10 min', volume: 'High', growth: '+15%', sentiment: 'Negative', category: 'Servicio' },
        { name: 'Helado Vegano', volume: 'Low', growth: '+85%', sentiment: 'Positive', category: 'Nicho' },
        { name: 'Pet Friendly', volume: 'Medium', growth: '+12%', sentiment: 'Positive', category: 'Experiencia' },
    ];

    return (
        <div className="space-y-8">
            {/* Top Trending Header */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <GlassCard className="p-6 rounded-[24px] bg-gradient-to-br from-indigo-500 to-purple-600 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-2">
                            <Zap className="w-5 h-5 text-yellow-300 fill-yellow-300" />
                            <h3 className="font-bold text-sm uppercase tracking-widest text-indigo-100">Macro Tendencia #1</h3>
                        </div>
                        <h2 className="text-2xl font-bold mb-4">Experiencias "Phygital"</h2>
                        <p className="text-indigo-100 text-sm font-medium leading-relaxed mb-6">
                            La fusión de experiencias físicas y digitales en puntos de venta está dominando la conversación en Q4.
                        </p>
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold backdrop-blur-sm">+124% Búsquedas</span>
                            <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold backdrop-blur-sm">Alta Relevancia</span>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 rounded-[24px] flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Hash className="w-5 h-5 text-radikal-fuchsia" />
                            <h3 className="font-bold text-sm text-slate-500 uppercase tracking-widest">Hashtags Virales</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['#FoodieCali', '#PostresArtesanales', '#DateNight', '#CheatMeal', '#Brunch', '#Helado'].map(tag => (
                                <span key={tag} className="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg hover:bg-radikal-fuchsia hover:text-white transition-colors cursor-pointer">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-100">
                        <p className="text-xs text-slate-400 font-medium text-center">Basado en TikTok & Instagram (Cali, CO)</p>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 rounded-[24px] flex flex-col justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Search className="w-5 h-5 text-blue-500" />
                            <h3 className="font-bold text-sm text-slate-500 uppercase tracking-widest">Interés de Búsqueda</h3>
                        </div>
                        <div className="space-y-4">
                            {[
                                { term: 'Ventolini domicilio', val: 85 },
                                { term: 'Mejores postres cali', val: 62 },
                                { term: 'Restaurantes pet friendly', val: 45 },
                            ].map((item, i) => (
                                <div key={i} className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-slate-700">
                                        <span>{item.term}</span>
                                        <span>{item.val}/100</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <div className="h-full bg-blue-500" style={{ width: `${item.val}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </GlassCard>
            </div>

            {/* Trends Table */}
            <GlassCard className="p-8 rounded-[32px]">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold font-display text-slate-800 tracking-tight">Tendencias Emergentes</h2>
                    <div className="flex gap-2">
                        <button className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-primary transition-colors"><BarChart3 className="w-4 h-4" /></button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {trends.map((trend, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl hover:bg-white hover:shadow-md transition-all border border-transparent hover:border-slate-100 group">
                            <div className="flex items-center gap-4">
                                <span className="text-lg font-bold text-slate-300 w-6">0{idx + 1}</span>
                                <div>
                                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-primary transition-colors">{trend.name}</h4>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{trend.category}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Volumen</p>
                                    <p className="text-xs font-bold text-slate-700">{trend.volume}</p>
                                </div>
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">Sentimiento</p>
                                    <p className={`text-xs font-bold ${trend.sentiment === 'Positive' ? 'text-emerald-500' :
                                            trend.sentiment === 'Negative' ? 'text-rose-500' : 'text-amber-500'
                                        }`}>{trend.sentiment}</p>
                                </div>
                                <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 min-w-[80px] justify-center">
                                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                                    <span className="text-xs font-bold text-emerald-600">{trend.growth}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </GlassCard>
        </div>
    );
};

export default RadarTrends;

import React from 'react';
import GlassCard from './GlassCard';
import { Trophy, TrendingUp, TrendingDown, Minus, Target, Users, Globe, ExternalLink } from 'lucide-react';

const RadarCompetitors: React.FC = () => {
    const competitors = [
        {
            name: 'Crepes & Waffles',
            marketShare: 35,
            growth: 2.4,
            sentiment: 92,
            strength: 'Calidad constante',
            weakness: 'Tiempos de espera',
            status: 'leader'
        },
        {
            name: 'Ventolini',
            marketShare: 12,
            growth: 15.2,
            sentiment: 88,
            strength: 'Innovación sabores',
            weakness: 'Cobertura',
            status: 'challenger'
        },
        {
            name: 'Popsy',
            marketShare: 22,
            growth: -1.5,
            sentiment: 75,
            strength: 'Ubicaciones',
            weakness: 'Percepción calidad',
            status: 'stable'
        },
        {
            name: 'Mimos',
            marketShare: 18,
            growth: 0.8,
            sentiment: 78,
            strength: 'Tradición',
            weakness: 'Innovación',
            status: 'stable'
        }
    ];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'leader': return <Trophy className="w-4 h-4 text-amber-500" />;
            case 'challenger': return <Target className="w-4 h-4 text-radikal-fuchsia" />;
            case 'stable': return <Minus className="w-4 h-4 text-slate-400" />;
            default: return null;
        }
    };

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Market Share Total', value: '12%', sub: '+1.5%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
                    { label: 'Posición Mercado', value: '#3', sub: 'Challenger', icon: Trophy, color: 'text-amber-500', bg: 'bg-amber-500/10' },
                    { label: 'Share of Voice', value: '18%', sub: '+4.2%', icon: Globe, color: 'text-radikal-fuchsia', bg: 'bg-radikal-fuchsia/10' },
                    { label: 'Gap vs Líder', value: '-23%', sub: 'Reduciendo', icon: Target, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
                ].map((stat, idx) => (
                    <GlassCard key={idx} className="p-6 relative overflow-hidden rounded-[24px]">
                        <div className={`absolute top-0 right-0 p-4 opacity-50`}>
                            <div className={`p-3 rounded-xl ${stat.bg}`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                        </div>
                        <div className="relative z-10">
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
                            <p className={`text-xs font-bold ${stat.sub.includes('-') ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {stat.sub}
                            </p>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <GlassCard className="p-8 rounded-[32px]">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold font-display text-slate-800 tracking-tight">Comparativa Directa</h2>
                    <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">
                        Descargar Reporte
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="text-left py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Marca</th>
                                <th className="text-center py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                                <th className="text-right py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Market Share</th>
                                <th className="text-right py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Crecimiento</th>
                                <th className="text-right py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Sentimiento</th>
                                <th className="text-left py-4 px-8 text-xs font-bold text-slate-400 uppercase tracking-wider">Punto Fuerte</th>
                                <th className="text-right py-4 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {competitors.map((comp, idx) => (
                                <tr key={idx} className={`group hover:bg-slate-50/50 transition-colors ${comp.name === 'Ventolini' ? 'bg-radikal-fuchsia/5' : ''}`}>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 text-xs">
                                                {comp.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <span className={`font-bold ${comp.name === 'Ventolini' ? 'text-radikal-fuchsia' : 'text-slate-700'}`}>
                                                {comp.name}
                                                {comp.name === 'Ventolini' && <span className="ml-2 text-[9px] bg-radikal-fuchsia text-white px-2 py-0.5 rounded-full uppercase">Tú</span>}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-center">
                                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm border border-slate-100" title={comp.status}>
                                            {getStatusIcon(comp.status)}
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="font-bold text-slate-700">{comp.marketShare}%</span>
                                            <div className="w-24 h-1.5 bg-slate-100 rounded-full mt-1 overflow-hidden">
                                                <div className="h-full bg-slate-800" style={{ width: `${comp.marketShare}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <div className={`inline-flex items-center gap-1 font-bold text-xs ${comp.growth > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                            {comp.growth > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                            {Math.abs(comp.growth)}%
                                        </div>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${comp.sentiment >= 90 ? 'bg-emerald-100 text-emerald-600' :
                                            comp.sentiment >= 75 ? 'bg-blue-100 text-blue-600' :
                                                'bg-amber-100 text-amber-600'
                                            }`}>
                                            {comp.sentiment}/100
                                        </span>
                                    </td>
                                    <td className="py-4 px-8">
                                        <span className="text-xs font-semibold text-slate-600">{comp.strength}</span>
                                    </td>
                                    <td className="py-4 px-4 text-right">
                                        <button className="p-2 text-slate-400 hover:text-radikal-fuchsia transition-colors">
                                            <ExternalLink className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </GlassCard>
        </div>
    );
};

export default RadarCompetitors;

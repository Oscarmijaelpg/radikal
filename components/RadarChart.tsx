import React from 'react';
import GlassCard from './GlassCard';
import { HelpCircle } from 'lucide-react';

const RadarChart: React.FC = () => {
    return (
        <GlassCard className="rounded-[32px] p-10 h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-2xl font-bold font-display text-slate-800 tracking-tight">Rating Promedio y Volumen de Reseñas</h2>
                        <HelpCircle className="text-slate-300 w-5 h-5 cursor-help" />
                    </div>
                    <p className="text-slate-400 text-xs font-medium">Comparativa de calidad (1-5) y cantidad total de comentarios mensuales.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-radikal-fuchsia"></span>
                        <span className="text-[11px] font-bold text-slate-500 font-tech uppercase">Rating Ventolini</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 bg-radikal-mint/40 rounded-sm"></span>
                        <span className="text-[11px] font-bold text-slate-500 font-tech uppercase">Volumen</span>
                    </div>
                </div>
            </div>

            {/* Custom Chart Illustration */}
            <div className="h-[320px] w-full relative mt-4 flex items-end justify-between px-2 gap-4">
                {/* Y Axis */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-[10px] font-tech text-slate-300 py-1">
                    <span>5.0</span><span>4.0</span><span>3.0</span><span>2.0</span><span>1.0</span>
                </div>

                {/* Bars & Line */}
                <div className="relative flex-1 h-full flex items-end justify-around pb-6 pt-2 pl-6">
                    {/* Month Bars */}
                    {[40, 45, 60, 55, 75, 85].map((height, idx) => (
                        <div key={idx} className="w-12 flex flex-col items-center gap-1 relative h-full justify-end group">
                            <div className={`w-8 bg-radikal-mint/20 rounded-t-md transition-all duration-300 group-hover:bg-radikal-mint/30`} style={{ height: `${height}%` }}></div>
                            {/* Line Point Dot (Simulated position based on height + variation) */}
                            <div className="absolute w-2 h-2 rounded-full bg-radikal-fuchsia z-10 shadow-[0_0_8px_rgba(232,137,226,0.5)] transition-transform group-hover:scale-125" style={{ bottom: `${height + 20}%` }}></div>
                        </div>
                    ))}

                    {/* SVG Line Overlay */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                        <path d="M10 40 L 26 35 L 42 20 L 58 25 L 74 5 L 90 0" fill="none" stroke="#E889E2" strokeLinecap="round" strokeWidth="0.5" transform="translate(0, 40) scale(1, 0.5)"></path>
                    </svg>
                </div>
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-around mt-2 pl-6 pr-2">
                {['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'].map(m => (
                    <span key={m} className="text-[10px] font-bold text-slate-400 font-tech uppercase">{m}</span>
                ))}
            </div>
        </GlassCard>
    );
};

export default RadarChart;

import React from 'react';
import GlassCard from './GlassCard';
import { HelpCircle } from 'lucide-react';

interface Props {
  title: string;
  value: string;
  subValue?: string;
  trend: string;
  trendPositive?: boolean;
  trendLabel: string;
}

const StatCard: React.FC<Props> = ({ title, value, subValue, trend, trendPositive = true, trendLabel }) => {
  return (
    <GlassCard className="rounded-2xl relative group hover:border-white/80 transition-all duration-300">
      <div className="flex justify-between items-start mb-4">
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest font-tech">{title}</p>
        <HelpCircle className="text-slate-300 w-5 h-5 cursor-help hover:text-radikal-fuchsia transition-colors" />
      </div>
      <h3 className="text-3xl font-bold font-tech text-slate-800 tracking-tight">
        {value}
        {subValue && <span className="text-lg opacity-50 font-normal"> {subValue}</span>}
      </h3>
      <div className="flex items-center gap-1.5 mt-2">
        <span className={`w-1.5 h-1.5 rounded-full ${trendPositive ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
        <p className={`text-[11px] font-semibold ${trendPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
          {trend} <span className="text-slate-400 font-medium">{trendLabel}</span>
        </p>
      </div>
    </GlassCard>
  );
};

export default StatCard;

import React from 'react';
import { CONTENT_RESULTS } from '../constants';
import { Filter, Download, Heart, FileText, Hash, Music, PlayCircle, CheckCircle } from 'lucide-react';

const BrandResults: React.FC = () => {
  return (
    <div className="p-6 lg:p-10 animate-fade-in">
      <header className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-display font-bold mb-3 text-black">
            Resultados <span className="text-primary">Radikal</span>
          </h1>
          <p className="text-slate-500 font-medium">
            Catálogo generado por IA basado en tu identidad de marca.
          </p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button className="px-5 py-3 rounded-2xl border border-slate-200 bg-white text-sm font-bold flex items-center gap-2 hover:bg-slate-50 text-slate-700 shadow-sm">
            <Filter className="w-5 h-5" />
            Filtrar
          </button>
          <button className="px-5 py-3 rounded-2xl bg-black text-white text-sm font-bold flex items-center gap-2 hover:bg-slate-800 shadow-xl">
            <Download className="w-5 h-5" />
            Exportar Todo
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
        {CONTENT_RESULTS.map((item) => (
          <div key={item.id} className="bg-white rounded-[2.5rem] overflow-hidden group hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 border border-slate-100">
            <div className="relative aspect-square overflow-hidden">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute top-5 left-5">
                <span className={`${item.tagColor} text-white text-[10px] font-bold px-4 py-2 rounded-full tracking-wider shadow-lg backdrop-blur-sm bg-opacity-90`}>
                  {item.tag}
                </span>
              </div>
              <div className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                <button className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg text-slate-900 hover:text-primary transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-3">
                  <FileText className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Copy Sugerido</span>
                </div>
                <p className="text-sm text-slate-800 leading-relaxed font-semibold">
                  {item.copy}
                </p>
              </div>

              <div>
                <div className="flex items-center gap-2 text-slate-400 mb-3">
                  <Hash className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Hashtags</span>
                </div>
                <p className="text-xs text-primary font-bold">
                  {item.hashtags}
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-100 group-hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                    <Music className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audio</p>
                    <p className="text-xs font-bold text-slate-900">{item.music}</p>
                  </div>
                </div>
                <button className="text-slate-400 hover:text-primary transition-colors">
                  <PlayCircle className="w-7 h-7" />
                </button>
              </div>

              <button className="w-full py-4 bg-white border-2 border-slate-100 hover:border-black hover:bg-black hover:text-white text-black rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Seleccionar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrandResults;
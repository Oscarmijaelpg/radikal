import React from 'react';
// import { ScreenName } from '../types';
import {
  Rocket,
  TrendingUp,
  Radio,
  ArrowRight,
  Wand2,
  Mountain,
  Globe,
  AtSign
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const Landing: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden bg-grid-pattern font-sans">

      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <div className="h-10 w-auto flex items-center">
                <span className="text-3xl font-display font-black tracking-tighter text-slate-900 flex items-center">
                  Radi<span className="text-primary italic">k</span>al
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors cursor-pointer">Productos</a>
              <a className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors cursor-pointer">Empresas</a>
              <a className="text-sm font-semibold text-slate-600 hover:text-primary transition-colors cursor-pointer">Precios</a>
              <button
                onClick={() => navigate('/register')}
                className="bg-primary text-white px-6 py-2.5 rounded-full font-bold text-sm glow-button transition-all"
              >
                Empieza Ahora
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 50%, rgba(236, 72, 153, 0.05) 0%, transparent 70%)' }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left Column: Text */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-wider mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Enterprise Grade AI
              </div>

              <h1 className="text-5xl lg:text-7xl font-display font-black tracking-tight mb-6 leading-[1.1] text-slate-900">
                Potencia tu empresa <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary">
                  al 1000%
                </span>
              </h1>

              <p className="text-xl text-slate-600 mb-10 max-w-xl leading-relaxed font-medium">
                La plataforma de IA diseñada exclusivamente para compañías con facturación superior a $1M+ ARR. Automatiza procesos críticos y escala sin límites.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-primary text-white px-10 py-4 rounded-xl font-extrabold text-lg glow-button flex items-center justify-center gap-2 transition-all hover:-translate-y-1"
                >
                  Empieza Ahora <Rocket className="w-6 h-6" />
                </button>
                <button className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-sm flex items-center justify-center gap-2">
                  Ver Demo
                </button>
              </div>
            </div>

            {/* Right Column: Image */}
            <div className="relative flex justify-center lg:justify-end animate-float">
              <div className="relative w-full max-w-lg">
                <div className="absolute -inset-4 bg-primary/10 blur-3xl rounded-full"></div>
                <img
                  alt="Expert 3D Character"
                  className="relative z-10 rounded-[2.5rem] object-cover w-full aspect-square shadow-2xl border border-white"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuApyrNI-15t7lskjWs0iMqqOEDxvOlB1HScfu5IJ7OglkT0JvKSuNPk_pHGbapmr6l9W3iYuzcJ98uG_xEU3kATgjFlTcvYYoJuReEE2hPsRyOfzJ-ZSItiwtUBU1uVFRvZIOAR9aA64n09tLRIxQ-CUbqKjCjoWMqcQMMfk5XeToBiqnuiYCF5Wll_h9XFBbxbtFCo18LL-hQhbyf2yhwp3XNMWvUcJ4_e6zB8TrcVK22FbWSQwQAWyjvPTMyaGCTFGP6GZPbuBg"
                />
                <div className="absolute -bottom-6 -left-6 z-20 bg-white/90 border border-slate-100 p-4 rounded-2xl shadow-xl backdrop-blur-lg flex items-center gap-4">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase font-bold tracking-widest">Efficiency Boost</p>
                    <p className="text-xl font-black text-slate-900">+1,240%</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Brands Section */}
      <section className="py-16 bg-mint">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-black text-white/80 uppercase tracking-[0.3em] mb-12">
            Empresas que creen en nosotros
          </p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20">
            {/* Using text for brands to ensure high quality rendering as SVG alternatives weren't provided */}
            <div className="text-2xl font-display font-black italic text-white/90">LIBERTARIO</div>
            <div className="text-2xl font-display font-black italic text-white/90">S HOTEL</div>
            <div className="text-2xl font-display font-black italic text-white/90">COCOA MOSAIC</div>
            <div className="text-2xl font-display font-black italic text-white/90">VENTOLINI</div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-display font-black mb-4 text-slate-900">
              Soluciones de Alto Impacto
            </h2>
            <p className="text-slate-500 max-w-2xl mx-auto font-medium text-lg">
              Herramientas diseñadas para CEOs y equipos de alto rendimiento que no se conforman con lo estándar.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="group glass-card p-8 rounded-[2rem] border border-slate-200 hover:border-primary/30 transition-all duration-500 flex flex-col h-full shadow-lg hover:shadow-primary/5 bg-white/70">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-600 mb-8 group-hover:scale-110 transition-transform">
                <Radio className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-display font-extrabold mb-4 text-slate-900">Radar de Mercado</h3>
              <p className="text-slate-600 mb-8 flex-grow leading-relaxed font-medium">
                Análisis predictivo en tiempo real de tu competencia y tendencias globales antes de que ocurran.
              </p>
              <button onClick={() => navigate('/login')} className="inline-flex items-center text-primary font-bold group-hover:gap-2 transition-all">
                Explorar <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Card 2 */}
            <div className="group glass-card p-8 rounded-[2rem] border border-slate-200 hover:border-primary/30 transition-all duration-500 flex flex-col h-full shadow-lg hover:shadow-primary/5 bg-white/70">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
                <Wand2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-display font-extrabold mb-4 text-slate-900">Generación de Contenido</h3>
              <p className="text-slate-600 mb-8 flex-grow leading-relaxed font-medium">
                IA entrenada con tu voz de marca para escalar la creación de contenido multicanal con calidad humana.
              </p>
              <button onClick={() => navigate('/login')} className="inline-flex items-center text-primary font-bold group-hover:gap-2 transition-all">
                Explorar <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>

            {/* Card 3 (Coming Soon) */}
            <div className="relative group bg-slate-50/50 p-8 rounded-[2rem] border border-dashed border-slate-300 flex flex-col h-full opacity-80">
              <div className="absolute top-6 right-6 px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500">
                Coming Soon
              </div>
              <div className="w-16 h-16 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-400 mb-8">
                <Mountain className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-display font-extrabold mb-4 text-slate-400">Everest Way</h3>
              <p className="text-slate-500 mb-8 flex-grow font-medium">
                La metodología definitiva de escalado empresarial impulsada por agentes autónomos de IA.
              </p>
              <div className="inline-flex items-center text-slate-400 font-bold italic">
                Muy pronto
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-gradient-to-br from-primary to-purple-600 rounded-[3rem] p-12 lg:p-20 overflow-hidden shadow-2xl text-center">
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-white/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>

            <h2 className="text-4xl lg:text-6xl font-display font-black text-white mb-8 relative z-10">
              ¿Listo para el siguiente nivel?
            </h2>
            <p className="text-white/90 text-xl mb-12 max-w-2xl mx-auto relative z-10 font-medium">
              Únete a las empresas que están redefiniendo sus industrias con Radikal.
            </p>
            <div className="relative z-10">
              <button
                onClick={() => navigate('/register')}
                className="bg-white text-primary px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-transform shadow-xl"
              >
                Solicitar Acceso VIP
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="pt-20 pb-10 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
            <div className="col-span-2">
              <span className="text-3xl font-display font-black tracking-tighter text-slate-900 mb-6 block">
                Radi<span className="text-primary italic">k</span>al
              </span>
              <p className="text-slate-500 max-w-sm mb-6 font-medium">
                Empoderando a las empresas más ambiciosas del mundo con inteligencia artificial de vanguardia.
              </p>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-primary transition-colors">
                  <AtSign className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-slate-900">Plataforma</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">Radar</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contenido</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-slate-900">Compañía</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">Nosotros</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Carreras</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Prensa</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6 text-slate-900">Legal</h4>
              <ul className="space-y-4 text-sm text-slate-500 font-medium">
                <li><a href="#" className="hover:text-primary transition-colors">Términos</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacidad</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-slate-100 text-slate-400 text-xs font-bold tracking-widest">
            <p>RADIKAL © 2025 ALL RIGHTS RESERVED</p>
            <div className="flex gap-8 mt-4 md:mt-0">
              <span>SISTEMA OPERATIVO v2.4.0</span>
              <span>MADRID // MIAMI // MEXICO CITY</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;
import React from 'react';
import { ArrowLeft, Zap, ArrowRight } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Back Button */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 w-12 h-12 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-500 hover:text-black hover:border-black hover:shadow-lg transition-all z-20 group"
        aria-label="Volver al inicio"
      >
        <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </button>

      {/* Background Ambience - Pink/Light */}
      <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-pink-100/50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-purple-100/50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      <div className="w-full max-w-md bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(236,72,153,0.15)] border border-pink-100 relative z-10 animate-float">
        <div className="flex justify-center mb-10">
          <div className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30 transform -rotate-6">
            <Zap className="text-white w-12 h-12" fill="currentColor" />
          </div>
        </div>

        <h1 className="text-4xl font-display font-bold text-black text-center mb-2">
          Bienvenido
        </h1>
        <p className="text-slate-500 text-center mb-10 font-medium">
          Tu inteligencia de marca, simplificada.
        </p>

        <form onSubmit={(e) => { e.preventDefault(); navigate('/dashboard'); }} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Email</label>
            <input
              type="email"
              defaultValue="ventolini@radikal.ai"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Contraseña</label>
            <input
              type="password"
              defaultValue="password123"
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-black hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            Iniciar Sesión
            <ArrowRight className="w-6 h-6" />
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-slate-400 uppercase font-bold tracking-widest text-[10px]">O continúa con</span></div>
        </div>

        <button className="w-full py-4 bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-slate-50 mb-6">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Google Workspace
        </button>

        <div className="text-center">
          <p className="text-slate-500 font-medium">
            ¿No tienes una cuenta? {' '}
            <button onClick={() => navigate('/register')} className="text-primary font-bold hover:underline">
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

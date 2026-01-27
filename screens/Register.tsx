import React, { useState } from 'react';
import { ArrowLeft, UserPlus, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/src/lib/supabase';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../src/context/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { refreshSession } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            company_name: company,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data.session) {
        console.log('✅ Registro exitoso. Actualizando sesión...');
        // Forzamos actualización del contexto antes de navegar
        await refreshSession();

        console.log('🔄 Navegando a onboarding...');
        navigate('/onboarding', { replace: true });
        return;
      } else {
        // En caso de requerir confirmación de email
        setError('Registro exitoso. Por favor verifica tu correo para continuar.');
        setLoading(false);
      }

    } catch (err: any) {
      setError(err.message || 'Error al registrarte');
      setLoading(false);
    }
  };

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

      {/* Background Ambience */}
      <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-pink-100/50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-purple-100/50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply" />

      <div className="w-full max-w-lg bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(236,72,153,0.15)] border border-pink-100 relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-2xl mb-4 text-primary">
            <UserPlus className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-display font-bold text-black mb-2">
            Crea tu cuenta
          </h1>
          <p className="text-slate-500 font-medium">
            Únete a la revolución de la IA corporativa.
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Nombre</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                required
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Empresa</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Empresa S.A."
                className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Email Profesional</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@empresa.com"
              required
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all font-medium"
            />
          </div>

          <div className="flex items-center gap-3 py-2">
            <input type="checkbox" id="terms" required className="w-5 h-5 rounded-lg border-2 border-slate-300 text-primary focus:ring-primary/20" />
            <label htmlFor="terms" className="text-sm text-slate-500 font-medium cursor-pointer select-none">
              Acepto los <span className="text-black font-bold hover:underline">Términos</span> y la <span className="text-black font-bold hover:underline">Privacidad</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-black hover:bg-slate-800 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                Registrarse
                <ArrowRight className="w-6 h-6" />
              </>
            )}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-slate-400 uppercase font-bold tracking-widest text-[10px]">O regístrate con</span></div>
        </div>

        <button className="w-full py-4 bg-white border-2 border-slate-100 hover:border-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all hover:bg-slate-50 mb-6">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
          Google Workspace
        </button>

        <div className="text-center">
          <p className="text-slate-500 font-medium">
            ¿Ya tienes una cuenta? {' '}
            <button onClick={() => navigate('/login')} className="text-primary font-bold hover:underline">
              Inicia Sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;

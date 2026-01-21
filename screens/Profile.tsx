import React from 'react';
import { CURRENT_USER } from '../constants';
import { Edit2, User, Settings, Bell, LogOut } from 'lucide-react';

interface Props {
  onLogout: () => void;
}

const Profile: React.FC<Props> = ({ onLogout }) => {
  return (
    <div className="p-6 lg:p-12 animate-fade-in max-w-5xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl lg:text-5xl font-display font-bold text-black mb-3">
          Mi <span className="text-primary">Perfil</span>
        </h1>
        <p className="text-slate-500 text-lg font-medium">
          Gestiona tu cuenta y preferencias personales.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col items-center text-center sticky top-8">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full p-1 bg-white border-4 border-slate-50 shadow-inner">
                <img
                  src={CURRENT_USER.avatar}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-primary transition-colors shadow-lg">
                <Edit2 className="w-4 h-4" />
              </button>
            </div>

            <h2 className="text-2xl font-bold text-black mb-1">{CURRENT_USER.name}</h2>
            <p className="text-slate-500 font-medium mb-8">{CURRENT_USER.role} at {CURRENT_USER.company}</p>

            <div className="w-full space-y-4">
              <div className="flex items-center justify-between px-5 py-4 bg-slate-50 rounded-2xl text-sm font-medium border border-slate-100">
                <span className="text-slate-500">Plan Actual</span>
                <span className="text-primary font-bold bg-primary/10 px-3 py-1 rounded-lg">Enterprise</span>
              </div>
              <div className="flex items-center justify-between px-5 py-4 bg-slate-50 rounded-2xl text-sm font-medium border border-slate-100">
                <span className="text-slate-500">Miembro desde</span>
                <span className="text-slate-900 font-bold">Oct 2023</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Settings & Logout */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Info Form */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-pink-50 rounded-lg text-primary">
                <User className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-black">Información Personal</h3>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Nombre Completo</label>
                  <input type="text" defaultValue={CURRENT_USER.name} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-2 border-slate-100 text-slate-900 font-bold focus:outline-none focus:border-primary focus:bg-white transition-all" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 ml-1">Email</label>
                  <input
                    type="email"
                    defaultValue="ventolini@radikal.ai"
                    readOnly
                    className="w-full px-5 py-4 rounded-2xl bg-slate-100 border-2 border-slate-100 text-slate-500 font-bold focus:outline-none cursor-not-allowed transition-all select-none"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button type="submit" className="px-8 py-4 bg-black text-white rounded-2xl font-bold hover:bg-slate-800 transition-all hover:-translate-y-1 shadow-lg">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>

          {/* Preferences & Logout */}
          <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-pink-50 rounded-lg text-primary">
                <Settings className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-black">Preferencias</h3>
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex items-center justify-between p-5 border border-slate-100 rounded-2xl hover:border-slate-200 transition-all cursor-pointer group bg-slate-50/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center text-slate-500 group-hover:text-primary transition-colors shadow-sm">
                    <Bell className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">Notificaciones</p>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Gestionar alertas</p>
                  </div>
                </div>
                <div className="w-14 h-8 bg-primary rounded-full relative cursor-pointer transition-colors shadow-inner">
                  <div className="w-6 h-6 bg-white rounded-full absolute top-1 right-1 shadow-sm"></div>
                </div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="w-full py-5 border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all group"
            >
              <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
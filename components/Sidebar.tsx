import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CURRENT_USER } from '../constants';
import {
  Zap,
  LayoutDashboard,
  Briefcase,
  Radio,
  Wand2,
  ChevronRight,
  LucideIcon
} from 'lucide-react';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const navItems: { path: string; label: string; icon: LucideIcon; activeMatch: string[] }[] = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, activeMatch: ['/dashboard'] },
    { path: '/brand', label: 'Mi Marca', icon: Briefcase, activeMatch: ['/brand', '/brand-results'] },
    { path: '/radar', label: 'Radar de Mercado', icon: Radio, activeMatch: ['/radar', '/radar-scanning', '/radar-results'] },
    { path: '/generation', label: 'Generación', icon: Wand2, activeMatch: ['/generation'] },
  ];

  const isActive = (matchPaths: string[]) => {
    return matchPaths.some(path => currentPath.startsWith(path));
  };

  return (
    <aside className="w-20 lg:w-72 bg-white border-r border-slate-200 flex flex-col fixed h-full z-50 transition-all duration-300">
      <div className="p-6 lg:p-8">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
            <Zap className="text-white w-6 h-6" fill="currentColor" />
          </div>
          <span className="font-display font-bold text-2xl tracking-tight text-black uppercase hidden lg:block">
            RADIKAL
          </span>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const active = isActive(item.activeMatch);
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-200 group relative ${active
                  ? 'bg-primary/10 text-primary'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
              >
                <item.icon
                  className={`w-6 h-6 transition-transform group-hover:scale-110 ${active ? 'fill-current' : ''}`}
                  strokeWidth={active ? 2.5 : 2}
                />
                <span className={`font-medium hidden lg:block ${active ? 'font-bold' : ''}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6">
        <button
          onClick={() => navigate('/profile')}
          className={`w-full bg-slate-50 p-4 rounded-2xl flex items-center gap-3 border border-slate-100 transition-all hover:bg-pink-50 hover:border-primary/20 hover:shadow-md text-left group outline-none ${currentPath === '/profile' ? 'ring-2 ring-primary ring-offset-2 border-primary/20' : ''}`}
        >
          <img
            src={CURRENT_USER.avatar}
            alt="User"
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow-sm group-hover:scale-105 transition-transform"
          />
          <div className="hidden lg:block overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">{CURRENT_USER.name}</p>
            <p className="text-xs text-slate-500 font-medium">{CURRENT_USER.role}</p>
          </div>
          <div className="ml-auto text-slate-400 group-hover:text-primary transition-colors hidden lg:block">
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

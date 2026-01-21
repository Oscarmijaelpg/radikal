import React from 'react';
import { Moon, Sun } from 'lucide-react';

interface Props {
  isDark: boolean;
  toggleTheme: () => void;
}

const FloatingThemeToggle: React.FC<Props> = ({ isDark, toggleTheme }) => {
  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-8 right-8 w-14 h-14 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl z-[60] transition-all hover:-translate-y-1 group"
    >
      <Moon className="w-6 h-6 text-slate-600 dark:hidden group-hover:text-primary transition-colors" />
      <Sun className="w-6 h-6 text-yellow-400 hidden dark:block group-hover:text-yellow-300 transition-colors" />
    </button>
  );
};

export default FloatingThemeToggle;

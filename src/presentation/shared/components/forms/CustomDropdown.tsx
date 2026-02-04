import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, LucideIcon } from 'lucide-react';

interface Option {
  label: string;
  value: string;
}

interface Props {
  label: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon | React.ComponentType<any>;
}

const CustomDropdown: React.FC<Props> = ({ label, options, value, onChange, icon: Icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="space-y-3" ref={dropdownRef}>
      <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">{label}</label>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-5 py-4 bg-slate-50/50 dark:bg-slate-950/50 border-2 ${isOpen ? 'border-primary ring-2 ring-primary/10' : 'border-slate-100 dark:border-slate-800'} rounded-2xl transition-all duration-200 outline-none group hover:border-slate-300 dark:hover:border-slate-700`}
        >
          <div className="flex items-center gap-3">
            <Icon className={`w-5 h-5 transition-colors ${isOpen ? 'text-primary' : 'text-slate-400'}`} />
            <span className="font-medium text-slate-700 dark:text-slate-200">
              {selectedOption?.label || 'Seleccionar...'}
            </span>
          </div>
          <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        <div className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl shadow-slate-200/50 z-50 overflow-hidden transition-all duration-200 origin-top ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}>
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left px-5 py-3 flex items-center justify-between transition-colors ${value === option.value
                  ? 'bg-primary/5 text-primary font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
            >
              <span>{option.label}</span>
              {value === option.value && (
                <Check className="w-5 h-5" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomDropdown;

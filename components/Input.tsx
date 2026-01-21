import React from 'react';
import { LucideIcon, AlertCircle } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    icon?: LucideIcon | React.ComponentType<any>;
    error?: string;
    containerClassName?: string;
}

const Input: React.FC<InputProps> = ({
    icon: Icon,
    error,
    className = '',
    containerClassName = '',
    ...props
}) => {
    return (
        <div className={`relative ${containerClassName}`}>
            <div className="relative group">
                {Icon && (
                    <Icon className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors w-5 h-5 ${error ? 'text-red-400' : 'text-slate-400 group-focus-within:text-primary'
                        }`} />
                )}
                <input
                    className={`w-full pl-12 pr-4 py-4 bg-slate-50/50 dark:bg-slate-950/50 border rounded-2xl outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-800 dark:text-slate-200 font-medium ${error
                            ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                            : 'border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary'
                        } ${className}`}
                    {...props}
                />
            </div>

            {error && (
                <div className="flex items-center gap-1.5 mt-1.5 ml-1 animate-fade-in text-red-500">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span className="text-xs font-semibold">{error}</span>
                </div>
            )}
        </div>
    );
};

export default Input;

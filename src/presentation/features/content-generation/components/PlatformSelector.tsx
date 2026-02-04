import React from 'react';
import { Platform } from "@core/types";

interface PlatformSelectorProps {
    platforms: Platform[];
    activePlatform: string;
    onSelect: (platformName: string) => void;
}

export const PlatformSelector: React.FC<PlatformSelectorProps> = ({
    platforms,
    activePlatform,
    onSelect,
}) => {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">
                Plataformas de Publicación
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {platforms.map((platform) => (
                    <button
                        key={platform.name}
                        type="button"
                        onClick={() => onSelect(platform.name)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all duration-200 ${activePlatform === platform.name
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-primary/30 hover:text-primary'
                            }`}
                    >
                        {platform.icon}
                        <span className="text-[10px] font-bold uppercase tracking-tighter">
                            {platform.name}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

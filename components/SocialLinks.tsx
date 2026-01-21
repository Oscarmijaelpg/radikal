import React from 'react';
import { Globe, Camera, Facebook, Music, Link as LinkIcon, AlertCircle } from 'lucide-react';

interface SocialLinksProps {
    socials: {
        website: string;
        instagram: string;
        facebook: string;
        tiktok: string;
    };
    onChange: (key: string, value: string) => void;
    isEditing: boolean;
    errors?: { [key: string]: string };
}

const SocialLinks: React.FC<SocialLinksProps> = ({ socials, onChange, isEditing, errors = {} }) => {
    const getIcon = (key: string) => {
        switch (key) {
            case 'website': return Globe;
            case 'instagram': return Camera;
            case 'facebook': return Facebook;
            case 'tiktok': return Music;
            default: return LinkIcon;
        }
    };

    const getLabel = (key: string) => {
        return key.charAt(0).toUpperCase() + key.slice(1);
    };

    const renderInput = (key: keyof typeof socials) => {
        const Icon = getIcon(key);
        const hasError = !!errors[key];

        return (
            <div key={key} className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <Icon className="w-3 h-3" />
                    {getLabel(key)}
                </label>
                <div className="relative">
                    <input
                        type="text"
                        value={socials[key]}
                        onChange={(e) => onChange(key, e.target.value)}
                        className={`w-full text-sm border rounded-xl px-4 py-2.5 transition-all outline-none
              ${hasError
                                ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-4 focus:ring-red-500/10'
                                : 'border-slate-200 bg-white focus:border-primary focus:ring-4 focus:ring-primary/10'
                            }`}
                        placeholder={`https://${key}...`}
                    />
                </div>
                {hasError && (
                    <div className="flex items-center gap-1.5 text-red-500 text-xs font-medium animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>{errors[key]}</span>
                    </div>
                )}
            </div>
        );
    };

    if (isEditing) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                {(Object.keys(socials) as Array<keyof typeof socials>).map((key) => renderInput(key))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {socials.website && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-primary group-hover:scale-110 transition-transform">
                        <Globe className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-0.5">Website</p>
                        <a
                            href={socials.website.startsWith('http') ? socials.website : `https://${socials.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-slate-900 hover:text-primary truncate block transition-colors"
                        >
                            {socials.website}
                        </a>
                    </div>
                </div>
            )}

            <div className="flex flex-wrap gap-4">
                {socials.instagram && (
                    <a href={socials.instagram} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                        <Camera className="w-4 h-4 text-pink-600 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-slate-700">Instagram</span>
                    </a>
                )}
                {socials.facebook && (
                    <a href={socials.facebook} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                        <Facebook className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-slate-700">Facebook</span>
                    </a>
                )}
                {socials.tiktok && (
                    <a href={socials.tiktok} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full shadow-sm hover:shadow-md hover:border-primary/30 transition-all group">
                        <Music className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium text-slate-700">TikTok</span>
                    </a>
                )}
            </div>
        </div>
    );
};

export default SocialLinks;

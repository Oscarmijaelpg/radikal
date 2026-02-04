import React from 'react';
import { Sparkles, Download, RefreshCw, X } from 'lucide-react';
import { toast } from 'sonner';

interface GeneratedImageDisplayProps {
    imageUrl: string;
    activePlatform: string;
    onRegenerate: () => void;
    onError: () => void;
}

export const GeneratedImageDisplay: React.FC<GeneratedImageDisplayProps> = ({
    imageUrl,
    activePlatform,
    onRegenerate,
    onError,
}) => {
    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `radikal-${activePlatform}-${Date.now()}.png`;
        link.target = '_blank';
        link.click();
        toast.success('Descargando imagen...');
    };

    return (
        <div className="mt-8 bg-gradient-to-br from-primary/5 to-purple-50 p-6 rounded-2xl border border-primary/20 animate-fade-in">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Imagen Generada
            </h3>
            <div className="relative rounded-xl overflow-hidden shadow-2xl mb-4">
                <img
                    src={imageUrl}
                    alt="Generated content"
                    className="w-full h-auto"
                    onError={onError}
                />
            </div>
            <div className="flex gap-3">
                <button
                    type="button"
                    onClick={handleDownload}
                    className="flex-1 bg-white border-2 border-primary text-primary py-3 px-4 rounded-xl font-bold hover:bg-primary/5 transition-colors flex items-center justify-center gap-2"
                >
                    <Download className="w-5 h-5" />
                    Descargar
                </button>
                <button
                    type="button"
                    onClick={onRegenerate}
                    className="flex-1 bg-primary text-white py-3 px-4 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-5 h-5" />
                    Regenerar
                </button>
            </div>
        </div>
    );
};

interface ImageErrorDisplayProps {
    error: string;
}

export const ImageErrorDisplay: React.FC<ImageErrorDisplayProps> = ({ error }) => {
    return (
        <div className="mt-6 bg-red-50 border border-red-200 p-4 rounded-xl animate-fade-in">
            <p className="text-sm text-red-700 flex items-center gap-2">
                <X className="w-4 h-4" />
                {error}
            </p>
        </div>
    );
};

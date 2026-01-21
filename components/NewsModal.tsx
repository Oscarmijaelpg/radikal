import React from 'react';
import { X, Calendar } from 'lucide-react';

interface NewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    newsItem: {
        source: string;
        title: string;
        content?: string;
        summary: string;
        date: string;
        image: string;
        tags: string[];
    } | null;
}

const NewsModal: React.FC<NewsModalProps> = ({ isOpen, onClose, newsItem }) => {
    if (!isOpen || !newsItem) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity duration-300"
                onClick={onClose}
            ></div>

            {/* Modal Container - Defines shape and max height */}
            <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">

                {/* Scrollable Area - Handles content scrolling inside the rounded container */}
                <div className="overflow-y-auto flex-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-slate-300/80 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">

                    {/* Header Image */}
                    <div className="relative h-64 w-full group shrink-0">
                        <img
                            src={newsItem.image}
                            alt="News Cover"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-60"></div>

                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors border border-white/10 z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-8">
                        {/* Date & Source Tag */}
                        <div className="flex items-center gap-3 mb-5">
                            <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                {newsItem.source}
                            </span>
                            <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                                <Calendar className="w-3.5 h-3.5" />
                                <span>{newsItem.date}</span>
                            </div>
                        </div>

                        {/* NO TITLE as requested */}

                        {/* Text Content */}
                        <div className="prose prose-slate prose-sm max-w-none">
                            <p className="text-slate-600 leading-7 text-[15px] font-medium">
                                {newsItem.content || newsItem.summary}
                            </p>
                            {/* Dummy extended content */}
                            <p className="text-slate-600 leading-7 text-[15px] mt-4">
                                Esta tendencia refleja un cambio significativo en el comportamiento del consumidor, quien ahora valora más la autenticidad y el origen de los ingredientes. Las marcas que logren adaptarse a esta narrativa tendrán una ventaja competitiva en el próximo trimestre.
                            </p>
                        </div>

                        {/* Close Button - Clean Text */}
                        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
                            <button
                                onClick={onClose}
                                className="text-slate-400 hover:text-slate-800 font-bold text-sm transition-colors uppercase tracking-widest"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewsModal;
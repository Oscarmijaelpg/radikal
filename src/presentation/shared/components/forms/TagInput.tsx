import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, Save } from 'lucide-react';

interface TagInputProps {
    tags: string[];
    onAdd: (tag: string) => void;
    onRemove: (tag: string) => void;
    placeholder?: string;
    title?: string;
}

const TagInput: React.FC<TagInputProps> = ({ tags, onAdd, onRemove, placeholder = 'Añadir...', title = 'Añadir Nuevo' }) => {
    const [isInputVisible, setIsInputVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const handleSave = () => {
        if (inputValue.trim()) {
            onAdd(inputValue.trim());
            setInputValue('');
            setIsInputVisible(false);
            // focus input again if we want rapid entry, but in a modal maybe better to keep it focused
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        } else if (e.key === 'Escape') {
            setIsInputVisible(false);
        }
    };

    return (
        <div className="flex flex-wrap gap-2 items-center">
            {tags.map((tag, idx) => (
                <span key={idx} className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 rounded-full text-sm font-medium text-slate-700 border border-slate-200">
                    {tag}
                    <button
                        onClick={() => onRemove(tag)}
                        className="p-0.5 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-3 h-3" />
                    </button>
                </span>
            ))}

            <button
                onClick={() => setIsInputVisible(true)}
                className="flex items-center gap-1 px-3 py-1.5 border border-dashed border-slate-300 rounded-full text-sm font-medium text-slate-500 hover:text-primary hover:border-primary transition-colors hover:bg-primary/5"
            >
                <Plus className="w-3 h-3" />
                <span className="text-xs">Añadir</span>
            </button>

            {isInputVisible && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-md mx-6 p-8 rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-200 ring-1 ring-black/5">
                        <button
                            onClick={() => setIsInputVisible(false)}
                            className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-full transition-colors"
                            title="Cerrar"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="text-center mb-8 mt-4">
                            <h3 className="text-2xl font-bold text-slate-900">{title}</h3>
                        </div>

                        <div className="space-y-4">
                            <input
                                autoFocus
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={placeholder}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg text-center text-slate-700 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all placeholder:text-slate-400"
                            />

                            <button
                                onClick={handleSave}
                                disabled={!inputValue.trim()}
                                className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                            >
                                <Save className="w-5 h-5" />
                                Guardar
                            </button>

                            <p className="text-center text-xs text-slate-400">
                                Presiona <kbd className="font-mono bg-slate-100 px-1 rounded">Enter</kbd> para guardar
                            </p>
                        </div>
                    </div>

                    {/* Backdrop click to close */}
                    <div
                        className="absolute inset-0 -z-10"
                        onClick={() => setIsInputVisible(false)}
                    />
                </div>,
                document.body
            )}        </div>
    );
};

export default TagInput;

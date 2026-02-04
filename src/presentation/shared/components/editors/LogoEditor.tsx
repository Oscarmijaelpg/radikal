import React, { useRef } from 'react';
import { Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

interface LogoEditorProps {
    logoUrl: string | null;
    base64: string | null;
    isEditing: boolean;
    onLogoChange: (file: File) => void;
    onRemove: () => void;
}

const LogoEditor: React.FC<LogoEditorProps> = ({
    logoUrl,
    base64,
    isEditing,
    onLogoChange,
    onRemove
}) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onLogoChange(file);
        }
    };

    const displaySource = base64 || logoUrl;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <div className={`
                        w-24 h-24 rounded-2xl border-2 border-slate-200 bg-slate-50 
                        flex items-center justify-center overflow-hidden
                        ${isEditing ? 'cursor-pointer hover:border-primary/50 hover:bg-slate-100' : ''}
                        transition-all duration-300
                    `}
                        onClick={() => isEditing && fileInputRef.current?.click()}
                    >
                        {displaySource ? (
                            <img
                                src={displaySource}
                                alt="Brand Logo"
                                className="w-full h-full object-contain p-2"
                            />
                        ) : (
                            <ImageIcon className="w-8 h-8 text-slate-300" />
                        )}

                        {isEditing && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Upload className="w-6 h-6 text-white" />
                            </div>
                        )}
                    </div>
                </div>

                {isEditing && (
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-2"
                        >
                            <Upload className="w-4 h-4" />
                            Subir Logo
                        </button>

                        {displaySource && (
                            <button
                                onClick={onRemove}
                                className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors flex items-center gap-2"
                            >
                                <Trash2 className="w-4 h-4" />
                                Eliminar
                            </button>
                        )}
                    </div>
                )}
            </div>

            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/svg+xml"
                onChange={handleFileChange}
            />

            {!isEditing && !displaySource && (
                <p className="text-sm text-slate-400 italic">No hay logo asignado</p>
            )}
        </div>
    );
};

export default LogoEditor;
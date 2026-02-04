import React from 'react';
import { CloudUpload, X } from 'lucide-react';

interface MediaUploadProps {
    uploadedFiles: File[];
    onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onRemoveFile: (index: number) => void;
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
    uploadedFiles,
    onFileUpload,
    onRemoveFile,
}) => {
    return (
        <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3 ml-1">
                Media Assets
            </label>
            <div className="border-2 border-dashed border-slate-200 rounded-[2rem] p-10 text-center bg-slate-50/50 hover:bg-slate-50 hover:border-primary/50 transition-all cursor-pointer group/upload">
                <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={onFileUpload}
                    className="hidden"
                    id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 group-hover/upload:scale-110 transition-transform shadow-sm">
                        <CloudUpload className="text-primary w-8 h-8" />
                    </div>
                    <p className="font-bold text-slate-700">Arrastra y suelta archivos aquí</p>
                    <p className="text-xs text-slate-400 mt-1 italic font-medium">
                        JPG, MP4 o RAW (Máx 500MB)
                    </p>
                </label>
            </div>

            {/* Uploaded Files */}
            {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                    {uploadedFiles.map((file, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between bg-white p-3 rounded-xl border border-slate-200"
                        >
                            <span className="text-sm text-slate-700 truncate">{file.name}</span>
                            <button
                                type="button"
                                onClick={() => onRemoveFile(idx)}
                                className="text-red-500 hover:text-red-700 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

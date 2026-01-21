import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { Plus, X, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

interface ColorPickerProps {
    colors: string[];
    onChange: (colors: string[]) => void;
    isEditing: boolean;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, onChange, isEditing }) => {
    const [showPicker, setShowPicker] = useState(false);
    const [currentColor, setCurrentColor] = useState('#000000');
    const [copiedColor, setCopiedColor] = useState<string | null>(null);

    const handleAddColor = () => {
        if (colors.includes(currentColor.toUpperCase())) {
            toast.error('Este color ya está en la paleta');
            return;
        }
        if (colors.length >= 10) {
            toast.error('Máximo 10 colores permitidos');
            return;
        }
        onChange([...colors, currentColor.toUpperCase()]);
        setShowPicker(false);
        toast.success('Color agregado');
    };

    const handleRemoveColor = (colorToRemove: string) => {
        onChange(colors.filter(c => c !== colorToRemove));
        toast.success('Color eliminado');
    };

    const copyToClipboard = async (color: string) => {
        try {
            await navigator.clipboard.writeText(color);
            setCopiedColor(color);
            toast.success(`Copiado: ${color}`);
            setTimeout(() => setCopiedColor(null), 2000);
        } catch (err) {
            toast.error('Error al copiar');
        }
    };

    // Helper: Get contrasting text color
    const getContrastColor = (hexColor: string) => {
        const hex = hexColor.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    };

    return (
        <div className="space-y-4">
            {/* Colors Display */}
            <div className="flex flex-wrap gap-3">
                {colors.length > 0 ? (
                    colors.map((color, idx) => (
                        <div
                            key={idx}
                            className="group relative"
                        >
                            {/* Color Swatch */}
                            <div
                                className="w-20 h-20 rounded-2xl shadow-lg border-2 border-white cursor-pointer transition-all hover:scale-110 hover:shadow-xl"
                                style={{ backgroundColor: color }}
                                onClick={() => !isEditing && copyToClipboard(color)}
                            >
                                {/* Remove button (only in edit mode) */}
                                {isEditing && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleRemoveColor(color);
                                        }}
                                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}

                                {/* Copy indicator */}
                                {!isEditing && copiedColor === color && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                                        <Check className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Color Code */}
                            <div className="mt-2 text-center">
                                <span className="text-xs font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-lg">
                                    {color}
                                </span>
                            </div>

                            {/* Hover tooltip */}
                            {/* Hover tooltip removed per user request */}
                        </div>
                    ))
                ) : (
                    <p className="text-slate-400 italic">No hay colores en la paleta</p>
                )}

                {/* Add Color Button */}
                {isEditing && colors.length < 10 && (
                    <button
                        onClick={() => setShowPicker(!showPicker)}
                        className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-300 hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center group"
                    >
                        <Plus className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                    </button>
                )}
            </div>

            {/* Color Picker Modal */}
            {isEditing && showPicker && (
                <div className="relative">
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-slate-900">Selecciona un color</h4>
                            <button
                                onClick={() => setShowPicker(false)}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* Color Picker */}
                            <HexColorPicker
                                color={currentColor}
                                onChange={setCurrentColor}
                                style={{ width: '100%', height: '200px' }}
                            />

                            {/* Color Preview and Input */}
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-16 h-16 rounded-xl shadow-md border-2 border-white"
                                    style={{ backgroundColor: currentColor }}
                                />
                                <div className="flex-1">
                                    <label className="text-xs font-semibold text-slate-500 mb-1 block">
                                        Código HEX
                                    </label>
                                    <input
                                        type="text"
                                        value={currentColor}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            if (/^#[0-9A-Fa-f]{0,6}$/.test(value)) {
                                                setCurrentColor(value);
                                            }
                                        }}
                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="#000000"
                                    />
                                </div>
                            </div>

                            {/* Add Button */}
                            <button
                                onClick={handleAddColor}
                                className="w-full px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all shadow-md hover:shadow-lg"
                            >
                                Agregar Color
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Instructions */}
            {!isEditing && colors.length > 0 && (
                <p className="text-xs text-slate-400 text-center">
                    💡 Haz clic en un color para copiar su código
                </p>
            )}
        </div>
    );
};

export default ColorPicker;
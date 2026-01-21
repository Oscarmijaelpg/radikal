import React from 'react';
import { Trash2, Plus, LucideIcon } from 'lucide-react';
import Input from './Input';

interface Props {
  label: string;
  items: string[];
  setItems: (items: string[]) => void;
  errors?: (string | undefined)[];
  placeholder: string;
  icon: LucideIcon | React.ComponentType<any>;
  type?: 'text' | 'email' | 'url';
  minItems?: number;
  maxItems?: number;
  addButtonLabel?: string;
}

const DynamicList: React.FC<Props> = ({
  label,
  items,
  setItems,
  errors = [],
  placeholder,
  icon: Icon,
  type = 'text',
  minItems = 0,
  maxItems,
  addButtonLabel = 'Añadir'
}) => {

  const handleChange = (index: number, value: string) => {
    const newItems = [...items];
    newItems[index] = value;
    setItems(newItems);
  };

  const handleAdd = () => {
    if (maxItems && items.length >= maxItems) return;
    setItems([...items, '']);
  };

  const handleRemove = (index: number) => {
    if (items.length <= minItems) return;
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-baseline">
        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">
          {label} <span className="text-slate-400 font-normal ml-1 text-xs">({items.length}{maxItems ? `/${maxItems}` : ''})</span>
        </label>
      </div>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex gap-3 items-start animate-fade-in">
            <div className="flex-1">
              <Input
                icon={Icon}
                placeholder={placeholder}
                type={type}
                value={item}
                onChange={(e) => handleChange(index, e.target.value)}
                error={errors[index]}
              />
            </div>

            {/* Show remove button only if we have more than minItems */}
            {(items.length > minItems) && (
              <button
                onClick={() => handleRemove(index)}
                className="w-14 h-14 flex items-center justify-center bg-white border-2 border-slate-100 text-slate-400 rounded-2xl hover:border-red-200 hover:bg-red-50 hover:text-red-500 transition-all active:scale-95 shrink-0"
                title="Eliminar"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>

      {(!maxItems || items.length < maxItems) && (
        <button
          onClick={handleAdd}
          className="text-primary text-xs font-bold uppercase tracking-wider px-2 py-2 hover:bg-primary/5 rounded-lg transition-colors flex items-center gap-2 mt-2"
        >
          <div className="bg-primary/10 rounded-md p-0.5">
            <Plus className="w-4 h-4" />
          </div>
          {addButtonLabel}
        </button>
      )}
    </div>
  );
};

export default DynamicList;

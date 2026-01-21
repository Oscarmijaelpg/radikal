import React, { useState } from 'react';
import CustomDropdown from '../components/CustomDropdown';
import DynamicList from '../components/DynamicList';
import { Search, Globe, Rss, CalendarClock, Mail } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

const RadarConfig: React.FC = () => {
  const navigate = useNavigate();

  // State for dynamic lists
  const [competitors, setCompetitors] = useState<string[]>([]);
  const [newsChannels, setNewsChannels] = useState<string[]>([]);
  const [emails, setEmails] = useState<string[]>(['usuario@empresa.com']);
  const [emailErrors, setEmailErrors] = useState<(string | undefined)[]>([]);
  const [timeframe, setTimeframe] = useState<string>('diaria');

  const timeframeOptions = [
    { label: 'Diaria', value: 'diaria' },
    { label: 'Semanal', value: 'semanal' },
  ];

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSetEmails = (newEmails: string[]) => {
    setEmails(newEmails);
    // Clear errors when user modifies the list
    if (emailErrors.length > 0) {
      setEmailErrors([]);
    }
  };

  const onSearch = () => {
    const newErrors: (string | undefined)[] = [];
    let hasError = false;

    // Validate if at least one email exists and is not empty
    const filledEmails = emails.filter(e => e.trim() !== '');
    if (filledEmails.length === 0) {
      if (emails.length > 0) {
        newErrors[0] = "Debes ingresar un correo.";
      }
      hasError = true;
    }

    // Validate each email format
    emails.forEach((email, index) => {
      if (email.trim() && !validateEmail(email)) {
        newErrors[index] = "Formato de correo inválido.";
        hasError = true;
      }
    });

    setEmailErrors(newErrors);

    if (hasError) return;

    // If validations pass
    navigate('/radar-scanning');
  };

  return (
    <div className="flex flex-col items-center justify-start p-6 lg:p-12 animate-fade-in font-sans">
      <div className="w-full max-w-3xl">
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-[10px] font-bold tracking-widest text-slate-500 dark:text-slate-400 uppercase mb-6">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            AI Industry Intelligence
          </div>
          <h1 className="text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4 tracking-tight font-display">
            Radar de <span className="text-primary">Mercado</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl">
            Configuración avanzada para el análisis de competencia y tendencias del sector.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-8 lg:p-10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)]">
          <div className="space-y-10">

            {/* Dynamic Competitors List */}
            <div>
              <DynamicList
                label="Monitorear Competidores"
                items={competitors}
                setItems={setCompetitors}
                placeholder="https://competidor.com"
                icon={Globe}
                type="url"
                maxItems={3}
                minItems={0}
                addButtonLabel="Añadir otro competidor"
              />
              {competitors.length === 0 && (
                <p className="text-xs text-amber-500 font-medium mt-2 ml-1">
                  * Opcional: Si no inserta dato, se buscará con IA.
                </p>
              )}
            </div>

            {/* Dynamic News Channels List */}
            <div>
              <DynamicList
                label="Canales de Noticias / RSS"
                items={newsChannels}
                setItems={setNewsChannels}
                placeholder="URL de feed RSS o fuente sectorial"
                icon={Rss}
                type="url"
                maxItems={3}
                minItems={0}
                addButtonLabel="Añadir otra fuente"
              />
              {newsChannels.length === 0 && (
                <p className="text-xs text-amber-500 font-medium mt-2 ml-1">
                  * Opcional: Si no inserta dato, se buscará con IA.
                </p>
              )}
            </div>

            {/* Custom Timeframe Dropdown */}
            <CustomDropdown
              label="Temporalidad de Búsqueda Automática"
              options={timeframeOptions}
              value={timeframe}
              onChange={setTimeframe}
              icon={CalendarClock}
            />

            {/* Dynamic Emails List (Min 1) */}
            <DynamicList
              label="Correos para enviar reporte"
              items={emails}
              setItems={handleSetEmails}
              errors={emailErrors}
              placeholder="usuario@empresa.com"
              icon={Mail}
              type="email"
              minItems={1}
              maxItems={3}
              addButtonLabel="Añadir otro correo"
            />

            {/* Action Button */}
            <div className="pt-6">
              <button
                onClick={onSearch}
                className="w-full bg-primary hover:opacity-90 active:scale-[0.98] text-white py-5 px-8 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20 group"
              >
                <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Iniciar Búsqueda Automática
              </button>
              <p className="text-center text-xs text-slate-400 font-medium mt-4">
                Se enviará un resumen al finalizar el análisis a los correos configurados.
              </p>
            </div>
          </div>
        </div>

        <p className="mt-12 text-center text-slate-400 dark:text-slate-600 text-sm font-medium">
          Radikal AI © 2025 · Inteligencia de Mercado Premium
        </p>
      </div>
    </div>
  );
};

export default RadarConfig;

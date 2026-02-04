import React, { useState } from "react";
import { supabase } from "@infrastructure/api/supabase";
import { useAuth } from "@context/AuthContext";
import {
  Zap,
  Globe,
  Fingerprint,
  Camera,
  Wand2,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { refreshBrand } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const [formData, setFormData] = useState({
    website: "",
    tax_id: "",
    instagram: "",
  });

  const isValidUrl = (url: string): boolean => {
    if (!url) return true;
    try {
      const urlToTest = url.startsWith("http") ? url : `https://${url}`;
      new URL(urlToTest);
      return true;
    } catch {
      return false;
    }
  };

  const normalizeUrl = (url: string): string => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) {
      return url;
    }
    return `https://${url}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    // Website - Required
    if (!formData.website.trim()) {
      newErrors.website = "El sitio web es obligatorio";
    } else if (!isValidUrl(formData.website)) {
      newErrors.website = "Por favor ingresa una URL válida";
    }

    // Tax ID (NIT) - Required
    if (!formData.tax_id.trim()) {
      newErrors.tax_id = "El NIT es obligatorio";
    }

    // Instagram - Required
    if (!formData.instagram.trim()) {
      newErrors.instagram = "Instagram es obligatorio";
    } else if (!isValidUrl(formData.instagram)) {
      newErrors.instagram = "Por favor ingresa una URL válida de Instagram";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      return;
    }

    setIsLoading(true);

    try {
      console.log("🚀 Iniciando onboarding...");

      const normalizedData = {
        website: normalizeUrl(formData.website),
        tax_id: formData.tax_id.trim(),
        instagram: normalizeUrl(formData.instagram),
      };

      console.log("📝 Datos normalizados:", normalizedData);

      // Invocar edge function
      const { data, error } = await supabase.functions.invoke(
        "complete-onboarding",
        {
          body: normalizedData,
        },
      );

      if (error) {
        console.error("❌ Error de Edge Function:", error);
        throw new Error(error.message || "Error al procesar la solicitud");
      }

      console.log("✅ Respuesta de onboarding:", data);

      if (!data?.success) {
        throw new Error(data?.error || "Error desconocido en el servidor");
      }

      if (!data?.brand_id || !data?.job_id) {
        throw new Error("Respuesta del servidor incompleta");
      }

      // Mostrar toast
      toast.success("¡Diagnóstico iniciado!");

      // IMPORTANTE: Navegar PRIMERO antes de actualizar hasBrand
      // Si actualizamos hasBrand primero, ProtectedRoute nos redirige al dashboard
      navigate("/scanning", {
        state: {
          brand_id: data.brand_id,
          job_id: data.job_id,
        },
      });
      console.log("🚀 Navegación iniciada");

      // Actualizar el estado global DESPUÉS de navegar
      // Esto evita que ProtectedRoute nos redirija al dashboard
      await refreshBrand();
      console.log("✅ Estado de marca actualizado");
    } catch (error: any) {
      console.error("❌ Error en onboarding:", error);

      if (error.message.includes("no autenticado")) {
        toast.error("Sesión expirada. Por favor inicia sesión nuevamente.");
        navigate("/login");
      } else {
        toast.error(
          error.message ||
          "Error al iniciar el análisis. Por favor intenta nuevamente.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-white animate-fade-in font-sans">
      <div className="mb-10 flex flex-col items-center">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 bg-primary rounded-xl flex items-center justify-center">
            <Zap className="text-white w-6 h-6" fill="currentColor" />
          </div>
          <span className="text-3xl font-extrabold tracking-tighter text-slate-900 font-display">
            RADIKAL
          </span>
        </div>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-[32px] p-10 md:p-14 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative overflow-hidden">
        <div className="relative z-10">
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold mb-3 tracking-tight text-slate-900 font-display">
              Onboarding Mágico
            </h1>
            <p className="text-slate-500 text-lg">
              Proporciona los detalles de tu marca para iniciar el análisis
              inteligente.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Website - OBLIGATORIO */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Sitio Web <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className={`minimal-input !pl-14 ${errors.website ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
                    placeholder="tuempresa.com o https://tuempresa.com"
                    type="text"
                    disabled={isLoading}
                  />
                </div>
                {errors.website && (
                  <div className="flex items-center gap-1 text-red-600 text-sm ml-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.website}</span>
                  </div>
                )}
              </div>

              {/* Tax ID (NIT) - OBLIGATORIO */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  NIT / Identificación Fiscal{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    name="tax_id"
                    value={formData.tax_id}
                    onChange={handleChange}
                    className={`minimal-input !pl-14 ${errors.tax_id ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
                    placeholder="900.000.000-1"
                    type="text"
                    disabled={isLoading}
                  />
                </div>
                {errors.tax_id && (
                  <div className="flex items-center gap-1 text-red-600 text-sm ml-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.tax_id}</span>
                  </div>
                )}
              </div>

              {/* Instagram - OBLIGATORIO */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700 ml-1">
                  Instagram <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Camera className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    className={`minimal-input !pl-14 ${errors.instagram ? "border-red-300 focus:border-red-500 focus:ring-red-200" : ""}`}
                    placeholder="instagram.com/tu_marca"
                    type="text"
                    disabled={isLoading}
                  />
                </div>
                {errors.instagram && (
                  <div className="flex items-center gap-1 text-red-600 text-sm ml-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.instagram}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-5 bg-primary text-white font-extrabold text-xl rounded-2xl shadow-xl shadow-fuchsia-200 hover:shadow-fuchsia-300 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Procesando...
                  </>
                ) : (
                  <>
                    Iniciar Análisis Mágico
                    <Wand2 className="w-5 h-5 font-bold" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <footer className="mt-16 w-full max-w-4xl flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm gap-6">
        <div>Radikal AI © 2025 • Edición Empresarial</div>
        <div className="flex items-center gap-8 font-medium">
          <a href="#" className="hover:text-slate-600 transition-colors">
            Términos de Servicio
          </a>
          <a href="#" className="hover:text-slate-600 transition-colors">
            Privacidad
          </a>
          <a href="#" className="hover:text-slate-600 transition-colors">
            Protocolo de Seguridad
          </a>
        </div>
      </footer>
    </main>
  );
};

export default Onboarding;

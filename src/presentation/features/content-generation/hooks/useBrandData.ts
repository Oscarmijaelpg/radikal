import { useState, useEffect } from 'react';
import { supabase } from "@infrastructure/api/supabase";
import { toast } from 'sonner';

export const useBrandData = (userId: string | undefined) => {
    const [brandId, setBrandId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBrandId = async () => {
            if (!userId) return;

            try {
                const { data, error } = await supabase
                    .from('brands')
                    .select('id')
                    .eq('user_id', userId)
                    .single();

                if (error) throw error;

                if (data) {
                    setBrandId(data.id);
                } else {
                    toast.error('No se encontró una marca asociada');
                }
            } catch (error) {
                console.error('Error obteniendo brand_id:', error);
                toast.error('Error al cargar la marca');
            } finally {
                setIsLoading(false);
            }
        };

        fetchBrandId();
    }, [userId]);

    return { brandId, isLoading };
};

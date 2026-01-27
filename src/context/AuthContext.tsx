import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    hasBrand: boolean | null;
    refreshBrand: () => Promise<void>;
    refreshSession: () => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [hasBrand, setHasBrand] = useState<boolean | null>(null);
    const initializingRef = React.useRef(false);

    const checkBrand = async (userId: string) => {
        console.log('🔍 Verificando si el usuario tiene marca...');

        try {
            // Timeout de 10 segundos (aumentado de 5)
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Timeout verificando marca')), 10000)
            );

            // Query simplificada - solo verificar existencia
            const queryPromise = supabase
                .from('brands')
                .select('id')
                .eq('user_id', userId)
                .limit(1)
                .single();

            const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

            // Si no hay error y hay data, tiene marca
            if (!error && data) {
                console.log('✅ Usuario tiene marca');
                setHasBrand(true);
                return;
            }

            // Si el error es "no rows", entonces no tiene marca
            if (error?.code === 'PGRST116') {
                console.log('⚠️ Usuario NO tiene marca');
                setHasBrand(false);
                return;
            }

            // Cualquier otro error, fail open
            console.error('❌ Error verificando marca:', error);
            setHasBrand(true);

        } catch (error) {
            console.error('❌ Error en checkBrand:', error);
            // En caso de timeout u otro error, asumir que tiene marca (fail open)
            setHasBrand(true);
        }
    };

    const refreshBrand = async () => {
        console.log('🔄 Refrescando estado de marca...');
        if (user) {
            await checkBrand(user.id);
        }
    };

    useEffect(() => {
        // Prevenir doble inicialización en desarrollo (StrictMode)
        if (initializingRef.current) {
            console.log('⚠️ Ya se está inicializando, saltando...');
            return;
        }

        initializingRef.current = true;
        console.log('🚀 Inicializando AuthContext...');

        // Get initial session
        const initSession = async () => {
            try {
                setLoading(true);
                console.log('📡 Obteniendo sesión inicial...');

                const { data: { session }, error } = await supabase.auth.getSession();

                if (error) {
                    console.error('❌ Error obteniendo sesión:', error);
                    throw error;
                }

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    console.log('✅ Usuario autenticado:', session.user.email);
                    await checkBrand(session.user.id);
                } else {
                    console.log('⚠️ No hay sesión activa');
                    setHasBrand(false);
                }
            } catch (error) {
                console.error('❌ Error en initSession:', error);
                setHasBrand(false); // Fail safe
            } finally {
                console.log('✅ Inicialización completada, loading = false');
                setLoading(false);
            }
        };

        initSession();

        // Listen for auth changes
        console.log('👂 Suscribiéndose a cambios de autenticación...');
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('🔔 Auth state changed:', event);

            // Ignorar INITIAL_SESSION porque ya se manejó en initSession
            if (event === 'INITIAL_SESSION') {
                console.log('⏭️ Ignorando INITIAL_SESSION, ya se procesó');
                return;
            }

            setSession(session);
            setUser(session?.user ?? null);

            if (session?.user) {
                console.log('✅ Usuario autenticado en cambio:', session.user.email);
                await checkBrand(session.user.id);
            } else {
                console.log('⚠️ Usuario desautenticado');
                setHasBrand(false);
            }

            // Asegurar que loading se desactive después de auth change
            setLoading(false);
        });

        return () => {
            console.log('🧹 Limpiando suscripción de auth');
            subscription.unsubscribe();
        };
    }, []); // Solo ejecutar una vez al montar

    const signOut = async () => {
        console.log('👋 Cerrando sesión...');
        try {
            await supabase.auth.signOut();
            setHasBrand(null);
            setSession(null);
            setUser(null);
            console.log('✅ Sesión cerrada');
        } catch (error) {
            console.error('❌ Error cerrando sesión:', error);
        }
    };

    const refreshSession = async () => {
        console.log('🔄 Forzando actualización de sesión...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (session) {
            setSession(session);
            setUser(session.user);
            await checkBrand(session.user.id);
        } else {
            setSession(null);
            setUser(null);
            setHasBrand(false);
        }
    };

    const value = {
        session,
        user,
        loading,
        hasBrand,
        signOut,
        refreshBrand,
        refreshSession
    };

    // Log del estado actual cuando cambia
    useEffect(() => {
        console.log('📊 AuthContext state:', {
            hasUser: !!user,
            hasBrand,
            loading
        });
    }, [user, hasBrand, loading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
import {
    Camera,
    Music,
    Facebook,
    MonitorPlay,
} from 'lucide-react';
import { ContentRecommendation, Platform } from "@core/types";

export const EXAMPLE_RECOMMENDATIONS: ContentRecommendation[] = [
    {
        id: 'example-1',
        recommendation_type: 'comentarios',
        title: 'Oportunidad detectada: Interacción con audiencia',
        paragraph: 'Analizando los comentarios de tus publicaciones, hemos detectado que tu audiencia tiene gran interés en conocer más sobre tu proceso de producción y los ingredientes que utilizas.',
        recommended_format: 'carrusel',
        recommended_objective: 'engagement',
        recommended_idea: 'Carrusel mostrando el "detrás de cámaras" de tu proceso de creación, destacando ingredientes premium y técnicas artesanales.',
        required_elements: [
            'Fotos del proceso de producción',
            'Lista de ingredientes principales',
            'Testimonios de clientes satisfechos',
            'Call to action invitando a preguntar'
        ],
        ai_brief: 'Crear contenido educativo que responda a las preguntas frecuentes de tu audiencia, mostrando transparencia en el proceso y generando confianza mediante storytelling visual.',
        status: 'active',
        created_at: new Date().toISOString()
    },
    {
        id: 'example-2',
        recommendation_type: 'mejores_post',
        title: 'Replica el éxito de tus mejores publicaciones',
        paragraph: 'Tus publicaciones con mayor engagement comparten un patrón: contenido emocional auténtico que conecta con la nostalgia y experiencias compartidas de tu audiencia.',
        recommended_format: 'video corto',
        recommended_objective: 'viralidad',
        recommended_idea: 'Video corto estilo "throwback" mostrando la evolución de tu marca, desde los inicios hasta hoy, con música emotiva.',
        required_elements: [
            'Fotos antiguas de tu negocio',
            'Video clips de momentos importantes',
            'Música nostálgica de fondo',
            'Texto overlay con hitos clave'
        ],
        ai_brief: 'Aprovechar el poder del storytelling y la nostalgia para crear conexión emocional con la audiencia, replicando el formato de tus posts más exitosos.',
        status: 'active',
        created_at: new Date().toISOString()
    },
    {
        id: 'example-3',
        recommendation_type: 'proximas_fechas',
        title: 'Oportunidad: San Valentín se acerca',
        paragraph: 'El Día de San Valentín es una fecha clave para tu sector. Es momento de posicionar tus productos como el regalo perfecto para celebrar el amor en todas sus formas.',
        recommended_format: 'carrusel',
        recommended_objective: 'ventas',
        recommended_idea: 'Carrusel temático "Endulza tu San Valentín" mostrando diferentes opciones de regalo, combos especiales y packaging romántico.',
        required_elements: [
            '4-5 fotos de productos con ambientación romántica',
            'Precios y combos especiales',
            'Información de pedidos anticipados',
            'Canales de contacto (WhatsApp/teléfono)'
        ],
        ai_brief: 'Crear campaña de San Valentín que posicione tus productos como la elección perfecta para celebrar, con énfasis en calidad, sabor único y experiencia compartida.',
        status: 'active',
        created_at: new Date().toISOString()
    },
    {
        id: 'example-4',
        recommendation_type: 'radar_tendencias',
        title: 'Tendencia detectada: Contenido educativo en auge',
        paragraph: 'El contenido educativo tipo "tips" y "sabías que" está generando alto engagement en tu nicho. Tu audiencia valora aprender mientras se entretiene.',
        recommended_format: 'reel',
        recommended_objective: 'alcance',
        recommended_idea: 'Reel educativo estilo "3 secretos que no sabías sobre [tu producto]" con texto dinámico y música trending.',
        required_elements: [
            'Datos interesantes o curiosidades',
            'Visual atractivo y dinámico',
            'Música trending de TikTok/Reels',
            'Texto en pantalla fácil de leer'
        ],
        ai_brief: 'Aprovechar la tendencia de contenido educativo entretenido para aumentar alcance y posicionarse como experto en el tema, usando formatos virales actuales.',
        status: 'active',
        created_at: new Date().toISOString()
    }
];

export const PLATFORMS: Platform[] = [
    { name: 'Instagram', icon: <Camera className="w-8 h-8 mb-1" /> },
    { name: 'TikTok', icon: <Music className="w-8 h-8 mb-1" /> },
    { name: 'Facebook', icon: <Facebook className="w-8 h-8 mb-1" /> },
    { name: 'YouTube', icon: <MonitorPlay className="w-8 h-8 mb-1" /> },
];

import React, { useState } from 'react';
import GlassCard from './GlassCard';
import { Newspaper, Clock, ArrowRight } from 'lucide-react';
import NewsModal from './NewsModal';

const RadarNews: React.FC = () => {
    const [selectedNews, setSelectedNews] = useState<any>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const news = [
        {
            source: 'Portafolio',
            title: 'El auge de la repostería artesanal en Colombia: Cifras del sector 2024',
            summary: 'El mercado de postres premium en Colombia está experimentando un renacimiento sin precedentes, impulsado por una nueva generación de consumidores que valoran la autenticidad y la experiencia sobre la conveniencia masiva. Según los últimos reportes de la industria, el sector ha crecido un 15% en el último año, superando pronósticos conservadores. Este auge no es solo una moda pasajera, sino un cambio estructural en los hábitos de consumo, donde la narrativa detrás del producto —el origen del cacao, la técnica del pastelero, y la historia de la marca— se convierte en un diferenciador clave. Las pastelerías que han adoptado modelos de "experiencia en sitio" reportan tickets promedio 30% más altos que aquellas enfocadas únicamente en el producto para llevar. Además, la fusión de sabores locales como el lulo, maracuyá y corozo con técnicas francesas e italianas está posicionando a Colombia como un nuevo referente gastronómico en la región, atrayendo no solo a locales sino también al turismo gastronómico.',
            date: 'Hace 2 horas',
            sentiment: 'positive',
            tags: ['Industria', 'Crecimiento', 'Tendencias'],
            image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=600'
        },
        {
            source: 'La República',
            title: 'Inflación impacta costos de materias primas para heladerías',
            summary: 'El sector heladero enfrenta uno de sus desafíos más complejos en la última década: un aumento histórico en los precios de insumos críticos. El cacao, impulsado por déficits de producción en África Occidental, ha visto sus precios en bolsa duplicarse en menos de seis meses. Simultáneamente, el sector lácteo local enfrenta presiones por costos de transporte y alimentación animal. Para las grandes cadenas, esto significa una erosión directa de los márgenes de utilidad, obligándolas a reconsiderar estrategias de precios y tamaños de porciones. Sin embargo, los analistas sugieren que este escenario también abre oportunidades para la innovación: el desarrollo de líneas basadas en agua o frutas, y la exploración de endulzantes alternativos podrían mitigar el impacto. Las marcas que logren comunicar transparentemente estos cambios a sus consumidores y mantengan la calidad percibida serán las que salgan fortalecidas de este ciclo inflacionario desafiante.',
            date: 'Hace 5 horas',
            sentiment: 'negative',
            tags: ['Economía', 'Costos', 'Materias Primas'],
            image: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?auto=format&fit=crop&q=80&w=600'
        }
    ];

    const handleOpenNews = (item: any) => {
        setSelectedNews(item);
        setIsModalOpen(true);
    };

    return (
        <div className="w-full">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100">
                    <Newspaper className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Noticias de Canales</h2>
                    <p className="text-slate-500">Monitoreo en tiempo real de medios y competencia</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {news.map((item, idx) => (
                    <GlassCard key={idx} className="flex flex-col p-6 rounded-[24px] hover:shadow-xl transition-all duration-300 group h-full border border-slate-100/60 bg-white/60">
                        {/* Image & Tag */}
                        <div className="relative h-48 rounded-2xl overflow-hidden mb-5 shrink-0 shadow-sm">
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute top-3 left-3">
                                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase backdrop-blur-md border ${item.sentiment === 'positive' ? 'bg-emerald-500/90 text-white border-emerald-400/50' :
                                    item.sentiment === 'negative' ? 'bg-rose-500/90 text-white border-rose-400/50' :
                                        'bg-slate-700/90 text-white border-slate-600/50'
                                    }`}>
                                    {item.source}
                                </span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-4 text-xs text-slate-400 font-medium">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{item.date}</span>
                            </div>

                            {/* TITLE REMOVED HERE */}

                            <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-4 font-medium">
                                {item.summary}
                            </p>

                            <div className="mt-auto flex flex-col gap-3">
                                <button
                                    onClick={() => handleOpenNews(item)}
                                    className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-bold rounded-xl transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                                >
                                    Ver noticia
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </GlassCard>
                ))}
            </div>

            <NewsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                newsItem={selectedNews}
            />
        </div>
    );
};

export default RadarNews;

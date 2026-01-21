import React, { useState } from 'react';
import { CheckCircle, FileText, Edit2, Globe, Camera, Music, LayoutGrid, Palette, Search, Save, Facebook, X } from 'lucide-react';
import TagInput from '../components/TagInput';

const BrandAnalysis: React.FC = () => {
  const [isEditing, setIsEditing] = useState<{ [key: string]: boolean }>({});

  // State for Brand Name
  const [brandName, setBrandName] = useState('Ventolini');

  // State for Description
  const [description, setDescription] = useState(
    'Ventolini es una reconocida pastelería y gelatería tradicional de Cali, Colombia, famosa por sus postres y helados artesanales que combinan la técnica italiana con frutas colombianas, ofreciendo una experiencia única y deliciosa desde 1963.'
  );

  // State for Socials
  const [socials, setSocials] = useState({
    website: 'ventolini.com',
    instagram: '@ventolinioficial',
    facebook: '/ventolini',
    tiktok: '@ventolini_tiktok'
  });

  // State for Products
  const [productTags, setProductTags] = useState([
    'helados', 'tortas', 'tartaletas', 'postres', 'gelatos', 'bebidas'
  ]);

  // State for Branding
  const [branding, setBranding] = useState({
    colors: ['#8B4513', '#FFD700', '#FFFDD0'],
    keywords: ['Agradable', 'Italiano', 'Artesanal']
  });

  // State for SEO
  const [seoKeywords, setSeoKeywords] = useState([
    'pastelería', 'postres', 'helados', 'postres artesanales', 'repostería', 'gelatería', 'dulces tradicionales', 'frutas tropicales', 'Cali'
  ]);

  const toggleEdit = (section: string) => {
    setIsEditing(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSave = (section: string) => {
    // Here you would typically save to backend
    toggleEdit(section);
  };

  const handleColorChange = (index: number, value: string) => {
    const newColors = [...branding.colors];
    newColors[index] = value;
    setBranding(prev => ({ ...prev, colors: newColors }));
  };

  // Tag Helpers
  const handleAddTag = (section: 'products' | 'branding' | 'seo', tag: string) => {
    if (!tag.trim()) return;

    if (section === 'products') {
      if (!productTags.includes(tag)) setProductTags([...productTags, tag]);
    } else if (section === 'branding') {
      if (!branding.keywords.includes(tag)) setBranding({ ...branding, keywords: [...branding.keywords, tag] });
    } else if (section === 'seo') {
      if (!seoKeywords.includes(tag)) setSeoKeywords([...seoKeywords, tag]);
    }
  };

  const handleRemoveTag = (section: 'products' | 'branding' | 'seo', tag: string) => {
    if (section === 'products') {
      setProductTags(productTags.filter(t => t !== tag));
    } else if (section === 'branding') {
      setBranding({ ...branding, keywords: branding.keywords.filter(t => t !== tag) });
    } else if (section === 'seo') {
      setSeoKeywords(seoKeywords.filter(t => t !== tag));
    }
  };

  return (
    <div className="p-6 lg:p-10 animate-fade-in font-display">
      <header className="mb-10 flex items-center gap-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="w-16 h-16 bg-primary/20 flex items-center justify-center rounded-2xl">
          <CheckCircle className="text-primary w-10 h-10" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Esto ha detectado Radikal IA de tu marca</h1>
          <p className="text-slate-500 mt-1">Radikal IA ha analizado tus redes y página web y ha detectado esta información clave sobre tu marca <span className="font-bold text-slate-900">{brandName}</span>.</p>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">

        {/* Left Column */}
        <div className="col-span-12 lg:col-span-7 space-y-6">

          {/* Brand Description & Name */}
          <section className="glass-card p-8 rounded-3xl shadow-sm border border-slate-200 relative group bg-white/70">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-2">
                <FileText className="text-primary w-5 h-5" />
                <h2 className="text-xl font-bold">Descripción de la Marca</h2>
              </div>
              <button
                onClick={() => isEditing['description'] ? handleSave('description') : toggleEdit('description')}
                className={`p-2 rounded-lg transition-colors flex items-center gap-2 ${isEditing['description'] ? 'bg-primary text-white hover:bg-primary/90' : 'text-primary hover:bg-primary/10'}`}
              >
                {isEditing['description'] ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                <span className="text-sm font-semibold uppercase tracking-wider">{isEditing['description'] ? 'Guardar' : 'Editar'}</span>
              </button>
            </div>

            <div className="space-y-6">
              {/* Brand Name Input */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">Nombre de la Marca</label>
                {isEditing['description'] ? (
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2 text-lg font-bold text-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  />
                ) : (
                  <h3 className="text-2xl font-bold text-slate-900">{brandName}</h3>
                )}
              </div>

              <div className="prose max-w-none">
                {isEditing['description'] ? (
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-slate-600 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none leading-relaxed text-lg"
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed text-lg">
                    {description}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col gap-4">
              {isEditing['description'] ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Website</label>
                    <input
                      type="text"
                      value={socials.website}
                      onChange={(e) => setSocials({ ...socials, website: e.target.value })}
                      className="w-full text-sm border p-2 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Instagram</label>
                    <input
                      type="text"
                      value={socials.instagram}
                      onChange={(e) => setSocials({ ...socials, instagram: e.target.value })}
                      className="w-full text-sm border p-2 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">Facebook</label>
                    <input
                      type="text"
                      value={socials.facebook}
                      onChange={(e) => setSocials({ ...socials, facebook: e.target.value })}
                      className="w-full text-sm border p-2 rounded-lg"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400">TikTok</label>
                    <input
                      type="text"
                      value={socials.tiktok}
                      onChange={(e) => setSocials({ ...socials, tiktok: e.target.value })}
                      className="w-full text-sm border p-2 rounded-lg"
                    />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-primary font-medium">
                    <Globe className="w-5 h-5" />
                    <a className="hover:underline" href={`https://${socials.website}`}>{socials.website}</a>
                  </div >
                  <div className="flex flex-wrap items-center gap-6">
                    <a className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors" href="#">
                      <Camera className="w-5 h-5" />
                      <span className="text-sm font-medium">{socials.instagram}</span>
                    </a>
                    <a className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors" href="#">
                      <Facebook className="w-5 h-5" />
                      <span className="text-sm font-medium">{socials.facebook}</span>
                    </a>
                    <a className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors" href="#">
                      <Music className="w-5 h-5" />
                      <span className="text-sm font-medium">{socials.tiktok}</span>
                    </a>
                  </div>
                </>
              )}
            </div >
          </section >

          {/* Detected Products */}
          < section className="glass-card p-8 rounded-3xl shadow-sm border border-slate-200 bg-white/70" >
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-2">
                <LayoutGrid className="text-primary w-5 h-5" />
                <h2 className="text-xl font-bold">Productos detectados</h2>
              </div>
              <button
                onClick={() => isEditing['products'] ? handleSave('products') : toggleEdit('products')}
                className={`transition-colors ${isEditing['products'] ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
              >
                {isEditing['products'] ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
              </button>
            </div>

            {
              isEditing['products'] ? (
                <TagInput
                  tags={productTags}
                  onAdd={(tag) => handleAddTag('products', tag)}
                  onRemove={(tag) => handleRemoveTag('products', tag)}
                  placeholder="Añadir producto..."
                />
              ) : (
                <div className="flex flex-wrap gap-2 mb-4">
                  {productTags.map((tag, idx) => (
                    <span key={idx} className="px-4 py-2 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 border border-transparent">
                      {tag}
                    </span>
                  ))}
                </div>
              )
            }
          </section >
        </div >

        {/* Right Column */}
        < div className="col-span-12 lg:col-span-5 space-y-6" >
          <section className="glass-card p-8 rounded-3xl shadow-sm border border-slate-200 bg-white/70">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Palette className="text-primary w-5 h-5" />
                <h2 className="text-xl font-bold">Branding</h2>
              </div>
              <button
                onClick={() => isEditing['branding'] ? handleSave('branding') : toggleEdit('branding')}
                className={`transition-colors ${isEditing['branding'] ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
              >
                {isEditing['branding'] ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
              </button>
            </div>

            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Colores Detectados</p>
              {isEditing['branding'] ? (
                <div className="space-y-3">
                  {branding.colors.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full shadow-sm border border-slate-200" style={{ backgroundColor: color }}></div>
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => handleColorChange(idx, e.target.value)}
                        className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-1 font-mono uppercase"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    {branding.colors.map((color, idx) => (
                      <div key={idx} className="w-12 h-12 rounded-full border-4 border-white shadow-sm" style={{ backgroundColor: color }}></div>
                    ))}
                  </div>
                  <p className="text-sm text-slate-500 italic">Colores principales</p>
                </div>
              )}
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Palabras clave de marca</p>
              {isEditing['branding'] ? (
                <TagInput
                  tags={branding.keywords}
                  onAdd={(tag) => handleAddTag('branding', tag)}
                  onRemove={(tag) => handleRemoveTag('branding', tag)}
                  placeholder="Añadir palabra clave..."
                  title="Nueva Palabra Clave"
                />
              ) : (
                <div className="flex flex-wrap gap-3">
                  {branding.keywords.map(kw => (
                    <span key={kw} className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-semibold shadow-sm">{kw}</span>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="glass-card p-8 rounded-3xl shadow-sm border border-slate-200 bg-white/70">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Search className="text-primary w-5 h-5" />
                <h2 className="text-xl font-bold">Palabras SEO</h2>
              </div>
              <button
                onClick={() => isEditing['seo'] ? handleSave('seo') : toggleEdit('seo')}
                className={`transition-colors ${isEditing['seo'] ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
              >
                {isEditing['seo'] ? <Save className="w-5 h-5" /> : <Edit2 className="w-5 h-5" />}
              </button>
            </div>

            {isEditing['seo'] ? (
              <TagInput
                tags={seoKeywords}
                onAdd={(tag) => handleAddTag('seo', tag)}
                onRemove={(tag) => handleRemoveTag('seo', tag)}
                placeholder="Añadir palabra SEO..."
                title="Nueva Palabra SEO"
              />
            ) : (
              <div className="flex flex-wrap gap-2">
                {seoKeywords.map((word) => (
                  <span key={word} className="px-3 py-1.5 bg-primary/5 text-primary border border-primary/20 rounded-xl text-xs font-medium">
                    {word}
                  </span>
                ))}
              </div>
            )}
          </section>
        </div >

      </div >
    </div >
  );
};

export default BrandAnalysis;

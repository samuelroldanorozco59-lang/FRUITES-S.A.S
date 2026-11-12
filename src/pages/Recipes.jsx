import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  ChefHat,
  Search,
  ArrowRight,
  Sparkles,
  Camera,
  MessageCircle,
  Share2,
  CheckCircle,
  Send,
  X,
} from 'lucide-react';
import { getRecipes } from '../services/recipesService.js';
import { siteConfig } from '../data/siteConfig.js';

/**
 * ============================================================================
 * PÁGINA: RECETAS Y BLOG FRUITES
 * ============================================================================
 * Preparaciones saludables, desayunos y pausas nutritivas con snacks
 * tropicales deshidratados, además de un llamado a la comunidad para
 * compartir sus creaciones culinarias.
 * ============================================================================
 */
export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('Todas');
  const [loading, setLoading] = useState(true);

  // Modal para compartir receta propia
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [userSubmission, setUserSubmission] = useState({
    nombre: '',
    email: '',
    tituloReceta: '',
    frutaUsada: 'Mango',
    ingredientes: '',
    pasos: '',
  });
  const [submittedCreation, setSubmittedCreation] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getRecipes();
        setRecipes(data || []);
      } catch (e) {
        console.error('Error al cargar recetas:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const categories = ['Todas', 'Desayunos & Bowls', 'Snacks & Pausas', 'Desayunos para Llevar', 'Hábitos & Estilo de Vida'];

  const filteredRecipes = recipes.filter((rec) => {
    const matchesSearch =
      (rec.titulo || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.extracto || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rec.frutasUsadas || []).some((f) => f.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCat = selectedCat === 'Todas' || rec.categoria === selectedCat;

    return matchesSearch && matchesCat && rec.publicado !== false;
  });

  const featuredRecipe = recipes[0];

  const handleShareSubmit = (e) => {
    e.preventDefault();
    setSubmittedCreation(true);
  };

  const waShareMsg = encodeURIComponent(
    `¡Hola FRUITES! Les comparto mi receta casera: "${userSubmission.tituloReceta || 'Receta con FRUITES'}" hecha por ${userSubmission.nombre || 'un fan'}. Usé fruta: ${userSubmission.frutaUsada}. Ingredientes: ${userSubmission.ingredientes}`
  );
  const waShareLink = `https://wa.me/${siteConfig.contact.whatsappClean}?text=${waShareMsg}`;

  return (
    <div className="recipes-page section" style={{ backgroundColor: 'var(--color-crema)' }}>
      <div className="container">
        {/* Encabezado */}
        <div className="section-header text-center">
          <span className="kicker">Inspiración & Cocina Tropical</span>
          <h1>Recetas & Estilo Frutal</h1>
          <p style={{ marginTop: '0.75rem', fontSize: 'var(--text-lg)' }}>
            Ideas frescas y sencillas para integrar la fruta tropical deshidratada en tus desayunos, meriendas y momentos activos.
          </p>
        </div>

        {/* Receta Destacada (Hero Editorial) */}
        {featuredRecipe && !searchTerm && selectedCat === 'Todas' && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              overflow: 'hidden',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
              marginBottom: '4rem',
            }}
          >
            <div style={{ height: '100%', minHeight: '340px' }}>
              <img
                src={featuredRecipe.imagen}
                alt={featuredRecipe.titulo}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </div>
            <div style={{ padding: '2.5rem 2rem 2.5rem 1rem' }}>
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: 'var(--color-coral)',
                  letterSpacing: '0.1em',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Receta Destacada · {featuredRecipe.categoria}
              </span>
              <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.3rem)', color: 'var(--color-selva)', marginBottom: '0.85rem' }}>
                <Link to={`/recetas/${featuredRecipe.slug}`}>
                  {featuredRecipe.titulo}
                </Link>
              </h2>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                {featuredRecipe.extracto}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Clock size={15} color="var(--color-selva)" />
                  <span>{featuredRecipe.tiempoPrep}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <ChefHat size={15} color="var(--color-coral)" />
                  <span>{featuredRecipe.dificultad}</span>
                </div>
              </div>

              <Link to={`/recetas/${featuredRecipe.slug}`} className="btn btn-primary">
                <span>Ver receta y preparación</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        )}

        {/* Barra de Filtros y Búsqueda */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '2.5rem',
          }}
        >
          {/* Categorías */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {categories.map((cat) => {
              const active = selectedCat === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: active ? 'var(--color-selva)' : '#ffffff',
                    color: active ? '#ffffff' : 'var(--color-selva)',
                    borderColor: active ? 'var(--color-selva)' : 'var(--color-border)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: active ? 700 : 500,
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Buscador de recetas */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
            <Search
              size={16}
              color="var(--color-text-light)"
              style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ingrediente o título..."
              className="form-input"
              style={{ paddingLeft: '2.4rem', fontSize: 'var(--text-xs)', borderRadius: 'var(--radius-full)' }}
            />
          </div>
        </div>

        {/* Grilla de Recetas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '2rem',
            marginBottom: '4.5rem',
          }}
        >
          {filteredRecipes.map((recipe) => (
            <article
              key={recipe.id}
              className="card"
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '210px', overflow: 'hidden', position: 'relative' }}>
                <img
                  src={recipe.imagen}
                  alt={recipe.titulo}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '0.85rem',
                    left: '0.85rem',
                    backgroundColor: 'rgba(255,255,255,0.92)',
                    backdropFilter: 'blur(4px)',
                    padding: '0.3rem 0.65rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: 'var(--color-selva)',
                  }}
                >
                  {recipe.categoria}
                </span>
              </div>

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', fontSize: '11.5px', color: 'var(--color-text-light)', marginBottom: '0.5rem' }}>
                  <span>⏱ {recipe.tiempoPrep}</span>
                  <span>·</span>
                  <span>{recipe.dificultad}</span>
                </div>

                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '0.5rem' }}>
                  <Link to={`/recetas/${recipe.slug}`} style={{ color: 'var(--color-selva)' }}>
                    {recipe.titulo}
                  </Link>
                </h3>

                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: '1.25rem', flexGrow: 1 }}>
                  {recipe.extracto}
                </p>

                <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.85rem', marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>
                    Fruta: {recipe.frutasUsadas?.join(', ') || 'Tropical'}
                  </span>
                  <Link to={`/recetas/${recipe.slug}`} className="btn btn-secondary btn-sm" style={{ padding: '0.35rem 0.75rem', fontSize: '11px' }}>
                    <span>Ver receta</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Llamada a la acción para compartir creaciones de la comunidad */}
        <div
          style={{
            backgroundColor: 'var(--color-selva)',
            color: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2.5rem',
            alignItems: 'center',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Camera size={18} color="var(--color-mango)" />
              <span style={{ color: 'var(--color-mango)', fontSize: 'var(--text-xs)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Comunidad FRUITES
              </span>
            </div>
            <h2 style={{ color: '#ffffff', fontSize: 'var(--text-2xl)', marginBottom: '0.85rem' }}>
              ¿Tienes tu propia receta con FRUITES?
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.85)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
              Nos encanta ver cómo disfrutas la fruta. Comparte tu desayuno, ensalada o snack con nosotros para publicarlo en el blog oficial o recibir una mención en nuestras redes sociales.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', alignItems: 'flex-start' }}>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="btn btn-primary btn-lg"
            >
              <Sparkles size={18} />
              <span>Compartir mi creación</span>
            </button>
            <a
              href={`https://wa.me/${siteConfig.contact.whatsappClean}?text=${encodeURIComponent(
                '¡Hola FRUITES! Quiero enviarles una foto y receta de cómo preparé mi snack.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
            >
              <MessageCircle size={15} />
              <span>O enviarla directo por WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* Modal: Compartir mi receta */}
      {isShareModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            zIndex: 1000,
          }}
          onClick={() => setIsShareModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '2.25rem',
              maxWidth: '520px',
              width: '100%',
              boxShadow: 'var(--shadow-xl)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-selva)', margin: 0 }}>
                Comparte tu Receta con FRUITES
              </h3>
              <button
                onClick={() => setIsShareModalOpen(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '0.2rem' }}
              >
                <X size={20} />
              </button>
            </div>

            {submittedCreation ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={44} color="var(--color-selva)" style={{ margin: '0 auto 1rem auto' }} />
                <h4 style={{ fontSize: 'var(--text-lg)', marginBottom: '0.5rem' }}>¡Muchas gracias por compartir!</h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Hemos recibido tu receta. La revisaremos con el equipo gastronómico para incluirla en nuestro blog oficial y darte créditos de autoría.
                </p>
                <a href={waShareLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-sm">
                  <MessageCircle size={14} />
                  <span>Enviar fotos del plato por WhatsApp</span>
                </a>
              </div>
            ) : (
              <form onSubmit={handleShareSubmit}>
                <div className="form-group">
                  <label className="form-label">Tu nombre o cuenta de Instagram</label>
                  <input
                    type="text"
                    required
                    value={userSubmission.nombre}
                    onChange={(e) => setUserSubmission({ ...userSubmission, nombre: e.target.value })}
                    placeholder="Ej. María o @maria.cocina"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Título de tu receta</label>
                  <input
                    type="text"
                    required
                    value={userSubmission.tituloReceta}
                    onChange={(e) => setUserSubmission({ ...userSubmission, tituloReceta: e.target.value })}
                    placeholder="Ej. Tostadas francesas con Piña Dorada"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">¿Qué sabor de FRUITES usaste?</label>
                  <select
                    value={userSubmission.frutaUsada}
                    onChange={(e) => setUserSubmission({ ...userSubmission, frutaUsada: e.target.value })}
                    className="form-select"
                  >
                    <option value="Mango">Mango Tropical</option>
                    <option value="Piña">Piña Dorada</option>
                    <option value="Papaya">Papaya Caribe</option>
                    <option value="Banano">Banano Tropical</option>
                    <option value="Varios">Varios sabores</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ingredientes y breve paso a paso</label>
                  <textarea
                    required
                    rows={3}
                    value={userSubmission.ingredientes}
                    onChange={(e) => setUserSubmission({ ...userSubmission, ingredientes: e.target.value })}
                    placeholder="Cuéntanos cómo la preparas en casa..."
                    className="form-textarea"
                  />
                </div>

                <button type="submit" className="btn btn-primary btn-full" style={{ marginTop: '0.75rem' }}>
                  <Send size={15} />
                  <span>Enviar receta para el blog</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

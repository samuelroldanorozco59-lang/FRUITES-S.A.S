import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  ChefHat,
  Users,
  Check,
  Share2,
  Sparkles,
  MessageCircle,
  Instagram,
  ArrowRight,
} from 'lucide-react';
import { getRecipeBySlug, getRecipes } from '../services/recipesService.js';
import { siteConfig } from '../data/siteConfig.js';

/**
 * ============================================================================
 * DETALLE DE RECETA / ARTÍCULO — FRUITES
 * ============================================================================
 * Ficha detallada con lista de ingredientes interactiva (checklist),
 * pasos de preparación numerados, consejos de conservación y llamado
 * a la comunidad para compartir fotos.
 * ============================================================================
 */
export default function RecipeDetail() {
  const { slug } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [related, setRelated] = useState([]);
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const item = await getRecipeBySlug(slug);
        setRecipe(item);

        const all = await getRecipes();
        if (item) {
          setRelated(all.filter((r) => r.slug !== item.slug).slice(0, 3));
        }
      } catch (e) {
        console.error('Error al cargar detalle de receta:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="section container text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Cargando receta tropical...</p>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="section container text-center" style={{ minHeight: '60vh' }}>
        <h2>Receta no encontrada</h2>
        <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          La receta o artículo que buscas no está disponible en este momento.
        </p>
        <Link to="/recetas" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Volver al recetario</span>
        </Link>
      </div>
    );
  }

  const toggleIngredient = (idx) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.titulo,
        text: `Mira esta receta con snacks FRUITES: ${recipe.titulo}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const waShareCreationLink = `https://wa.me/${siteConfig.contact.whatsappClean}?text=${encodeURIComponent(
    `¡Hola FRUITES! Preparé la receta "${recipe.titulo}". Les comparto mi foto y comentarios:`
  )}`;

  return (
    <div className="recipe-detail-page section" style={{ backgroundColor: 'var(--color-crema)' }}>
      <div className="container-narrow">
        {/* Enlace de regreso */}
        <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link
            to="/recetas"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-selva)',
            }}
          >
            <ArrowLeft size={16} />
            <span>Volver a todas las recetas</span>
          </Link>

          <button
            onClick={handleShare}
            className="btn btn-secondary btn-sm"
            style={{ borderRadius: 'var(--radius-full)' }}
          >
            <Share2 size={14} />
            <span>{copied ? '¡Enlace copiado!' : 'Compartir'}</span>
          </button>
        </div>

        {/* Encabezado editorial */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--color-coral)',
              display: 'block',
              marginBottom: '0.5rem',
            }}
          >
            {recipe.categoria}
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.8vw, 3rem)', color: 'var(--color-selva)', marginBottom: '0.75rem', lineHeight: 1.15 }}>
            {recipe.titulo}
          </h1>
          {recipe.subtitulo && (
            <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)', maxWidth: '640px', margin: '0 auto 1.5rem auto' }}>
              {recipe.subtitulo}
            </p>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.75rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-light)' }}>
            <span>Por {recipe.autor || 'Equipo FRUITES'}</span>
            <span>·</span>
            <span>{recipe.fecha ? new Date(recipe.fecha).toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' }) : ''}</span>
          </div>
        </div>

        {/* Imagen Principal */}
        <div
          style={{
            borderRadius: 'var(--radius-xl)',
            overflow: 'hidden',
            marginBottom: '2.5rem',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--color-border)',
            maxHeight: '460px',
          }}
        >
          <img
            src={recipe.imagen}
            alt={recipe.titulo}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        </div>

        {/* Tira de Datos Rápidos (Tiempo, Dificultad, Porciones) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem 1.5rem',
            border: '1px solid var(--color-border)',
            marginBottom: '3rem',
            textAlign: 'center',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-light)', display: 'block' }}>Tiempo</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
              <Clock size={14} color="var(--color-selva)" />
              <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-selva)' }}>{recipe.tiempoPrep}</strong>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-light)', display: 'block' }}>Dificultad</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
              <ChefHat size={14} color="var(--color-coral)" />
              <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-selva)' }}>{recipe.dificultad}</strong>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-light)', display: 'block' }}>Rendimiento</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
              <Users size={14} color="var(--color-lima)" />
              <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-selva)' }}>{recipe.porciones}</strong>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-light)', display: 'block' }}>Fruta Usada</span>
            <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-selva)', display: 'block', marginTop: '0.2rem' }}>
              {recipe.frutasUsadas?.join(', ') || 'FRUITES'}
            </strong>
          </div>
        </div>

        {/* Sección: Ingredientes y Preparación */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2.5rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '3.5rem',
          }}
        >
          {/* Ingredientes con checklist interactivo */}
          <div style={{ marginBottom: '3rem' }}>
            <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-selva)', marginBottom: '0.4rem' }}>
              Ingredientes
            </h3>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', marginBottom: '1.25rem' }}>
              Toca cada ingrediente a medida que lo alistes en tu cocina:
            </p>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {(recipe.ingredientes || []).map((ing, i) => {
                const isChecked = checkedIngredients[i];
                return (
                  <li
                    key={i}
                    onClick={() => toggleIngredient(i)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isChecked ? 'var(--color-crema)' : 'transparent',
                      border: `1px solid ${isChecked ? 'var(--color-selva-light)' : 'var(--color-border-subtle)'}`,
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: `2px solid ${isChecked ? 'var(--color-selva)' : 'var(--color-border)'}`,
                        backgroundColor: isChecked ? 'var(--color-selva)' : '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isChecked && <Check size={14} color="#ffffff" />}
                    </div>
                    <span
                      style={{
                        fontSize: 'var(--text-sm)',
                        color: isChecked ? 'var(--color-text-light)' : 'var(--color-text-main)',
                        textDecoration: isChecked ? 'line-through' : 'none',
                      }}
                    >
                      {ing}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Pasos de preparación numerados */}
          <div>
            <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-selva)', marginBottom: '1.5rem' }}>
              Paso a Paso
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {(recipe.pasos || []).map((paso, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <span
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-mango)',
                      color: 'var(--color-selva)',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: 'var(--text-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-main)', lineHeight: 1.7 }}>
                    {paso}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Consejo del chef */}
          {recipe.consejos && (
            <div
              style={{
                marginTop: '2.5rem',
                padding: '1.25rem 1.5rem',
                backgroundColor: 'var(--color-crema)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border-subtle)',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
              }}
            >
              <Sparkles size={18} color="var(--color-coral)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: 'var(--text-xs)', textTransform: 'uppercase', color: 'var(--color-selva)', display: 'block', marginBottom: '0.2rem' }}>
                  Consejo FRUITES
                </strong>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                  {recipe.consejos}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Llamado a la acción: Compartir foto o pedir la fruta */}
        <div
          style={{
            backgroundColor: 'var(--color-selva)',
            color: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem 2rem',
            textAlign: 'center',
            marginBottom: '4rem',
          }}
        >
          <h3 style={{ color: '#ffffff', fontSize: 'var(--text-xl)', marginBottom: '0.5rem' }}>
            ¿Preparaste esta receta?
          </h3>
          <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'var(--text-sm)', maxWidth: '520px', margin: '0 auto 1.5rem auto' }}>
            Envíanos una foto por WhatsApp o etiquétanos en Instagram ({siteConfig.contact.instagram}) para compartir tu versión con toda la comunidad.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a
              href={waShareCreationLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp"
            >
              <MessageCircle size={16} />
              <span>Enviar foto por WhatsApp</span>
            </a>
            <Link to="/catalogo" className="btn btn-outline-white">
              <span>Pedir fruta para esta receta</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Otras recetas recomendadas */}
        {related.length > 0 && (
          <div>
            <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-selva)', marginBottom: '1.5rem' }}>
              Más recetas de la Colección
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {related.map((r) => (
                <article
                  key={r.id}
                  className="card"
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                  }}
                >
                  <img
                    src={r.imagen}
                    alt={r.titulo}
                    style={{ height: '140px', width: '100%', objectFit: 'cover', borderRadius: 'var(--radius-sm)', marginBottom: '0.75rem' }}
                  />
                  <span style={{ fontSize: '11px', color: 'var(--color-coral)', fontWeight: 700 }}>
                    {r.categoria}
                  </span>
                  <h4 style={{ fontSize: 'var(--text-sm)', margin: '0.35rem 0' }}>
                    <Link to={`/recetas/${r.slug}`} style={{ color: 'var(--color-selva)' }}>
                      {r.titulo}
                    </Link>
                  </h4>
                  <Link to={`/recetas/${r.slug}`} style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-selva)', display: 'inline-flex', alignItems: 'center', gap: '2px', marginTop: 'auto' }}>
                    <span>Ver preparación</span> →
                  </Link>
                </article>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

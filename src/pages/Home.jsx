import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  BookOpen,
  Briefcase,
  Activity,
  Compass,
  Smile,
  CheckCircle,
  MessageCircle,
  Store,
} from 'lucide-react';
import { siteConfig } from '../data/siteConfig.js';
import { initialProducts } from '../data/products.js';
import ProductCard from '../components/ProductCard.jsx';
import { recommendFlavors } from '../services/aiService.js';

/**
 * ============================================================================
 * PÁGINA DE INICIO (LANDING PAGE) — FRUITES
 * ============================================================================
 * Diseñada para transmitir la personalidad de marca: energética, tropical,
 * premium accesible y contemporánea. Sin afirmaciones no verificadas.
 * ============================================================================
 */
export default function Home() {
  // Estado para el mini recomendador interactivo en la home
  const [selectedMoment, setSelectedMoment] = useState('oficina');
  const [selectedPref, setSelectedPref] = useState('dulce intenso');
  const [recommendation, setRecommendation] = useState(() =>
    recommendFlavors({ moment: 'oficina', preference: 'dulce intenso' })
  );

  const handleRecommend = (moment, pref) => {
    setSelectedMoment(moment);
    setSelectedPref(pref);
    setRecommendation(recommendFlavors({ moment, preference: pref }));
  };

  const momentIcons = {
    estudio: <BookOpen size={22} color="var(--color-mango)" />,
    trabajo: <Briefcase size={22} color="var(--color-selva)" />,
    entrenamiento: <Activity size={22} color="var(--color-coral)" />,
    trayectos: <Compass size={22} color="var(--color-lima)" />,
    pausas: <Smile size={22} color="var(--color-mango)" />,
  };

  const waLink = `https://wa.me/${siteConfig.contact.whatsappClean}?text=${encodeURIComponent(
    '¡Hola FRUITES! Vi su sitio web y quiero conocer más sobre sus snacks de frutas tropicales.'
  )}`;

  return (
    <div className="home-page">
      {/* ======================================================================
          HERO SECTION
          ====================================================================== */}
      <section
        style={{
          paddingTop: '3.5rem',
          paddingBottom: '5rem',
          backgroundColor: 'var(--color-crema)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            {/* Columna de texto */}
            <div>
              <span className="kicker">
                Caribe Colombiano · Colección Tropical
              </span>
              <h1
                style={{
                  fontSize: 'clamp(2.5rem, 4vw, 3.8rem)',
                  marginBottom: '1.25rem',
                  lineHeight: 1.1,
                  color: 'var(--color-selva)',
                }}
              >
                {siteConfig.brandName}.
                <br />
                <span style={{ color: 'var(--color-selva-light)', fontWeight: 700 }}>
                  {siteConfig.tagline}
                </span>
              </h1>

              <p
                style={{
                  fontSize: 'var(--text-lg)',
                  color: 'var(--color-text-muted)',
                  lineHeight: 1.6,
                  maxWidth: '540px',
                  marginBottom: '2rem',
                }}
              >
                {siteConfig.valueProposition}
              </p>

              {/* Acciones principales */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1rem',
                  alignItems: 'center',
                }}
              >
                <Link to="/catalogo" className="btn btn-primary btn-lg">
                  <span>Ver colección</span>
                  <ArrowRight size={18} />
                </Link>

                <Link to="/negocios" className="btn btn-secondary btn-lg">
                  <Store size={18} />
                  <span>Quiero vender FRUITES</span>
                </Link>
              </div>

              {/* Puntos destacados sutiles */}
              <div
                style={{
                  marginTop: '2.5rem',
                  paddingTop: '1.75rem',
                  borderTop: '1px solid var(--color-border)',
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '1.5rem',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle size={15} color="var(--color-selva)" />
                  <span>Bolsa tipo pouch resellable</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle size={15} color="var(--color-selva)" />
                  <span>4 sabores tropicales</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                  <CheckCircle size={15} color="var(--color-selva)" />
                  <span>Validado desde Barranquilla</span>
                </div>
              </div>
            </div>

            {/* Columna visual del empaque hero */}
            <div style={{ position: 'relative' }}>
              <div
                style={{
                  position: 'relative',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                  border: '1px solid var(--color-border)',
                  boxShadow: 'var(--shadow-xl)',
                }}
              >
                <img
                  src="/images/hero_tropical.jpg"
                  alt="Colección Tropical de snacks FRUITES con trozos de fruta deshidratada"
                  style={{
                    width: '100%',
                    height: 'auto',
                    objectFit: 'cover',
                    display: 'block',
                  }}
                />
                {/* Pie de foto sutil */}
                <div
                  style={{
                    padding: '1rem 1.25rem',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 'var(--text-xs)',
                  }}
                >
                  <span style={{ fontWeight: 700, color: 'var(--color-selva)' }}>
                    Colección Tropical: Mango · Piña · Papaya · Banano
                  </span>
                  <span style={{ color: 'var(--color-text-light)' }}>
                    Bolsa resellable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECCIÓN: COLECCIÓN TROPICAL (CATÁLOGO INICIAL DE 4 SABORES)
          ====================================================================== */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="kicker">Primera Edición</span>
            <h2>Colección Tropical</h2>
            <p style={{ marginTop: '0.75rem' }}>
              Cuatro frutas características convertidas en una opción práctica de snack, cada una con su color y empaque coleccionable.
            </p>
          </div>

          {/* Grilla de productos */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '2rem',
            }}
          >
            {initialProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/catalogo" className="btn btn-secondary">
              <span>Explorar catálogo completo y fichas sensoriales</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECCIÓN: CÓMO DISFRUTARLO (MOMENTOS DE CONSUMO)
          ====================================================================== */}
      <section className="section" style={{ backgroundColor: 'var(--color-crema)' }}>
        <div className="container">
          <div className="section-header">
            <span className="kicker">Diseñado para tu rutina</span>
            <h2>Cómo disfrutar FRUITES</h2>
            <p style={{ marginTop: '0.75rem' }}>
              La fruta no tiene por qué ser complicada de pelar, cortar o transportar. Llévala en tu formato favorito.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {siteConfig.moments.map((m) => (
              <div
                key={m.id}
                className="card card-solid"
                style={{ padding: '1.5rem', height: '100%' }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    backgroundColor: 'var(--color-crema)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  {momentIcons[m.id] || <Smile size={20} />}
                </div>
                <h4 style={{ fontSize: 'var(--text-base)', marginBottom: '0.5rem' }}>
                  {m.title}
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECCIÓN: POR QUÉ FRUITES (3 BLOQUES DIFERENCIADORES)
          ====================================================================== */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="kicker">Nuestra Propuesta</span>
            <h2>Por qué FRUITES</h2>
            <p style={{ marginTop: '0.75rem' }}>
              La combinación de producto, identidad visual y experiencia para el consumidor actual.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem',
            }}
          >
            {siteConfig.pillars.map((pillar, idx) => (
              <div
                key={pillar.id}
                className="card"
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2.25rem 1.75rem',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-mango)',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    display: 'block',
                  }}
                >
                  0{idx + 1}. PILAR
                </span>
                <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '0.75rem' }}>
                  {pillar.title}
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {pillar.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECCIÓN: HISTORIA DE MARCA
          ====================================================================== */}
      <section
        className="section"
        style={{
          backgroundColor: 'var(--color-selva)',
          color: '#ffffff',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span
                style={{
                  color: 'var(--color-mango)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                  display: 'block',
                  marginBottom: '0.75rem',
                }}
              >
                Origen y Esencia
              </span>
              <h2 style={{ color: '#ffffff', marginBottom: '1.25rem' }}>
                {siteConfig.brandStory.core}
              </h2>
              <p
                style={{
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: 'var(--text-base)',
                  lineHeight: 1.7,
                  marginBottom: '1.5rem',
                }}
              >
                {siteConfig.brandStory.history}
              </p>
              <Link to="/nosotros" className="btn btn-outline-white">
                <span>Conoce nuestra misión y visión</span>
                <ArrowRight size={16} />
              </Link>
            </div>

            {/* Tarjeta de propósito */}
            <div
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem 2rem',
                backdropFilter: 'blur(8px)',
              }}
            >
              <span
                style={{
                  color: 'var(--color-mango)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  display: 'block',
                  marginBottom: '0.5rem',
                }}
              >
                Nuestro Propósito
              </span>
              <p
                style={{
                  fontSize: 'var(--text-xl)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1.4,
                  marginBottom: '1.5rem',
                }}
              >
                "{siteConfig.brandStory.purpose}"
              </p>
              <div
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'rgba(255, 255, 255, 0.7)',
                  borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                  paddingTop: '1rem',
                }}
              >
                Barranquilla · Caribe Colombiano
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECCIÓN: ASISTENTE DE IA (RECOMENDADOR DE SABORES)
          ====================================================================== */}
      <section className="section" style={{ backgroundColor: 'var(--color-crema)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="kicker">
              <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
              Asistente FRUITES
            </span>
            <h2>¿Cuál sabor va contigo hoy?</h2>
            <p style={{ marginTop: '0.75rem' }}>
              Elige tu momento y preferencia para recibir una recomendación de sabor al instante.
            </p>
          </div>

          <div
            className="card"
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              padding: '2.25rem',
              backgroundColor: '#ffffff',
            }}
          >
            {/* Paso 1: Momento */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
                1. ¿En qué momento lo vas a disfrutar?
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {[
                  { id: 'estudio', label: 'Estudio / Universidad' },
                  { id: 'oficina', label: 'Oficina / Trabajo' },
                  { id: 'entrenamiento', label: 'Entrenamiento' },
                  { id: 'viaje', label: 'Viaje / Trayecto' },
                  { id: 'antojo', label: 'Momento de antojo' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => handleRecommend(m.id, selectedPref)}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: selectedMoment === m.id ? 'var(--color-selva)' : 'var(--color-crema)',
                      color: selectedMoment === m.id ? '#ffffff' : 'var(--color-selva)',
                      borderColor: selectedMoment === m.id ? 'var(--color-selva)' : 'var(--color-border)',
                    }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Paso 2: Preferencia de sabor */}
            <div style={{ marginBottom: '2rem' }}>
              <label className="form-label" style={{ marginBottom: '0.75rem', display: 'block' }}>
                2. ¿Qué perfil de sabor prefieres?
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                {[
                  { id: 'dulce intenso', label: 'Dulce intenso y masticable' },
                  { id: 'toque ácido', label: 'Con chispa ácida cítrica' },
                  { id: 'suave', label: 'Suave y delicado' },
                  { id: 'sorprendeme', label: 'Sorpréndeme' },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleRecommend(selectedMoment, p.id)}
                    className="btn btn-sm"
                    style={{
                      backgroundColor: selectedPref === p.id ? 'var(--color-mango)' : 'var(--color-crema)',
                      color: 'var(--color-selva-dark)',
                      borderColor: selectedPref === p.id ? 'var(--color-mango)' : 'var(--color-border)',
                      fontWeight: selectedPref === p.id ? 800 : 600,
                    }}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resultado de la recomendación */}
            {recommendation && (
              <div
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-crema-subtle)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Sparkles size={16} color="var(--color-selva)" />
                  <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', color: 'var(--color-selva)' }}>
                    Recomendación para ti:
                  </span>
                </div>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-main)', marginBottom: '1.25rem' }}>
                  {recommendation.explanation}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {recommendation.products.map((prod) => (
                    <Link
                      key={prod.id}
                      to={`/catalogo/${prod.slug}`}
                      className="btn btn-selva btn-sm"
                    >
                      <span>Ver {prod.nombre}</span>
                      <ArrowRight size={14} />
                    </Link>
                  ))}
                  <Link to="/asistente" className="btn btn-secondary btn-sm">
                    <span>Preguntarle más dudas a la IA</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================================
          SECCIÓN: PARA NEGOCIOS (LLAMADO B2B)
          ====================================================================== */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: 'var(--color-crema)',
              borderRadius: 'var(--radius-xl)',
              padding: '3.5rem 2.5rem',
              border: '1px solid var(--color-border)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span className="kicker">Oportunidad B2B</span>
              <h2 style={{ marginBottom: '1rem' }}>
                FRUITES en tu punto de venta o café
              </h2>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                Buscamos cafés, gimnasios, tiendas saludables y empresas en Barranquilla y Colombia que deseen ofrecer un snack moderno con rotación y presentación atractiva.
              </p>
              <div style={{ marginTop: '1.75rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/negocios" className="btn btn-selva">
                  <span>Conocer propuesta para negocios</span>
                  <ArrowRight size={16} />
                </Link>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsappClean}?text=${encodeURIComponent(
                    '¡Hola! Tengo un negocio y me interesa conocer condiciones comerciales de FRUITES.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Comercial</span>
                </a>
              </div>
            </div>

            {/* Lista de beneficios para el negocio */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              {[
                { title: 'Empaque de mostrador', desc: 'Diseño coleccionable y llamativo que estimula la compra por impulso.' },
                { title: 'Validación en lote pequeño', desc: 'Comenzamos con cantidades cómodas para comprobar la respuesta de tus clientes.' },
                { title: 'Calidad y sabor consistente', desc: 'Frutas seleccionadas para una experiencia que genera recompra.' },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#ffffff',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--color-border-subtle)',
                  }}
                >
                  <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: '0.25rem' }}>{item.title}</h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          LLAMADO FINAL A CONTACTO
          ====================================================================== */}
      <section className="section-sm" style={{ backgroundColor: 'var(--color-crema)', textAlign: 'center' }}>
        <div className="container-narrow">
          <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: '0.75rem' }}>
            ¿Tienes alguna duda o quieres ser de los primeros en probar FRUITES?
          </h2>
          <p style={{ marginBottom: '1.75rem', fontSize: 'var(--text-base)' }}>
            Escríbenos directamente o déjanos un mensaje. Te responderemos con gusto desde Barranquilla.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <a href={waLink} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp btn-lg">
              <MessageCircle size={18} />
              <span>Chatear por WhatsApp</span>
            </a>
            <Link to="/contacto" className="btn btn-secondary btn-lg">
              <span>Formulario de contacto</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Compass, Heart, ShieldCheck, Sparkles, Sun } from 'lucide-react';
import { siteConfig } from '../data/siteConfig.js';

/**
 * ============================================================================
 * PÁGINA NOSOTROS / MARCA — FRUITES
 * ============================================================================
 * Historia, propósito, misión, visión, valores y pilares institucionales.
 * Textos oficiales definidos en la sección 8 del brief de marca.
 * ============================================================================
 */
export default function About() {
  return (
    <div className="about-page">
      {/* Cabecera institucional */}
      <section
        style={{
          paddingTop: '4rem',
          paddingBottom: '4rem',
          backgroundColor: 'var(--color-selva)',
          color: '#ffffff',
          textAlign: 'center',
        }}
      >
        <div className="container-narrow">
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
            Nuestra Esencia
          </span>
          <h1 style={{ color: '#ffffff', marginBottom: '1.25rem', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
            {siteConfig.brandStory.core}
          </h1>
          <p
            style={{
              fontSize: 'var(--text-lg)',
              color: 'rgba(255, 255, 255, 0.85)',
              lineHeight: 1.6,
              maxWidth: '650px',
              margin: '0 auto',
            }}
          >
            Snacks de frutas tropicales concebidos desde Barranquilla, Colombia, para transformar la fruta en una experiencia contemporánea y cotidiana.
          </p>
        </div>
      </section>

      {/* Historia completa */}
      <section className="section" style={{ backgroundColor: 'var(--color-crema)' }}>
        <div className="container-narrow">
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '3.5rem 3rem',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <span className="kicker">Cómo nace la marca</span>
            <h2 style={{ fontSize: 'var(--text-2xl)', marginBottom: '1.5rem' }}>
              Historia de FRUITES
            </h2>
            <div
              style={{
                fontSize: 'var(--text-base)',
                color: 'var(--color-text-muted)',
                lineHeight: 1.8,
                display: 'flex',
                flexDirection: 'column',
                gap: '1.25rem',
              }}
            >
              <p>{siteConfig.brandStory.history}</p>
              <p>
                El trópico caribeño nos inspira con su abundancia y vitalidad, pero nuestro enfoque está en resolver una fricción cotidiana: cómo disfrutar la riqueza de la fruta sin depender de nevera, cuchillo ni tiempos de preparación.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Propósito, Misión y Visión (3 bloques) */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="kicker">Rumbo Estratégico</span>
            <h2>Propósito, Misión y Visión</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {/* Propósito */}
            <div
              className="card"
              style={{
                backgroundColor: 'var(--color-crema)',
                border: '1px solid var(--color-border)',
                padding: '2.5rem 2rem',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-selva)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '1rem',
                  display: 'block',
                }}
              >
                01 · PROPÓSITO
              </span>
              <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '1rem' }}>
                Hacer accesible la fruta
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                "{siteConfig.brandStory.purpose}"
              </p>
            </div>

            {/* Misión */}
            <div
              className="card"
              style={{
                backgroundColor: 'var(--color-crema)',
                border: '1px solid var(--color-border)',
                padding: '2.5rem 2rem',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-coral)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '1rem',
                  display: 'block',
                }}
              >
                02 · MISIÓN
              </span>
              <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '1rem' }}>
                Desarrollo e Innovación
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                "{siteConfig.brandStory.mision}"
              </p>
            </div>

            {/* Visión */}
            <div
              className="card"
              style={{
                backgroundColor: 'var(--color-crema)',
                border: '1px solid var(--color-border)',
                padding: '2.5rem 2rem',
              }}
            >
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-mango)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '1rem',
                  display: 'block',
                }}
              >
                03 · VISIÓN
              </span>
              <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '1rem' }}>
                Proyección y Calidad
              </h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                "{siteConfig.brandStory.vision}"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores de marca */}
      <section className="section" style={{ backgroundColor: 'var(--color-crema)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="kicker">Principios Guía</span>
            <h2>Nuestros Valores</h2>
            <p style={{ marginTop: '0.75rem' }}>
              Los principios que orientan nuestras formulaciones, diseño y relación con clientes.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {siteConfig.brandStory.values.map((v, i) => (
              <div
                key={i}
                className="card card-solid"
                style={{
                  padding: '1.75rem',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-selva)',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    display: 'block',
                  }}
                >
                  VALOR 0{i + 1}
                </span>
                <h4 style={{ fontSize: 'var(--text-base)', marginBottom: '0.5rem' }}>
                  {v.title}
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {v.description}
                </p>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3.5rem' }}>
            <Link to="/catalogo" className="btn btn-primary btn-lg">
              <span>Descubre la Colección Tropical</span>
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

/**
 * ============================================================================
 * PÁGINA 404 (NO ENCONTRADA) — FRUITES
 * ============================================================================
 * Mensaje amable y regreso rápido a la Colección Tropical o al inicio.
 * ============================================================================
 */
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '70vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        backgroundColor: 'var(--color-crema)',
      }}
    >
      <div className="container-narrow">
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '4rem',
            fontWeight: 800,
            color: 'var(--color-mango)',
            display: 'block',
            lineHeight: 1,
            marginBottom: '1rem',
          }}
        >
          404
        </span>

        <h1 style={{ fontSize: 'var(--text-3xl)', marginBottom: '1rem', color: 'var(--color-selva)' }}>
          Esta página no está madura todavía
        </h1>

        <p
          style={{
            fontSize: 'var(--text-base)',
            color: 'var(--color-text-muted)',
            maxWidth: '480px',
            margin: '0 auto 2rem auto',
          }}
        >
          La ruta a la que intentas ingresar no existe o ha cambiado de lugar. Te invitamos a descubrir nuestros snacks tropicales.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/" className="btn btn-primary">
            <Home size={16} />
            <span>Volver al Inicio</span>
          </Link>
          <Link to="/catalogo" className="btn btn-secondary">
            <span>Ver Colección Tropical</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

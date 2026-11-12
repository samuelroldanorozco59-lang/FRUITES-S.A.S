import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Check } from 'lucide-react';
import StandUpPouchIllustration from './StandUpPouchIllustration.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatCOP } from '../utils/formatters.js';
import { getAssetUrl } from '../utils/imageUrl.js';

/**
 * ============================================================================
 * TARJETA DE PRODUCTO FRUITES (E-COMMERCE)
 * ============================================================================
 * Muestra el producto con:
 * - Selector de presentación (ej. 40g / 80g).
 * - Precio oficial en Pesos Colombianos (COP).
 * - Botón directo de "Agregar al Carrito".
 * - Imagen con soporte seguro para subdirectorios en GitHub Pages (getAssetUrl).
 * ============================================================================
 */
export default function ProductCard({ product }) {
  const [imgError, setImgError] = useState(false);
  const { addItem } = useCart();
  const [selectedPresIdx, setSelectedPresIdx] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const presentations = product?.presentaciones && product.presentaciones.length > 0
    ? product.presentaciones
    : [{ gramaje: '40g', precio: 9500, disponible: true }];

  const currentPres = presentations[selectedPresIdx] || presentations[0];

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem(product, 1, currentPres);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  return (
    <article
      className="card card-product"
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        transition: 'transform var(--transition-normal), box-shadow var(--transition-normal)',
      }}
    >
      {/* Cabecera visual del empaque con color de fondo sutil del sabor */}
      <div
        style={{
          backgroundColor: product?.colorSecundario || 'var(--color-crema)',
          padding: '2rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          minHeight: '280px',
        }}
      >
        {/* Etiqueta de fruta */}
        <div
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            background: 'rgba(255,255,255,0.94)',
            backdropFilter: 'blur(4px)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            border: '1px solid rgba(24, 61, 50, 0.08)',
          }}
        >
          <span
            style={{
              width: '9px',
              height: '9px',
              borderRadius: '50%',
              backgroundColor: product?.colorPrincipal || '#F6C945',
              display: 'inline-block',
            }}
            aria-hidden="true"
          />
          <span
            style={{
              fontSize: 'var(--text-xs)',
              fontWeight: 700,
              fontFamily: 'var(--font-display)',
              color: 'var(--color-selva)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {product?.fruta}
          </span>
        </div>

        {/* Imagen real o ilustración SVG si la imagen falla */}
        {product?.imagen && !imgError ? (
          <img
            src={getAssetUrl(product.imagen)}
            alt={`Snack de fruta deshidratada FRUITES ${product.nombre}`}
            loading="lazy"
            width={220}
            height={220}
            onError={() => setImgError(true)}
            style={{
              maxHeight: '230px',
              width: 'auto',
              objectFit: 'contain',
              filter: 'drop-shadow(0 10px 20px rgba(24, 61, 50, 0.12))',
              transition: 'transform var(--transition-normal)',
            }}
            className="product-card-img"
          />
        ) : (
          <StandUpPouchIllustration
            fruta={product?.fruta}
            colorPrincipal={product?.colorPrincipal}
            colorAcento={product?.colorAcento}
            size={220}
          />
        )}
      </div>

      {/* Contenido y detalles */}
      <div
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          flexGrow: 1,
        }}
      >
        <div style={{ marginBottom: '0.75rem' }}>
          <span
            style={{
              fontSize: 'var(--text-xs)',
              color: 'var(--color-text-light)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              fontWeight: 600,
              display: 'block',
              marginBottom: '0.2rem',
            }}
          >
            Colección Tropical
          </span>
          <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '0.4rem' }}>
            <Link
              to={`/catalogo/${product?.slug}`}
              style={{ color: 'var(--color-selva)' }}
            >
              {product?.nombre}
            </Link>
          </h3>
          <p
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.5,
              marginBottom: '1rem',
            }}
          >
            {product?.descripcionCorta}
          </p>
        </div>

        {/* Selector de Presentaciones si hay más de una */}
        {presentations.length > 1 && (
          <div style={{ marginBottom: '1rem' }}>
            <span style={{ fontSize: '11px', color: 'var(--color-text-light)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              Tamaño de pouch:
            </span>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {presentations.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedPresIdx(idx)}
                  style={{
                    padding: '0.3rem 0.65rem',
                    fontSize: '11px',
                    fontWeight: selectedPresIdx === idx ? 700 : 500,
                    borderRadius: 'var(--radius-sm)',
                    border: selectedPresIdx === idx ? '1.5px solid var(--color-selva)' : '1px solid #D1D5DB',
                    backgroundColor: selectedPresIdx === idx ? '#F8FAF9' : '#ffffff',
                    color: 'var(--color-selva)',
                    cursor: 'pointer',
                  }}
                >
                  {p.gramaje}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Precios oficiales */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
            borderTop: '1px solid var(--color-border-subtle)',
            paddingTop: '0.85rem',
            marginTop: 'auto',
            marginBottom: '1.25rem',
          }}
        >
          <div>
            <span style={{ fontSize: '11px', color: 'var(--color-text-light)', display: 'block' }}>
              Presentación {currentPres.gramaje}
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.4rem' }}>
              <strong style={{ fontSize: '1.25rem', color: 'var(--color-selva)', fontWeight: 800 }}>
                {formatCOP(currentPres.precio)}
              </strong>
              {currentPres.precioAnterior && (
                <span style={{ fontSize: '12px', color: '#9CA3AF', textDecoration: 'line-through' }}>
                  {formatCOP(currentPres.precioAnterior)}
                </span>
              )}
            </div>
          </div>

          <span style={{ fontSize: '11px', color: '#059669', fontWeight: 600 }}>
            {product?.disponible !== false ? '● En stock' : 'Agotado'}
          </span>
        </div>

        {/* Botones de acción E-Commerce */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn btn-primary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={product?.disponible === false}
          >
            {addedAnimation ? <Check size={15} /> : <ShoppingBag size={15} />}
            <span>{addedAnimation ? '¡Agregado!' : 'Al Carrito'}</span>
          </button>

          <Link
            to={`/catalogo/${product?.slug}`}
            className="btn btn-secondary btn-sm"
            style={{ width: '100%', justifyContent: 'center' }}
          >
            <span>Ver Ficha</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

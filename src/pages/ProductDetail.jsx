import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  MessageCircle,
  Store,
  ShoppingBag,
  Check,
  ShieldCheck,
  Truck,
  Sparkles,
} from 'lucide-react';
import { getProductBySlug, getProducts } from '../services/productsService.js';
import StandUpPouchIllustration from '../components/StandUpPouchIllustration.jsx';
import ProductCard from '../components/ProductCard.jsx';
import { siteConfig } from '../data/siteConfig.js';
import { useCart } from '../context/CartContext.jsx';
import { formatCOP } from '../utils/formatters.js';
import { getAssetUrl } from '../utils/imageUrl.js';

/**
 * ============================================================================
 * DETALLE DE PRODUCTO (PDP) — FRUITES (E-COMMERCE)
 * ============================================================================
 * Ficha sensorial completa, selección de presentación (40g / 80g),
 * precios en Pesos Colombianos, botón de Agregar al Carrito y compra directa.
 * ============================================================================
 */
export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedPresIdx, setSelectedPresIdx] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const { addItem } = useCart();

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      setImgError(false);
      try {
        const item = await getProductBySlug(slug);
        setProduct(item);

        const all = await getProducts();
        if (item) {
          setRelated(all.filter((p) => p.slug !== item.slug).slice(0, 3));
        }
      } catch (err) {
        console.error('Error al cargar detalle del producto:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading) {
    return (
      <div className="section container text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontSize: 'var(--text-lg)', color: 'var(--color-text-muted)' }}>Cargando ficha del sabor...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="section container text-center" style={{ minHeight: '60vh' }}>
        <h2>Sabor no encontrado</h2>
        <p style={{ marginTop: '1rem', marginBottom: '2rem' }}>
          El sabor que buscas no se encuentra en la Colección Tropical actual.
        </p>
        <Link to="/catalogo" className="btn btn-primary">
          <ArrowLeft size={16} />
          <span>Volver a la Colección</span>
        </Link>
      </div>
    );
  }

  const presentations = product?.presentaciones && product.presentaciones.length > 0
    ? product.presentaciones
    : [{ gramaje: '40g', precio: 9500, disponible: true }];

  const currentPres = presentations[selectedPresIdx] || presentations[0];

  const handleAddToCart = () => {
    addItem(product, quantity, currentPres);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1400);
  };

  // Enlace a WhatsApp con mensaje prellenado
  const waMsg = encodeURIComponent(
    `¡Hola FRUITES! Quisiera pedir ${quantity} unidad(es) de ${product.nombre} (Presentación ${currentPres.gramaje} - ${formatCOP(currentPres.precio * quantity)}). ¿Tienen disponibilidad para entrega en Barranquilla?`
  );
  const waLink = `https://wa.me/${siteConfig.contact.whatsappClean}?text=${waMsg}`;

  return (
    <div className="product-detail-page section" style={{ backgroundColor: 'var(--color-crema)' }}>
      <div className="container">
        {/* Navegación de miga de pan sutil */}
        <div style={{ marginBottom: '2rem' }}>
          <Link
            to="/catalogo"
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
            <span>Volver a la Colección Tropical</span>
          </Link>
        </div>

        {/* Módulo de producto principal: 2 columnas balanceadas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'start',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2.5rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '4.5rem',
          }}
        >
          {/* Columna Izquierda: Imagen o Ilustración Vectorial */}
          <div
            style={{
              backgroundColor: product?.colorSecundario || 'var(--color-crema)',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem 2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '420px',
              position: 'relative',
            }}
          >
            {product?.imagen && !imgError ? (
              <img
                src={getAssetUrl(product.imagen)}
                alt={`Empaque de ${product.nombre}`}
                loading="eager"
                onError={() => setImgError(true)}
                style={{
                  maxHeight: '380px',
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 14px 28px rgba(24, 61, 50, 0.15))',
                }}
              />
            ) : (
              <StandUpPouchIllustration
                fruta={product?.fruta}
                colorPrincipal={product?.colorPrincipal}
                colorAcento={product?.colorAcento}
                size={290}
              />
            )}
          </div>

          {/* Columna Derecha: Información del producto y módulo de compra */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.5rem' }}>
              <span
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: product?.colorPrincipal || '#F6C945',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: 'var(--color-selva)',
                }}
              >
                Fruta: {product?.fruta} · Colección Tropical
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.75rem)', marginBottom: '0.75rem', color: 'var(--color-selva)' }}>
              {product?.nombre}
            </h1>

            {/* Precios oficiales destacados */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <strong style={{ fontSize: '2rem', color: 'var(--color-selva)', fontWeight: 800 }}>
                {formatCOP(currentPres.precio)}
              </strong>
              {currentPres.precioAnterior && (
                <span style={{ fontSize: '1.1rem', color: '#9CA3AF', textDecoration: 'line-through' }}>
                  {formatCOP(currentPres.precioAnterior)}
                </span>
              )}
              <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
                {product?.disponible !== false ? '● En stock' : 'Agotado'}
              </span>
            </div>

            <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-muted)', lineHeight: 1.7, marginBottom: '1.75rem' }}>
              {product?.descripcionLarga || product?.descripcionCorta}
            </p>

            {/* Selector de Presentación / Gramaje */}
            <div style={{ marginBottom: '1.75rem' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-selva)', display: 'block', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Selecciona la Presentación:
              </span>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {presentations.map((pres, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPresIdx(idx)}
                    style={{
                      padding: '0.65rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      border: selectedPresIdx === idx ? '2px solid var(--color-selva)' : '1px solid var(--color-border)',
                      backgroundColor: selectedPresIdx === idx ? '#F8FAF9' : '#ffffff',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <strong style={{ display: 'block', fontSize: '13px', color: 'var(--color-selva)' }}>
                      {pres.gramaje}
                    </strong>
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      {formatCOP(pres.precio)}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Ficha de Perfil Sensorial */}
            {product?.perfilSensorial && (
              <div
                style={{
                  backgroundColor: 'var(--color-crema)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem',
                  border: '1px solid var(--color-border-subtle)',
                  marginBottom: '1.75rem',
                }}
              >
                <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: '0.75rem', color: 'var(--color-selva)' }}>
                  Perfil Sensorial
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: 'var(--text-xs)' }}>
                  <div>
                    <strong style={{ color: 'var(--color-selva)' }}>Sabor:</strong>{' '}
                    <span style={{ color: 'var(--color-text-muted)' }}>{product.perfilSensorial?.sabor}</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--color-selva)' }}>Textura:</strong>{' '}
                    <span style={{ color: 'var(--color-text-muted)' }}>{product.perfilSensorial?.textura}</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--color-selva)' }}>Aroma:</strong>{' '}
                    <span style={{ color: 'var(--color-text-muted)' }}>{product.perfilSensorial?.aroma}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Formato y empaque */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                padding: '1.25rem 0',
                borderTop: '1px solid var(--color-border)',
                borderBottom: '1px solid var(--color-border)',
                marginBottom: '1.75rem',
                fontSize: 'var(--text-xs)',
              }}
            >
              <div>
                <span style={{ color: 'var(--color-text-light)', display: 'block' }}>Formato de empaque</span>
                <strong style={{ color: 'var(--color-selva)', fontSize: 'var(--text-sm)' }}>
                  Stand-up pouch resellable
                </strong>
              </div>
              <div>
                <span style={{ color: 'var(--color-text-light)', display: 'block' }}>Garantía</span>
                <strong style={{ color: 'var(--color-selva)', fontSize: 'var(--text-sm)' }}>
                  Cierre hermético con zipper
                </strong>
              </div>
            </div>

            {/* Selector de cantidad y Botones de Compra */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <span style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-selva)' }}>
                  Cantidad:
                </span>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden',
                    backgroundColor: 'var(--color-crema)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      padding: '0.45rem 1rem',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontWeight: 700,
                      color: 'var(--color-selva)',
                    }}
                  >
                    -
                  </button>
                  <span style={{ padding: '0 0.85rem', fontWeight: 700, fontSize: 'var(--text-sm)' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    style={{
                      padding: '0.45rem 1rem',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontWeight: 700,
                      color: 'var(--color-selva)',
                    }}
                  >
                    +
                  </button>
                </div>

                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  Total: <strong>{formatCOP(currentPres.precio * quantity)}</strong>
                </span>
              </div>

              {/* Botones de acción E-Commerce */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="btn btn-primary btn-lg"
                  style={{ flex: 1, minWidth: '220px', justifyContent: 'center' }}
                  disabled={product?.disponible === false}
                >
                  {addedAnimation ? <Check size={20} /> : <ShoppingBag size={20} />}
                  <span>{addedAnimation ? '¡Agregado al Carrito!' : `Agregar ${quantity} al Carrito`}</span>
                </button>

                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-lg"
                  style={{ flex: 1, minWidth: '220px', justifyContent: 'center' }}
                >
                  <MessageCircle size={18} />
                  <span>Pedir directo por WhatsApp</span>
                </a>
              </div>

              {/* Beneficios de entrega */}
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E8ECE9', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  <Truck size={15} color="var(--color-selva)" />
                  <span>Envío GRATIS en compras desde $60.000 COP</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  <ShieldCheck size={15} color="var(--color-selva)" />
                  <span>Pago Contra Entrega disponible en Barranquilla</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de otros sabores relacionados */}
        {related.length > 0 && (
          <div>
            <div style={{ marginBottom: '2rem' }}>
              <span className="kicker">Continúa explorando</span>
              <h2 style={{ fontSize: 'var(--text-2xl)' }}>Otros sabores de la Colección</h2>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '2rem',
              }}
            >
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

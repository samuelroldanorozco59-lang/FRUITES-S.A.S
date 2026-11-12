import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  Sparkles,
  Tag,
  Check,
  MessageCircle,
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { formatCOP } from '../utils/formatters.js';
import { getAssetUrl } from '../utils/imageUrl.js';
import { siteConfig } from '../data/siteConfig.js';

export default function CartDrawer() {
  const {
    items,
    totalCount,
    subtotal,
    discount,
    shippingFee,
    total,
    freeShippingProgress,
    amountForFreeShipping,
    isFreeShipping,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    couponCode,
    couponDiscountPercent,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const navigate = useNavigate();
  const [inputCoupon, setInputCoupon] = useState('');
  const [couponFeedback, setCouponFeedback] = useState(null);

  if (!isOpen) return null;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon);
    setCouponFeedback(res);
    if (res.success) {
      setInputCoupon('');
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  // Enlace directo para enviar el carrito completo por WhatsApp
  const generateWhatsAppOrderLink = () => {
    const itemsList = items
      .map((it) => `• ${it.quantity}x ${it.nombre} (${it.gramaje}) — ${formatCOP(it.precio * it.quantity)}`)
      .join('\n');

    const msg = `¡Hola FRUITES! Quiero pedir el siguiente carrito de compras:\n\n${itemsList}\n\n*Subtotal:* ${formatCOP(subtotal)}\n${discount > 0 ? `*Descuento:* -${formatCOP(discount)}\n` : ''}*Envío estimado:* ${shippingFee === 0 ? '¡GRATIS!' : formatCOP(shippingFee)}\n*Total:* ${formatCOP(total)}\n\n¿Cuál es el tiempo de entrega y cómo procedemos?`;

    return `https://wa.me/${siteConfig.contact.whatsappClean}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
      role="dialog"
      aria-modal="true"
      aria-label="Carrito de compras"
    >
      {/* Fondo oscuro con difuminado */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 40, 33, 0.55)',
          backdropFilter: 'blur(3px)',
          transition: 'opacity 0.2s ease',
        }}
        onClick={closeCart}
      />

      {/* Panel lateral */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          height: '100%',
          backgroundColor: '#ffffff',
          boxShadow: '-4px 0 25px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1101,
        }}
      >
        {/* Cabecera del Carrito */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #E8ECE9',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'var(--color-selva)',
            color: '#ffffff',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShoppingBag size={20} color="var(--color-mango)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
              Tu Carrito de Snacks
            </h3>
            <span
              style={{
                backgroundColor: 'var(--color-mango)',
                color: 'var(--color-selva)',
                fontSize: '11px',
                fontWeight: 800,
                borderRadius: '9999px',
                padding: '2px 8px',
              }}
            >
              {totalCount} {totalCount === 1 ? 'snack' : 'snacks'}
            </span>
          </div>

          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Barra de progreso de Envío Gratis */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            backgroundColor: '#F8FAF9',
            borderBottom: '1px solid #E8ECE9',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <Truck size={16} color="var(--color-selva)" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-selva)' }}>
              {isFreeShipping ? (
                <strong style={{ color: '#166534' }}>¡Felicidades! Tienes Envío GRATIS</strong>
              ) : (
                <>
                  Agrega <strong>{formatCOP(amountForFreeShipping)}</strong> para <strong>Envío GRATIS</strong>
                </>
              )}
            </span>
          </div>
          <div
            style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#E5EAE7',
              borderRadius: '9999px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${freeShippingProgress}%`,
                height: '100%',
                backgroundColor: isFreeShipping ? '#22C55E' : 'var(--color-mango)',
                borderRadius: '9999px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>

        {/* Lista de productos */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {items.length === 0 ? (
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '2rem 1rem',
              }}
            >
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-crema)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '1rem',
                }}
              >
                <ShoppingBag size={28} color="var(--color-text-light)" />
              </div>
              <h4 style={{ fontSize: '1.1rem', color: 'var(--color-selva)', marginBottom: '0.4rem' }}>
                Tu carrito está vacío
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--color-text-muted)', maxWidth: '280px', marginBottom: '1.5rem' }}>
                Explora nuestra Colección Tropical y descubre fruta real lista para llevar a cualquier parte.
              </p>
              <button
                type="button"
                onClick={() => {
                  closeCart();
                  navigate('/catalogo');
                }}
                className="btn btn-primary btn-sm"
              >
                <span>Ver Colección Tropical</span>
                <ArrowRight size={15} />
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: '0.85rem',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#ffffff',
                }}
              >
                {/* Imagen del empaque pouch */}
                <div
                  style={{
                    width: '68px',
                    height: '68px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: item.colorPrincipal || '#F6C945',
                    overflow: 'hidden',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <img
                    src={getAssetUrl(item.imagen)}
                    alt={item.nombre}
                    loading="lazy"
                    width={68}
                    height={68}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>

                {/* Detalles y precios */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ fontSize: '0.9rem', margin: 0, color: 'var(--color-selva)', fontWeight: 700 }}>
                        {item.nombre}
                      </h4>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        Presentación: {item.gramaje}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      aria-label={`Eliminar ${item.nombre} del carrito`}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#9CA3AF',
                        cursor: 'pointer',
                        padding: '2px',
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                    {/* Selector de cantidad */}
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        border: '1px solid #D1D5DB',
                        borderRadius: 'var(--radius-full)',
                        padding: '2px 6px',
                        gap: '6px',
                        backgroundColor: '#F9FAFB',
                      }}
                    >
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        aria-label="Disminuir cantidad"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '2px',
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span style={{ fontSize: '12px', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        aria-label="Aumentar cantidad"
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          padding: '2px',
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Precio total por item */}
                    <strong style={{ fontSize: '0.9rem', color: 'var(--color-selva)' }}>
                      {formatCOP(item.precio * item.quantity)}
                    </strong>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer del Carrito con totales y botones */}
        {items.length > 0 && (
          <div
            style={{
              padding: '1.25rem 1.5rem',
              borderTop: '1px solid #E8ECE9',
              backgroundColor: '#FAFCFB',
            }}
          >
            {/* Cupón de descuento */}
            <div style={{ marginBottom: '1rem' }}>
              {couponCode ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.45rem 0.75rem',
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '12px',
                    color: '#065F46',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Check size={14} />
                    <span>
                      Cupón <strong>{couponCode}</strong> ({couponDiscountPercent}% OFF)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#047857',
                      cursor: 'pointer',
                      fontSize: '11px',
                      textDecoration: 'underline',
                    }}
                  >
                    Quitar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} style={{ display: 'flex', gap: '0.4rem' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input
                      type="text"
                      placeholder="Cupón (ej. FRUITES10)"
                      value={inputCoupon}
                      onChange={(e) => setInputCoupon(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.45rem 0.75rem',
                        fontSize: '12px',
                        borderRadius: 'var(--radius-sm)',
                        border: '1px solid #D1D5DB',
                        textTransform: 'uppercase',
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn btn-secondary btn-sm"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '12px' }}
                  >
                    <Tag size={13} />
                    <span>Aplicar</span>
                  </button>
                </form>
              )}

              {couponFeedback && !couponCode && (
                <div style={{ fontSize: '11px', color: '#B91C1C', marginTop: '0.3rem' }}>
                  {couponFeedback.message}
                </div>
              )}
            </div>

            {/* Desglose de totales */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                <span>Subtotal</span>
                <span>{formatCOP(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#059669' }}>
                  <span>Descuento cupón</span>
                  <span>-{formatCOP(discount)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                <span>Envío estimado</span>
                <span>
                  {shippingFee === 0 ? (
                    <strong style={{ color: '#059669' }}>¡GRATIS!</strong>
                  ) : (
                    formatCOP(shippingFee)
                  )}
                </span>
              </div>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  color: 'var(--color-selva)',
                  paddingTop: '0.5rem',
                  borderTop: '1px dashed #D1D5DB',
                  marginTop: '0.35rem',
                }}
              >
                <span>Total</span>
                <span>{formatCOP(total)}</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={handleCheckout}
                className="btn btn-primary btn-lg btn-full"
                style={{ justifyContent: 'center' }}
              >
                <span>Finalizar Pedido</span>
                <ArrowRight size={18} />
              </button>

              <a
                href={generateWhatsAppOrderLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-sm btn-full"
                style={{ justifyContent: 'center' }}
              >
                <MessageCircle size={15} />
                <span>O pedir carrito por WhatsApp</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

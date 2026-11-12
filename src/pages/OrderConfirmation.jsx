import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  CheckCircle,
  Package,
  Truck,
  MessageCircle,
  ArrowRight,
  CreditCard,
  MapPin,
  Calendar,
  Share2,
} from 'lucide-react';
import { getOrderById } from '../services/ordersService.js';
import { formatCOP, formatDate } from '../utils/formatters.js';
import { getAssetUrl } from '../utils/imageUrl.js';
import { siteConfig } from '../data/siteConfig.js';

export default function OrderConfirmation() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      setLoading(true);
      try {
        const found = await getOrderById(orderId);
        setOrder(found);
      } catch (err) {
        console.error('Error al cargar orden:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [orderId]);

  if (loading) {
    return (
      <div className="section container text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: 'var(--color-text-muted)' }}>Cargando comprobante de tu pedido...</p>
      </div>
    );
  }

  // Enlace a WhatsApp con el pedido prellenado
  const waOrderMessage = order
    ? encodeURIComponent(
        `¡Hola equipo FRUITES! Acabo de registrar mi pedido #${order.orderNumber} por ${formatCOP(
          order.total
        )} a nombre de ${order.customerName}.\n\nMétodo de pago: ${
          order.paymentMethod === 'contraentrega'
            ? 'Contra Entrega'
            : order.paymentMethod === 'transferencia'
            ? 'Transferencia Nequi/Daviplata'
            : 'Coordinación directa'
        }.\nCiudad: ${order.customerCity}.\n\n¿Me confirman recepción y fecha estimada de entrega? ¡Gracias!`
      )
    : '';

  const waLink = `https://wa.me/${siteConfig.contact.whatsappClean}?text=${waOrderMessage}`;

  return (
    <div className="order-confirmation-page section" style={{ backgroundColor: 'var(--color-crema)' }}>
      <div className="container-narrow">
        {/* Tarjeta Principal de Confirmación */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-md)',
            textAlign: 'center',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#ECFDF5',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1.25rem',
            }}
          >
            <CheckCircle size={40} color="#10B981" />
          </div>

          <span className="kicker" style={{ color: '#059669' }}>
            ¡Pedido Registrado con Éxito!
          </span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)', color: 'var(--color-selva)', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            Gracias por tu compra en FRUITES
          </h1>

          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.95rem', maxWidth: '520px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
            Hemos recibido los detalles de tu orden. Tu snack tropical entrará en alistamiento en nuestro centro de despacho en Barranquilla.
          </p>

          {/* Código de pedido destacado */}
          <div
            style={{
              display: 'inline-block',
              backgroundColor: 'var(--color-crema)',
              border: '2px dashed var(--color-selva)',
              borderRadius: 'var(--radius-md)',
              padding: '0.75rem 2rem',
              marginBottom: '2rem',
            }}
          >
            <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--color-text-light)', display: 'block' }}>
              Número de Pedido
            </span>
            <strong style={{ fontSize: '1.8rem', color: 'var(--color-selva)', fontFamily: 'var(--font-mono, monospace)', letterSpacing: '0.05em' }}>
              {order ? order.orderNumber : orderId}
            </strong>
          </div>

          {/* Botón destacado de WhatsApp */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-lg"
              style={{ padding: '0.85rem 1.75rem' }}
            >
              <MessageCircle size={18} />
              <span>Confirmar / Enviar Comprobante por WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Desglose y Detalles del Pedido */}
        {order && (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '2.25rem',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
              marginBottom: '2rem',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', color: 'var(--color-selva)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid #E8ECE9' }}>
              Detalles de la Entrega y Pago
            </h3>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-light)', display: 'block', marginBottom: '0.25rem' }}>
                  Cliente
                </span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-selva)', display: 'block' }}>
                  {order.customerName}
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {order.customerPhone} · {order.customerEmail}
                </span>
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-light)', display: 'block', marginBottom: '0.25rem' }}>
                  Dirección de Envío
                </span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-selva)', display: 'block' }}>
                  {order.customerAddress}
                </strong>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                  {order.customerCity}, {order.customerDepartment}
                </span>
                {order.deliveryNotes && (
                  <p style={{ fontSize: '11px', color: 'var(--color-text-light)', fontStyle: 'italic', margin: '0.2rem 0 0 0' }}>
                    Nota: {order.deliveryNotes}
                  </p>
                )}
              </div>

              <div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-light)', display: 'block', marginBottom: '0.25rem' }}>
                  Método de Pago
                </span>
                <strong style={{ fontSize: '0.95rem', color: 'var(--color-selva)', display: 'block' }}>
                  {order.paymentMethod === 'contraentrega'
                    ? 'Pago Contra Entrega'
                    : order.paymentMethod === 'transferencia'
                    ? 'Transferencia Nequi / Daviplata / Bancolombia'
                    : 'Coordinación por WhatsApp'}
                </strong>
                <span
                  style={{
                    display: 'inline-block',
                    fontSize: '11px',
                    fontWeight: 700,
                    backgroundColor: '#FEF3C7',
                    color: '#92400E',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    marginTop: '4px',
                  }}
                >
                  Estado: {order.paymentStatus || 'Pendiente'}
                </span>
              </div>
            </div>

            {/* Instrucciones de Transferencia si aplica */}
            {order.paymentMethod === 'transferencia' && (
              <div
                style={{
                  padding: '1.25rem',
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #BBF7D0',
                  borderRadius: 'var(--radius-md)',
                  marginBottom: '2rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <CreditCard size={18} color="#166534" />
                  <strong style={{ fontSize: '0.9rem', color: '#166534' }}>
                    Datos para tu Transferencia:
                  </strong>
                </div>
                <p style={{ fontSize: '12px', color: '#14532D', margin: 0, lineHeight: 1.6 }}>
                  • <strong>Nequi / Daviplata:</strong> {siteConfig.contact.whatsappNumber} (Titular: FRUITES)
                  <br />
                  • <strong>Valor a transferir:</strong> {formatCOP(order.total)}
                  <br />
                  • Por favor envía la captura del comprobante al WhatsApp oficial indicando tu número de orden: <strong>{order.orderNumber}</strong>.
                </p>
              </div>
            )}

            {/* Lista de productos comprados */}
            <h4 style={{ fontSize: '1rem', color: 'var(--color-selva)', marginBottom: '1rem' }}>
              Productos en tu Orden
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {order.items &&
                order.items.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0',
                      borderBottom: '1px solid #F3F4F6',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: '#F6C945',
                          overflow: 'hidden',
                        }}
                      >
                        <img
                          src={getAssetUrl(item.imagen)}
                          alt={item.nombre}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </div>
                      <div>
                        <strong style={{ fontSize: '13px', color: 'var(--color-selva)' }}>{item.nombre}</strong>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>
                          {item.quantity} x {item.gramaje}
                        </span>
                      </div>
                    </div>

                    <strong style={{ fontSize: '13px', color: 'var(--color-selva)' }}>
                      {formatCOP(item.precio * item.quantity)}
                    </strong>
                  </div>
                ))}
            </div>

            {/* Resumen monetario */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', paddingTop: '0.75rem', borderTop: '1px solid #E8ECE9', maxWidth: '300px', marginLeft: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                <span>Subtotal</span>
                <span>{formatCOP(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#059669' }}>
                  <span>Descuento</span>
                  <span>-{formatCOP(order.discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                <span>Envío</span>
                <span>{order.shippingCost === 0 ? '¡GRATIS!' : formatCOP(order.shippingCost)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-selva)', paddingTop: '0.4rem', borderTop: '2px solid var(--color-selva)' }}>
                <span>Total</span>
                <span>{formatCOP(order.total)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Acciones de regreso */}
        <div style={{ textAlign: 'center' }}>
          <Link to="/catalogo" className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
            <span>Seguir descubriendo la Colección Tropical</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}

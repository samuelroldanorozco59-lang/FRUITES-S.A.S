import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  CheckCircle,
  ArrowLeft,
  Lock,
  MessageCircle,
  ChevronRight,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { createOrder } from '../services/ordersService.js';
import { formatCOP } from '../utils/formatters.js';
import { getAssetUrl } from '../utils/imageUrl.js';
import { siteConfig } from '../data/siteConfig.js';

export default function Checkout() {
  const {
    items,
    subtotal,
    discount,
    shippingFee,
    total,
    destinationCity,
    setDestinationCity,
    couponCode,
    clearCart,
  } = useCart();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    barrio: '',
    ciudad: destinationCity || 'Barranquilla',
    departamento: 'Atlántico',
    indicaciones: '',
    metodoPago: 'contraentrega',
    aceptaTerminos: false,
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Si no hay productos en el carrito, invitamos a comprar
  if (items.length === 0) {
    return (
      <div className="section container text-center" style={{ minHeight: '65vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ maxWidth: '440px', padding: '2rem' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-crema)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}
          >
            <ShoppingBag size={28} color="var(--color-selva)" />
          </div>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--color-selva)', marginBottom: '0.5rem' }}>
            Tu carrito está vacío
          </h2>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            Agrega tus snacks favoritos de la Colección Tropical para continuar con el proceso de compra.
          </p>
          <Link to="/catalogo" className="btn btn-primary">
            <span>Explorar Colección Tropical</span>
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => {
      const next = { ...prev, [name]: type === 'checkbox' ? checked : value };
      if (name === 'ciudad') {
        setDestinationCity(value);
      }
      return next;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.nombre.trim() || !formData.email.trim() || !formData.telefono.trim() || !formData.direccion.trim()) {
      setErrorMsg('Por favor completa todos los campos de contacto y dirección obligatorios (*).');
      return;
    }

    if (!formData.aceptaTerminos) {
      setErrorMsg('Debes aceptar la política de tratamiento de datos personales para continuar.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName: formData.nombre.trim(),
        customerEmail: formData.email.trim().toLowerCase(),
        customerPhone: formData.telefono.trim(),
        customerAddress: `${formData.direccion.trim()}${formData.barrio ? `, Barrio ${formData.barrio.trim()}` : ''}`,
        customerCity: formData.ciudad,
        customerDepartment: formData.departamento,
        deliveryNotes: formData.indicaciones ? formData.indicaciones.trim() : null,
        paymentMethod: formData.metodoPago,
        paymentStatus: formData.metodoPago === 'transferencia' ? 'pendiente_comprobante' : 'pendiente',
        subtotal,
        discount,
        couponCode: couponCode || null,
        shippingCost: shippingFee,
        total,
        status: 'nuevo',
        items: items.map((it) => ({
          id: it.id,
          productId: it.productId,
          nombre: it.nombre,
          fruta: it.fruta,
          gramaje: it.gramaje,
          precio: it.precio,
          quantity: it.quantity,
          imagen: it.imagen,
        })),
      };

      const result = await createOrder(orderPayload);

      if (result.success && result.order) {
        clearCart();
        navigate(`/pedido-confirmado/${result.order.orderNumber}`);
      } else {
        setErrorMsg('Ocurrió un problema al procesar el pedido. Por favor intenta de nuevo o escríbenos por WhatsApp.');
      }
    } catch (err) {
      console.error('Error en checkout:', err);
      setErrorMsg('Error al registrar la orden. Puedes finalizar tu pedido directamente a través de nuestro WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-page section" style={{ backgroundColor: 'var(--color-crema)' }}>
      <div className="container">
        {/* Navegación de miga de pan */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '12px', color: 'var(--color-text-light)', marginBottom: '1.5rem' }}>
          <Link to="/" style={{ color: 'var(--color-text-muted)' }}>Inicio</Link>
          <ChevronRight size={12} />
          <Link to="/catalogo" style={{ color: 'var(--color-text-muted)' }}>Catálogo</Link>
          <ChevronRight size={12} />
          <strong style={{ color: 'var(--color-selva)' }}>Finalizar Compra</strong>
        </div>

        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="kicker">Tienda Oficial FRUITES</span>
          <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)' }}>Finalizar Pedido</h1>
          <p style={{ marginTop: '0.4rem', fontSize: '0.95rem', color: 'var(--color-text-muted)' }}>
            Completa tus datos de entrega para recibir tus snacks tropicales frescos y resellables.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
            alignItems: 'start',
          }}
        >
          {/* Formulario de Checkout */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '2.25rem',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <form onSubmit={handleSubmit}>
              {/* Paso 1: Datos de Contacto */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-selva)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'var(--color-selva)', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>1</span>
                  <span>Datos de Contacto</span>
                </h3>

                <div className="form-group">
                  <label className="form-label" htmlFor="nombre">Nombre y Apellido *</label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Carolina Méndez"
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Correo Electrónico *</label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="carolina@ejemplo.com"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="telefono">WhatsApp / Celular *</label>
                    <input
                      id="telefono"
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      placeholder="+57 300 123 4567"
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Paso 2: Dirección de Entrega */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-selva)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'var(--color-selva)', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>2</span>
                  <span>Dirección de Entrega</span>
                </h3>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="ciudad">Ciudad de Entrega *</label>
                    <select
                      id="ciudad"
                      name="ciudad"
                      value={formData.ciudad}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="Barranquilla">Barranquilla (Atlántico)</option>
                      <option value="Soledad">Soledad (Atlántico)</option>
                      <option value="Puerto Colombia">Puerto Colombia (Atlántico)</option>
                      <option value="Cartagena">Cartagena (Bolívar)</option>
                      <option value="Santa Marta">Santa Marta (Magdalena)</option>
                      <option value="Bogotá">Bogotá D.C.</option>
                      <option value="Medellín">Medellín (Antioquia)</option>
                      <option value="Cali">Cali (Valle del Cauca)</option>
                      <option value="Bucaramanga">Bucaramanga (Santander)</option>
                      <option value="Otra ciudad">Otra ciudad en Colombia</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" htmlFor="barrio">Barrio / Sector</label>
                    <input
                      id="barrio"
                      type="text"
                      name="barrio"
                      value={formData.barrio}
                      onChange={handleChange}
                      placeholder="Ej. Alto Prado / El Golf"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="direccion">Dirección exacta (Calle, Carrera, Número, Apto/Torre) *</label>
                  <input
                    id="direccion"
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    placeholder="Ej. Cra 53 # 82-45, Edificio Mirador Apto 602"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="indicaciones">Notas de entrega (opcional)</label>
                  <input
                    id="indicaciones"
                    type="text"
                    name="indicaciones"
                    value={formData.indicaciones}
                    onChange={handleChange}
                    placeholder="Ej. Dejar en portería o tocar timbre de la izquierda"
                    className="form-input"
                  />
                </div>
              </div>

              {/* Paso 3: Método de Pago */}
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.15rem', color: 'var(--color-selva)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: 'var(--color-selva)', color: '#ffffff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>3</span>
                  <span>Método de Pago</span>
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {/* Opción 1: Contra Entrega */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: formData.metodoPago === 'contraentrega' ? '2px solid var(--color-selva)' : '1px solid var(--color-border)',
                      backgroundColor: formData.metodoPago === 'contraentrega' ? '#F8FAF9' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      value="contraentrega"
                      checked={formData.metodoPago === 'contraentrega'}
                      onChange={handleChange}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Banknote size={17} color="var(--color-selva)" />
                        <strong style={{ fontSize: '0.95rem', color: 'var(--color-selva)' }}>
                          Pago Contra Entrega
                        </strong>
                        <span style={{ fontSize: '10px', backgroundColor: '#E8ECE9', padding: '1px 6px', borderRadius: '4px', fontWeight: 700 }}>
                          Barranquilla & Soledad
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                        Pagas en efectivo o con tarjeta al domiciliario cuando recibas tus snacks en tu puerta.
                      </p>
                    </div>
                  </label>

                  {/* Opción 2: Transferencia Nequi / Daviplata / Bancolombia */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: formData.metodoPago === 'transferencia' ? '2px solid var(--color-selva)' : '1px solid var(--color-border)',
                      backgroundColor: formData.metodoPago === 'transferencia' ? '#F8FAF9' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      value="transferencia"
                      checked={formData.metodoPago === 'transferencia'}
                      onChange={handleChange}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <CreditCard size={17} color="var(--color-selva)" />
                        <strong style={{ fontSize: '0.95rem', color: 'var(--color-selva)' }}>
                          Transferencia Nequi / Daviplata / Bancolombia
                        </strong>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                        Transfiere a la línea oficial <strong>{siteConfig.contact.whatsappNumber}</strong> y confirmamos tu despacho al instante.
                      </p>
                    </div>
                  </label>

                  {/* Opción 3: Coordinación vía WhatsApp */}
                  <label
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.85rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      border: formData.metodoPago === 'whatsapp' ? '2px solid #25D366' : '1px solid var(--color-border)',
                      backgroundColor: formData.metodoPago === 'whatsapp' ? '#F0FDF4' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="metodoPago"
                      value="whatsapp"
                      checked={formData.metodoPago === 'whatsapp'}
                      onChange={handleChange}
                      style={{ marginTop: '3px' }}
                    />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MessageCircle size={17} color="#25D366" />
                        <strong style={{ fontSize: '0.95rem', color: '#166534' }}>
                          Finalizar y Coordinar por WhatsApp
                        </strong>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '0.25rem 0 0 0' }}>
                        Envía el resumen de tu pedido a nuestro canal directo de WhatsApp para acordar entrega personalizada o pedidos especiales.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Casilla de aceptación de Habeas Data */}
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    name="aceptaTerminos"
                    checked={formData.aceptaTerminos}
                    onChange={handleChange}
                    required
                  />
                  <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    Acepto el tratamiento de mis datos personales para la gestión de este pedido conforme a la{' '}
                    <Link to="/privacidad" target="_blank" style={{ color: 'var(--color-selva)', textDecoration: 'underline' }}>
                      Política de Privacidad (Ley 1581 de 2012)
                    </Link>
                    .
                  </span>
                </label>
              </div>

              {errorMsg && (
                <div style={{ padding: '0.75rem', marginBottom: '1.25rem', backgroundColor: '#FDEEE9', color: '#B3261E', borderRadius: 'var(--radius-sm)', fontSize: '12px' }}>
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg btn-full"
                style={{ justifyContent: 'center' }}
              >
                <Lock size={17} />
                <span>{loading ? 'Procesando pedido...' : `Confirmar Pedido — ${formatCOP(total)}`}</span>
              </button>
            </form>
          </div>

          {/* Resumen del Pedido (Columna Lateral) */}
          <div>
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '2rem',
                border: '1px solid var(--color-border)',
                boxShadow: 'var(--shadow-sm)',
                marginBottom: '1.5rem',
              }}
            >
              <h3 style={{ fontSize: '1.15rem', color: 'var(--color-selva)', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #E8ECE9' }}>
                Resumen de tu Pedido ({items.length})
              </h3>

              {/* Lista de productos en checkout */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.5rem' }}>
                {items.map((item) => (
                  <div key={item.id} style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: 'var(--radius-sm)',
                        backgroundColor: item.colorPrincipal || '#F6C945',
                        overflow: 'hidden',
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={getAssetUrl(item.imagen)}
                        alt={item.nombre}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ fontSize: '13px', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--color-selva)' }}>
                        {item.nombre}
                      </strong>
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                        {item.quantity} x {item.gramaje}
                      </span>
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-selva)' }}>
                      {formatCOP(item.precio * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Desglose de totales */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #E8ECE9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  <span>Subtotal productos</span>
                  <span>{formatCOP(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#059669' }}>
                    <span>Descuento ({couponCode})</span>
                    <span>-{formatCOP(discount)}</span>
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-text-muted)' }}>
                  <span>Costo de envío</span>
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
                    fontSize: '1.25rem',
                    fontWeight: 800,
                    color: 'var(--color-selva)',
                    paddingTop: '0.75rem',
                    borderTop: '2px solid var(--color-selva)',
                    marginTop: '0.5rem',
                  }}
                >
                  <span>Total a Pagar</span>
                  <span>{formatCOP(total)}</span>
                </div>
              </div>
            </div>

            {/* Sellos de Confianza y Garantía */}
            <div
              style={{
                backgroundColor: 'var(--color-selva)',
                color: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <ShieldCheck size={18} color="var(--color-mango)" />
                <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>Garantía FRUITES</strong>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '12px', color: 'rgba(255,255,255,0.85)' }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={14} color="var(--color-mango)" />
                  <span>Snacks de fruta tropical en empaque pouch resellable.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={14} color="var(--color-mango)" />
                  <span>Despacho directo desde Barranquilla a toda Colombia.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle size={14} color="var(--color-mango)" />
                  <span>Soporte y atención inmediata vía WhatsApp.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

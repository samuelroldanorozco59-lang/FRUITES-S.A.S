import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Send,
  CheckCircle,
  Instagram,
} from 'lucide-react';
import { siteConfig } from '../data/siteConfig.js';
import { sendContactMessage } from '../services/messagesService.js';

/**
 * ============================================================================
 * PÁGINA DE CONTACTO — FRUITES
 * ============================================================================
 * Formulario de contacto real con validaciones, protección anti-spam,
 * canales directos de WhatsApp / correo y ubicación en Barranquilla, Colombia.
 * ============================================================================
 */
export default function Contact() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    whatsapp: '',
    tipo_contacto: 'Consumidor',
    nombre_negocio: '',
    mensaje: '',
    acepta_privacidad: false,
    honeypot: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.nombre.trim() || !formData.email.trim() || !formData.mensaje.trim()) {
      setErrorMsg('Por favor completa todos los campos obligatorios (*).');
      return;
    }

    if (formData.tipo_contacto === 'Negocio' && !formData.nombre_negocio.trim()) {
      setErrorMsg('Por favor indica el nombre de tu negocio.');
      return;
    }

    if (!formData.acepta_privacidad) {
      setErrorMsg('Debes aceptar el tratamiento de datos para enviar el formulario.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendContactMessage(formData);
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg('No se pudo enviar el mensaje. Intenta de nuevo o contáctanos por WhatsApp.');
      }
    } catch (err) {
      setErrorMsg('Error al conectar. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Enlace directo a WhatsApp con mensaje predeterminado
  const waDirectLink = `https://wa.me/${siteConfig.contact.whatsappClean}?text=${encodeURIComponent(
    formData.mensaje
      ? `¡Hola FRUITES! Mi nombre es ${formData.nombre || 'un interesado'}: ${formData.mensaje}`
      : '¡Hola FRUITES! Quisiera información directa sobre sus snacks de frutas.'
  )}`;

  return (
    <div className="contact-page section" style={{ backgroundColor: 'var(--color-crema)' }}>
      <div className="container">
        {/* Encabezado */}
        <div className="section-header text-center">
          <span className="kicker">Hablemos</span>
          <h1>Contacto Directo</h1>
          <p style={{ marginTop: '0.75rem', fontSize: 'var(--text-lg)' }}>
            ¿Tienes dudas, sugerencias o quieres ser parte de la validación inicial de FRUITES? Escríbenos.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Canales directos e información */}
          <div>
            <div
              style={{
                backgroundColor: 'var(--color-selva)',
                color: '#ffffff',
                borderRadius: 'var(--radius-xl)',
                padding: '2.5rem 2rem',
                marginBottom: '2rem',
              }}
            >
              <h3 style={{ color: '#ffffff', fontSize: 'var(--text-xl)', marginBottom: '1rem' }}>
                Canales de Atención
              </h3>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'var(--text-sm)', lineHeight: 1.6, marginBottom: '2rem' }}>
                Atendemos de manera cercana y directa a consumidores y comercios desde Barranquilla, Atlántico.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsappClean}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', color: '#ffffff' }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MessageCircle size={20} color="#ffffff" />
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', display: 'block' }}>WhatsApp Oficial</span>
                    <strong style={{ fontSize: 'var(--text-sm)' }}>{siteConfig.contact.whatsappNumber}</strong>
                  </div>
                </a>

                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', color: '#ffffff' }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Mail size={18} color="var(--color-mango)" />
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', display: 'block' }}>Correo Electrónico</span>
                    <strong style={{ fontSize: 'var(--text-sm)' }}>{siteConfig.contact.email}</strong>
                  </div>
                </a>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', color: '#ffffff' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <MapPin size={18} color="var(--color-coral)" />
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', display: 'block' }}>Ubicación</span>
                    <strong style={{ fontSize: 'var(--text-sm)' }}>{siteConfig.originCity}, Colombia</strong>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', color: '#ffffff' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Clock size={18} color="var(--color-lima)" />
                  </div>
                  <div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.7)', display: 'block' }}>Horario de Atención</span>
                    <strong style={{ fontSize: 'var(--text-sm)' }}>{siteConfig.contact.businessHours}</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario real */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '2.5rem',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <CheckCircle size={48} color="var(--color-selva)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '0.75rem' }}>¡Mensaje Enviado!</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                  Hemos recibido tu mensaje correctamente. Te responderemos al correo proporcionado en el menor tiempo posible.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      nombre: '',
                      email: '',
                      whatsapp: '',
                      tipo_contacto: 'Consumidor',
                      nombre_negocio: '',
                      mensaje: '',
                      acepta_privacidad: false,
                      honeypot: '',
                    });
                  }}
                  className="btn btn-secondary btn-sm"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '1.25rem' }}>Envíanos un mensaje</h3>

                {/* Honeypot anti-spam */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="form-group">
                  <label className="form-label" htmlFor="nombre">
                    Nombre completo *
                  </label>
                  <input
                    id="nombre"
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    placeholder="Tu nombre"
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Correo electrónico *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="tu@correo.com"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="whatsapp">
                      WhatsApp (opcional)
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+57 324 903 7227"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="tipo_contacto">
                    Tipo de contacto *
                  </label>
                  <select
                    id="tipo_contacto"
                    name="tipo_contacto"
                    value={formData.tipo_contacto}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="Consumidor">Soy consumidor (deseo probar FRUITES)</option>
                    <option value="Negocio">Tengo un negocio (café, gimnasio, tienda o empresa)</option>
                    <option value="Otro">Otro asunto</option>
                  </select>
                </div>

                {formData.tipo_contacto === 'Negocio' && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="nombre_negocio">
                      Nombre de tu negocio o punto de venta *
                    </label>
                    <input
                      id="nombre_negocio"
                      type="text"
                      name="nombre_negocio"
                      value={formData.nombre_negocio}
                      onChange={handleChange}
                      required
                      placeholder="Ej. Café Botánica"
                      className="form-input"
                    />
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label" htmlFor="mensaje">
                    Mensaje *
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows={4}
                    required
                    placeholder="Escribe tu mensaje o consulta..."
                    className="form-textarea"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                  <label className="form-checkbox-label">
                    <input
                      type="checkbox"
                      name="acepta_privacidad"
                      checked={formData.acepta_privacidad}
                      onChange={handleChange}
                      required
                    />
                    <span>
                      Acepto el tratamiento de datos personales conforme a la{' '}
                      <Link to="/privacidad" style={{ textDecoration: 'underline', color: 'var(--color-selva)' }}>
                        Política de Privacidad
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                {errorMsg && (
                  <div style={{ padding: '0.65rem 0.85rem', marginBottom: '1rem', backgroundColor: '#FDEEE9', color: '#B3261E', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>
                    {errorMsg}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-full"
                  >
                    <Send size={16} />
                    <span>{loading ? 'Enviando...' : 'Enviar formulario'}</span>
                  </button>

                  <a
                    href={waDirectLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-whatsapp btn-full"
                  >
                    <MessageCircle size={16} />
                    <span>O abrir WhatsApp con este mensaje</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

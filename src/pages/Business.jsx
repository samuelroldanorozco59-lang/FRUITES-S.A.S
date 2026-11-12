import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  TrendingUp,
  Package,
  Layers,
  ArrowRight,
  MessageCircle,
  CheckCircle,
  Send,
} from 'lucide-react';
import { siteConfig } from '../data/siteConfig.js';
import { sendContactMessage } from '../services/messagesService.js';

/**
 * ============================================================================
 * PÁGINA PARA NEGOCIOS (B2B) — FRUITES
 * ============================================================================
 * Enfocada en gimnasios, cafés, tiendas saludables y empresas.
 * Explica cómo trabajamos en 4 pasos y contiene el formulario B2B preseleccionado.
 * ============================================================================
 */
export default function Business() {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    whatsapp: '',
    tipo_contacto: 'Negocio',
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

    if (!formData.nombre.trim() || !formData.email.trim() || !formData.nombre_negocio.trim()) {
      setErrorMsg('Por favor completa tu nombre, correo y el nombre de tu negocio.');
      return;
    }

    if (!formData.acepta_privacidad) {
      setErrorMsg('Debes aceptar la política de tratamiento de datos para continuar.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendContactMessage(formData);
      if (res.success) {
        setSubmitted(true);
      } else {
        setErrorMsg('Ocurrió un error al enviar tu solicitud. Intenta nuevamente o contáctanos por WhatsApp.');
      }
    } catch (err) {
      setErrorMsg('Error de conexión. Puedes escribirnos directamente por WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const waB2bMsg = encodeURIComponent(
    '¡Hola equipo FRUITES! Tengo un negocio y me gustaría recibir su catálogo comercial y condiciones para comercializar sus snacks.'
  );
  const waLink = `https://wa.me/${siteConfig.contact.whatsappClean}?text=${waB2bMsg}`;

  return (
    <div className="business-page">
      {/* Hero B2B */}
      <section
        style={{
          paddingTop: '4rem',
          paddingBottom: '4rem',
          backgroundColor: 'var(--color-selva)',
          color: '#ffffff',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '780px' }}>
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
              Alianzas Comerciales
            </span>
            <h1 style={{ color: '#ffffff', marginBottom: '1.25rem', fontSize: 'clamp(2.2rem, 4vw, 3.2rem)' }}>
              {siteConfig.b2b.heroTitle}
            </h1>
            <p
              style={{
                fontSize: 'var(--text-lg)',
                color: 'rgba(255, 255, 255, 0.85)',
                lineHeight: 1.6,
                marginBottom: '2rem',
              }}
            >
              {siteConfig.b2b.heroDescription}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
              <button
                type="button"
                onClick={() => {
                  document.getElementById('formulario-b2b')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn btn-primary btn-lg"
              >
                <span>Solicitar catálogo y muestras</span>
                <ArrowRight size={18} />
              </button>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-lg"
              >
                <MessageCircle size={18} />
                <span>Hablar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Qué busca un negocio y formatos */}
      <section className="section" style={{ backgroundColor: 'var(--color-crema)' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="kicker">Propuesta de Valor Comercial</span>
            <h2>¿Por qué incluir FRUITES en tu comercio?</h2>
            <p style={{ marginTop: '0.75rem' }}>
              Desarrollamos una alternativa que responde a las necesidades reales del punto de venta.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.75rem',
            }}
          >
            {siteConfig.b2b.targetAudiences.map((aud, i) => (
              <div
                key={i}
                className="card card-solid"
                style={{ padding: '2rem 1.5rem', height: '100%' }}
              >
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    backgroundColor: 'var(--color-crema)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <Store size={20} color="var(--color-selva)" />
                </div>
                <h4 style={{ fontSize: 'var(--text-base)', marginBottom: '0.5rem' }}>
                  {aud.title}
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {aud.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo trabajamos (Los 4 pasos de la sección 8) */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="section-header text-center">
            <span className="kicker">Proceso Claro y Transparente</span>
            <h2>Cómo trabajamos con tu negocio</h2>
            <p style={{ marginTop: '0.75rem' }}>
              Sin mínimos exagerados ni promesas irreales. Iniciamos paso a paso para validar la rotación.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '2rem',
            }}
          >
            {siteConfig.b2b.steps.map((st) => (
              <div
                key={st.step}
                className="card"
                style={{
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '2rem 1.5rem',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--color-mango)',
                    fontWeight: 800,
                    marginBottom: '0.75rem',
                    display: 'block',
                  }}
                >
                  PASO {st.step}
                </span>
                <h4 style={{ fontSize: 'var(--text-lg)', marginBottom: '0.5rem' }}>
                  {st.title}
                </h4>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>
                  {st.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulario de contacto B2B */}
      <section id="formulario-b2b" className="section" style={{ backgroundColor: 'var(--color-crema)' }}>
        <div className="container-narrow">
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-xl)',
              padding: '3rem 2.5rem',
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <span className="kicker">Contacto Comercial</span>
              <h2 style={{ fontSize: 'var(--text-2xl)' }}>
                Hablemos de tu negocio
              </h2>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
                Completa tus datos y te responderemos desde Barranquilla con la información comercial inicial.
              </p>
            </div>

            {submitted ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2.5rem 1rem',
                  backgroundColor: 'var(--color-crema-light)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--color-lima)',
                }}
              >
                <CheckCircle size={44} color="var(--color-selva)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '0.5rem' }}>
                  ¡Mensaje recibido con éxito!
                </h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
                  Gracias por tu interés en FRUITES. Nos pondremos en contacto contigo vía correo o WhatsApp para compartirte el catálogo comercial.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({
                      nombre: '',
                      email: '',
                      whatsapp: '',
                      tipo_contacto: 'Negocio',
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
                {/* Campo oculto Honeypot anti-spam */}
                <input
                  type="text"
                  name="honeypot"
                  value={formData.honeypot}
                  onChange={handleChange}
                  style={{ display: 'none' }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="nombre">
                      Tu nombre y apellido *
                    </label>
                    <input
                      id="nombre"
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      required
                      placeholder="Ej. Carlos Valencia"
                      className="form-input"
                    />
                  </div>

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
                      placeholder="Ej. Café & Fitness Barranquilla"
                      className="form-input"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">
                      Correo electrónico corporativo / comercial *
                    </label>
                    <input
                      id="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="carlos@negocio.com"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" htmlFor="whatsapp">
                      WhatsApp de contacto (opcional)
                    </label>
                    <input
                      id="whatsapp"
                      type="tel"
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      placeholder="+57 300 123 4567"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="mensaje">
                    Cuéntanos sobre tu negocio, ciudad y qué sabores te llaman la atención
                  </label>
                  <textarea
                    id="mensaje"
                    name="mensaje"
                    value={formData.mensaje}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Nos encontramos en Barranquilla y tenemos un flujo de 150 clientes diarios en el mostrador..."
                    className="form-textarea"
                  />
                </div>

                {/* Casilla de aceptación de tratamiento de datos personales */}
                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-checkbox-label">
                    <input
                      type="checkbox"
                      name="acepta_privacidad"
                      checked={formData.acepta_privacidad}
                      onChange={handleChange}
                      required
                    />
                    <span>
                      Acepto el tratamiento de mis datos personales para recibir información comercial de FRUITES, conforme a la{' '}
                      <Link to="/privacidad" style={{ textDecoration: 'underline', color: 'var(--color-selva)' }}>
                        Política de Privacidad
                      </Link>
                      .
                    </span>
                  </label>
                </div>

                {errorMsg && (
                  <div style={{ padding: '0.75rem', marginBottom: '1.25rem', backgroundColor: '#FDEEE9', color: '#B3261E', borderRadius: 'var(--radius-sm)', fontSize: 'var(--text-xs)' }}>
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-selva btn-lg btn-full"
                >
                  <Send size={18} />
                  <span>{loading ? 'Enviando solicitud...' : 'Enviar solicitud de información comercial'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

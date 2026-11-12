import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Mail, Instagram, MapPin, Shield } from 'lucide-react';
import Logo from './Logo.jsx';
import { siteConfig } from '../data/siteConfig.js';

/**
 * ============================================================================
 * PIE DE PÁGINA (FOOTER) — FRUITES
 * ============================================================================
 * Elegante, con identidad caribeña sobria, redes oficiales, contacto,
 * aviso legal obligatorio y enlace discreto al panel de administración.
 * ============================================================================
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'var(--color-selva)',
        color: '#FFFFFF',
        paddingTop: '4.5rem',
        paddingBottom: '2.5rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        {/* Rejilla principal del footer */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '3rem',
            paddingBottom: '3rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
          }}
        >
          {/* Columna 1: Marca y propósito */}
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <Logo size="medium" light={true} />
            </div>
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: 'var(--text-sm)',
                lineHeight: 1.6,
                marginBottom: '1.5rem',
              }}
            >
              {siteConfig.tagline}
              <br />
              Snacks de frutas tropicales deshidratadas en bolsa resellable. Una experiencia de fruta pensada para acompañar tu día a día.
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: 'var(--text-xs)',
                color: 'rgba(255, 255, 255, 0.65)',
              }}
            >
              <MapPin size={15} color="var(--color-mango)" />
              <span>{siteConfig.originCity}, {siteConfig.originCountry}</span>
            </div>
          </div>

          {/* Columna 2: Navegación del sitio */}
          <div>
            <h4
              style={{
                color: 'var(--color-mango)',
                fontSize: 'var(--text-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}
            >
              Explorar
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/catalogo" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'var(--text-sm)' }}>
                  Colección Tropical
                </Link>
              </li>
              <li>
                <Link to="/tiendas" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'var(--text-sm)' }}>
                  Puntos de Venta (Mapa)
                </Link>
              </li>
              <li>
                <Link to="/recetas" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'var(--text-sm)' }}>
                  Recetas & Blog Frutal
                </Link>
              </li>
              <li>
                <Link to="/nosotros" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'var(--text-sm)' }}>
                  Nuestra Historia
                </Link>
              </li>
              <li>
                <Link to="/negocios" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'var(--text-sm)' }}>
                  Para Negocios y Cafés
                </Link>
              </li>
              <li>
                <Link to="/asistente" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'var(--text-sm)' }}>
                  Recomendador de Sabores (IA)
                </Link>
              </li>
              <li>
                <Link to="/contacto" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'var(--text-sm)' }}>
                  Formulario de Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Sabores de la Colección */}
          <div>
            <h4
              style={{
                color: 'var(--color-mango)',
                fontSize: 'var(--text-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}
            >
              Sabores
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <li>
                <Link to="/catalogo/mango-tropical" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'var(--text-sm)' }}>
                  Mango Tropical
                </Link>
              </li>
              <li>
                <Link to="/catalogo/pina-dorada" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'var(--text-sm)' }}>
                  Piña Dorada
                </Link>
              </li>
              <li>
                <Link to="/catalogo/papaya-caribe" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'var(--text-sm)' }}>
                  Papaya Caribe
                </Link>
              </li>
              <li>
                <Link to="/catalogo/banano-crujiente" style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'var(--text-sm)' }}>
                  Banano Tropical
                </Link>
              </li>
              <li style={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: 'var(--text-xs)', marginTop: '0.4rem' }}>
                Próximamente: Mezclas y semillas
              </li>
            </ul>
          </div>

          {/* Columna 4: Contacto y redes */}
          <div>
            <h4
              style={{
                color: 'var(--color-mango)',
                fontSize: 'var(--text-sm)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '1.25rem',
              }}
            >
              Conectar
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsappClean}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                <MessageCircle size={16} color="#25D366" />
                <span>WhatsApp: {siteConfig.contact.whatsappNumber}</span>
              </a>

              <a
                href={`mailto:${siteConfig.contact.email}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                <Mail size={16} color="var(--color-mango)" />
                <span>{siteConfig.contact.email}</span>
              </a>

              <a
                href={siteConfig.contact.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.6rem',
                  color: 'rgba(255, 255, 255, 0.85)',
                  fontSize: 'var(--text-sm)',
                }}
              >
                <Instagram size={16} color="var(--color-coral)" />
                <span>Instagram: {siteConfig.contact.instagram}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Fila inferior con aviso legal obligatorio y enlaces secundarios */}
        <div
          style={{
            paddingTop: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            fontSize: 'var(--text-xs)',
            color: 'rgba(255, 255, 255, 0.6)',
          }}
        >
          {/* Nota legal requerida en sección 2 */}
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: 'rgba(0, 0, 0, 0.18)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'rgba(255, 255, 255, 0.75)',
              textAlign: 'center',
            }}
          >
            <span>{siteConfig.legalFooterNote}</span>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
            }}
          >
            <div>
              © {currentYear} {siteConfig.brandName}. Todos los derechos reservados. Barranquilla, Colombia.
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <Link
                to="/privacidad"
                style={{ color: 'rgba(255, 255, 255, 0.6)' }}
              >
                Política de Privacidad
              </Link>
              <span>·</span>
              {/* Enlace discreto al panel de administración como se pide en sección 4 */}
              <Link
                to="/admin/login"
                style={{
                  color: 'rgba(255, 255, 255, 0.45)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                <Shield size={12} />
                <span>Acceso Admin</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

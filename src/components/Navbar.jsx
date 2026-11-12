import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageCircle, Sparkles, ShoppingBag, Shield } from 'lucide-react';
import Logo from './Logo.jsx';
import { siteConfig } from '../data/siteConfig.js';
import { useCart } from '../context/CartContext.jsx';

/**
 * ============================================================================
 * BARRA DE NAVEGACIÓN PRINCIPAL (NAVBAR) — FRUITES
 * ============================================================================
 * Enlaces: Inicio, Colección, Puntos de Venta (Mapa), Recetas & Blog,
 * Nosotros, Para Negocios, Asistente IA, Contacto.
 * Incluye botón de carrito de compras con contador en tiempo real y acceso admin.
 * ============================================================================
 */
export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const location = useLocation();
  const { totalCount, openCart } = useCart();

  useEffect(() => {
    setIsAdminLoggedIn(Boolean(localStorage.getItem('fruites_admin_session')));
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Inicio', path: '/' },
    { label: 'Colección', path: '/catalogo' },
    { label: 'Puntos de Venta', path: '/tiendas' },
    { label: 'Recetas', path: '/recetas' },
    { label: 'Nosotros', path: '/nosotros' },
    { label: 'Para Negocios', path: '/negocios' },
    { label: 'Asistente IA', path: '/asistente', isAi: true },
    { label: 'Contacto', path: '/contacto' },
  ];

  const waLink = `https://wa.me/${siteConfig.contact.whatsappClean}?text=${encodeURIComponent(
    '¡Hola FRUITES! Quisiera conocer más sobre sus snacks de frutas tropicales.'
  )}`;

  return (
    <>
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          backgroundColor: scrolled ? 'rgba(247, 241, 230, 0.96)' : 'var(--color-crema)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${scrolled ? 'rgba(24, 61, 50, 0.1)' : 'transparent'}`,
          transition: 'all var(--transition-fast)',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            height: '74px',
          }}
        >
          {/* Zona 1: Wordmark */}
          <Link
            to="/"
            style={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0,
            }}
            aria-label="Ir al inicio de FRUITES"
          >
            <Logo size="medium" />
          </Link>

          {/* Zona 2: Enlaces Desktop */}
          <nav
            style={{
              display: 'none',
              alignItems: 'center',
              gap: '1.25rem',
            }}
            className="desktop-nav"
          >
            {navLinks.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '0.85rem',
                    fontWeight: isActive ? 700 : 600,
                    color: isActive ? 'var(--color-selva)' : 'var(--color-text-muted)',
                    position: 'relative',
                    whiteSpace: 'nowrap',
                    padding: '0.4rem 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                  }}
                >
                  {item.isAi && <Sparkles size={13} color="var(--color-mango)" />}
                  <span>{item.label}</span>
                  {isActive && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '2px',
                        backgroundColor: 'var(--color-mango)',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Zona 3: Carrito y CTAs */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              flexShrink: 0,
            }}
          >
            {/* Botón Carrito de Compras */}
            <button
              type="button"
              onClick={openCart}
              aria-label={`Ver carrito de compras con ${totalCount} artículos`}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: totalCount > 0 ? 'var(--color-mango)' : 'rgba(24, 61, 50, 0.08)',
                color: 'var(--color-selva)',
                border: 'none',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
              }}
              title="Abrir Carrito de Compras"
            >
              <ShoppingBag size={20} />
              {totalCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-3px',
                    right: '-3px',
                    backgroundColor: 'var(--color-selva)',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 800,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #ffffff',
                  }}
                >
                  {totalCount > 99 ? '99+' : totalCount}
                </span>
              )}
            </button>

            {/* Acceso Rápido Administrador */}
            {isAdminLoggedIn && (
              <Link
                to="/admin/dashboard"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  padding: '0.45rem 0.85rem',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: 'var(--color-selva)',
                  color: '#ffffff',
                  fontSize: '11px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  boxShadow: 'var(--shadow-sm)',
                }}
                title="Ir a tu Panel de Gestión Privado"
              >
                <Shield size={13} color="var(--color-mango)" />
                <span>Panel Admin</span>
              </Link>
            )}

            {/* Botón WhatsApp */}
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-whatsapp btn-sm"
              style={{ display: 'none' }}
              id="desktop-cta"
            >
              <MessageCircle size={15} />
              <span>WhatsApp</span>
            </a>

            {/* Toggle Móvil */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(24, 61, 50, 0.05)',
                border: '1px solid rgba(24, 61, 50, 0.1)',
                color: 'var(--color-selva)',
                cursor: 'pointer',
              }}
              className="mobile-toggle"
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Menú móvil */}
        {isOpen && (
          <div
            style={{
              backgroundColor: 'var(--color-crema)',
              borderBottom: '1px solid var(--color-border)',
              padding: '1.5rem',
              boxShadow: 'var(--shadow-lg)',
            }}
            className="mobile-drawer"
          >
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {navLinks.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'var(--text-base)',
                    fontWeight: location.pathname === item.path ? 800 : 600,
                    color: location.pathname === item.path ? 'var(--color-selva)' : 'var(--color-text-muted)',
                    padding: '0.4rem 0',
                    borderBottom: '1px solid var(--color-border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  {item.isAi && <Sparkles size={16} color="var(--color-mango)" />}
                  <span>{item.label}</span>
                </Link>
              ))}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    openCart();
                  }}
                  className="btn btn-primary btn-full"
                  style={{ justifyContent: 'center' }}
                >
                  <ShoppingBag size={18} />
                  <span>Ver Carrito ({totalCount})</span>
                </button>
              </div>

              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp btn-full"
                style={{ marginTop: '0.25rem' }}
              >
                <MessageCircle size={18} />
                <span>Pedir por WhatsApp</span>
              </a>

              {isAdminLoggedIn && (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-selva btn-full"
                  style={{ justifyContent: 'center', marginTop: '0.5rem', fontSize: 'var(--text-xs)' }}
                >
                  <Shield size={16} color="var(--color-mango)" />
                  <span>Ir a mi Panel de Control Admin</span>
                </Link>
              )}
            </nav>
          </div>
        )}
      </header>

      <style>{`
        @media (min-width: 1040px) {
          .desktop-nav {
            display: flex !important;
          }
          #desktop-cta {
            display: inline-flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
          .mobile-drawer {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

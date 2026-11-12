import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Mail, Lock, Eye, EyeOff, ArrowRight, AlertTriangle, CheckCircle, KeyRound, Sparkles } from 'lucide-react';
import {
  authenticateAdmin,
  PRIMARY_ADMIN_EMAIL,
  DEFAULT_ADMIN_PASS,
  checkRateLimit,
} from '../services/adminAuthService.js';
import Logo from '../components/Logo.jsx';

/**
 * ============================================================================
 * ACCESO EXCLUSIVO AL PANEL DE ADMINISTRACIÓN — FRUITES
 * ============================================================================
 * Administrador Autorizado: Samuel Roldán Orozco (samuelroldanorozco59@gmail.com)
 * ============================================================================
 */
export default function AdminLogin() {
  const [email, setEmail] = useState(PRIMARY_ADMIN_EMAIL);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const navigate = useNavigate();

  // Verificar si hay bloqueo por fuerza bruta
  useEffect(() => {
    const status = checkRateLimit();
    if (!status.allowed) {
      setLockoutSeconds(status.remainingTime);
      const timer = setInterval(() => {
        setLockoutSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const session = await authenticateAdmin(email, password);
      setSuccess(`¡Bienvenido de nuevo, ${session.name}! Redirigiendo a tu panel...`);
      setTimeout(() => {
        navigate('/admin/dashboard');
      }, 800);
    } catch (err) {
      setError(err.message || 'Error de autenticación. Verifica tus datos.');
      const status = checkRateLimit();
      if (!status.allowed) {
        setLockoutSeconds(status.remainingTime);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLoginAsSamuel = () => {
    setEmail(PRIMARY_ADMIN_EMAIL);
    setPassword(DEFAULT_ADMIN_PASS);
  };

  return (
    <div
      style={{
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        backgroundColor: 'var(--color-crema)',
      }}
    >
      <div
        className="card"
        style={{
          width: '100%',
          maxWidth: '460px',
          padding: '2.5rem 2rem',
          backgroundColor: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          boxShadow: '0 10px 30px rgba(24, 61, 50, 0.08)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Cabecera con Logo e Identidad */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Logo size="medium" />
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(24, 61, 50, 0.06)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              marginTop: '1.25rem',
              marginBottom: '0.5rem',
            }}
          >
            <Shield size={14} color="var(--color-selva)" />
            <span
              style={{
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 700,
                color: 'var(--color-selva)',
                letterSpacing: '0.05em',
              }}
            >
              ZONA DE GESTIÓN PRIVADA
            </span>
          </div>

          <h1 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-selva)', margin: '0.25rem 0' }}>
            Acceso Administrador
          </h1>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            Panel de control exclusivo de pedidos, catálogo y contenidos de FRUITES
          </p>
        </div>

        {/* Tarjeta de Administrador Oficial */}
        <div
          style={{
            padding: '0.9rem 1rem',
            backgroundColor: 'var(--color-crema)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
          }}
        >
          <div>
            <span style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 800, color: 'var(--color-coral)', letterSpacing: '0.05em', display: 'block' }}>
              Administrador Designado
            </span>
            <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-selva)' }}>
              Samuel Roldán Orozco
            </strong>
            <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
              {PRIMARY_ADMIN_EMAIL}
            </div>
          </div>

          <button
            type="button"
            onClick={handleQuickLoginAsSamuel}
            className="btn btn-sm btn-secondary"
            style={{ fontSize: '10.5px', padding: '0.35rem 0.65rem', whiteSpace: 'nowrap' }}
            title="Autocompletar credenciales maestras iniciales"
          >
            <Sparkles size={12} color="var(--color-mango)" />
            <span>Autocompletar</span>
          </button>
        </div>

        {/* Mensaje de Bloqueo por Fuerza Bruta */}
        {lockoutSeconds > 0 && (
          <div
            style={{
              padding: '0.85rem',
              backgroundColor: '#FDEEE9',
              border: '1px solid #F5C2C7',
              color: '#842029',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-xs)',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <AlertTriangle size={16} />
            <span>Acceso pausado por seguridad. Espera {lockoutSeconds} segundos para reintentar.</span>
          </div>
        )}

        {/* Formulario de Login */}
        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label className="form-label" htmlFor="admin-email" style={{ fontSize: 'var(--text-xs)' }}>
              Correo Electrónico de Administrador
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="samuelroldanorozco59@gmail.com"
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
                disabled={lockoutSeconds > 0 || loading}
              />
              <Mail
                size={16}
                color="var(--color-text-light)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="admin-password" style={{ fontSize: 'var(--text-xs)' }}>
                Contraseña de Administrador
              </label>
              <button
                type="button"
                onClick={handleQuickLoginAsSamuel}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--color-coral)',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                ¿Clave inicial?
              </button>
            </div>

            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
                className="form-input"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                disabled={lockoutSeconds > 0 || loading}
              />
              <Lock
                size={16}
                color="var(--color-text-light)"
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-light)',
                  padding: '4px',
                }}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <span style={{ fontSize: '10.5px', color: 'var(--color-text-light)', marginTop: '0.35rem', display: 'block' }}>
              * Clave inicial por defecto: <code style={{ backgroundColor: 'var(--color-crema)', padding: '1px 4px', borderRadius: '3px' }}>SamuelAdmin2026!</code> (la puedes cambiar dentro del panel).
            </span>
          </div>

          {error && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#FDEEE9',
                color: '#B3261E',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <AlertTriangle size={15} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div
              style={{
                padding: '0.75rem',
                backgroundColor: '#D1E7DD',
                color: '#0F5132',
                borderRadius: 'var(--radius-sm)',
                fontSize: 'var(--text-xs)',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <CheckCircle size={15} />
              <span>{success}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || lockoutSeconds > 0}
            className="btn btn-selva btn-lg btn-full"
            style={{ marginTop: '0.5rem' }}
          >
            <KeyRound size={16} />
            <span>{loading ? 'Validando credenciales...' : 'Entrar a mi Panel de Control'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        {/* Pie informativo */}
        <div
          style={{
            marginTop: '2rem',
            paddingTop: '1.25rem',
            borderTop: '1px solid var(--color-border-subtle)',
            textAlign: 'center',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-light)',
          }}
        >
          <div style={{ marginBottom: '0.75rem' }}>
            🔒 <strong>Acceso protegido:</strong> Solo el administrador tiene permiso para ver pedidos y modificar el catálogo.
          </div>
          <Link
            to="/"
            style={{
              color: 'var(--color-selva)',
              fontWeight: 600,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            ← Volver a la tienda pública de FRUITES
          </Link>
        </div>
      </div>
    </div>
  );
}

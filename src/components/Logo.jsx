import React from 'react';

/**
 * ============================================================================
 * LOGOTIPO FRUITES (Wordmark tipográfico con intervención gráfica)
 * ============================================================================
 * Tipografía robusta, compacta y ligeramente redondeada, con una intervención
 * en el detalle frutal y la terminación de la marca FRUITES.
 * ============================================================================
 */
export default function Logo({ size = 'medium', light = false, className = '' }) {
  const sizeStyles = {
    small: { fontSize: '1.25rem', height: '28px' },
    medium: { fontSize: '1.65rem', height: '36px' },
    large: { fontSize: '2.4rem', height: '52px' },
  }[size] || { fontSize: '1.65rem', height: '36px' };

  const textColor = light ? '#FFFFFF' : '#183D32';
  const accentColor = '#F6C945'; // Amarillo mango

  return (
    <div
      className={`fruites-logo ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        fontFamily: 'var(--font-display, "Plus Jakarta Sans", sans-serif)',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        lineHeight: 1,
        userSelect: 'none',
        ...sizeStyles,
      }}
      aria-label="FRUITES Logo"
    >
      <span style={{ color: textColor }}>FRUIT</span>
      <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ color: accentColor }}>ES</span>
        {/* Intervención gráfica sutil: gajo/semilla estilizada sobre la E */}
        <svg
          viewBox="0 0 24 24"
          width="0.45em"
          height="0.45em"
          style={{
            position: 'absolute',
            top: '-0.25em',
            right: '0.1em',
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        >
          <path
            d="M12 2C7 2 3 7 3 12C3 17 7 21 12 21C14 21 17 19 19 16C21 13 21 7 12 2Z"
            fill={accentColor}
            stroke={textColor}
            strokeWidth="1.5"
          />
          <circle cx="11" cy="12" r="1.5" fill={textColor} />
        </svg>
      </span>
    </div>
  );
}

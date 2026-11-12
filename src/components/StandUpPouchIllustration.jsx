import React from 'react';

/**
 * ============================================================================
 * ILUSTRACIÓN VECTORIAL: BOLSA STAND-UP POUCH RESELLABLE
 * ============================================================================
 * Ilustración SVG propia con forma de bolsa pouch para snacks deshidratados,
 * pliegues superiores, muesca de apertura (tear notch), línea zipper,
 * ventana transparente y trozos de fruta estilizados según el sabor.
 * ============================================================================
 */
export default function StandUpPouchIllustration({
  fruta = 'Mango',
  colorPrincipal = '#F6C945',
  colorAcento = '#183D32',
  className = '',
  size = 320,
}) {
  // Configuración de fruta y rodajas visibles en la ventana transparente
  const fruitConfigs = {
    Mango: {
      tag: 'MANGO',
      subtitle: 'TIRAS TROPICALES',
      sliceColor: '#F4A926',
      sliceDetail: '#E37A17',
    },
    Piña: {
      tag: 'PIÑA',
      subtitle: 'RODAJAS DORADAS',
      sliceColor: '#F7C934',
      sliceDetail: '#D49E10',
    },
    Papaya: {
      tag: 'PAPAYA',
      subtitle: 'TIRAS CARIBE',
      sliceColor: '#F07A60',
      sliceDetail: '#D75135',
    },
    Banano: {
      tag: 'BANANO',
      subtitle: 'CHIPS NATURALES',
      sliceColor: '#E6D385',
      sliceDetail: '#BFA849',
    },
  };

  const current = fruitConfigs[fruta] || fruitConfigs['Mango'];

  return (
    <div
      className={`pouch-wrapper ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '100%',
        height: 'auto',
      }}
    >
      <svg
        viewBox="0 0 280 380"
        width={size}
        height={(size * 380) / 280}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ filter: 'drop-shadow(0 12px 28px rgba(24, 61, 50, 0.12))' }}
        role="img"
        aria-label={`Bolsa pouch de snack FRUITES sabor ${fruta}`}
      >
        <defs>
          <linearGradient id={`pouchGrad-${fruta}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="45%" stopColor="#F8F5EE" />
            <stop offset="100%" stopColor="#EDE5D4" />
          </linearGradient>

          <filter id={`windowShine-${fruta}`} x="0%" y="0%" width="100%" height="100%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="rgba(24, 61, 50, 0.08)" />
          </filter>

          <filter id={`softShadow-${fruta}`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgba(24, 61, 50, 0.08)" />
          </filter>
        </defs>

        {/* Base ensanchada del Stand-up pouch (fuelle inferior) */}
        <path
          d="M 45 345 Q 140 368 235 345 L 245 358 Q 140 374 35 358 Z"
          fill="#D6CBBA"
        />

        {/* Cuerpo principal del empaque Pouch */}
        <path
          d="M 40 40 
             L 240 40 
             Q 246 40 248 48 
             L 245 330 
             Q 245 345 235 350 
             Q 140 370 45 350 
             Q 35 345 35 330 
             L 32 48 
             Q 34 40 40 40 Z"
          fill={`url(#pouchGrad-${fruta})`}
          stroke="rgba(24, 61, 50, 0.08)"
          strokeWidth="1.5"
        />

        {/* Sellado superior térmico con relieve */}
        <path
          d="M 33 40 L 247 40 L 246 54 L 34 54 Z"
          fill="#E7DFD0"
          stroke="rgba(24, 61, 50, 0.06)"
          strokeWidth="1"
        />

        {/* Ranuras del sellador superior */}
        {[48, 64, 80, 96, 112, 128, 144, 160, 176, 192, 208, 224, 240].map((x) => (
          <line
            key={x}
            x1={x}
            y1="42"
            x2={x}
            y2="52"
            stroke="rgba(24, 61, 50, 0.15)"
            strokeWidth="1"
          />
        ))}

        {/* Muescas de fácil apertura (tear notches) a los costados */}
        <path d="M 32 50 L 37 47 L 37 53 Z" fill="#183D32" opacity="0.4" />
        <path d="M 248 50 L 243 47 L 243 53 Z" fill="#183D32" opacity="0.4" />

        {/* Línea del zipper resellable interno */}
        <line
          x1="38"
          y1="64"
          x2="242"
          y2="64"
          stroke="rgba(24, 61, 50, 0.18)"
          strokeDasharray="4 2"
          strokeWidth="1.2"
        />

        {/* Franja superior de sabor */}
        <rect x="42" y="74" width="196" height="6" rx="3" fill={colorPrincipal} />

        {/* Bloque superior de marca FRUITES */}
        <text
          x="140"
          y="108"
          textAnchor="middle"
          fill="#183D32"
          fontFamily="Plus Jakarta Sans, sans-serif"
          fontWeight="800"
          fontSize="22"
          letterSpacing="0.05em"
        >
          FRUITES
        </text>

        <text
          x="140"
          y="124"
          textAnchor="middle"
          fill="#4f635c"
          fontFamily="DM Sans, sans-serif"
          fontWeight="600"
          fontSize="8.5"
          letterSpacing="0.16em"
        >
          COLECCIÓN TROPICAL
        </text>

        {/* Tarjeta de identificación del sabor */}
        <rect
          x="55"
          y="136"
          width="170"
          height="42"
          rx="10"
          fill={colorPrincipal}
          filter={`url(#softShadow-${fruta})`}
        />

        <text
          x="140"
          y="158"
          textAnchor="middle"
          fill="#183D32"
          fontFamily="Plus Jakarta Sans, sans-serif"
          fontWeight="800"
          fontSize="14"
          letterSpacing="0.06em"
        >
          {current.tag}
        </text>

        <text
          x="140"
          y="170"
          textAnchor="middle"
          fill="#183D32"
          fontFamily="DM Sans, sans-serif"
          fontWeight="600"
          fontSize="7.5"
          letterSpacing="0.12em"
          opacity="0.85"
        >
          {current.subtitle}
        </text>

        {/* Ventana transparente para ver la fruta deshidratada */}
        <g>
          {/* Fondo oscuro traslúcido de la ventana */}
          <rect
            x="60"
            y="192"
            width="160"
            height="100"
            rx="16"
            fill="#3B2E1E"
            opacity="0.1"
          />

          {/* Trozos de fruta deshidratada dentro de la ventana */}
          {fruta === 'Mango' && (
            <g>
              <path d="M 75 220 C 95 200, 140 215, 155 240 C 140 260, 90 250, 75 220 Z" fill={current.sliceColor} />
              <path d="M 85 226 C 100 212, 130 222, 142 238" stroke={current.sliceDetail} strokeWidth="1.5" fill="none" />
              <path d="M 120 235 C 145 225, 185 245, 195 275 C 170 285, 130 270, 120 235 Z" fill={current.sliceColor} />
              <path d="M 95 255 C 120 240, 155 255, 165 282 C 140 290, 105 280, 95 255 Z" fill="#F4A926" />
            </g>
          )}

          {fruta === 'Piña' && (
            <g>
              {/* Rodajas circulares con agujero central */}
              <circle cx="110" cy="240" r="28" fill={current.sliceColor} />
              <circle cx="110" cy="240" r="9" fill="#E8DEC8" />
              <circle cx="110" cy="240" r="23" stroke={current.sliceDetail} strokeWidth="1" strokeDasharray="3 2" fill="none" />

              <circle cx="165" cy="250" r="26" fill={current.sliceColor} />
              <circle cx="165" cy="250" r="8" fill="#E8DEC8" />
              <circle cx="165" cy="250" r="21" stroke={current.sliceDetail} strokeWidth="1" strokeDasharray="3 2" fill="none" />
            </g>
          )}

          {fruta === 'Papaya' && (
            <g>
              <path d="M 75 230 C 90 210, 135 210, 160 235 C 135 255, 95 250, 75 230 Z" fill={current.sliceColor} />
              <path d="M 105 245 C 125 225, 175 235, 195 265 C 170 280, 125 270, 105 245 Z" fill={current.sliceColor} />
              <circle cx="130" cy="235" r="2" fill="#2E241E" />
              <circle cx="140" cy="242" r="2.2" fill="#2E241E" />
              <circle cx="152" cy="248" r="2" fill="#2E241E" />
            </g>
          )}

          {fruta === 'Banano' && (
            <g>
              {/* Chips circulares de banano deshidratado */}
              <ellipse cx="100" cy="235" rx="20" ry="16" fill={current.sliceColor} />
              <ellipse cx="100" cy="235" rx="8" ry="6" fill="#FFF8DE" />
              <line x1="97" y1="235" x2="103" y2="235" stroke={current.sliceDetail} strokeWidth="1.5" />

              <ellipse cx="145" cy="230" rx="19" ry="15" fill={current.sliceColor} />
              <ellipse cx="145" cy="230" rx="7" ry="5" fill="#FFF8DE" />

              <ellipse cx="125" cy="265" rx="22" ry="18" fill={current.sliceColor} />
              <ellipse cx="125" cy="265" rx="9" ry="7" fill="#FFF8DE" />

              <ellipse cx="170" cy="260" rx="18" ry="14" fill={current.sliceColor} />
            </g>
          )}

          {/* Brillo de reflejo plástico sobre la ventana */}
          <rect
            x="60"
            y="192"
            width="160"
            height="100"
            rx="16"
            fill={`url(#windowShine-${fruta})`}
            stroke="rgba(24, 61, 50, 0.15)"
            strokeWidth="1.2"
          />
        </g>

        {/* Pie de bolsa con datos esenciales */}
        <text
          x="140"
          y="312"
          textAnchor="middle"
          fill="#183D32"
          fontFamily="Plus Jakarta Sans, sans-serif"
          fontWeight="700"
          fontSize="9"
          letterSpacing="0.08em"
        >
          SNACK DE FRUTA DESHIDRATADA
        </text>

        <text
          x="140"
          y="326"
          textAnchor="middle"
          fill="#6a7d76"
          fontFamily="DM Sans, sans-serif"
          fontWeight="500"
          fontSize="8"
          letterSpacing="0.04em"
        >
          EMPAQUE RESELLABLE · ORIGEN CARIBE
        </text>
      </svg>
    </div>
  );
}

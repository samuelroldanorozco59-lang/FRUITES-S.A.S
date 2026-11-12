import React, { useState } from 'react';
import { Info, X } from 'lucide-react';
import { isDemoMode } from '../services/supabaseClient.js';

/**
 * ============================================================================
 * BANNER DE MODO DEMOSTRACIÓN
 * ============================================================================
 * Informa de forma discreta al usuario que el sitio está funcionando con datos
 * locales y almacenamiento en el navegador, sin necesidad de configurar Supabase.
 * ============================================================================
 */
export default function DemoBanner() {
  const [visible, setVisible] = useState(true);

  if (!isDemoMode || !visible) return null;

  return (
    <div
      style={{
        backgroundColor: '#FFF8E1',
        borderBottom: '1px solid #FFE082',
        color: '#795548',
        padding: '0.45rem 1rem',
        fontSize: 'var(--text-xs)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
      }}
      role="status"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}>
        <Info size={14} color="#FFA000" />
        <span>
          <strong>Modo Demostración Activo:</strong> Catálogo y mensajes funcionando con datos locales en tu navegador. Para conectar Supabase y Gemini, revisa <code>GUIA_PASO_A_PASO.md</code>.
        </span>
      </div>
      <button
        onClick={() => setVisible(false)}
        style={{
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          color: '#795548',
          display: 'flex',
          alignItems: 'center',
          padding: '0.2rem',
        }}
        aria-label="Cerrar aviso de demostración"
      >
        <X size={14} />
      </button>
    </div>
  );
}

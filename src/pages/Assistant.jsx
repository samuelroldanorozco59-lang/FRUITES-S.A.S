import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Send,
  ArrowRight,
  RefreshCw,
  MessageCircle,
  HelpCircle,
  ShieldCheck,
} from 'lucide-react';
import { initialProducts } from '../data/products.js';
import { recommendFlavors, askAssistant } from '../services/aiService.js';
import { siteConfig } from '../data/siteConfig.js';

/**
 * ============================================================================
 * PÁGINA: ASISTENTE FRUITES (IA)
 * ============================================================================
 * Herramienta de recomendación sensorial y atención de preguntas sobre la
 * Colección Tropical, disponibilidad y compras para negocios.
 * ============================================================================
 */
export default function Assistant() {
  // Estado del recomendador
  const [moment, setMoment] = useState('estudio');
  const [pref, setPref] = useState('dulce intenso');
  const [recommendation, setRecommendation] = useState(() =>
    recommendFlavors({ moment: 'estudio', preference: 'dulce intenso' })
  );

  // Estado del chat
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: '¡Hola! Soy tu asistente de FRUITES. Puedo recomendarte sabores según tu rutina o contarte cómo probar nuestra Colección Tropical en Barranquilla o vender en tu negocio. ¿Qué te gustaría saber?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const handleQuizChange = (newMoment, newPref) => {
    setMoment(newMoment);
    setPref(newPref);
    setRecommendation(recommendFlavors({ moment: newMoment, preference: newPref }));
  };

  const handleSend = async (customText) => {
    const text = customText || input;
    if (!text.trim() || loading) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const reply = await askAssistant(text, initialProducts);
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: reply,
        },
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: 'Hubo una breve interrupción al consultar la IA. Escríbenos directamente a WhatsApp para atenderte de inmediato.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="assistant-page section" style={{ backgroundColor: 'var(--color-crema)' }}>
      <div className="container">
        {/* Cabecera */}
        <div className="section-header text-center">
          <span className="kicker">
            <Sparkles size={14} style={{ display: 'inline', marginRight: '4px' }} />
            Orientación Sensorial
          </span>
          <h1>Asistente FRUITES</h1>
          <p style={{ marginTop: '0.75rem', fontSize: 'var(--text-lg)' }}>
            Descubre qué fruta se adapta a tu día y resuelve preguntas sobre pedidos y venta para negocios.
          </p>
        </div>

        {/* ==================================================================
            SECCIÓN 1: RECOMENDADOR INTERACTIVO
            ================================================================== */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '2.5rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '3.5rem',
          }}
        >
          <div style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: 'var(--text-xl)', marginBottom: '0.4rem' }}>
              Encuentra tu sabor ideal en dos pasos
            </h2>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
              Selecciona tu contexto de hoy para recibir una sugerencia personalizada.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem',
            }}
          >
            {/* Opción 1: Momento */}
            <div>
              <span className="form-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
                1. ¿En qué momento lo disfrutarás?
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { id: 'estudio', label: 'Estudio y universidad' },
                  { id: 'oficina', label: 'Oficina y jornadas largas' },
                  { id: 'entrenamiento', label: 'Antes o después de entrenar' },
                  { id: 'viaje', label: 'Viaje, trayecto o paseo' },
                  { id: 'antojo', label: 'Momento de antojo en casa' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleQuizChange(item.id, pref)}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${moment === item.id ? 'var(--color-selva)' : 'var(--color-border)'}`,
                      backgroundColor: moment === item.id ? 'var(--color-selva)' : '#ffffff',
                      color: moment === item.id ? '#ffffff' : 'var(--color-selva)',
                      fontWeight: moment === item.id ? 700 : 500,
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Opción 2: Preferencia */}
            <div>
              <span className="form-label" style={{ display: 'block', marginBottom: '0.75rem' }}>
                2. ¿Qué perfil de sabor buscas?
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {[
                  { id: 'dulce intenso', label: 'Dulce intenso y masticable (Mango)' },
                  { id: 'toque ácido', label: 'Balance cítrico refrescante (Piña)' },
                  { id: 'suave', label: 'Suave, sutil y dócil (Papaya)' },
                  { id: 'sorprendeme', label: 'Familiar y reconfortante (Banano)' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleQuizChange(moment, item.id)}
                    style={{
                      textAlign: 'left',
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${pref === item.id ? 'var(--color-mango)' : 'var(--color-border)'}`,
                      backgroundColor: pref === item.id ? 'var(--color-mango-light)' : '#ffffff',
                      color: 'var(--color-selva)',
                      fontWeight: pref === item.id ? 700 : 500,
                      cursor: 'pointer',
                      fontSize: 'var(--text-sm)',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Resultado sugerido */}
          {recommendation && (
            <div
              style={{
                backgroundColor: 'var(--color-crema)',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Sparkles size={16} color="var(--color-selva)" />
                <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-selva)' }}>
                  Sugerencia FRUITES:
                </strong>
              </div>
              <p style={{ fontSize: 'var(--text-base)', color: 'var(--color-text-main)', lineHeight: 1.6, marginBottom: '1.25rem' }}>
                {recommendation.explanation}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {recommendation.products.map((p) => (
                  <Link
                    key={p.id}
                    to={`/catalogo/${p.slug}`}
                    className="btn btn-selva btn-sm"
                  >
                    <span>Ver ficha de {p.nombre}</span>
                    <ArrowRight size={14} />
                  </Link>
                ))}
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsappClean}?text=${encodeURIComponent(
                    `¡Hola FRUITES! Hice el test de sabor y me recomendaron ${recommendation.products.map((p) => p.nombre).join(' y ')}. ¿Tienen disponibilidad?`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm"
                >
                  <MessageCircle size={14} />
                  <span>Pedir sugerencia por WhatsApp</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ==================================================================
            SECCIÓN 2: CONVERSACIÓN ABIERTA CON LA IA
            ================================================================== */}
        <div
          style={{
            maxWidth: '820px',
            margin: '0 auto',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              padding: '1.25rem 1.75rem',
              backgroundColor: 'var(--color-selva)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-mango)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-selva)',
                  fontWeight: 800,
                }}
              >
                F
              </div>
              <div>
                <h3 style={{ color: '#ffffff', fontSize: 'var(--text-base)', margin: 0 }}>
                  Conversación con Asistente FRUITES
                </h3>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
                  Enfoque en sabores, pedidos y ventas B2B
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '11px', color: 'rgba(255,255,255,0.75)' }}>
              <ShieldCheck size={14} color="var(--color-lima)" />
              <span>Respuestas verificadas</span>
            </div>
          </div>

          {/* Historial de conversación */}
          <div
            style={{
              height: '380px',
              overflowY: 'auto',
              padding: '1.5rem',
              backgroundColor: 'var(--color-crema-light)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '82%',
                    padding: '0.85rem 1.15rem',
                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    backgroundColor: isUser ? 'var(--color-selva)' : '#ffffff',
                    color: isUser ? '#ffffff' : 'var(--color-text-main)',
                    fontSize: 'var(--text-sm)',
                    lineHeight: 1.5,
                    border: isUser ? 'none' : '1px solid var(--color-border-subtle)',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                >
                  {m.text}
                </div>
              );
            })}

            {loading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  padding: '0.75rem 1rem',
                  borderRadius: '18px 18px 18px 4px',
                  backgroundColor: '#ffffff',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <Sparkles size={14} color="var(--color-mango)" className="animate-spin" />
                <span>Consultando con el asistente...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preguntas sugeridas */}
          <div
            style={{
              padding: '0.75rem 1.25rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--color-border-subtle)',
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
            }}
          >
            <span style={{ fontSize: '11px', color: 'var(--color-text-light)', alignSelf: 'center' }}>
              Preguntas sugeridas:
            </span>
            {[
              '¿Tienen opción para vender en gimnasios?',
              '¿Qué fruta es menos empalagosa?',
              '¿Tienen fecha para despachos nacionales?',
            ].map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                style={{
                  fontSize: '11px',
                  padding: '0.3rem 0.65rem',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-crema)',
                  color: 'var(--color-selva)',
                  cursor: 'pointer',
                }}
              >
                {q}
              </button>
            ))}
          </div>

          {/* Caja de entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: '#ffffff',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: '0.75rem',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu consulta sobre FRUITES..."
              maxLength={280}
              className="form-input"
              style={{ flex: 1, borderRadius: 'var(--radius-full)' }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="btn btn-primary"
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              <Send size={16} />
              <span>Enviar</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

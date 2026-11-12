import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, CornerDownLeft } from 'lucide-react';
import { askAssistant } from '../services/aiService.js';
import { initialProducts } from '../data/products.js';

/**
 * ============================================================================
 * WIDGET FLOTANTE DE ASISTENTE VIRTUAL (CHAT)
 * ============================================================================
 * Permite a cualquier visitante resolver dudas frecuentes o recibir
 * sugerencias sobre sabores y ventas B2B desde cualquier página del sitio.
 * ============================================================================
 */
export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'assistant',
      text: '¡Hola! Soy el asistente de FRUITES. Puedo ayudarte a elegir tu sabor ideal o resolver tus dudas sobre nuestra Colección Tropical y ventas para negocios. ¿En qué puedo orientarte hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickPrompts = [
    '¿Qué sabores tienen?',
    '¿Tienen venta para cafés o tiendas?',
    '¿Cuáles son los precios y gramajes?',
    '¿Dónde los puedo comprar?',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSend = async (textToSend) => {
    const text = textToSend || input;
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
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          sender: 'assistant',
          text: 'Disculpa, tuve un momento de congestión. Por favor escríbenos directamente a nuestro WhatsApp o déjanos un mensaje en el formulario.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        zIndex: 99,
      }}
    >
      {/* Botón flotante para abrir el chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.85rem 1.35rem',
            borderRadius: 'var(--radius-full)',
            backgroundColor: 'var(--color-selva)',
            color: '#ffffff',
            border: '2px solid var(--color-mango)',
            boxShadow: 'var(--shadow-lg)',
            cursor: 'pointer',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 'var(--text-sm)',
            transition: 'transform var(--transition-fast)',
          }}
          className="chat-floating-btn"
          aria-label="Abrir asistente de FRUITES"
        >
          <Sparkles size={18} color="var(--color-mango)" />
          <span>Pregúntale a FRUITES</span>
        </button>
      )}

      {/* Ventana de chat desplegada */}
      {isOpen && (
        <div
          style={{
            width: '360px',
            maxWidth: 'calc(100vw - 2rem)',
            height: '520px',
            maxHeight: 'calc(100vh - 6rem)',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
          role="dialog"
          aria-label="Chat del asistente de FRUITES"
        >
          {/* Cabecera del chat */}
          <div
            style={{
              padding: '1rem 1.25rem',
              backgroundColor: 'var(--color-selva)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-mango)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--color-selva)',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                }}
              >
                F
              </div>
              <div>
                <h4 style={{ color: '#ffffff', fontSize: 'var(--text-sm)', margin: 0 }}>
                  Asistente FRUITES
                </h4>
                <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
                  Guía de sabores y pedidos
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '0.25rem',
              }}
              aria-label="Cerrar chat"
            >
              <X size={20} />
            </button>
          </div>

          {/* Historial de mensajes */}
          <div
            style={{
              flex: 1,
              padding: '1rem',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
              backgroundColor: 'var(--color-crema-light)',
            }}
          >
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div
                  key={m.id}
                  style={{
                    alignSelf: isUser ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '0.75rem 1rem',
                    borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                    backgroundColor: isUser ? 'var(--color-selva)' : '#ffffff',
                    color: isUser ? '#ffffff' : 'var(--color-text-main)',
                    fontSize: 'var(--text-xs)',
                    lineHeight: 1.5,
                    boxShadow: 'var(--shadow-sm)',
                    border: isUser ? 'none' : '1px solid var(--color-border-subtle)',
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
                  padding: '0.65rem 0.9rem',
                  borderRadius: '16px 16px 16px 4px',
                  backgroundColor: '#ffffff',
                  fontSize: 'var(--text-xs)',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  border: '1px solid var(--color-border-subtle)',
                }}
              >
                <Sparkles size={13} color="var(--color-mango)" className="animate-spin" />
                <span>Escribiendo respuesta...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Preguntas sugeridas rápidas */}
          {messages.length < 3 && (
            <div
              style={{
                padding: '0.5rem 0.85rem',
                borderTop: '1px solid var(--color-border-subtle)',
                backgroundColor: '#ffffff',
                display: 'flex',
                gap: '0.4rem',
                overflowX: 'auto',
              }}
            >
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  style={{
                    padding: '0.35rem 0.65rem',
                    fontSize: '11px',
                    borderRadius: 'var(--radius-full)',
                    border: '1px solid var(--color-border)',
                    backgroundColor: 'var(--color-crema)',
                    color: 'var(--color-selva)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {prompt}
                </button>
              ))}
            </div>
          )}

          {/* Caja de entrada de texto */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            style={{
              padding: '0.75rem',
              borderTop: '1px solid var(--color-border)',
              display: 'flex',
              gap: '0.5rem',
              backgroundColor: '#ffffff',
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Escribe tu pregunta..."
              maxLength={250}
              style={{
                flex: 1,
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--color-border)',
                fontSize: 'var(--text-xs)',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: input.trim() ? 'var(--color-selva)' : '#e0e0e0',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'default',
              }}
              aria-label="Enviar mensaje"
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary capturó un error:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '#/';
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: '70vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            backgroundColor: 'var(--color-crema, #FAF7F2)',
            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
          }}
        >
          <div
            style={{
              maxWidth: '480px',
              backgroundColor: '#ffffff',
              borderRadius: '1rem',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #E8ECE9',
            }}
          >
            <div
              style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                backgroundColor: '#FDEEE9',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <AlertTriangle size={28} color="#EF775C" />
            </div>

            <h2
              style={{
                fontSize: '1.5rem',
                color: '#183D32',
                marginBottom: '0.75rem',
                fontWeight: 700,
              }}
            >
              Algo no salió como esperábamos
            </h2>

            <p
              style={{
                fontSize: '0.9rem',
                color: '#4F635C',
                lineHeight: 1.6,
                marginBottom: '1.75rem',
              }}
            >
              Ocurrió un error inesperado al cargar esta sección. No te preocupes, tus datos y carrito están a salvo.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={this.handleReload}
                className="btn btn-primary btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '9999px',
                  backgroundColor: '#F6C945',
                  color: '#183D32',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <RefreshCw size={15} />
                <span>Reintentar</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="btn btn-secondary btn-sm"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.6rem 1.2rem',
                  borderRadius: '9999px',
                  backgroundColor: '#E8ECE9',
                  color: '#183D32',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                <Home size={15} />
                <span>Ir al Inicio</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

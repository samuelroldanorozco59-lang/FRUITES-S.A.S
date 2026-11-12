import React, { useState, useEffect } from 'react';
import { initialProducts, upcomingLines } from '../data/products.js';
import { getProducts } from '../services/productsService.js';
import ProductCard from '../components/ProductCard.jsx';
import { Sparkles, Info } from 'lucide-react';

/**
 * ============================================================================
 * PÁGINA DE CATÁLOGO — COLECCIÓN TROPICAL
 * ============================================================================
 * Muestra los 4 sabores oficiales con sus tarjetas, colores y fichas.
 * Permite filtrar por fruta y muestra las futuras líneas en desarrollo.
 * ============================================================================
 */
export default function Catalog() {
  const [products, setProducts] = useState(initialProducts);
  const [filter, setFilter] = useState('todos');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getProducts();
        if (data && data.length > 0) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Error al cargar catálogo:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredProducts =
    filter === 'todos'
      ? products
      : products.filter((p) => p.fruta.toLowerCase() === filter.toLowerCase());

  return (
    <div className="catalog-page section" style={{ backgroundColor: 'var(--color-crema)' }}>
      <div className="container">
        {/* Cabecera del catálogo */}
        <div className="section-header text-center">
          <span className="kicker">Primera Línea</span>
          <h1>Colección Tropical</h1>
          <p style={{ marginTop: '0.75rem', fontSize: 'var(--text-lg)' }}>
            Cuatro frutas tropicales seleccionadas, convertidas en snacks prácticos en bolsa tipo stand-up pouch resellable.
          </p>
        </div>

        {/* Filtros sutiles (sin botones tipo píldora genérica) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '0.5rem',
            flexWrap: 'wrap',
            marginBottom: '2.5rem',
          }}
        >
          {['todos', 'mango', 'piña', 'papaya', 'banano'].map((flavor) => {
            const isActive = filter === flavor;
            return (
              <button
                key={flavor}
                onClick={() => setFilter(flavor)}
                className="btn btn-sm"
                style={{
                  backgroundColor: isActive ? 'var(--color-selva)' : '#ffffff',
                  color: isActive ? '#ffffff' : 'var(--color-selva)',
                  borderColor: isActive ? 'var(--color-selva)' : 'var(--color-border)',
                  textTransform: 'capitalize',
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {flavor === 'todos' ? 'Todos los sabores' : flavor}
              </button>
            );
          })}
        </div>

        {/* Aviso de etapa de desarrollo */}
        <div
          style={{
            maxWidth: '720px',
            margin: '0 auto 2.5rem auto',
            padding: '0.9rem 1.25rem',
            backgroundColor: 'rgba(24, 61, 50, 0.05)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: 'var(--text-xs)',
            color: 'var(--color-text-muted)',
          }}
        >
          <Info size={16} color="var(--color-selva)" style={{ flexShrink: 0 }} />
          <span>
            <strong>Nota de formulación:</strong> Los gramajes y precios comerciales se encuentran actualmente en validación ([POR DEFINIR]). Puedes solicitar muestras o reservar disponibilidad por WhatsApp.
          </span>
        </div>

        {/* Grilla de productos */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            marginBottom: '4.5rem',
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Sección de próximas líneas (mencionadas discretamente como "Próximamente") */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2rem',
            border: '1px solid var(--color-border)',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
            <span className="kicker">En Laboratorio</span>
            <h3 style={{ fontSize: 'var(--text-2xl)' }}>Futuras Colecciones</h3>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', marginTop: '0.5rem' }}>
              FRUITES continuará explorando la riqueza del trópico colombiano a medida que validemos nuestra primera línea.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {upcomingLines.map((line, idx) => (
              <div
                key={idx}
                style={{
                  padding: '1.5rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-crema)',
                  border: '1px solid var(--color-border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: 'var(--color-coral)',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      display: 'block',
                      marginBottom: '0.4rem',
                    }}
                  >
                    {line.estado}
                  </span>
                  <h4 style={{ fontSize: 'var(--text-base)', marginBottom: '0.45rem' }}>
                    {line.titulo}
                  </h4>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
                    {line.descripcion}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Search,
  Navigation,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  Store,
  CheckCircle,
  ShieldCheck,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { getStores } from '../services/storesService.js';
import StoreMap from '../components/StoreMap.jsx';
import { siteConfig } from '../data/siteConfig.js';

/**
 * ============================================================================
 * PÁGINA: PUNTOS DE VENTA (GEOLOCALIZACIÓN Y MAPA INTERACTIVO)
 * ============================================================================
 * Permite al usuario encontrar tiendas, cafés y gimnasios que venden FRUITES,
 * filtrar por ciudad/tipo, calcular distancia con GPS y a los negocios B2B
 * solicitar o gestionar su listado.
 * ============================================================================
 */
export default function StoreLocator() {
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [userLocation, setUserLocation] = useState(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getStores();
        setStores(data || []);
        if (data && data.length > 0) {
          setSelectedStore(data[0]);
        }
      } catch (err) {
        console.error('Error al cargar tiendas:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  // Calcular distancia en km usando fórmula de Haversine
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null;
    const R = 6371; // Radio de la Tierra en km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // Solicitar geolocalización al navegador
  const handleGetLocation = () => {
    setLocating(true);
    setLocError('');

    if (!navigator.geolocation) {
      setLocError('Tu navegador no soporta geolocalización.');
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocating(false);
      },
      (error) => {
        setLocError('No se pudo acceder a tu ubicación. Permite el acceso en tu navegador.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Filtrado de tiendas
  const filteredStores = stores.filter((store) => {
    const matchesSearch =
      (store.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (store.barrio || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (store.ciudad || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (store.direccion || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'Todos' ||
      (store.tipo && store.tipo.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  // Ordenar por distancia si el usuario compartió su ubicación
  const sortedStores = userLocation
    ? [...filteredStores].sort((a, b) => {
        const distA = parseFloat(calculateDistance(userLocation.lat, userLocation.lng, a.lat, a.lng) || 9999);
        const distB = parseFloat(calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng) || 9999);
        return distA - distB;
      })
    : filteredStores;

  return (
    <div className="store-locator-page section" style={{ backgroundColor: 'var(--color-crema)' }}>
      <div className="container">
        {/* Cabecera de la sección */}
        <div className="section-header text-center">
          <span className="kicker">Disponibilidad en Puntos Físicos</span>
          <h1>Encuentra FRUITES Cerca de Ti</h1>
          <p style={{ marginTop: '0.75rem', fontSize: 'var(--text-lg)' }}>
            Explora los cafés, gimnasios y tiendas saludables que ofrecen nuestra Colección Tropical.
          </p>
        </div>

        {/* Barra de Búsqueda, Filtros y GPS */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '1.5rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            {/* Buscador de texto */}
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search
                size={18}
                color="var(--color-text-light)"
                style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por barrio, ciudad o nombre (ej. Alto Prado, Riomar)..."
                className="form-input"
                style={{ paddingLeft: '2.75rem', borderRadius: 'var(--radius-full)' }}
              />
            </div>

            {/* Botón de Geolocalización */}
            <button
              onClick={handleGetLocation}
              disabled={locating}
              className="btn btn-secondary btn-sm"
              style={{ borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}
            >
              <Navigation size={15} color="var(--color-selva)" />
              <span>{locating ? 'Ubicando...' : 'Usar mi ubicación'}</span>
            </button>
          </div>

          {/* Categorías */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-selva)', marginRight: '0.25rem' }}>
              Filtrar por:
            </span>
            {['Todos', 'Café', 'Tienda Saludable', 'Gimnasio'].map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="btn btn-sm"
                  style={{
                    backgroundColor: active ? 'var(--color-selva)' : 'var(--color-crema)',
                    color: active ? '#ffffff' : 'var(--color-selva)',
                    borderColor: active ? 'var(--color-selva)' : 'var(--color-border)',
                    fontSize: '11px',
                    padding: '0.35rem 0.85rem',
                  }}
                >
                  {cat === 'Todos' ? 'Todos los puntos' : cat}
                </button>
              );
            })}
          </div>

          {locError && (
            <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-coral)' }}>
              {locError}
            </div>
          )}
        </div>

        {/* Rejilla Principal: Mapa + Lista de Puntos */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '2rem',
            alignItems: 'start',
            marginBottom: '3.5rem',
          }}
        >
          {/* Mapa Interactivo */}
          <div style={{ height: '560px', position: 'sticky', top: '90px' }}>
            <StoreMap
              stores={sortedStores}
              selectedStore={selectedStore}
              onSelectStore={(st) => setSelectedStore(st)}
              userLocation={userLocation}
            />
          </div>

          {/* Lista de Tiendas y Tarjetas de Detalle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '560px', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {sortedStores.length === 0 ? (
              <div
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  padding: '3rem 2rem',
                  textAlign: 'center',
                  border: '1px solid var(--color-border)',
                }}
              >
                <Store size={36} color="var(--color-text-light)" style={{ margin: '0 auto 1rem auto' }} />
                <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '0.5rem' }}>No encontramos tiendas en esta zona</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
                  Intenta cambiar el término de búsqueda o pídelo directamente a nuestro WhatsApp oficial para despacho a tu dirección.
                </p>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsappClean}?text=Hola,%20busco%20puntos%20de%20venta%20FRUITES%20en%20mi%20ciudad`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm"
                  style={{ marginTop: '1rem' }}
                >
                  <MessageCircle size={15} />
                  <span>Pedir directo por WhatsApp</span>
                </a>
              </div>
            ) : (
              sortedStores.map((store) => {
                const isSelected = selectedStore && selectedStore.id === store.id;
                const distance = userLocation ? calculateDistance(userLocation.lat, userLocation.lng, store.lat, store.lng) : null;

                return (
                  <article
                    key={store.id}
                    onClick={() => setSelectedStore(store)}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1.5rem',
                      border: `2px solid ${isSelected ? 'var(--color-mango)' : 'var(--color-border)'}`,
                      boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-sm)',
                      cursor: 'pointer',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          color: 'var(--color-coral)',
                          letterSpacing: '0.06em',
                        }}
                      >
                        {store.categoria || store.tipo}
                      </span>
                      {distance && (
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: 'var(--color-selva)',
                            backgroundColor: 'var(--color-crema)',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                          }}
                        >
                          A {distance} km
                        </span>
                      )}
                    </div>

                    <h3 style={{ fontSize: 'var(--text-lg)', color: 'var(--color-selva)', marginBottom: '0.35rem' }}>
                      {store.nombre}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '0.5rem' }}>
                      <MapPin size={14} color="var(--color-selva)" />
                      <span>{store.direccion}, {store.barrio} · {store.ciudad}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '11.5px', color: 'var(--color-text-light)', marginBottom: '0.85rem' }}>
                      <Clock size={13} />
                      <span>{store.horario}</span>
                    </div>

                    {store.saboresDisponibles && store.saboresDisponibles.length > 0 && (
                      <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.75rem', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '11px', color: 'var(--color-text-light)', display: 'block', marginBottom: '0.35rem' }}>
                          Sabores que encuentras aquí:
                        </span>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          {store.saboresDisponibles.map((sab) => (
                            <span
                              key={sab}
                              style={{
                                fontSize: '11px',
                                backgroundColor: 'var(--color-crema)',
                                color: 'var(--color-selva)',
                                padding: '0.2rem 0.5rem',
                                borderRadius: 'var(--radius-full)',
                                fontWeight: 600,
                              }}
                            >
                              {sab}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Acciones para el consumidor y el negocio B2B */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '11px' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLink size={12} />
                        <span>Cómo llegar</span>
                      </a>

                      {store.whatsapp && (
                        <a
                          href={`https://wa.me/${store.whatsapp}?text=Hola,%20quisiera%20confirmar%20disponibilidad%20de%20snacks%20FRUITES`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-whatsapp btn-sm"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '11px' }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MessageCircle size={12} />
                          <span>Contactar local</span>
                        </a>
                      )}

                      {/* Botón para que el negocio gestione su listado */}
                      <Link
                        to="/admin/login"
                        className="btn btn-sm"
                        style={{
                          marginLeft: 'auto',
                          background: 'transparent',
                          color: 'var(--color-text-light)',
                          fontSize: '11px',
                          border: 'none',
                          padding: '0.35rem 0.5rem',
                        }}
                        onClick={(e) => e.stopPropagation()}
                        title="Los clientes B2B pueden actualizar sus datos desde el panel de administración"
                      >
                        <span>¿Es tu tienda? Gestionar</span>
                      </Link>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </div>

        {/* Llamado a la acción para sumar nuevos negocios B2B */}
        <div
          style={{
            backgroundColor: 'var(--color-selva)',
            color: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '3rem 2.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem',
            alignItems: 'center',
          }}
        >
          <div>
            <span
              style={{
                color: 'var(--color-mango)',
                fontSize: 'var(--text-xs)',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              ¿Tienes un negocio?
            </span>
            <h2 style={{ color: '#ffffff', fontSize: 'var(--text-2xl)', marginBottom: '0.75rem' }}>
              Ofrece FRUITES y aparece en este mapa interactivo
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 'var(--text-sm)', lineHeight: 1.6 }}>
              Si tienes un café, gimnasio o tienda saludable en Barranquilla o Colombia, podemos enviarte un lote inicial y dar visibilidad a tu punto de venta ante nuestra comunidad.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', alignItems: 'flex-start' }}>
            <Link to="/negocios" className="btn btn-primary btn-lg">
              <span>Registrar mi negocio como punto aliado</span>
              <ArrowRight size={18} />
            </Link>
            <span style={{ fontSize: 'var(--text-xs)', color: 'rgba(255,255,255,0.6)' }}>
              * Lotes de validación sin contratos forzosos.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

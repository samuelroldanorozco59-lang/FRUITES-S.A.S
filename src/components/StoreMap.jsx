import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/**
 * Función de escape para prevenir Cross-Site Scripting (XSS) en popups de Leaflet (M-01)
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * ============================================================================
 * MAPA INTERACTIVO DE PUNTOS DE VENTA (LEAFLET + OPENSTREETMAP)
 * ============================================================================
 * - Carga CSS local de Leaflet desde node_modules (M-07, elimina dependencia CDN).
 * - Sanitización estricta de cadenas HTML en popups (M-01).
 * - Validación numérica estricta de coordenadas (Number.isFinite).
 * - Popups con estilo de marca FRUITES, enlaces seguros y llamada a WhatsApp.
 * ============================================================================
 */
export default function StoreMap({
  stores = [],
  selectedStore = null,
  onSelectStore = () => {},
  userLocation = null,
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  // Inicializar mapa
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Coordenadas centrales por defecto: Barranquilla (11.0041, -74.8070)
    const defaultCenter = [11.0041, -74.807];
    const defaultZoom = 13;

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: defaultZoom,
      scrollWheelZoom: false,
    });

    // Capa de mapas OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Actualizar marcadores de tiendas
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Limpiar marcadores previos
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    stores.forEach((store) => {
      const lat = Number(store.lat);
      const lng = Number(store.lng);
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

      const isSelected = selectedStore && selectedStore.id === store.id;

      // Icono personalizado HTML con colores de FRUITES
      const customIcon = L.divIcon({
        className: 'fruites-map-marker',
        html: `
          <div style="
            width: ${isSelected ? '36px' : '30px'};
            height: ${isSelected ? '36px' : '30px'};
            background-color: ${isSelected ? '#F6C945' : '#183D32'};
            border: 3px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 12px rgba(24, 61, 50, 0.35);
            transition: all 0.2s ease;
            cursor: pointer;
          ">
            <span style="
              width: 10px;
              height: 10px;
              background-color: ${isSelected ? '#183D32' : '#F6C945'};
              border-radius: 50%;
              display: inline-block;
            "></span>
          </div>
        `,
        iconSize: [isSelected ? 36 : 30, isSelected ? 36 : 30],
        iconAnchor: [isSelected ? 18 : 15, isSelected ? 18 : 15],
      });

      const marker = L.marker([lat, lng], { icon: customIcon }).addTo(map);

      // Popup informativo enriquecido y sanitizado contra XSS (M-01)
      const safeCategoria = escapeHtml(store.categoria || 'Punto de Venta Aliado');
      const safeNombre = escapeHtml(store.nombre || 'Tienda FRUITES');
      const safeDireccion = escapeHtml(store.direccion || '');
      const safeBarrio = escapeHtml(store.barrio || '');
      const safeCiudad = escapeHtml(store.ciudad || 'Barranquilla');
      const safeHorario = escapeHtml(store.horario || 'Consultar horario');
      const cleanPhone = store.whatsapp ? String(store.whatsapp).replace(/\D/g, '') : '';

      const popupContent = `
        <div style="font-family: 'DM Sans', sans-serif; padding: 4px; max-width: 220px;">
          <div style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #EF775C; letter-spacing: 0.05em; margin-bottom: 2px;">
            ${safeCategoria}
          </div>
          <strong style="font-size: 14px; font-family: 'Plus Jakarta Sans', sans-serif; color: #183D32; display: block; margin-bottom: 4px;">
            ${safeNombre}
          </strong>
          <div style="font-size: 11px; color: #4f635c; margin-bottom: 4px;">
            📍 ${safeDireccion}${safeBarrio ? `, ${safeBarrio}` : ''} (${safeCiudad})
          </div>
          <div style="font-size: 10.5px; color: #7b8e88; margin-bottom: 8px;">
            🕒 ${safeHorario}
          </div>
          <div style="display: flex; gap: 4px;">
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="
              background-color: #183D32;
              color: #ffffff;
              padding: 4px 8px;
              border-radius: 9999px;
              font-size: 10px;
              font-weight: 700;
              text-decoration: none;
              display: inline-block;
            ">
              Cómo llegar ↗
            </a>
            ${
              cleanPhone
                ? `
              <a href="https://wa.me/${cleanPhone}?text=Hola,%20quisiera%20saber%20si%20tienen%20snacks%20FRUITES%20disponibles" target="_blank" rel="noopener noreferrer" style="
                background-color: #25D366;
                color: #ffffff;
                padding: 4px 8px;
                border-radius: 9999px;
                font-size: 10px;
                font-weight: 700;
                text-decoration: none;
                display: inline-block;
              ">
                WhatsApp
              </a>
            `
                : ''
            }
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('click', () => {
        onSelectStore(store);
      });

      markersRef.current[store.id] = marker;
    });

    // Si hay tiendas, ajustar vista
    if (stores.length > 0 && !selectedStore && !userLocation) {
      const group = L.featureGroup(Object.values(markersRef.current));
      if (group.getLayers().length > 0) {
        map.fitBounds(group.getBounds().pad(0.2));
      }
    }
  }, [stores, selectedStore, onSelectStore, userLocation]);

  // Si hay una tienda seleccionada, centrar suavemente en ella
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !selectedStore) return;
    const lat = Number(selectedStore.lat);
    const lng = Number(selectedStore.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    map.flyTo([lat, lng], 16, { duration: 1 });

    const marker = markersRef.current[selectedStore.id];
    if (marker) {
      marker.openPopup();
    }
  }, [selectedStore]);

  // Marcador de ubicación del usuario
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !userLocation) return;
    const lat = Number(userLocation.lat);
    const lng = Number(userLocation.lng);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    const userIcon = L.divIcon({
      className: 'user-loc-marker',
      html: `
        <div style="
          width: 18px;
          height: 18px;
          background-color: #3B82F6;
          border: 3px solid #ffffff;
          border-radius: 50%;
          box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.35);
        "></div>
      `,
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    const userMarker = L.marker([lat, lng], { icon: userIcon })
      .addTo(map)
      .bindPopup('<strong>Tu ubicación actual</strong>');

    map.flyTo([lat, lng], 14, { duration: 1.2 });

    return () => {
      userMarker.remove();
    };
  }, [userLocation]);

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '440px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--color-border)',
        boxShadow: 'var(--shadow-sm)',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: '440px' }} />
    </div>
  );
}

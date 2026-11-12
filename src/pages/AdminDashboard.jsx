import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Inbox,
  Package,
  MapPin,
  BookOpen,
  ShoppingBag,
  LogOut,
  Download,
  Upload,
  Eye,
  Plus,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  Shield,
  Edit2,
  Trash2,
  X,
  CreditCard,
  Truck,
  CheckCircle,
  UserCheck,
  KeyRound,
  FileText,
  AlertTriangle,
  HelpCircle,
  Database,
  Lock,
} from 'lucide-react';
import { getContactMessages, updateMessageStatus } from '../services/messagesService.js';
import { getProducts, saveProduct } from '../services/productsService.js';
import { getStores, saveStore, deleteStore } from '../services/storesService.js';
import { getRecipes, saveRecipe, deleteRecipe } from '../services/recipesService.js';
import { getOrders, updateOrderStatus } from '../services/ordersService.js';
import { isDemoMode, supabase } from '../services/supabaseClient.js';
import {
  getCurrentAdminSession,
  logoutAdmin,
  updateAdminPassword,
  getStoredAdminCredentials,
  PRIMARY_ADMIN_EMAIL,
} from '../services/adminAuthService.js';
import { exportSecureCSV } from '../utils/csvExport.js';
import { formatCOP, formatDate } from '../utils/formatters.js';
import Logo from '../components/Logo.jsx';

/**
 * ============================================================================
 * PANEL DE ADMINISTRACIÓN Y ZONA DE GESTIÓN PRIVADA — FRUITES
 * ============================================================================
 * Administrador Maestro: Samuel Roldán Orozco (samuelroldanorozco59@gmail.com)
 * 
 * Módulos integrados:
 * 1. Pedidos E-commerce (compras, estados, modal con cliente y CSV seguro)
 * 2. Mensajes de contacto y propuestas B2B (filtros, estados y WhatsApp)
 * 3. Puntos de venta / Tiendas piloto (geolocalización, coordenadas, añadir/editar)
 * 4. Recetas y Blog gastronómico (crear, editar contenido, fotos y publicación)
 * 5. Catálogo de productos (activación de sabores y descripciones)
 * 6. Seguridad & Mi Perfil (cambio de clave de Samuel, backups JSON y guía)
 * ============================================================================
 */
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('pedidos');

  // Datos
  const [orders, setOrders] = useState([]);
  const [messages, setMessages] = useState([]);
  const [products, setProducts] = useState([]);
  const [stores, setStores] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtros
  const [filterMessageStatus, setFilterMessageStatus] = useState('todos');
  const [filterMessageType, setFilterMessageType] = useState('todos');
  const [filterOrderStatus, setFilterOrderStatus] = useState('todos');

  // Modales
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingStore, setEditingStore] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);

  // Estados de Seguridad y Cambio de Clave
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' });
  const [backupMsg, setBackupMsg] = useState({ type: '', text: '' });

  // Verificar sesión y autenticación
  useEffect(() => {
    async function verifyAuth() {
      const activeSession = getCurrentAdminSession();
      if (!activeSession) {
        navigate('/admin/login');
        return;
      }

      // Si Supabase está activo y no es demo, verificar sesión real
      if (!isDemoMode && supabase && activeSession.provider === 'supabase') {
        const { data: { session: sbSession } } = await supabase.auth.getSession();
        if (!sbSession) {
          await logoutAdmin();
          navigate('/admin/login');
          return;
        }
      }

      setSession(activeSession);
    }
    verifyAuth();
  }, [navigate]);

  // Cargar todos los datos de la tienda
  const loadData = async () => {
    setLoading(true);
    try {
      const [ords, msgs, prods, sts, recs] = await Promise.all([
        getOrders(),
        getContactMessages(),
        getProducts(),
        getStores(),
        getRecipes(),
      ]);
      setOrders(ords || []);
      setMessages(msgs || []);
      setProducts(prods || []);
      setStores(sts || []);
      setRecipes(recs || []);
    } catch (e) {
      console.error('Error al cargar datos en panel admin:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session) {
      loadData();
    }
  }, [session]);

  const handleLogout = async () => {
    await logoutAdmin();
    navigate('/admin/login');
  };

  // --- GESTIÓN DE SEGURIDAD (CAMBIO DE CONTRASEÑA) ---
  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg({ type: '', text: '' });

    if (newPassInput !== confirmPassInput) {
      setPasswordMsg({ type: 'error', text: 'La nueva contraseña y su confirmación no coinciden.' });
      return;
    }

    if (newPassInput.length < 6) {
      setPasswordMsg({ type: 'error', text: 'La contraseña debe tener mínimo 6 caracteres.' });
      return;
    }

    try {
      await updateAdminPassword(currentPassInput, newPassInput);
      setPasswordMsg({ type: 'success', text: '¡Contraseña actualizada con éxito! Se aplicará en tu próximo inicio de sesión.' });
      setCurrentPassInput('');
      setNewPassInput('');
      setConfirmPassInput('');
    } catch (err) {
      setPasswordMsg({ type: 'error', text: err.message || 'No se pudo actualizar la contraseña.' });
    }
  };

  // --- COPIA DE SEGURIDAD Y RESTAURACIÓN (BACKUP) ---
  const handleDownloadBackup = () => {
    const backupData = {
      app: 'FRUITES',
      exportDate: new Date().toISOString(),
      admin: session?.email || PRIMARY_ADMIN_EMAIL,
      data: {
        orders,
        messages,
        products,
        stores,
        recipes,
      },
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `fruites_copia_seguridad_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setBackupMsg({ type: 'success', text: 'Copia de seguridad descargada exitosamente en formato JSON.' });
    setTimeout(() => setBackupMsg({ type: '', text: '' }), 4000);
  };

  const handleRestoreBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const parsed = JSON.parse(evt.target.result);
        if (!parsed.data) {
          throw new Error('El archivo no contiene un formato de respaldo válido de FRUITES.');
        }

        if (parsed.data.orders) {
          localStorage.setItem('fruites_orders', JSON.stringify(parsed.data.orders));
          setOrders(parsed.data.orders);
        }
        if (parsed.data.messages) {
          localStorage.setItem('fruites_demo_messages', JSON.stringify(parsed.data.messages));
          setMessages(parsed.data.messages);
        }
        if (parsed.data.stores) {
          localStorage.setItem('fruites_demo_stores', JSON.stringify(parsed.data.stores));
          setStores(parsed.data.stores);
        }
        if (parsed.data.recipes) {
          localStorage.setItem('fruites_demo_recipes', JSON.stringify(parsed.data.recipes));
          setRecipes(parsed.data.recipes);
        }
        if (parsed.data.products) {
          localStorage.setItem('fruites_demo_products', JSON.stringify(parsed.data.products));
          setProducts(parsed.data.products);
        }

        setBackupMsg({ type: 'success', text: '¡Datos restaurados con éxito desde la copia de seguridad!' });
      } catch (err) {
        setBackupMsg({ type: 'error', text: `Error al restaurar: ${err.message}` });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // --- ACCIONES DE PEDIDOS ---
  const handleOrderStatusChange = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, estado: newStatus } : o))
    );
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => ({ ...prev, estado: newStatus }));
    }
  };

  const exportOrdersCSV = () => {
    if (orders.length === 0) return;
    const headers = [
      'ID Pedido',
      'Fecha',
      'Cliente',
      'Email',
      'Teléfono',
      'Ciudad',
      'Dirección',
      'Método de Pago',
      'Estado',
      'Subtotal COP',
      'Envío COP',
      'Descuento COP',
      'Total COP',
      'Artículos',
    ];
    const rows = orders.map((o) => [
      o.id,
      o.created_at || '',
      o.cliente?.nombre || '',
      o.cliente?.email || '',
      o.cliente?.telefono || '',
      o.direccion?.ciudad || '',
      `${o.direccion?.direccion || ''} ${o.direccion?.detalles || ''}`,
      o.metodoPago || '',
      o.estado || '',
      o.subtotal || 0,
      o.costoEnvio || 0,
      o.descuento || 0,
      o.total || 0,
      (o.items || []).map((it) => `${it.cantidad}x ${it.nombre} (${it.tamano})`).join('; '),
    ]);

    exportSecureCSV(`fruites_pedidos_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  // --- ACCIONES DE MENSAJES ---
  const handleMessageStatusChange = async (msgId, newStatus) => {
    await updateMessageStatus(msgId, newStatus);
    setMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, estado: newStatus } : m))
    );
    if (selectedMessage && selectedMessage.id === msgId) {
      setSelectedMessage((prev) => ({ ...prev, estado: newStatus }));
    }
  };

  const exportMessagesCSV = () => {
    if (messages.length === 0) return;
    const headers = ['ID', 'Fecha', 'Nombre', 'Email', 'WhatsApp', 'Tipo', 'Negocio', 'Estado', 'Mensaje'];
    const rows = messages.map((m) => [
      m.id,
      m.created_at || '',
      m.nombre || '',
      m.email || '',
      m.whatsapp || '',
      m.tipo_contacto || '',
      m.nombre_negocio || '',
      m.estado || '',
      m.mensaje || '',
    ]);

    exportSecureCSV(`fruites_mensajes_${new Date().toISOString().slice(0, 10)}.csv`, headers, rows);
  };

  // --- ACCIONES DE PRODUCTOS ---
  const handleToggleProduct = async (product) => {
    const updated = { ...product, disponible: !product.disponible };
    await saveProduct(updated);
    setProducts((prev) => prev.map((p) => (p.id === product.id ? updated : p)));
  };

  const handleSaveProductEdit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;
    await saveProduct(editingProduct);
    setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? editingProduct : p)));
    setEditingProduct(null);
  };

  // --- ACCIONES DE TIENDAS ---
  const handleSaveStore = async (e) => {
    e.preventDefault();
    if (!editingStore) return;
    const saved = await saveStore(editingStore);
    const existing = stores.find((s) => s.id === editingStore.id);
    if (existing) {
      setStores((prev) => prev.map((s) => (s.id === editingStore.id ? editingStore : s)));
    } else {
      setStores((prev) => [...prev, saved]);
    }
    setEditingStore(null);
  };

  const handleDeleteStore = async (id) => {
    if (window.confirm('¿Deseas eliminar este punto de venta?')) {
      await deleteStore(id);
      setStores((prev) => prev.filter((s) => s.id !== id));
    }
  };

  // --- ACCIONES DE RECETAS ---
  const handleSaveRecipe = async (e) => {
    e.preventDefault();
    if (!editingRecipe) return;

    const processed = {
      ...editingRecipe,
      ingredientes: Array.isArray(editingRecipe.ingredientes)
        ? editingRecipe.ingredientes
        : (editingRecipe.ingredientes || '').split('\n').filter(Boolean),
      pasos: Array.isArray(editingRecipe.pasos)
        ? editingRecipe.pasos
        : (editingRecipe.pasos || '').split('\n').filter(Boolean),
      frutasUsadas: Array.isArray(editingRecipe.frutasUsadas)
        ? editingRecipe.frutasUsadas
        : (editingRecipe.frutasUsadas || 'Mango').split(',').map((f) => f.trim()),
    };

    const saved = await saveRecipe(processed);
    const existing = recipes.find((r) => r.id === processed.id);
    if (existing) {
      setRecipes((prev) => prev.map((r) => (r.id === processed.id ? processed : r)));
    } else {
      setRecipes((prev) => [saved, ...prev]);
    }
    setEditingRecipe(null);
  };

  const handleDeleteRecipe = async (id) => {
    if (window.confirm('¿Deseas eliminar esta receta del blog?')) {
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
    }
  };

  // Filtros
  const filteredMessages = messages.filter((m) => {
    const matchStatus = filterMessageStatus === 'todos' || m.estado === filterMessageStatus;
    const matchType = filterMessageType === 'todos' || m.tipo_contacto === filterMessageType;
    return matchStatus && matchType;
  });

  const filteredOrders = orders.filter((o) => {
    if (filterOrderStatus === 'todos') return true;
    return o.estado === filterOrderStatus;
  });

  const getOrderStatusBadge = (st) => {
    switch (st) {
      case 'entregado':
        return { bg: '#D1E7DD', text: '#0F5132', label: 'Entregado' };
      case 'enviado':
        return { bg: '#CFE2FF', text: '#084298', label: 'En camino' };
      case 'en_preparacion':
        return { bg: '#FFF3CD', text: '#664D03', label: 'En preparación' };
      case 'pagado':
        return { bg: '#D1E7DD', text: '#0F5132', label: 'Pagado' };
      case 'cancelado':
        return { bg: '#F8D7DA', text: '#842029', label: 'Cancelado' };
      case 'pendiente_pago':
      default:
        return { bg: '#FFF3CD', text: '#D97706', label: 'Pendiente' };
    }
  };

  return (
    <div style={{ backgroundColor: '#F8F9FA', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Barra superior de administración */}
      <header
        style={{
          backgroundColor: 'var(--color-selva)',
          color: '#ffffff',
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <Logo size="small" light={true} />
          <span
            style={{
              fontSize: '11px',
              fontFamily: 'var(--font-mono)',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              letterSpacing: '0.04em',
            }}
          >
            PANEL DE GESTIÓN ADMINISTRADOR
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            onClick={() => setActiveTab('seguridad')}
            style={{
              background: activeTab === 'seguridad' ? 'rgba(246, 201, 69, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${activeTab === 'seguridad' ? 'var(--color-mango)' : 'rgba(255, 255, 255, 0.2)'}`,
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
            }}
          >
            <UserCheck size={14} color="var(--color-mango)" />
            <span>{session?.name || 'Samuel Roldán (Admin)'}</span>
          </button>

          <Link
            to="/catalogo"
            target="_blank"
            style={{
              color: 'rgba(255, 255, 255, 0.85)',
              fontSize: 'var(--text-xs)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              textDecoration: 'none',
              padding: '0.35rem 0.6rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
            }}
          >
            <ExternalLink size={13} />
            <span>Ver Tienda</span>
          </Link>

          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem 0.75rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: 'var(--text-xs)',
              cursor: 'pointer',
            }}
          >
            <LogOut size={14} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </header>

      {/* Contenido principal */}
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3.5rem', flex: 1 }}>
        {/* Banner de Modo Seguro / Estado de Sincronización */}
        {isDemoMode ? (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: '#FFF8E1',
              border: '1px solid #FFE082',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              fontSize: 'var(--text-xs)',
              color: '#6d4c41',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={16} color="#FFA000" />
              <span>
                <strong>Modo Administrador Seguro Local:</strong> Estás autenticado como <strong>{session?.name || 'Samuel Roldán'}</strong>. Todas las órdenes, tiendas y recetas se gestionan con persistencia inmediata y cifrada en tu navegador.
              </span>
            </div>
            <button
              onClick={() => setActiveTab('seguridad')}
              style={{
                background: 'none',
                border: 'none',
                textDecoration: 'underline',
                fontWeight: 700,
                color: 'var(--color-selva)',
                cursor: 'pointer',
                fontSize: 'var(--text-xs)',
              }}
            >
              Configurar Clave / Ver Backup ⚙️
            </button>
          </div>
        ) : (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: '#E8F5E9',
              border: '1px solid #A5D6A7',
              borderRadius: 'var(--radius-md)',
              marginBottom: '2rem',
              fontSize: 'var(--text-xs)',
              color: '#1B5E20',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <CheckCircle size={16} color="#2E7D32" />
            <span>
              <strong>Base de Datos Supabase Conectada:</strong> Los pedidos y cambios se sincronizan en la nube en tiempo real.
            </span>
          </div>
        )}

        {/* Tarjetas de Métricas de Resumen */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem',
          }}
        >
          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff', cursor: 'pointer' }} onClick={() => setActiveTab('pedidos')}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', display: 'block' }}>
              Pedidos Totales
            </span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-selva)', fontFamily: 'var(--font-display)' }}>
              {orders.length}
            </span>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff', cursor: 'pointer' }} onClick={() => { setActiveTab('pedidos'); setFilterOrderStatus('pendiente_pago'); }}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', display: 'block' }}>
              Pedidos Pendientes
            </span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#D97706', fontFamily: 'var(--font-display)' }}>
              {orders.filter((o) => o.estado === 'pendiente_pago' || o.estado === 'en_preparacion').length}
            </span>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff', cursor: 'pointer' }} onClick={() => setActiveTab('mensajes')}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', display: 'block' }}>
              Mensajes Nuevos
            </span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-coral)', fontFamily: 'var(--font-display)' }}>
              {messages.filter((m) => m.estado === 'nuevo').length}
            </span>
          </div>

          <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff', cursor: 'pointer' }} onClick={() => setActiveTab('tiendas')}>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', display: 'block' }}>
              Puntos de Venta (Mapa)
            </span>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-selva)', fontFamily: 'var(--font-display)' }}>
              {stores.length}
            </span>
          </div>
        </div>

        {/* Selector de pestañas */}
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            borderBottom: '1px solid var(--color-border)',
            marginBottom: '2rem',
            overflowX: 'auto',
          }}
        >
          <button
            onClick={() => setActiveTab('pedidos')}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'pedidos' ? 'var(--color-selva)' : 'transparent',
              color: activeTab === 'pedidos' ? '#ffffff' : 'var(--color-text-muted)',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              fontWeight: 700,
            }}
          >
            <ShoppingBag size={15} />
            <span>Pedidos Online ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('mensajes')}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'mensajes' ? 'var(--color-selva)' : 'transparent',
              color: activeTab === 'mensajes' ? '#ffffff' : 'var(--color-text-muted)',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              fontWeight: 700,
            }}
          >
            <Inbox size={15} />
            <span>Mensajes B2B / Contacto ({messages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('tiendas')}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'tiendas' ? 'var(--color-selva)' : 'transparent',
              color: activeTab === 'tiendas' ? '#ffffff' : 'var(--color-text-muted)',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              fontWeight: 700,
            }}
          >
            <MapPin size={15} />
            <span>Puntos de Venta ({stores.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('recetas')}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'recetas' ? 'var(--color-selva)' : 'transparent',
              color: activeTab === 'recetas' ? '#ffffff' : 'var(--color-text-muted)',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              fontWeight: 700,
            }}
          >
            <BookOpen size={15} />
            <span>Recetas & Blog ({recipes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('productos')}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'productos' ? 'var(--color-selva)' : 'transparent',
              color: activeTab === 'productos' ? '#ffffff' : 'var(--color-text-muted)',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              fontWeight: 700,
            }}
          >
            <Package size={15} />
            <span>Catálogo ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('seguridad')}
            className="btn btn-sm"
            style={{
              backgroundColor: activeTab === 'seguridad' ? 'var(--color-coral)' : 'transparent',
              color: activeTab === 'seguridad' ? '#ffffff' : 'var(--color-text-muted)',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              fontWeight: 700,
              marginLeft: 'auto',
            }}
          >
            <KeyRound size={15} />
            <span>Seguridad & Mi Perfil</span>
          </button>
        </div>

        {/* ==================================================================
            PESTAÑA 1: PEDIDOS E-COMMERCE
            ================================================================== */}
        {activeTab === 'pedidos' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem',
                backgroundColor: '#ffffff',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-selva)' }}>
                  Estado de Pedido:
                </span>
                <select
                  value={filterOrderStatus}
                  onChange={(e) => setFilterOrderStatus(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: 'var(--text-xs)' }}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="pendiente_pago">Pendiente de pago</option>
                  <option value="pagado">Pagado</option>
                  <option value="en_preparacion">En preparación</option>
                  <option value="enviado">En camino / Enviado</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={loadData} className="btn btn-secondary btn-sm" title="Recargar pedidos">
                  <RefreshCw size={14} />
                  <span>Refrescar</span>
                </button>
                <button onClick={exportOrdersCSV} className="btn btn-primary btn-sm" title="Descargar CSV seguro">
                  <Download size={14} />
                  <span>Exportar Pedidos CSV</span>
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID Pedido</th>
                    <th>Fecha</th>
                    <th>Cliente</th>
                    <th>Ciudad</th>
                    <th>Artículos</th>
                    <th>Total</th>
                    <th>Método</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                        No hay pedidos registrados con el filtro actual.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((o) => {
                      const badge = getOrderStatusBadge(o.estado);
                      return (
                        <tr key={o.id}>
                          <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, color: 'var(--color-selva)' }}>
                            {o.id}
                          </td>
                          <td style={{ fontSize: '11px', whiteSpace: 'nowrap', color: 'var(--color-text-light)' }}>
                            {formatDate(o.created_at)}
                          </td>
                          <td>
                            <strong style={{ color: 'var(--color-selva)', display: 'block' }}>{o.cliente?.nombre}</strong>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>{o.cliente?.telefono}</span>
                          </td>
                          <td style={{ fontSize: '12px' }}>
                            {o.direccion?.ciudad || 'Barranquilla'}
                          </td>
                          <td style={{ fontSize: '11px', maxWidth: '180px' }}>
                            {(o.items || []).map((it) => `${it.cantidad}x ${it.nombre}`).join(', ')}
                          </td>
                          <td style={{ fontWeight: 800, color: 'var(--color-selva)', whiteSpace: 'nowrap' }}>
                            {formatCOP(o.total)}
                          </td>
                          <td>
                            <span style={{ fontSize: '10.5px', textTransform: 'capitalize' }}>
                              {o.metodoPago === 'contraentrega' ? 'Contra Entrega' : o.metodoPago === 'transferencia' ? 'Nequi / Bancolombia' : 'WhatsApp'}
                            </span>
                          </td>
                          <td>
                            <select
                              value={o.estado || 'pendiente_pago'}
                              onChange={(e) => handleOrderStatusChange(o.id, e.target.value)}
                              style={{
                                padding: '0.25rem 0.5rem',
                                fontSize: '10.5px',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--color-border)',
                                backgroundColor: badge.bg,
                                color: badge.text,
                                fontWeight: 700,
                                cursor: 'pointer',
                              }}
                            >
                              <option value="pendiente_pago">Pendiente</option>
                              <option value="pagado">Pagado</option>
                              <option value="en_preparacion">En preparación</option>
                              <option value="enviado">En camino</option>
                              <option value="entregado">Entregado</option>
                              <option value="cancelado">Cancelado</option>
                            </select>
                          </td>
                          <td>
                            <button
                              onClick={() => setSelectedOrder(o)}
                              className="btn btn-secondary btn-sm"
                              style={{ padding: '0.3rem 0.6rem', fontSize: '11px' }}
                            >
                              <Eye size={12} />
                              <span>Ver</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================
            PESTAÑA 2: MENSAJES DE CONTACTO Y B2B
            ================================================================== */}
        {activeTab === 'mensajes' && (
          <div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.5rem',
                backgroundColor: '#ffffff',
                padding: '1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-selva)' }}>
                  Estado:
                </span>
                <select
                  value={filterMessageStatus}
                  onChange={(e) => setFilterMessageStatus(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: 'var(--text-xs)' }}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="nuevo">Nuevos</option>
                  <option value="leido">Leídos</option>
                  <option value="respondido">Respondidos</option>
                </select>

                <span style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-selva)', marginLeft: '0.5rem' }}>
                  Tipo:
                </span>
                <select
                  value={filterMessageType}
                  onChange={(e) => setFilterMessageType(e.target.value)}
                  className="form-select"
                  style={{ width: 'auto', padding: '0.4rem 0.75rem', fontSize: 'var(--text-xs)' }}
                >
                  <option value="todos">Todos los tipos</option>
                  <option value="Consumidor">Consumidores</option>
                  <option value="Negocio">Negocios (B2B)</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={loadData} className="btn btn-secondary btn-sm" title="Recargar datos">
                  <RefreshCw size={14} />
                  <span>Refrescar</span>
                </button>
                <button onClick={exportMessagesCSV} className="btn btn-primary btn-sm" title="Descargar CSV seguro">
                  <Download size={14} />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Contacto</th>
                    <th>Mensaje</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMessages.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--color-text-muted)' }}>
                        No hay mensajes con los filtros seleccionados.
                      </td>
                    </tr>
                  ) : (
                    filteredMessages.map((m) => (
                      <tr key={m.id}>
                        <td style={{ fontSize: '11px', whiteSpace: 'nowrap', color: 'var(--color-text-light)' }}>
                          {formatDate(m.created_at)}
                        </td>
                        <td>
                          <strong style={{ color: 'var(--color-selva)' }}>{m.nombre}</strong>
                          {m.nombre_negocio && (
                            <span style={{ display: 'block', fontSize: '11px', color: 'var(--color-coral)', fontWeight: 600 }}>
                              {m.nombre_negocio}
                            </span>
                          )}
                        </td>
                        <td>
                          <span
                            style={{
                              fontSize: '11px',
                              padding: '0.2rem 0.5rem',
                              borderRadius: 'var(--radius-full)',
                              backgroundColor: m.tipo_contacto === 'Negocio' ? 'var(--color-mango-light)' : 'var(--color-crema)',
                              color: 'var(--color-selva)',
                              fontWeight: 600,
                            }}
                          >
                            {m.tipo_contacto}
                          </span>
                        </td>
                        <td style={{ fontSize: '12px' }}>
                          <div>{m.email}</div>
                          {m.whatsapp && (
                            <a
                              href={`https://wa.me/${m.whatsapp.replace(/\D/g, '')}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: '#25D366', fontWeight: 600, fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '2px' }}
                            >
                              <MessageCircle size={11} /> {m.whatsapp}
                            </a>
                          )}
                        </td>
                        <td style={{ maxWidth: '280px', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          <span style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {m.mensaje}
                          </span>
                        </td>
                        <td>
                          <select
                            value={m.estado || 'nuevo'}
                            onChange={(e) => handleMessageStatusChange(m.id, e.target.value)}
                            style={{
                              padding: '0.3rem 0.5rem',
                              fontSize: '11px',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--color-border)',
                              backgroundColor:
                                m.estado === 'nuevo'
                                  ? '#FFF3CD'
                                  : m.estado === 'respondido'
                                  ? '#D1E7DD'
                                  : '#E2E3E5',
                              fontWeight: 600,
                              cursor: 'pointer',
                            }}
                          >
                            <option value="nuevo">Nuevo</option>
                            <option value="leido">Leído</option>
                            <option value="respondido">Respondido</option>
                          </select>
                        </td>
                        <td>
                          <button
                            onClick={() => setSelectedMessage(m)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '11px' }}
                          >
                            <Eye size={12} />
                            <span>Ver</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================
            PESTAÑA 3: PUNTOS DE VENTA (TIENDAS B2B)
            ================================================================== */}
        {activeTab === 'tiendas' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Puntos de Venta y Tiendas Piloto</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                  Administra los comercios físicos que aparecen en el mapa interactivo de FRUITES.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/tiendas" target="_blank" className="btn btn-secondary btn-sm">
                  <ExternalLink size={14} />
                  <span>Ver mapa público</span>
                </Link>
                <button
                  onClick={() =>
                    setEditingStore({
                      id: '',
                      nombre: '',
                      categoria: 'Café de Especialidad',
                      tipo: 'Café',
                      direccion: '',
                      barrio: '',
                      ciudad: 'Barranquilla',
                      departamento: 'Atlántico',
                      lat: 11.0041,
                      lng: -74.807,
                      telefono: '3249037227',
                      whatsapp: '573249037227',
                      horario: 'Lunes a Sábado: 8:00 a.m. - 7:00 p.m.',
                      saboresDisponibles: ['Mango Tropical', 'Piña Dorada'],
                      esClienteB2B: true,
                      activo: true,
                    })
                  }
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} />
                  <span>Agregar Punto de Venta</span>
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Nombre Tienda</th>
                    <th>Categoría</th>
                    <th>Ubicación</th>
                    <th>Contacto</th>
                    <th>Sabores</th>
                    <th>B2B</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {stores.map((st) => (
                    <tr key={st.id}>
                      <td>
                        <strong style={{ color: 'var(--color-selva)' }}>{st.nombre}</strong>
                        <div style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>
                          🕒 {st.horario}
                        </div>
                      </td>
                      <td>
                        <span style={{ fontSize: '11px', color: 'var(--color-coral)', fontWeight: 600 }}>
                          {st.categoria || st.tipo}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px' }}>
                        <div>{st.direccion}</div>
                        <span style={{ color: 'var(--color-text-light)', fontSize: '11px' }}>
                          {st.barrio}, {st.ciudad}
                        </span>
                      </td>
                      <td style={{ fontSize: '12px' }}>
                        {st.whatsapp && (
                          <a
                            href={`https://wa.me/${st.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: '#25D366', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                          >
                            <MessageCircle size={11} /> {st.whatsapp}
                          </a>
                        )}
                      </td>
                      <td style={{ fontSize: '11px', maxWidth: '200px' }}>
                        {(st.saboresDisponibles || []).join(', ')}
                      </td>
                      <td>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            color: st.esClienteB2B ? 'var(--color-selva)' : 'var(--color-text-light)',
                            backgroundColor: st.esClienteB2B ? 'var(--color-mango-light)' : 'transparent',
                            padding: '0.2rem 0.5rem',
                            borderRadius: 'var(--radius-full)',
                          }}
                        >
                          {st.esClienteB2B ? 'Aliado Piloto' : 'Estándar'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button
                            onClick={() => setEditingStore({ ...st })}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '0.3rem 0.55rem', fontSize: '11px' }}
                            title="Editar punto de venta"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeleteStore(st.id)}
                            className="btn btn-sm"
                            style={{ padding: '0.3rem 0.55rem', fontSize: '11px', backgroundColor: '#F8D7DA', color: '#842029', border: 'none' }}
                            title="Eliminar punto de venta"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================
            PESTAÑA 4: RECETAS Y BLOG
            ================================================================== */}
        {activeTab === 'recetas' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Gestión de Recetas & Blog</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                  Crea y edita preparaciones culinarias y artículos de estilo de vida frutal.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/recetas" target="_blank" className="btn btn-secondary btn-sm">
                  <ExternalLink size={14} />
                  <span>Ver recetario público</span>
                </Link>
                <button
                  onClick={() =>
                    setEditingRecipe({
                      id: '',
                      titulo: '',
                      subtitulo: '',
                      categoria: 'Desayunos & Bowls',
                      tiempoPrep: '10 min',
                      dificultad: 'Fácil',
                      porciones: '1 - 2 personas',
                      frutasUsadas: ['Mango'],
                      imagen: '/images/recipe_smoothie_bowl.jpg',
                      extracto: '',
                      ingredientes: '',
                      pasos: '',
                      consejos: '',
                      publicado: true,
                    })
                  }
                  className="btn btn-primary btn-sm"
                >
                  <Plus size={14} />
                  <span>Nueva Receta</span>
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {recipes.map((rec) => (
                <div
                  key={rec.id}
                  className="card"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--color-border)',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ height: '140px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', marginBottom: '0.85rem' }}>
                    <img src={rec.imagen} alt={rec.titulo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>

                  <span style={{ fontSize: '11px', color: 'var(--color-coral)', fontWeight: 700, textTransform: 'uppercase' }}>
                    {rec.categoria}
                  </span>

                  <h4 style={{ fontSize: 'var(--text-base)', color: 'var(--color-selva)', margin: '0.35rem 0' }}>
                    {rec.titulo}
                  </h4>

                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', lineHeight: 1.5, marginBottom: '1rem', flexGrow: 1 }}>
                    {rec.extracto}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>
                      ⏱ {rec.tiempoPrep}
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() =>
                          setEditingRecipe({
                            ...rec,
                            ingredientes: Array.isArray(rec.ingredientes) ? rec.ingredientes.join('\n') : rec.ingredientes,
                            pasos: Array.isArray(rec.pasos) ? rec.pasos.join('\n') : rec.pasos,
                            frutasUsadas: Array.isArray(rec.frutasUsadas) ? rec.frutasUsadas.join(', ') : rec.frutasUsadas,
                          })
                        }
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '11px' }}
                      >
                        <Edit2 size={12} />
                        <span>Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeleteRecipe(rec.id)}
                        className="btn btn-sm"
                        style={{ padding: '0.3rem 0.6rem', fontSize: '11px', backgroundColor: '#F8D7DA', color: '#842029', border: 'none' }}
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            PESTAÑA 5: CATÁLOGO DE PRODUCTOS
            ================================================================== */}
        {activeTab === 'productos' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h3 style={{ fontSize: 'var(--text-lg)', margin: 0 }}>Gestión de la Colección Tropical</h3>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                  Activa o desactiva la visibilidad pública de cada sabor o edita sus textos descriptivos.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {products.map((p) => (
                <div
                  key={p.id}
                  className="card"
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid var(--color-border)',
                    padding: '1.5rem',
                    opacity: p.disponible ? 1 : 0.65,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: p.colorPrincipal,
                          display: 'inline-block',
                        }}
                      />
                      <strong style={{ fontSize: 'var(--text-base)', color: 'var(--color-selva)' }}>
                        {p.nombre}
                      </strong>
                    </div>

                    <button
                      onClick={() => handleToggleProduct(p)}
                      style={{
                        padding: '0.25rem 0.6rem',
                        fontSize: '11px',
                        borderRadius: 'var(--radius-full)',
                        border: 'none',
                        cursor: 'pointer',
                        backgroundColor: p.disponible ? '#D1E7DD' : '#F8D7DA',
                        color: p.disponible ? '#0F5132' : '#842029',
                        fontWeight: 700,
                      }}
                    >
                      {p.disponible ? 'Activo en web' : 'Oculto'}
                    </button>
                  </div>

                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '1rem', flexGrow: 1 }}>
                    {p.descripcionCorta}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--color-border-subtle)', paddingTop: '0.75rem' }}>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-light)' }}>
                      Orden: #{p.orden || 1}
                    </span>
                    <button
                      onClick={() => setEditingProduct({ ...p })}
                      className="btn btn-secondary btn-sm"
                      style={{ padding: '0.3rem 0.75rem', fontSize: '11px' }}
                    >
                      Editar textos
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================
            PESTAÑA 6 (NUEVA): SEGURIDAD & MI PERFIL ADMINISTRADOR
            ================================================================== */}
        {activeTab === 'seguridad' && (
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: 'var(--text-xl)', color: 'var(--color-selva)', margin: '0 0 0.25rem 0' }}>
                Seguridad, Credenciales & Centro de Control
              </h3>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                Gestiona tu acceso como administrador exclusivo, cambia tu contraseña y realiza respaldos de la tienda.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Tarjeta 1: Perfil del Administrador */}
              <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.75rem', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: 'var(--color-crema)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <UserCheck size={24} color="var(--color-selva)" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--color-selva)' }}>
                      {session?.name || 'Samuel Roldán Orozco'}
                    </h4>
                    <span style={{ fontSize: '11px', color: 'var(--color-coral)', fontWeight: 700 }}>
                      Super Administrador — FRUITES
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: 'var(--text-xs)', backgroundColor: 'var(--color-crema)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem' }}>
                  <div>
                    <strong style={{ color: 'var(--color-selva)' }}>Correo Oficial:</strong>
                    <div style={{ fontFamily: 'var(--font-mono)' }}>{session?.email || PRIMARY_ADMIN_EMAIL}</div>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--color-selva)' }}>Nivel de Acceso:</strong>
                    <div>Total (Pedidos, Catálogo, Tiendas, Recetas, Backups)</div>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--color-selva)' }}>Almacén de Datos:</strong>
                    <div>{isDemoMode ? 'Local Seguro (Navegador Administrador)' : 'Supabase Cloud Postgres'}</div>
                  </div>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--color-text-light)', lineHeight: 1.5 }}>
                  🛡️ Tu sesión está protegida con verificación de credenciales maestras y control anti-fuerza bruta.
                </div>
              </div>

              {/* Tarjeta 2: Cambiar Contraseña */}
              <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.75rem', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <Lock size={18} color="var(--color-selva)" />
                  <h4 style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--color-selva)' }}>
                    Cambiar Mi Contraseña
                  </h4>
                </div>

                <form onSubmit={handleChangePassword}>
                  <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Contraseña Actual</label>
                    <input
                      type="password"
                      required
                      value={currentPassInput}
                      onChange={(e) => setCurrentPassInput(e.target.value)}
                      placeholder="••••••••••••"
                      className="form-input"
                      style={{ fontSize: 'var(--text-xs)', padding: '0.6rem 0.85rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '0.85rem' }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Nueva Contraseña (mínimo 6 caracteres)</label>
                    <input
                      type="password"
                      required
                      value={newPassInput}
                      onChange={(e) => setNewPassInput(e.target.value)}
                      placeholder="Escribe tu nueva clave"
                      className="form-input"
                      style={{ fontSize: 'var(--text-xs)', padding: '0.6rem 0.85rem' }}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label" style={{ fontSize: '11px' }}>Confirmar Nueva Contraseña</label>
                    <input
                      type="password"
                      required
                      value={confirmPassInput}
                      onChange={(e) => setConfirmPassInput(e.target.value)}
                      placeholder="Repite la nueva clave"
                      className="form-input"
                      style={{ fontSize: 'var(--text-xs)', padding: '0.6rem 0.85rem' }}
                    />
                  </div>

                  {passwordMsg.text && (
                    <div
                      style={{
                        padding: '0.65rem 0.85rem',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '11px',
                        marginBottom: '1rem',
                        backgroundColor: passwordMsg.type === 'success' ? '#D1E7DD' : '#FDEEE9',
                        color: passwordMsg.type === 'success' ? '#0F5132' : '#842029',
                      }}
                    >
                      {passwordMsg.text}
                    </div>
                  )}

                  <button type="submit" className="btn btn-selva btn-sm" style={{ width: '100%' }}>
                    <KeyRound size={14} />
                    <span>Guardar Nueva Contraseña</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Fila 2: Respaldos de Datos y Guía de Funcionamiento */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
              {/* Respaldos (Backup) */}
              <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.75rem', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <Database size={18} color="var(--color-selva)" />
                  <h4 style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--color-selva)' }}>
                    Copias de Seguridad (Backup & Restore)
                  </h4>
                </div>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                  Descarga una copia completa de toda la base de datos de tu tienda (pedidos, clientes, tiendas y recetas) para guardarla en tu computador o restaurarla en otro equipo.
                </p>

                {backupMsg.text && (
                  <div
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: 'var(--radius-sm)',
                      fontSize: '11px',
                      marginBottom: '1rem',
                      backgroundColor: backupMsg.type === 'success' ? '#D1E7DD' : '#FDEEE9',
                      color: backupMsg.type === 'success' ? '#0F5132' : '#842029',
                    }}
                  >
                    {backupMsg.text}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <button
                    onClick={handleDownloadBackup}
                    className="btn btn-primary btn-sm"
                    style={{ justifyContent: 'center' }}
                  >
                    <Download size={14} />
                    <span>Descargar Copia de Seguridad (.json)</span>
                  </button>

                  <label
                    className="btn btn-secondary btn-sm"
                    style={{ justifyContent: 'center', cursor: 'pointer', margin: 0 }}
                  >
                    <Upload size={14} />
                    <span>Restaurar desde archivo de respaldo</span>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleRestoreBackup}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>

              {/* Guía Explicativa: Cómo funciona */}
              <div className="card" style={{ backgroundColor: '#ffffff', padding: '1.75rem', border: '1px solid var(--color-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <HelpCircle size={18} color="var(--color-selva)" />
                  <h4 style={{ margin: 0, fontSize: 'var(--text-base)', color: 'var(--color-selva)' }}>
                    ¿Cómo funciona tu Zona de Gestión?
                  </h4>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: 'var(--text-xs)', color: 'var(--color-text-main)', lineHeight: 1.5 }}>
                  <div>
                    <strong style={{ color: 'var(--color-selva)' }}>1. Pedidos Online:</strong>
                    <p style={{ margin: '0.15rem 0 0 0', color: 'var(--color-text-muted)' }}>
                      Aquí llegan las compras de los clientes. Puedes ver los productos pedidos, la dirección de despacho en Colombia y cambiar el estado (ej. <em>Pagado</em>, <em>En camino</em>). Con un clic abres un chat de WhatsApp con el cliente para coordinar la entrega.
                    </p>
                  </div>

                  <div>
                    <strong style={{ color: 'var(--color-selva)' }}>2. Mensajes B2B & Contacto:</strong>
                    <p style={{ margin: '0.15rem 0 0 0', color: 'var(--color-text-muted)' }}>
                      Revisa las solicitudes de cafés, tiendas saludables o gimnasios que quieren vender FRUITES. Puedes responderles de inmediato y exportar la lista a Excel.
                    </p>
                  </div>

                  <div>
                    <strong style={{ color: 'var(--color-selva)' }}>3. Puntos de Venta (Mapa):</strong>
                    <p style={{ margin: '0.15rem 0 0 0', color: 'var(--color-text-muted)' }}>
                      Agrega o edita comercios aliados. Las coordenadas que pongas ubican automáticamente el pin en el mapa interactivo de la página pública.
                    </p>
                  </div>

                  <div>
                    <strong style={{ color: 'var(--color-selva)' }}>4. Recetas & Catálogo:</strong>
                    <p style={{ margin: '0.15rem 0 0 0', color: 'var(--color-text-muted)' }}>
                      Publica nuevas recetas saludables y activa o pausa la visibilidad de los sabores de la Colección Tropical cuando desees.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: DETALLES DE PEDIDO */}
      {selectedOrder && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 1000 }} onClick={() => setSelectedOrder(null)}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '2rem', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--color-coral)', fontWeight: 700 }}>
                  PEDIDO {selectedOrder.id}
                </span>
                <h3 style={{ fontSize: 'var(--text-xl)', margin: '0.25rem 0 0 0' }}>{selectedOrder.cliente?.nombre}</h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-light)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', backgroundColor: 'var(--color-crema)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: 'var(--text-xs)' }}>
              <div>
                <strong>Contacto:</strong>
                <div>{selectedOrder.cliente?.email}</div>
                <div>{selectedOrder.cliente?.telefono}</div>
              </div>
              <div>
                <strong>Dirección de Entrega:</strong>
                <div>{selectedOrder.direccion?.direccion} {selectedOrder.direccion?.detalles}</div>
                <div>{selectedOrder.direccion?.barrio}, {selectedOrder.direccion?.ciudad}</div>
              </div>
            </div>

            <h4 style={{ fontSize: 'var(--text-sm)', marginBottom: '0.75rem' }}>Productos Solicitados</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
              {(selectedOrder.items || []).map((it, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border-subtle)', fontSize: 'var(--text-xs)' }}>
                  <div>
                    <span style={{ fontWeight: 700 }}>{it.cantidad}x {it.nombre}</span>
                    <span style={{ color: 'var(--color-text-light)', marginLeft: '0.5rem' }}>({it.tamano})</span>
                  </div>
                  <strong>{formatCOP(it.precio * it.cantidad)}</strong>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: 'var(--color-crema-light)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: 'var(--text-xs)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span>Subtotal:</span>
                <span>{formatCOP(selectedOrder.subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span>Envío:</span>
                <span>{selectedOrder.costoEnvio === 0 ? '¡Gratis!' : formatCOP(selectedOrder.costoEnvio)}</span>
              </div>
              {selectedOrder.descuento > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', color: '#16A34A', fontWeight: 700 }}>
                  <span>Descuento aplicado:</span>
                  <span>-{formatCOP(selectedOrder.descuento)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--color-border)', paddingTop: '0.5rem', fontWeight: 800, fontSize: 'var(--text-base)', color: 'var(--color-selva)' }}>
                <span>Total Pedido:</span>
                <span>{formatCOP(selectedOrder.total)}</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
              {selectedOrder.cliente?.telefono && (
                <a
                  href={`https://wa.me/${selectedOrder.cliente.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `¡Hola ${selectedOrder.cliente.nombre}! Te escribimos de FRUITES acerca de tu pedido #${selectedOrder.id}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm"
                >
                  <MessageCircle size={14} />
                  <span>Contactar Cliente por WhatsApp</span>
                </a>
              )}
              <button onClick={() => setSelectedOrder(null)} className="btn btn-secondary btn-sm">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: VER MENSAJE */}
      {selectedMessage && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 1000 }} onClick={() => setSelectedMessage(null)}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '2rem', maxWidth: '540px', width: '100%', boxShadow: 'var(--shadow-xl)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: 'var(--color-selva)', backgroundColor: 'var(--color-crema)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                {selectedMessage.tipo_contacto}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-light)' }}>
                {formatDate(selectedMessage.created_at)}
              </span>
            </div>

            <h3 style={{ fontSize: 'var(--text-xl)', marginBottom: '0.25rem' }}>{selectedMessage.nombre}</h3>
            {selectedMessage.nombre_negocio && (
              <p style={{ color: 'var(--color-coral)', fontWeight: 600, fontSize: 'var(--text-sm)', marginBottom: '1rem' }}>
                Negocio: {selectedMessage.nombre_negocio}
              </p>
            )}

            <div style={{ backgroundColor: 'var(--color-crema)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1.25rem', fontSize: 'var(--text-sm)' }}>
              <div><strong>Correo:</strong> {selectedMessage.email}</div>
              {selectedMessage.whatsapp && <div><strong>WhatsApp:</strong> {selectedMessage.whatsapp}</div>}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <strong style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', display: 'block', marginBottom: '0.4rem' }}>
                Mensaje recibido:
              </strong>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-main)', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                {selectedMessage.mensaje}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {selectedMessage.whatsapp && (
                <a
                  href={`https://wa.me/${selectedMessage.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(
                    `¡Hola ${selectedMessage.nombre}! Te escribimos de FRUITES respecto a tu mensaje.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp btn-sm"
                >
                  <MessageCircle size={14} />
                  <span>Responder por WhatsApp</span>
                </a>
              )}
              <button onClick={() => setSelectedMessage(null)} className="btn btn-secondary btn-sm">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR / AGREGAR TIENDA */}
      {editingStore && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 1000 }} onClick={() => setEditingStore(null)}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '2rem', maxWidth: '580px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '1.25rem' }}>
              {editingStore.id ? `Editar Tienda: ${editingStore.nombre}` : 'Registrar Nuevo Punto de Venta'}
            </h3>

            <form onSubmit={handleSaveStore}>
              <div className="form-group">
                <label className="form-label">Nombre del Comercio / Punto de Venta *</label>
                <input
                  type="text"
                  required
                  value={editingStore.nombre}
                  onChange={(e) => setEditingStore({ ...editingStore, nombre: e.target.value })}
                  className="form-input"
                  placeholder="Ej. Café & Botánica"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Tipo de Comercio</label>
                  <select
                    value={editingStore.tipo || 'Café'}
                    onChange={(e) => setEditingStore({ ...editingStore, tipo: e.target.value, categoria: e.target.value })}
                    className="form-select"
                  >
                    <option value="Café">Café de Especialidad</option>
                    <option value="Tienda Saludable">Tienda Saludable</option>
                    <option value="Gimnasio">Gimnasio & Fitness</option>
                    <option value="Mercado Gourmet">Mercado Gourmet</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ciudad</label>
                  <input
                    type="text"
                    required
                    value={editingStore.ciudad}
                    onChange={(e) => setEditingStore({ ...editingStore, ciudad: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Dirección *</label>
                  <input
                    type="text"
                    required
                    value={editingStore.direccion}
                    onChange={(e) => setEditingStore({ ...editingStore, direccion: e.target.value })}
                    className="form-input"
                    placeholder="Calle 76 # 54-21"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Barrio</label>
                  <input
                    type="text"
                    value={editingStore.barrio || ''}
                    onChange={(e) => setEditingStore({ ...editingStore, barrio: e.target.value })}
                    className="form-input"
                    placeholder="Alto Prado"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Latitud (ej: 11.0041)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={editingStore.lat}
                    onChange={(e) => setEditingStore({ ...editingStore, lat: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Longitud (ej: -74.8070)</label>
                  <input
                    type="number"
                    step="0.0001"
                    required
                    value={editingStore.lng}
                    onChange={(e) => setEditingStore({ ...editingStore, lng: parseFloat(e.target.value) || 0 })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Horario de Atención</label>
                <input
                  type="text"
                  value={editingStore.horario}
                  onChange={(e) => setEditingStore({ ...editingStore, horario: e.target.value })}
                  className="form-input"
                  placeholder="Lunes a Sábado: 8:00 a.m. - 7:00 p.m."
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    value={editingStore.telefono}
                    onChange={(e) => setEditingStore({ ...editingStore, telefono: e.target.value })}
                    className="form-input"
                    placeholder="+57 324 903 7227"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">WhatsApp</label>
                  <input
                    type="text"
                    value={editingStore.whatsapp}
                    onChange={(e) => setEditingStore({ ...editingStore, whatsapp: e.target.value })}
                    className="form-input"
                    placeholder="573249037227"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-checkbox-label">
                  <input
                    type="checkbox"
                    checked={editingStore.esClienteB2B}
                    onChange={(e) => setEditingStore({ ...editingStore, esClienteB2B: e.target.checked })}
                  />
                  <span>Marcar como Aliado Piloto de FRUITES</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setEditingStore(null)} className="btn btn-secondary btn-sm">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Guardar Tienda
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR / CREAR RECETA */}
      {editingRecipe && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 1000 }} onClick={() => setEditingRecipe(null)}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '2rem', maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: 'var(--shadow-xl)' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '1.25rem' }}>
              {editingRecipe.id ? `Editar: ${editingRecipe.titulo}` : 'Crear Nueva Receta o Artículo'}
            </h3>

            <form onSubmit={handleSaveRecipe}>
              <div className="form-group">
                <label className="form-label">Título de la Receta / Artículo *</label>
                <input
                  type="text"
                  required
                  value={editingRecipe.titulo}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, titulo: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Categoría</label>
                  <select
                    value={editingRecipe.categoria}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, categoria: e.target.value })}
                    className="form-select"
                  >
                    <option value="Desayunos & Bowls">Desayunos & Bowls</option>
                    <option value="Snacks & Pausas">Snacks & Pausas</option>
                    <option value="Desayunos para Llevar">Desayunos para Llevar</option>
                    <option value="Hábitos & Estilo de Vida">Hábitos & Estilo de Vida</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Tiempo de preparación / lectura</label>
                  <input
                    type="text"
                    value={editingRecipe.tiempoPrep}
                    onChange={(e) => setEditingRecipe({ ...editingRecipe, tiempoPrep: e.target.value })}
                    className="form-input"
                    placeholder="Ej. 10 min o Lectura 4 min"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Imagen destacada (Ruta en /images/ o URL)</label>
                <input
                  type="text"
                  value={editingRecipe.imagen}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, imagen: e.target.value })}
                  className="form-input"
                  placeholder="/images/recipe_smoothie_bowl.jpg"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Extracto breve (para tarjeta y redes)</label>
                <textarea
                  rows={2}
                  required
                  value={editingRecipe.extracto}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, extracto: e.target.value })}
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ingredientes (un ingrediente por línea)</label>
                <textarea
                  rows={4}
                  value={editingRecipe.ingredientes}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, ingredientes: e.target.value })}
                  className="form-textarea"
                  placeholder="1 taza de avena&#10;1 paquete Mango FRUITES&#10;1 cucharada de chía"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Pasos de preparación (un paso por línea)</label>
                <textarea
                  rows={4}
                  value={editingRecipe.pasos}
                  onChange={(e) => setEditingRecipe({ ...editingRecipe, pasos: e.target.value })}
                  className="form-textarea"
                  placeholder="Mezcla la avena con la leche...&#10;Decora con los snacks de fruta deshidratada..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button type="button" onClick={() => setEditingRecipe(null)} className="btn btn-secondary btn-sm">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Guardar Receta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: EDITAR PRODUCTO */}
      {editingProduct && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', zIndex: 1000 }} onClick={() => setEditingProduct(null)}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: 'var(--radius-lg)', padding: '2rem', maxWidth: '540px', width: '100%', boxShadow: 'var(--shadow-xl)' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: 'var(--text-lg)', marginBottom: '1.25rem' }}>
              Editar Sabor: {editingProduct.nombre}
            </h3>

            <form onSubmit={handleSaveProductEdit}>
              <div className="form-group">
                <label className="form-label">Nombre del Producto</label>
                <input
                  type="text"
                  value={editingProduct.nombre}
                  onChange={(e) => setEditingProduct({ ...editingProduct, nombre: e.target.value })}
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción Corta</label>
                <textarea
                  value={editingProduct.descripcionCorta}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descripcionCorta: e.target.value })}
                  className="form-textarea"
                  rows={2}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descripción Larga</label>
                <textarea
                  value={editingProduct.descripcionLarga || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, descripcionLarga: e.target.value })}
                  className="form-textarea"
                  rows={3}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setEditingProduct(null)} className="btn btn-secondary btn-sm">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary btn-sm">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

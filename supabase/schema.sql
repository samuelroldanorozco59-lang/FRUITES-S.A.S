-- ============================================================================
-- FRUITES — ESQUEMA DE BASE DE DATOS Y REGLAS DE SEGURIDAD (SUPABASE)
-- ============================================================================
-- Tablas:
-- 1. products (Catálogo de snacks tropicales con precios en COP)
-- 2. contact_messages (Mensajes recibidos del formulario web y B2B)
-- 3. stores (Puntos de venta físicos y aliados piloto para mapa interactivo)
-- 4. recipes (Recetas y artículos del blog gastronómico)
-- 5. orders (Pedidos de venta en línea y comercio electrónico)
-- 6. admin_users (Lista de correos autorizados para el panel de administración)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ----------------------------------------------------------------------------
-- 1. TABLA: products
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    fruta TEXT NOT NULL,
    color_principal TEXT NOT NULL,
    color_acento TEXT,
    color_secundario TEXT,
    descripcion_corta TEXT NOT NULL,
    descripcion_larga TEXT,
    perfil_sensorial JSONB,
    momentos_consumo JSONB,
    presentaciones JSONB,
    empaque TEXT DEFAULT 'Bolsa stand-up pouch resellable',
    disponible BOOLEAN DEFAULT TRUE,
    imagen TEXT,
    orden INT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 2. TABLA: contact_messages
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    nombre TEXT NOT NULL,
    email TEXT NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    whatsapp TEXT,
    tipo_contacto TEXT NOT NULL DEFAULT 'Consumidor',
    nombre_negocio TEXT,
    mensaje TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'nuevo' CHECK (estado IN ('nuevo', 'leido', 'respondido'))
);

-- ----------------------------------------------------------------------------
-- 3. TABLA: stores (Puntos de venta / mapa interactivo)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre TEXT NOT NULL,
    categoria TEXT DEFAULT 'Café de Especialidad',
    tipo TEXT DEFAULT 'Café',
    direccion TEXT NOT NULL,
    barrio TEXT,
    ciudad TEXT NOT NULL DEFAULT 'Barranquilla',
    departamento TEXT DEFAULT 'Atlántico',
    pais TEXT DEFAULT 'Colombia',
    lat DOUBLE PRECISION NOT NULL CHECK (lat BETWEEN -90 AND 90),
    lng DOUBLE PRECISION NOT NULL CHECK (lng BETWEEN -180 AND 180),
    telefono TEXT,
    whatsapp TEXT,
    horario TEXT,
    sabores_disponibles JSONB DEFAULT '[]'::jsonb,
    es_cliente_b2b BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    descripcion TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 4. TABLA: recipes (Recetas y blog frutal)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    titulo TEXT NOT NULL,
    subtitulo TEXT,
    categoria TEXT DEFAULT 'Desayunos & Bowls',
    tiempo_prep TEXT DEFAULT '10 min',
    dificultad TEXT DEFAULT 'Fácil',
    porciones TEXT DEFAULT '1 - 2 personas',
    frutas_usadas JSONB DEFAULT '[]'::jsonb,
    imagen TEXT,
    extracto TEXT NOT NULL,
    ingredientes JSONB DEFAULT '[]'::jsonb,
    pasos JSONB DEFAULT '[]'::jsonb,
    consejos TEXT,
    fecha DATE DEFAULT CURRENT_DATE,
    publicado BOOLEAN DEFAULT TRUE,
    autor TEXT DEFAULT 'Equipo FRUITES',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------------------------------
-- 5. TABLA: orders (Pedidos de comercio electrónico)
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    cliente JSONB NOT NULL,
    direccion JSONB NOT NULL,
    items JSONB NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    costo_envio NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (costo_envio >= 0),
    descuento NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (descuento >= 0),
    total NUMERIC(12, 2) NOT NULL CHECK (total >= 0),
    metodo_pago TEXT NOT NULL CHECK (metodo_pago IN ('contraentrega', 'transferencia', 'whatsapp')),
    estado TEXT NOT NULL DEFAULT 'pendiente_pago' CHECK (estado IN ('pendiente_pago', 'pagado', 'en_preparacion', 'enviado', 'entregado', 'cancelado')),
    notas TEXT
);

-- ----------------------------------------------------------------------------
-- 6. TABLA: admin_users
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- SEGURIDAD: ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Reglas para products
CREATE POLICY "Lectura publica de productos disponibles"
    ON public.products FOR SELECT USING (disponible = TRUE);

CREATE POLICY "Administradores pueden gestionar productos"
    ON public.products FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.admin_users) OR auth.email() IN (SELECT email FROM public.admin_users));

-- Reglas para contact_messages (C-02: inserción pública anónima sin select)
CREATE POLICY "Cualquiera puede enviar mensajes de contacto"
    ON public.contact_messages FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Solo administradores pueden leer mensajes"
    ON public.contact_messages FOR SELECT TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.admin_users) OR auth.email() IN (SELECT email FROM public.admin_users));

CREATE POLICY "Solo administradores pueden actualizar mensajes"
    ON public.contact_messages FOR UPDATE TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.admin_users) OR auth.email() IN (SELECT email FROM public.admin_users));

-- Reglas para stores (Puntos de venta)
CREATE POLICY "Lectura publica de tiendas activas"
    ON public.stores FOR SELECT USING (activo = TRUE);

CREATE POLICY "Administradores pueden gestionar tiendas"
    ON public.stores FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.admin_users) OR auth.email() IN (SELECT email FROM public.admin_users));

-- Reglas para recipes (Blog y recetas)
CREATE POLICY "Lectura publica de recetas publicadas"
    ON public.recipes FOR SELECT USING (publicado = TRUE);

CREATE POLICY "Administradores pueden gestionar recetas"
    ON public.recipes FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.admin_users) OR auth.email() IN (SELECT email FROM public.admin_users));

-- Reglas para orders (E-commerce)
CREATE POLICY "Cualquiera puede registrar un pedido"
    ON public.orders FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Administradores pueden gestionar pedidos"
    ON public.orders FOR ALL TO authenticated
    USING (auth.uid() IN (SELECT id FROM public.admin_users) OR auth.email() IN (SELECT email FROM public.admin_users));

-- Reglas para admin_users
CREATE POLICY "Administradores pueden consultar la lista de admins"
    ON public.admin_users FOR SELECT TO authenticated
    USING (auth.uid() = id);

-- ============================================================================
-- DATOS INICIALES: COLECCIÓN TROPICAL (PRECIOS OFICIALES EN COP)
-- ============================================================================
INSERT INTO public.products (slug, nombre, fruta, color_principal, color_acento, color_secundario, descripcion_corta, descripcion_larga, perfil_sensorial, momentos_consumo, presentaciones, empaque, disponible, imagen, orden)
VALUES
(
    'mango-tropical',
    'Mango Tropical',
    'Mango',
    '#F6C945',
    '#183D32',
    '#FFF4D6',
    'Tiras de mango deshidratado con dulzor característico y textura suave para disfrutar en cualquier momento.',
    'El clásico indiscutible del trópico colombiano. Cada bocado concentra el sabor cálido y vibrante del mango maduro en láminas fáciles de comer.',
    '{"sabor": "Dulce frutal concentrado", "textura": "Flexible y suave", "aroma": "Mango maduro caribeño"}'::jsonb,
    '["Pausa en la oficina", "Antojo dulce a media tarde", "Viajes"]'::jsonb,
    '[{"tamano": "40g", "precio": 9500, "precioTexto": "$9.500 COP", "disponible": true}, {"tamano": "80g", "precio": 17500, "precioTexto": "$17.500 COP", "disponible": true}]'::jsonb,
    'Bolsa stand-up pouch resellable',
    TRUE,
    '/images/mango_pouch.jpg',
    1
),
(
    'pina-dorada',
    'Piña Dorada',
    'Piña',
    '#E9B935',
    '#B7C96A',
    '#FCF5DF',
    'Rodajas de piña deshidratada con balance entre notas ácidas y dulces que despiertan el paladar.',
    'Un estallido refrescante inspirado en la brisa caribeña. Combina la acidez cítrica natural con una dulzura profunda.',
    '{"sabor": "Equilibrio cítrico dulce", "textura": "Carnosa y elástica", "aroma": "Fresco y tropical"}'::jsonb,
    '["Post-entrenamiento", "Pausa en el trabajo", "Con yogurt"]'::jsonb,
    '[{"tamano": "40g", "precio": 9500, "precioTexto": "$9.500 COP", "disponible": true}, {"tamano": "80g", "precio": 17500, "precioTexto": "$17.500 COP", "disponible": true}]'::jsonb,
    'Bolsa stand-up pouch resellable',
    TRUE,
    '/images/pineapple_pouch.jpg',
    2
)
ON CONFLICT (slug) DO NOTHING;

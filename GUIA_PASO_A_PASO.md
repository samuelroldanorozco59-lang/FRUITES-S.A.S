# 📖 GUÍA PASO A PASO: FRUITES (Para no programadores)

Esta guía fue escrita en lenguaje sencillo para que puedas gestionar, editar y publicar el sitio web de **FRUITES** sin necesidad de conocimientos técnicos avanzados.

---

## 1. Descargar el proyecto y abrirlo en Visual Studio Code

1. Si descargaste el proyecto como archivo **ZIP**, haz clic derecho sobre él y selecciona **"Extraer todo..."**.
2. Abre el programa **Visual Studio Code** (VS Code).
3. En el menú superior de VS Code, ve a **File (Archivo)** > **Open Folder... (Abrir carpeta...)**.
4. Selecciona la carpeta descomprimida `fruites` y haz clic en **Seleccionar carpeta**.
5. Verás todas las carpetas y archivos en la barra lateral izquierda.

---

## 2. Programas que necesitas instalar (Solo una vez)

Para que tu computador pueda ejecutar el sitio web, necesitas tener instaladas dos herramientas gratuitas y seguras:

1. **Node.js (versión 20 o superior LTS)**:
   - Descárgalo desde [https://nodejs.org/](https://nodejs.org/) (elige la versión que dice **LTS**).
   - Instálalo dando "Siguiente" a todo.
2. **Git**:
   - Descárgalo desde [https://git-scm.com/](https://git-scm.com/).
   - Instálalo manteniendo las opciones por defecto.

### ¿Cómo verificar que quedaron bien instalados?
Abre la terminal de tu computador (o presiona `Ctrl + ñ` dentro de Visual Studio Code) y escribe estos comandos uno a uno:

```bash
node -v
npm -v
git --version
```

Si cada comando te responde con un número de versión (por ejemplo `v20.12.0`), ¡todo está listo!

---

## 3. Comandos para probar el sitio web en tu computador

Abre la terminal integrada en Visual Studio Code (`Terminal` > `New Terminal`) y ejecuta estos dos comandos:

### Paso A: Instalar las librerías necesarias
```bash
npm install
```
*(Este comando solo lo ejecutas la primera vez o cuando se agregue una nueva herramienta).*

### Paso B: Encender el sitio web en tu computador
```bash
npm run dev
```

### ¿Qué debes ver?
La terminal te mostrará un mensaje como este:
```
  VITE v...  ready in 300 ms

  ➜  Local:   http://localhost:3000/
```
Mantén presionada la tecla `Ctrl` (o `Cmd` en Mac) y haz clic en ese enlace, o abre tu navegador web (Chrome, Edge, Safari) y entra a:
👉 **`http://localhost:3000`**

Verás el sitio web de FRUITES con su diseño completo, interactivo y en **Modo Demostración**.

---

## 4. Dónde editar cada cosa (Tabla de referencia)

| ¿Qué quieres modificar? | ¿En qué archivo se encuentra? | Instrucciones |
| :--- | :--- | :--- |
| **Eslogan principal y secundarios** | `src/data/siteConfig.js` | Busca la línea `tagline:` o `taglinesAlternative:` y cambia el texto entre comillas. |
| **Teléfono WhatsApp, correo y redes** | `src/data/siteConfig.js` | En la sección `contact:`, cambia `whatsappNumber`, `email`, `instagram`, etc. |
| **Historia, propósito, misión y visión** | `src/data/siteConfig.js` | En la sección `brandStory:`, edita los párrafos de texto oficial. |
| **Nombre de los sabores o descripciones** | `src/data/products.js` | Modifica `nombre`, `descripcionCorta`, `descripcionLarga` o el perfil de sabor. |
| **Precios y gramajes (cuando los definas)** | `src/data/products.js` | Reemplaza `[POR DEFINIR]` por el valor final (ej. `gramaje: '50 g'`, `precio: '$5.500'`). |
| **Preguntas frecuentes (FAQ)** | `src/data/faq.js` | Puedes agregar o editar cualquier pregunta y respuesta. |
| **Colores de la marca** | `src/styles/variables.css` | Cambia los códigos hexadecimales como `--color-selva`, `--color-mango`, etc. |
| **Logotipo tipográfico provisional** | `src/components/Logo.jsx` | Modifica el texto o reemplázalo en el futuro por una imagen de tu logo final. |
| **Fotos reales de las bolsas** | `public/images/` | Guarda tus fotos allí con nombres claros como `mango_pouch.jpg`, `pineapple_pouch.jpg`, etc. |

---

## 5. Cómo configurar Supabase (Base de datos y Auth)

El sitio funciona sin base de datos en modo demostración. Cuando quieras activar la base de datos real en la nube:

1. Entra a [https://supabase.com/](https://supabase.com/) y crea una cuenta gratuita.
2. Haz clic en **"New Project"** (Nuevo proyecto).
3. Asígnale un nombre (ej. `fruites-database`), define una contraseña segura y elige la región más cercana (ej. `East US` o `São Paulo`).
4. Ve al menú lateral izquierdo y haz clic en **SQL Editor**.
5. Haz clic en **New query** (Nueva consulta).
6. Abre el archivo `supabase/schema.sql` de este proyecto, copia todo su contenido, pégalo en el editor de Supabase y haz clic en **Run** (Ejecutar).
7. Para crear tu usuario administrador:
   - Ve a **Authentication** > **Users** > **Add user** > **Create user**.
   - Ingresa tu correo (ej. `admin@fruites.co`) y una contraseña segura.
   - En el SQL Editor, agrega tu correo como administrador ejecutando:
     ```sql
     INSERT INTO public.admin_users (id, email)
     SELECT id, email FROM auth.users WHERE email = 'admin@fruites.co';
     ```
8. Para conectar tu página web con Supabase:
   - En Supabase, ve a **Project Settings (el engranaje)** > **API**.
   - Copia la **Project URL** y la clave **anon public**.
   - En tu computador, crea un archivo llamado `.env` en la raíz del proyecto (junto a `.env.example`) y pega:
     ```env
     VITE_SUPABASE_URL="https://tu-proyecto.supabase.co"
     VITE_SUPABASE_ANON_KEY="tu-clave-anon-publica"
     VITE_BASE_PATH="./"
     ```
   - Reinicia el comando `npm run dev`. El aviso de modo demo desaparecerá y tus mensajes se guardarán en Supabase.

---

## 6. Cómo configurar la Inteligencia Artificial (Gemini)

Para que el Asistente Virtual responda con Gemini de forma segura sin exponer tu clave:

1. Obtén tu clave gratuita de Gemini en [Google AI Studio](https://aistudio.google.com/).
2. Instala la herramienta de Supabase en tu computador:
   ```bash
   npm install -g supabase
   ```
3. Inicia sesión en Supabase desde tu terminal:
   ```bash
   supabase login
   ```
4. Vincula tu proyecto:
   ```bash
   supabase link --project-ref tu-id-de-proyecto
   ```
5. Guarda tu clave de Gemini como secreto en el servidor de Supabase:
   ```bash
   supabase secrets set GEMINI_API_KEY="tu_clave_de_gemini_aqui"
   ```
6. Despliega la función con este comando:
   ```bash
   supabase functions deploy ai-assistant
   ```

---

## 7. Cómo subir a GitHub y publicar en GitHub Pages

### Paso 1: Crear el repositorio en GitHub
1. Entra a [https://github.com/](https://github.com/) e inicia sesión.
2. Haz clic en el botón verde **"New"** para crear un nuevo repositorio.
3. Nómbralo (por ejemplo: `fruites-web`), déjalo **Público** y no marques ninguna casilla adicional. Haz clic en **"Create repository"**.

### Paso 2: Los 15 Commits recomendados
Para llevar un historial ordenado y profesional como un desarrollador senior, ejecuta estos comandos en tu terminal a medida que avances:

```bash
# 1. Estructura inicial
git init
git add package.json vite.config.ts index.html metadata.json .gitignore .env.example
git commit -m "Estructura inicial del proyecto y configuración base de Vite"

# 2. Paleta y variables de diseño
git add src/styles/
git commit -m "Configura paleta de colores institucional, escala tipográfica y variables CSS"

# 3. Datos de configuración y marca
git add src/data/siteConfig.js
git commit -m "Agrega configuración general de FRUITES con eslogan y propuesta de valor"

# 4. Catálogo inicial de productos
git add src/data/products.js
git commit -m "Define los 4 sabores de la Colección Tropical y perfiles sensoriales"

# 5. Preguntas frecuentes
git add src/data/faq.js
git commit -m "Agrega módulo de preguntas frecuentes prudentes para B2C y B2B"

# 6. Logotipo y elementos vectoriales
git add src/components/Logo.jsx src/components/StandUpPouchIllustration.jsx
git commit -m "Crea logotipo tipográfico e ilustración vectorial de bolsa pouch resellable"

# 7. Barra de navegación y pie de página
git add src/components/Navbar.jsx src/components/Footer.jsx
git commit -m "Implementa navegación fija responsive y pie de página con aviso legal"

# 8. Servicios de datos y modo demostración
git add src/services/
git commit -m "Crea capa de servicios para Supabase, almacenamiento local e IA"

# 9. Componente de tarjeta de producto
git add src/components/ProductCard.jsx src/components/DemoBanner.jsx
git commit -m "Desarrolla tarjeta de producto con color por sabor y enlace a WhatsApp"

# 10. Página de inicio (Landing page)
git add src/pages/Home.jsx
git commit -m "Construye página de inicio con Hero, momentos de consumo e historia"

# 11. Catálogo completo y ficha de producto
git add src/pages/Catalog.jsx src/pages/ProductDetail.jsx
git commit -m "Implementa catálogo con filtros y detalle de producto con selector de cantidad"

# 12. Páginas Nosotros, Negocios (B2B) y Privacidad
git add src/pages/About.jsx src/pages/Business.jsx src/pages/PrivacyPolicy.jsx
git commit -m "Agrega página institucional, propuesta comercial B2B y política de datos"

# 13. Formulario de contacto y Asistente IA
git add src/pages/Contact.jsx src/pages/Assistant.jsx src/components/ChatWidget.jsx
git commit -m "Implementa formulario de contacto con validación y widget de chat con IA"

# 14. Panel de administración y gestión
git add src/pages/AdminLogin.jsx src/pages/AdminDashboard.jsx
git commit -m "Crea panel administrativo con métricas, exportación a CSV y editor de sabores"

# 15. Esquema SQL, Edge Function y flujo de despliegue
git add supabase/ .github/ README.md GUIA_PASO_A_PASO.md src/App.jsx src/main.jsx public/
git commit -m "Añade esquema SQL de Supabase, Edge Function para Gemini y flujo de GitHub Pages"
```

### Paso 3: Conectar con tu repositorio y subirlo
Reemplaza `TU_USUARIO` y `fruites-web` por los tuyos:
```bash
git branch -M main
git remote add origin https://github.com/TU_USUARIO/fruites-web.git
git push -u origin main
```

### Paso 4: Activar GitHub Pages
1. En tu repositorio de GitHub, ve a **Settings (Configuración)** > **Pages**.
2. En la opción **Source (Origen)**, selecciona **GitHub Actions**.
3. El archivo `.github/workflows/deploy.yml` compilará y publicará tu sitio automáticamente en pocos minutos.
4. Tu sitio web quedará disponible en:
   `https://TU_USUARIO.github.io/fruites-web/`

---

## 8. Lista de Verificación Final (Checklist)

Antes de lanzar al público, verifica:
- [x] El formulario de contacto envía los datos y muestra el mensaje de agradecimiento.
- [x] Los mensajes llegan y se visualizan en el panel de administración (`/admin`).
- [x] El botón "Exportar a CSV" descarga el archivo con los mensajes recibidos.
- [x] El botón "Pedir por WhatsApp" abre un chat de WhatsApp con el mensaje prellenado del sabor seleccionado.
- [x] El catálogo se ve ordenado y legible en celulares sin desplazamientos horizontales.
- [x] El Asistente IA responde preguntas sobre sabores y pedidos sin inventar precios ni propiedades milagrosas.
- [x] El aviso legal del pie de página está visible en todas las páginas.

---

## 9. Errores más comunes y cómo resolverlos

1. **"Página en blanco al entrar en GitHub Pages"**:
   - Ocurre cuando la ruta base no coincide. En `vite.config.ts`, asegúrate de que `base: './'` esté configurado (ya viene configurado así en este proyecto para evitar este problema).
   - Recuerda que usamos `HashRouter` (rutas con `#`), por lo que enlaces como `#/catalogo` nunca darán error 404 al recargar en GitHub Pages.
2. **"No se guardan los mensajes en Supabase"**:
   - Revisa si ejecutaste el archivo `supabase/schema.sql` en el SQL Editor de Supabase.
   - Verifica que las variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` estén escritas correctamente en tu archivo `.env`.
3. **"No puedo ingresar al panel de administración"**:
   - Si estás en modo demo, usa el usuario `demo@fruites.co` y clave `admin123`.
   - Si ya conectaste Supabase, asegúrate de haber insertado tu correo en la tabla `public.admin_users`.

---

## 10. Lista de datos `[POR DEFINIR]` que debes completar

A medida que avances en el desarrollo de FRUITES, debes completar estos datos en `src/data/siteConfig.js` y `src/data/products.js`:

1. **Número de WhatsApp Oficial** (actualmente configurado con `+57 324 903 7227` en `siteConfig.js`).
2. **Correo Electrónico Oficial** (actualmente `contacto@fruites.co` en `siteConfig.js`).
3. **Usuario de Instagram Oficial** (actualmente `@fruites.co` en `siteConfig.js`).
4. **Usuario de TikTok Oficial** (actualmente `@fruites.co` en `siteConfig.js`).
5. **Gramajes comerciales de cada bolsa** (por ejemplo: 30 g, 50 g, 80 g en `products.js`).
6. **Precios comerciales unitarios y mayoristas** (en `products.js`).
7. **Información de la tabla nutricional definitiva** (una vez realizada la prueba bromatológica de laboratorio).
8. **Fotografías reales del empaque impreso final** (para subir a `public/images/`).

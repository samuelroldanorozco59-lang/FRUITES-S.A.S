# 🍍 FRUITES — Fruta que va contigo

Sitio web oficial y plataforma digital de **FRUITES**, marca colombiana de snacks de frutas tropicales deshidratadas en bolsa resellable tipo stand-up pouch, nacida con la energía y calidez del Caribe en Barranquilla, Colombia.

Este proyecto ha sido desarrollado con altos estándares de diseño, arquitectura modular y código comentado en español, pensado especialmente para que una persona sin experiencia en programación pueda editar textos, sabores, fotos y datos de contacto de forma intuitiva con **Visual Studio Code**.

---

## 🌴 Sabores de la "Colección Tropical"
1. **Mango Tropical** *(Amarillo Mango #F6C945)*: Tiras de mango deshidratado dulce y masticable.
2. **Piña Dorada** *(Amarillo Dorado #E9B935 & Verde Lima #B7C96A)*: Rodajas con balance refrescante y toque cítrico.
3. **Papaya Caribe** *(Coral Tropical #EF775C)*: Textura dócil y dulzor delicado.
4. **Banano Tropical** *(Crema Natural #DFCC7D)*: Bocados reconfortantes y tradicionales.

---

## 🚀 Inicio Rápido (En 3 Pasos)

Si solo quieres ver y probar el sitio web en tu computador:

```bash
# 1. Instalar librerías
npm install

# 2. Iniciar servidor local
npm run dev
```

Abre tu navegador en `http://localhost:3000`.  
¡El sitio funciona al 100% de inmediato en **Modo Demostración** sin necesidad de configurar ninguna base de datos!

---

## 🧭 ¿Dónde edito cada elemento? (Guía Rápida)

| ¿Qué deseas cambiar? | Archivo a editar | ¿Qué encontrarás allí? |
| :--- | :--- | :--- |
| **Eslogan, redes, WhatsApp, correo y textos generales** | `src/data/siteConfig.js` | Teléfono, correo, ciudad, misión, visión y eslogan. |
| **Sabores, descripciones, notas sensoriales y catálogo** | `src/data/products.js` | Lista de productos, colores por sabor, orden y descripciones. |
| **Preguntas frecuentes (FAQ)** | `src/data/faq.js` | Preguntas y respuestas sobre pedidos, envíos y negocios. |
| **Colores de la marca y fuentes** | `src/styles/variables.css` | Códigos hexadecimales (`#183D32`, `#F6C945`, etc.). |
| **Logotipo tipográfico provisional** | `src/components/Logo.jsx` | Estilo visual del wordmark y detalle gráfico en la letra "O". |
| **Fotos reales de las bolsas pouch** | `public/images/` | Carpeta donde subes tus fotos en formato `.jpg` o `.png`. |

---

## 🛠️ Tecnologías Utilizadas
- **React + Vite** (JavaScript moderno, semántico y modular).
- **HashRouter** (para que funcione sin errores en servidores estáticos como GitHub Pages).
- **CSS Nativo con Variables** (sin frameworks pesados, 100% editable).
- **Supabase** (Autenticación, Base de datos PostgreSQL con políticas RLS y Edge Functions).
- **Google Gemini API** (asistente de IA para recomendación de sabores y atención).
- **Lucide Icons & Framer Motion** (microinteracciones suaves).

---

## 📖 Guía Detallada
Para ver el paso a paso completo de configuración en Supabase, despliegue en GitHub Pages, los 15 commits recomendados y la lista de datos `[POR DEFINIR]`, lee el archivo:
👉 **`GUIA_PASO_A_PASO.md`**

import { supabase, isDemoMode } from './supabaseClient.js';
import { initialProducts } from '../data/products.js';

/**
 * ============================================================================
 * SERVICIO DE ASISTENTE VIRTUAL FRUITES (IA)
 * ============================================================================
 * Modo 1 (Producción): Llama a la Edge Function 'ai-assistant' de Supabase
 *                      que consulta Gemini de forma segura sin exponer llaves.
 * Modo 2 (Demostración): Motor conversacional inteligente en español colombiano
 *                        con respuestas contextualizadas a FRUITES y catálogo local.
 * ============================================================================
 */

// Límite de mensajes por sesión en el cliente para prevenir abusos
const MAX_MESSAGES_PER_SESSION = 20;
let sessionMessageCount = 0;

/**
 * Recomendador interactivo de sabores basado en momento y preferencia
 */
export function recommendFlavors({ moment, preference, catalog = initialProducts }) {
  const normPref = (preference || '').toLowerCase();
  const normMom = (moment || '').toLowerCase();

  let recommended = [];

  if (normPref.includes('ácido') || normPref.includes('acido') || normPref.includes('toque ácido')) {
    recommended = catalog.filter((p) => p.fruta === 'Piña');
    if (recommended.length === 0) recommended = [catalog[1] || catalog[0]];
    return {
      products: recommended,
      explanation: 'Para quienes buscan un toque refrescante con personalidad, la Piña Dorada es la opción ideal: un balance vibrante entre dulzor y chispa ácida cítrica.',
    };
  }

  if (normPref.includes('suave') || normMom.includes('mañana') || normMom.includes('desayuno')) {
    recommended = catalog.filter((p) => p.fruta === 'Papaya');
    if (recommended.length === 0) recommended = [catalog[2] || catalog[0]];
    return {
      products: recommended,
      explanation: 'La Papaya Caribe destaca por su textura blanda y su dulzor sutil y aterciopelado. Es suave, nada empalagosa y perfecta para acompañar momentos tranquilos.',
    };
  }

  if (normPref.includes('dulce intenso') || normMom.includes('oficina') || normMom.includes('estudio')) {
    recommended = catalog.filter((p) => p.fruta === 'Mango');
    if (recommended.length === 0) recommended = [catalog[0]];
    return {
      products: recommended,
      explanation: 'El Mango Tropical concentra la dulzura más representativa de nuestra fruta caribeña. Textura masticable que acompaña perfectamente las horas de trabajo o estudio.',
    };
  }

  if (normMom.includes('entrenamiento') || normMom.includes('viaje')) {
    recommended = catalog.filter((p) => p.fruta === 'Banano' || p.fruta === 'Mango');
    return {
      products: recommended.slice(0, 2),
      explanation: 'Para movimiento continuo y trayectos, el Banano Tropical y el Mango Tropical son opciones prácticas, cómodas de llevar y de textura placentera.',
    };
  }

  // "Sorpréndeme" o fallback
  const randomProduct = catalog[Math.floor(Math.random() * catalog.length)] || catalog[0];
  return {
    products: [randomProduct],
    explanation: `Te recomendamos comenzar por nuestro ${randomProduct.nombre}: un clásico tropical con textura cuidada y empaque resellable para llevar contigo.`,
  };
}

/**
 * Chat con el asistente de FRUITES
 */
export async function askAssistant(userMessage, currentCatalog = initialProducts) {
  if (!userMessage || !userMessage.trim()) {
    return '¡Hola! Cuéntame en qué puedo ayudarte hoy sobre nuestros snacks de frutas o cómo disfrutar FRUITES.';
  }

  if (sessionMessageCount >= MAX_MESSAGES_PER_SESSION) {
    return 'Has alcanzado el límite de preguntas por esta sesión. Si tienes más dudas o deseas atención personalizada, por favor escríbenos directamente a nuestro WhatsApp o déjanos un mensaje en el formulario.';
  }

  sessionMessageCount += 1;
  const cleanQuery = userMessage.trim().slice(0, 300); // Limita entrada

  // Si Supabase está configurado con la función Edge Function:
  if (!isDemoMode && supabase) {
    try {
      const { data, error } = await supabase.functions.invoke('ai-assistant', {
        body: {
          message: cleanQuery,
          catalog: currentCatalog.map((p) => ({
            nombre: p.nombre,
            fruta: p.fruta,
            descripcion: p.descripcionCorta,
            disponible: p.disponible,
          })),
        },
      });

      if (!error && data && data.reply) {
        return data.reply;
      }
    } catch (err) {
      console.warn('Edge Function no disponible, activando motor conversacional demo:', err);
    }
  }

  // Modo demostración: respuestas amables, prudentes y en tono colombiano
  return generateDemoResponse(cleanQuery, currentCatalog);
}

/**
 * Generador contextual para modo demo (respetando todas las restricciones de marca)
 */
function generateDemoResponse(query, catalog) {
  const q = query.toLowerCase();

  // Pregunta sobre precios o costos
  if (q.includes('precio') || q.includes('cuesta') || q.includes('vale') || q.includes('cuanto') || q.includes('cuánto')) {
    return '¡Hola! Actualmente los precios oficiales y gramajes finales de la Colección Tropical están en proceso de definición ([POR DEFINIR]). Si deseas ser de los primeros en conocer la lista de precios o recibir un lote de prueba en Barranquilla, escríbenos por WhatsApp o déjanos tus datos en el formulario.';
  }

  // Pregunta sobre salud, nutrición o propiedades médicas
  if (q.includes('adelgaza') || q.includes('cura') || q.includes('diabetes') || q.includes('enfermedad') || q.includes('salud') || q.includes('engorda') || q.includes('calorías') || q.includes('calorias') || q.includes('azucar') || q.includes('azúcar')) {
    return 'En FRUITES nos enfocamos en brindarte un snack frutal práctico, rico y con un empaque pensado para el día a día. No hacemos afirmaciones médicas ni dietéticas; te sugerimos revisar la tabla nutricional de la etiqueta final una vez salga al mercado para conocer los detalles exactos según tus requerimientos personales.';
  }

  // Pregunta sobre venta a negocios / B2B / mayoristas
  if (q.includes('negocio') || q.includes('tienda') || q.includes('cafe') || q.includes('café') || q.includes('gimnasio') || q.includes('distribui') || q.includes('mayor') || q.includes('revend') || q.includes('b2b')) {
    return '¡Qué buena noticia! En FRUITES nos interesa conectar con negocios, tiendas saludables, cafés y gimnasios. Puedes visitar nuestra sección "Para Negocios" y llenar el formulario B2B, o escribirnos directamente a nuestro WhatsApp para coordinar condiciones comerciales y muestras iniciales.';
  }

  // Pregunta sobre dónde comprar o envíos
  if (q.includes('donde') || q.includes('dónde') || q.includes('comprar') || q.includes('envio') || q.includes('envío') || q.includes('ciudad') || q.includes('bogota') || q.includes('medellin') || q.includes('barranquilla')) {
    return 'FRUITES nace en Barranquilla, Colombia, donde estamos realizando nuestras primeras validaciones con pedidos directos vía WhatsApp. Muy pronto habilitaremos puntos de venta aliados y despachos a otras ciudades del país. ¡Puedes contactarnos por WhatsApp para coordinar tu entrega!';
  }

  // Pregunta sobre sabores o catálogo
  if (q.includes('sabor') || q.includes('sabores') || q.includes('mango') || q.includes('piña') || q.includes('pina') || q.includes('papaya') || q.includes('banano') || q.includes('catalogo') || q.includes('catálogo')) {
    const list = catalog.map((p) => p.nombre).join(', ');
    return `Nuestra primera línea es la "Colección Tropical" con cuatro sabores seleccionados: ${list}. Vienen en bolsa tipo stand-up pouch resellable para que la fruta se conserve en su punto y la lleves a donde vayas. ¿Te gustaría recomendación de algún sabor para un momento especial?`;
  }

  // Pregunta sobre ingredientes o si es natural/sin conservantes
  if (q.includes('ingrediente') || q.includes('conservante') || q.includes('quimico') || q.includes('organico') || q.includes('orgánico') || q.includes('natural')) {
    return 'La información de formulación e ingredientes específicos estará debidamente señalada en la etiqueta final de cada empaque conforme a la normativa vigente colombiana, asegurando total transparencia para nuestros consumidores.';
  }

  // Preguntas fuera de tema
  if (q.includes('futbol') || q.includes('politica') || q.includes('clima') || q.includes('musica') || q.includes('receta')) {
    return 'Soy el asistente de FRUITES y mi especialidad es contarte todo sobre nuestros snacks de frutas tropicales deshidratadas y cómo disfrutar de la fruta en tu rutina. ¿Hay algún sabor que te llame la atención o te gustaría conocer cómo pedir?';
  }

  // Saludo general o respuesta por defecto
  return '¡Hola! Qué gusto saludarte. En FRUITES queremos que disfrutar de la fruta sea algo rico, práctico y moderno. ¿Quisieras que te ayude a elegir entre Mango, Piña, Papaya o Banano, o buscas información para tu negocio?';
}

import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield, CheckCircle2, Lock, FileText } from 'lucide-react';
import { siteConfig } from '../data/siteConfig.js';

/**
 * ============================================================================
 * POLÍTICA DE TRATAMIENTO DE DATOS PERSONALES (HABEAS DATA - LEY 1581 DE 2012)
 * ============================================================================
 * Cumplimiento riguroso de la Ley Estatutaria 1581 de 2012, Decreto 1377 de 2013
 * y normas concordantes de la República de Colombia (Hallazgo A-05).
 * ============================================================================
 */
export default function PrivacyPolicy() {
  return (
    <div className="privacy-page section" style={{ backgroundColor: 'var(--color-crema)' }}>
      <div className="container-narrow">
        <div style={{ marginBottom: '2rem' }}>
          <Link
            to="/contacto"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontSize: 'var(--text-sm)',
              fontWeight: 600,
              color: 'var(--color-selva)',
            }}
          >
            <ArrowLeft size={16} />
            <span>Volver a Contacto</span>
          </Link>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem 2.5rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
            <Shield size={24} color="var(--color-selva)" />
            <span className="kicker" style={{ margin: 0 }}>
              Protección y Tratamiento de Datos
            </span>
          </div>

          <h1 style={{ fontSize: 'var(--text-2xl)', marginBottom: '1rem', color: 'var(--color-selva)' }}>
            Política de Privacidad y Tratamiento de Información Personal
          </h1>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-light)', marginBottom: '2rem' }}>
            Última actualización: Noviembre de 2026 | Conforme a la Ley 1581 de 2012 de Colombia
          </p>

          <div
            style={{
              fontSize: 'var(--text-sm)',
              color: 'var(--color-text-muted)',
              lineHeight: 1.8,
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            <section>
              <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-selva)', marginBottom: '0.5rem' }}>
                1. Responsable del Tratamiento
              </h3>
              <p>
                <strong>FRUITES</strong>, iniciativa comercial con domicilio principal en la ciudad de Barranquilla, Departamento del Atlántico, República de Colombia, es la responsable del tratamiento de los datos personales suministrados por los usuarios a través del sitio web oficial y sus canales digitales de atención comercial.
              </p>
              <div style={{ backgroundColor: 'var(--color-crema)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-sm)', marginTop: '0.5rem', fontSize: 'var(--text-xs)' }}>
                📍 <strong>Domicilio:</strong> Barranquilla, Atlántico, Colombia<br />
                💬 <strong>Canal WhatsApp Oficial:</strong> +57 324 903 7227<br />
                ✉️ <strong>Correo Electrónico de Contacto:</strong> hola@fruites.co
              </div>
            </section>

            <section>
              <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-selva)', marginBottom: '0.5rem' }}>
                2. Finalidad de los Datos Recolectados
              </h3>
              <p>
                Los datos solicitados a través de formularios de contacto, registro de puntos de venta y pedidos en la tienda virtual (nombre, correo electrónico, teléfono/WhatsApp, dirección de despacho y datos comerciales) tienen las siguientes finalidades legítimas:
              </p>
              <ul style={{ paddingLeft: '1.25rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <li>Procesar, despachar y dar seguimiento logístico a los pedidos de snacks adquiridos en la tienda en línea.</li>
                <li>Atender requerimientos comerciales B2B, solicitud de catálogos y acuerdos con distribuidores piloto.</li>
                <li>Enviar comunicaciones de servicio, confirmaciones de pago y facturación electrónica cuando aplique.</li>
                <li>Resolver dudas o comentarios canalizados mediante el asistente de atención y servicio al cliente.</li>
              </ul>
            </section>

            <section>
              <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-selva)', marginBottom: '0.5rem' }}>
                3. Derechos del Titular y Procedimiento Habeas Data
              </h3>
              <p>
                De acuerdo con el artículo 8 de la Ley 1581 de 2012, usted como titular de datos personales tiene derecho a conocer, actualizar, rectificar y solicitar la supresión de su información.
              </p>
              <p>
                <strong>Términos legales de atención:</strong> Las solicitudes de consulta serán atendidas en un término máximo de <strong>diez (10) días hábiles</strong> contados a partir de su recepción. Cuando se trate de un reclamo para corrección, actualización o eliminación de datos, el plazo máximo legal de respuesta será de <strong>quince (15) días hábiles</strong>.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-selva)', marginBottom: '0.5rem' }}>
                4. Infraestructura Tecnológica y Transferencia de Datos
              </h3>
              <p>
                FRUITES almacena su información utilizando proveedores de infraestructura en la nube con estándares de seguridad internacional (encriptación SSL/TLS, autenticación segura y protocolos TLS 1.3). La información de medios de pago no es almacenada en nuestros servidores locales; las transferencias bancarias directas y pasarelas de pago se gestionan de forma segura por sus respectivas entidades financieras vigiladas por la Superintendencia Financiera de Colombia.
              </p>
            </section>

            <section>
              <h3 style={{ fontSize: 'var(--text-base)', color: 'var(--color-selva)', marginBottom: '0.5rem' }}>
                5. Aceptación Expresa
              </h3>
              <p>
                Al marcar la casilla de verificación en nuestros formularios y al confirmar un pedido de compra en línea, el titular autoriza de manera previa, expresa e informada a FRUITES para tratar sus datos con las finalidades descritas.
              </p>
            </section>

            <div
              style={{
                marginTop: '1rem',
                padding: '1.25rem',
                backgroundColor: 'var(--color-crema)',
                borderRadius: 'var(--radius-md)',
                fontSize: 'var(--text-xs)',
                borderLeft: '4px solid var(--color-selva)',
              }}
            >
              <em>{siteConfig.legalFooterNote}</em>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

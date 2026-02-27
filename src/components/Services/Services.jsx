import React from 'react';
import './Services.css';

import desktopIcon from '../../assets/icons/web.svg';
import mobileIcon from '../../assets/icons/mobile.svg';
import brainIcon from '../../assets/icons/advice.svg';
import settingsIcon from '../../assets/icons/settings.svg';
import databaseIcon from '../../assets/icons/database.svg';
import filesIcon from '../../assets/icons/files.svg';
import diagramIcon from '../../assets/icons/diagram.svg';

const SERVICES = [
  {
    id: 1,
    title: 'Desarrollo Web',
    description:
      'Sitios web y aplicaciones web a medida, construidos con tecnologías modernas. Rápidos, responsivos y optimizados para el rendimiento y la experiencia de usuario.',
    features: [
      'Diseño Responsive',
      'Aplicaciones Web Progresivas',
      'Soluciones E-commerce',
      'Integración con CMS'
    ]
  },
  {
    id: 2,
    title: 'Aplicaciones Móviles',
    description:
      'Aplicaciones móviles nativas y multiplataforma para Android e iOS, enfocadas en rendimiento, usabilidad y escalabilidad.',
    features: [
      'Desarrollo Android e iOS',
      'Soluciones Multiplataforma',
      'Diseño UI/UX',
      'Publicación en Stores'
    ]
  },
  {
    id: 3,
    title: 'Consultoría Técnica',
    description:
      'Asesoramiento técnico para la toma de decisiones, mejora de arquitecturas existentes y definición de soluciones eficientes.',
    features: [
      'Estrategia Tecnológica',
      'Diseño de Arquitectura',
      'Revisión de Código',
      'Buenas Prácticas de Desarrollo'
    ]
  },
  {
    id: 4,
    title: 'Desarrollo Backend',
    description:
      'Implementación de la lógica del servidor con foco en seguridad, mantenibilidad y escalabilidad.',
    features: [
      'APIs REST',
      'Autenticación y Autorización',
      'Integración con Bases de Datos',
      'Arquitectura Escalable'
    ]
  },
  {
    id: 5,
    title: 'Bases de Datos',
    description:
      'Diseño, modelado y optimización de bases de datos para garantizar integridad, rendimiento y escalabilidad del sistema.',
    features: [
      'Modelado conceptual, lógico y físico',
      'Normalización y relaciones',
      'Optimización de consultas',
      'Soporte para bases de datos relacionales'
    ]
  },
  {
    id: 6,
    title: 'Definición de Flujos y Entidades',
    description:
      'Análisis funcional del sistema para definir entidades, relaciones y flujos de negocio antes del desarrollo.',
    features: [
      'Modelado de entidades',
      'Definición de reglas de negocio',
      'Estados y flujos del sistema',
      'Documentación funcional'
    ]
  },
  {
    id: 7,
    title: 'Diagramas Técnicos',
    description:
      'Documentación visual del sistema para facilitar la comprensión y comunicación técnica.',
    features: [
      'Diagramas de Casos de Uso',
      'Diagramas Entidad-Relación',
      'Diagramas de Clases',
      'Diagramas de Secuencia'
    ]
  }
];

const iconById = {
  1: desktopIcon,
  2: mobileIcon,
  3: brainIcon,
  4: settingsIcon,
  5: databaseIcon,
  6: filesIcon,
  7: diagramIcon
};

export default function Services() {
  return (
    <section
      id="services"
      className="services-section"
      aria-label="Servicios"
    >
      <div className="bg-grid" aria-hidden="true" />
      <div className="floating-orb orb-1" aria-hidden="true" />
      <div className="floating-orb orb-2" aria-hidden="true" />

      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Servicios</h2>
          <p className="section-subtitle">
            Transformando ideas en soluciones digitales mediante tecnología moderna y desarrollo de calidad.
          </p>
        </div>

        <div className="services-grid">
          {SERVICES.map((s) => (
            <article
              className="service-card"
              key={s.id}
              tabIndex={0}
              aria-labelledby={`service-title-${s.id}`}
            >
              <div className="service-number" aria-hidden="true">
                {String(s.id).padStart(2, '0')}
              </div>

              <div className="service-icon" aria-hidden="true">
                <img src={iconById[s.id]} alt="" aria-hidden="true" />
              </div>

              <div className="service-content">
                <h3 className="service-title" id={`service-title-${s.id}`}>
                  {s.title}
                </h3>
                <p className="service-description">{s.description}</p>
                <ul className="service-features">
                  {s.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

import React from 'react';
import './Hero.css';

// Logo
import logo from '../../assets/Codeverse_Logo (1).png';

// Icons (importadas como componentes SVG — tu ?react está bien si tu setup lo soporta)
import ResponsiveIcon from '../../assets/icons/mobile.svg?react';
import PerformanceIcon from '../../assets/icons/performance.svg?react';
import SecurityIcon from '../../assets/icons/security.svg?react';

export default function Hero() {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <img
          src={logo}
          alt="Logo Codeverse"
          className="logo"
        />

        <h1>Transforma tu presencia digital</h1>

        <p className="tagline">
          Creamos soluciones web de vanguardia adaptadas a las necesidades de tu negocio.
          Desde sitios web modernos hasta potentes aplicaciones web, convertimos tu visión en realidad.
        </p>

        <div className="services-grid">

          <div className="service-card">
            <div className="service-icon" title="Diseño responsivo" aria-hidden="true">
              {/* pasamos className para poder controlar desde CSS */}
              <ResponsiveIcon className="icon-svg" aria-hidden="true" focusable="false" />
            </div>
            <h3 className="service-title">Diseño Responsivo</h3>
            <p className="service-desc">
              Experiencia impecable en todos los dispositivos con una adaptación perfecta.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon" title="Rendimiento" aria-hidden="true">
              <PerformanceIcon className="icon-svg" aria-hidden="true" focusable="false" />
            </div>
            <h3 className="service-title">Rendimiento</h3>
            <p className="service-desc">
              Carga ultrarrápida y rendimiento optimizado para un mejor posicionamiento SEO.
            </p>
          </div>

          <div className="service-card">
            <div className="service-icon" title="Seguridad" aria-hidden="true">
              <SecurityIcon className="icon-svg" aria-hidden="true" focusable="false" />
            </div>
            <h3 className="service-title">Seguridad</h3>
            <p className="service-desc">
              Medidas de seguridad de nivel empresarial para proteger tu negocio y a tus usuarios.
            </p>
          </div>

        </div>

        <div className="cta-buttons">
          <a href="#contact" className="btn btn-primary">Comenzar</a>
          <a href="#services" className="btn btn-secondary">Nuestros Servicios</a>
        </div>
      </div>
    </div>
  );
}

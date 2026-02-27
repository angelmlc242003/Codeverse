// src/components/AboutMe/AboutMe.jsx
import React from 'react';
import './AboutMe.css';

import logo from '../../assets/Logo_Codeverse.png';

// SVG como componentes React (Vite + SVGR)
import ShieldIcon from '../../assets/icons/shield.svg?react';
import MessagesIcon from '../../assets/icons/messages.svg?react';
import ShieldCheckIcon from '../../assets/icons/shield_check.svg?react';

export default function AboutMe() {
  return (
    <section id="about" className="about-container">
      <div className="about-content">

        {/* Introducción */}
        <div className="intro text-center">
          <h1 className="title">
            Creando <span className="gradient-text">Experiencias Digitales</span> Que{' '}
            <span className="gradient-text">Inspiran</span>
          </h1>
          <p className="subtitle">
            En Codeverse, transformamos ideas en soluciones digitales seguras,
            escalables y diseñadas para perdurar.
          </p>
        </div>

        {/* Sobre Codeverse */}
        <div className="profile flex-row">
          <div className="logo">
            <img src={logo} alt="Logo Codeverse" />
          </div>

          <div className="profile-text">
            <h2 className="section-heading">
              Sobre <span className="gradient-text">Codeverse</span>
            </h2>

            <p className="description">
              Codeverse es un estudio boutique de desarrollo digital fundado en 2026,
              enfocado en la creación de soluciones tecnológicas a medida para negocios,
              emprendedores y proyectos que buscan destacarse en un entorno digital
              cada vez más competitivo.
            </p>

            <p className="description">
              Nuestro enfoque combina ingeniería de software de alta calidad,
              pensamiento estratégico y diseño centrado en el usuario. Cada proyecto
              se aborda de forma personalizada, priorizando la escalabilidad,
              la seguridad y el rendimiento desde la primera línea de código.
            </p>

            <p className="description">
              En Codeverse no creemos en soluciones genéricas. Creemos en construir
              productos sólidos, bien pensados y alineados con los objetivos reales
              de cada cliente, acompañándolos desde la idea inicial hasta la evolución
              continua del producto.
            </p>
          </div>
        </div>

        {/* Valores */}
        <div className="values-section">
          <h2 className="section-heading-center">
            Nuestros <span className="gradient-text">Valores Principales</span>
          </h2>

          <div className="values-grid">

            {/* Integridad */}
            <div className="glow-card">
              <div className="feature-icon">
                <ShieldIcon />
              </div>
              <h3>Integridad en el Código</h3>
              <p>
                Escribimos código limpio, mantenible y bien documentado,
                siguiendo buenas prácticas y estándares profesionales.
              </p>
            </div>

            {/* Colaboración */}
            <div className="glow-card">
              <div className="feature-icon">
                <MessagesIcon />
              </div>
              <h3>Colaboración con el Cliente</h3>
              <p>
                Trabajamos de forma cercana y transparente, entendiendo que
                la comunicación clara es clave para el éxito de cualquier proyecto.
              </p>
            </div>

            {/* Escalabilidad */}
            <div className="glow-card">
              <div className="feature-icon">
                <ShieldCheckIcon />
              </div>
              <h3>Preparados para el Futuro</h3>
              <p>
                Diseñamos soluciones pensadas para crecer, adaptarse y evolucionar
                junto a tu negocio y a las nuevas tecnologías.
              </p>
            </div>

          </div>
        </div>

        {/* CTA */}
        <div className="cta-card glow-card">
          <h3>¿Listo para potenciar tu presencia digital?</h3>
          <p>Hablemos sobre cómo Codeverse puede dar vida a tu visión.</p>
          <a href="#contact" className="btn-primary">
            Contacta a nuestro equipo
          </a>
        </div>

      </div>
    </section>
  );
}

import React from 'react';
import './Footer.css';

// Icons (SVG como URLs)
import MailIcon from '../../assets/icons/mail.svg';
import PhoneIcon from '../../assets/icons/phone.svg';
import FacebookIcon from '../../assets/icons/facebook.svg';
import InstagramIcon from '../../assets/icons/instagram.svg';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Logo + breve descripción */}
        <div className="footer-section">
          <div className="footer-logo">
            <div className="footer-logo-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 6V18L20 12L13 6Z" fill="white" />
                <path d="M4 6V18L11 12L4 6Z" fill="white" />
              </svg>
            </div>
            <span className="footer-logo-text">Codeverse</span>
          </div>

          <p className="footer-description">
            Creamos soluciones web y móviles personalizadas para potenciar tu presencia digital.
          </p>
        </div>

        {/* Servicios */}
        <div className="footer-section">
          <h3 className="footer-heading">Servicios</h3>
          <a href="#services" className="footer-link">Desarrollo Web</a>
          <a href="#services" className="footer-link">Aplicaciones Móviles</a>
          <a href="#services" className="footer-link">Consultoría técnica</a>
          <a href="#services" className="footer-link">Y más</a>
        </div>

        {/* Compañía */}
        <div className="footer-section">
          <h3 className="footer-heading">Compañía</h3>
          <a href="#about" className="footer-link">Sobre mí</a>
          <a href="#contact" className="footer-link">Contacto</a>
        </div>

{/* Contacto y redes */}
<div className="footer-section">
  <h3 className="footer-heading">Contacto</h3>

  {/* Email: mailto */}
  <a
    href="mailto:codeverse.codes@gmail.com"
    className="footer-contact-link"
    aria-label="Enviar correo a codeverse.codes@gmail.com"
    title="Enviar correo"
  >
    <img src={MailIcon} alt="Email" className="footer-contact-icon" />
    <span className="footer-contact-text">codeverse.codes@gmail.com</span>
  </a>

  {/* Teléfono: tel: */}
  <a
    href="tel:+543885970968"
    className="footer-contact-link"
    aria-label="Llamar a +54 388 597-0968"
    title="Llamar"
  >
    <img src={PhoneIcon} alt="Teléfono" className="footer-contact-icon" />
    <span className="footer-contact-text">+54 388 597-0968</span>
  </a>

  <div className="social-links">
    <a
      href="https://www.facebook.com/profile.php?id=61587283381622"
      className="social-link"
      aria-label="Facebook (se abre en nueva pestaña)"
      target="_blank"
      rel="noopener noreferrer"
      title="Facebook"
    >
      <img src={FacebookIcon} alt="Facebook" className="social-icon" />
    </a>

    <a
      href="https://www.instagram.com/codeverse.codes?igsh=MWJ1N291OXd2MnA0cw=="
      className="social-link"
      aria-label="Instagram (se abre en nueva pestaña)"
      target="_blank"
      rel="noopener noreferrer"
      title="Instagram"
    >
      <img src={InstagramIcon} alt="Instagram" className="social-icon" />
     </a>
     </div>
    </div>
   </div>

      {/* Pie de página */}
      <div className="footer-bottom">
        <span>
          &copy; {new Date().getFullYear()} Codeverse. Todos los derechos reservados.
        </span>
        <span className="footer-note code-element">
          Construyamos algo increíble juntos
        </span>
      </div>
    </footer>
  );
}

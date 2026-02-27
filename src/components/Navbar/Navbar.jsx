import React, { useState } from 'react';
import './Navbar.css';

import logo from '../../assets/Codeverse_Logo_Navbar.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="navbar">
      {/* Logo con enlace - clase logo_navbar */}
      <a href="#home" className="logo_navbar" onClick={closeMenu}>
        <img src={logo} alt="Codeverse Logo" />
      </a>

      {/* Links de navegación */}
      <ul className={`nav-links ${isOpen ? 'active' : ''}`}>
        <li><a href="#services" onClick={closeMenu}>Servicios</a></li>
        <li><a href="#about" onClick={closeMenu}>Sobre mí</a></li>
        <li><a href="#contact" onClick={closeMenu}>Contacto</a></li>
      </ul>

      {/* Botón hamburguesa */}
      <div className={`hamburger ${isOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="menu">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </nav>
  );
}

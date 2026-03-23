// File: components/ContactPage/ContactPage.jsx
import React, { useEffect, useRef, useState } from 'react';
import './ContactPage.css';
import emailjs from '@emailjs/browser';

import MapIcon from '../../assets/icons/map.svg';
import PhoneIcon from '../../assets/icons/phone.svg';
import MailIcon from '../../assets/icons/mail.svg';
import ClockIcon from '../../assets/icons/hour.svg';
import FacebookIcon from '../../assets/icons/facebook.svg';
import WhatsAppIcon from '../../assets/icons/whatsapp.svg';
import InstagramIcon from '../../assets/icons/instagram.svg';

const RECAPTCHA_SITE_KEY =
  import.meta.env.VITE_RECAPTCHA_SITE_KEY ||
  import.meta.env.RECAPTCHA_SITE_KEY ||
  '';

const RATE_LIMIT_SECONDS = 30;

const EMAILJS_USER_ID =
  import.meta.env.VITE_EMAILJS_USER_ID || import.meta.env.EMAILJS_USER_ID || '';
const EMAILJS_SERVICE_ID =
  import.meta.env.VITE_EMAILJS_SERVICE_ID || import.meta.env.EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID =
  import.meta.env.VITE_EMAILJS_TEMPLATE_ID || import.meta.env.EMAILJS_TEMPLATE_ID || '';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    _hp: ''
  });

  const [status, setStatus] = useState({
    sending: false,
    success: false,
    error: ''
  });

  const inputsRef = useRef([]);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const stripTags = (str = '') => String(str).replace(/<\/?[^>]+(>|$)/g, '');

  /* ---------------- EmailJS init ---------------- */
  useEffect(() => {
    if (EMAILJS_USER_ID) {
      try {
        emailjs.init(EMAILJS_USER_ID);
      } catch (err) {
        console.warn('EmailJS init failed', err);
      }
    }
  }, []);

  /* ---------------- reCAPTCHA load ---------------- */
  useEffect(() => {
    if (!RECAPTCHA_SITE_KEY) return;
    if (document.getElementById('grecaptcha-script')) return;

    const script = document.createElement('script');
    script.id = 'grecaptcha-script';
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  /* ---------------- Validación visual (SIN estilos inline) ---------------- */
  useEffect(() => {
    const onBlur = (e) => {
      if (e.target.value.trim() === '') {
        e.target.classList.add('is-invalid');
      }
    };

    const onInput = (e) => {
      if (e.target.value.trim() !== '') {
        e.target.classList.remove('is-invalid');
      }
    };

    // attach listeners (defensivo: inputsRef.current puede cambiar)
    const list = inputsRef.current.slice();
    list.forEach((input) => {
      if (!input) return;
      input.addEventListener('blur', onBlur);
      input.addEventListener('input', onInput);
    });

    return () => {
      list.forEach((input) => {
        if (!input) return;
        input.removeEventListener('blur', onBlur);
        input.removeEventListener('input', onInput);
      });
    };
  }, []);

  const handleChange = (e) => {
    const { id, value, name } = e.target;
    setForm((prev) => ({ ...prev, [name || id]: value }));
  };

  const mapSubjectLabel = (value) => ({
    'web-development': 'Desarrollo Web',
    'mobile-app': 'Aplicación Móvil',
    'api-development': 'Desarrollo de API',
    consulting: 'Consultoría Técnica',
    other: 'Otro'
  }[value] || value || 'No especificado');

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // client-side rate limit
    const last = Number(localStorage.getItem('contact_last_sent') || 0);
    if (Date.now() - last < RATE_LIMIT_SECONDS * 1000) {
      setStatus({
        sending: false,
        success: false,
        error: `Esperá ${RATE_LIMIT_SECONDS} segundos antes de mandar otro mensaje.`
      });
      return;
    }

    // limpiar estados visuales previos
    inputsRef.current.forEach((i) => i?.classList.remove('is-invalid'));

    const { name, email, subject, message, _hp } = form;

    if (_hp) {
      // honeypot activado -> posible bot
      setStatus({ sending: false, success: false, error: 'Error al enviar el mensaje.' });
      return;
    }

    const errors = [];
    if (!name.trim()) errors.push(inputsRef.current[0]);
    if (!emailRegex.test(email)) errors.push(inputsRef.current[1]);
    if (!subject) errors.push(inputsRef.current[2]);
    if (!message.trim()) errors.push(inputsRef.current[3]);

    if (errors.length) {
      errors.forEach((el) => el?.classList.add('is-invalid'));
      errors[0]?.focus();
      setStatus({ sending: false, success: false, error: 'Revisá los campos marcados.' });
      return;
    }

    setStatus({ sending: true, success: false, error: '' });

    try {
      let token = null;
      // sólo intento reCAPTCHA si está configurado y cargado
      if (RECAPTCHA_SITE_KEY && window.grecaptcha && typeof window.grecaptcha.execute === 'function') {
        try {
          await new Promise((resolve) => {
            try {
              window.grecaptcha.ready(resolve);
            } catch {
              resolve();
            }
          });
          token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'contact_form' });
        } catch (recErr) {
          console.warn('reCAPTCHA execution failed, continuing without token', recErr);
          token = null;
        }
      } else {
        // no hay reCAPTCHA configurado / cargado: continuar (dev fallback)
        console.info('reCAPTCHA no configurado o no disponible — se omite verificación en cliente.');
      }

      // Si obtuvimos token, verificamos en backend. Si no, omitimos verificación (fallback).
      if (token) {
        const resp = await fetch('/.netlify/functions/verifyRecaptcha', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            name,
            email,
            subject: mapSubjectLabel(subject),
            message: stripTags(message)
          })
        });

        const text = await resp.text();
        let json = null;
        try {
          json = text ? JSON.parse(text) : null;
        } catch {
          // texto no-json -> tratar como error
          throw new Error(text || 'Respuesta inválida del servidor al verificar reCAPTCHA.');
        }

        const okSignal = (json && (json.success === true || json.ok === true)) || resp.ok;
        if (!okSignal) {
          const msg = (json && (json.message || json.msg)) || 'Error al verificar reCAPTCHA.';
          throw new Error(msg);
        }
      } else {
        // token null -> skip server verification (OK en entorno de desarrollo)
      }

      // Enviar email con EmailJS (si está configurado)
      if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID) {
        // Si no está configurado EmailJS, consideramos el envío "simulado" exitoso
        localStorage.setItem('contact_last_sent', Date.now().toString());
        setForm({ name: '', email: '', subject: '', message: '', _hp: '' });
        setStatus({ sending: false, success: true, error: '' });
        return;
      }

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        subject: mapSubjectLabel(subject),
        message: stripTags(message)
      });

      // éxito
      localStorage.setItem('contact_last_sent', Date.now().toString());
      setForm({ name: '', email: '', subject: '', message: '', _hp: '' });
      setStatus({ sending: false, success: true, error: '' });
    } catch (err) {
      console.error('Contact send error:', err);
      setStatus({
        sending: false,
        success: false,
        error: err?.message || 'Error al enviar el mensaje.'
      });
    }
  };

  return (
    <section id="contact" className="contact-section">
      <div className="container">
        <div className="section-title">
          <h2>Contáctanos</h2>
          <p>
            ¿Listo para dar vida a tus ideas? Hablemos sobre tu próximo proyecto y creemos algo increíble juntos.
          </p>
        </div>

        <div className="contact-grid">
          <div className="contact-form">
            <div className="form-header">
              <h3>Envíanos un mensaje</h3>
              <p>Te responderemos en menos de 24 horas</p>
            </div>

            <form id="contactForm" onSubmit={handleSubmit} aria-busy={status.sending}>
              <input
                type="text"
                name="_hp"
                id="_hp"
                value={form._hp}
                onChange={handleChange}
                autoComplete="off"
                style={{ display: 'none' }}
                tabIndex={-1}
                aria-hidden="true"
              />

              <div className="form-group">
                <label htmlFor="name">Nombre completo</label>
                <input
                  ref={(el) => (inputsRef.current[0] = el)}
                  type="text"
                  id="name"
                  className="form-control"
                  placeholder="Ingresa tu nombre completo"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Correo electrónico</label>
                <input
                  ref={(el) => (inputsRef.current[1] = el)}
                  type="email"
                  id="email"
                  className="form-control"
                  placeholder="Ingresa tu correo electrónico"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Tipo de proyecto</label>
                <select
                  ref={(el) => (inputsRef.current[2] = el)}
                  id="subject"
                  className="form-control"
                  value={form.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona el tipo de proyecto</option>

                  <option value="web-development">Desarrollo Web</option>
                  <option value="mobile-app">Aplicación Móvil</option>
                  <option value="consulting">Consultoría Técnica</option>
                  <option value="backend-development">Desarrollo Backend</option>
                  <option value="database-design">Base de datos</option>
                  <option value="flows-identity">Definición de flujos e identidades</option>
                  <option value="technical-diagrams">Diagramas técnicos</option>

                  <option value="other">Otro</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="message">Detalles del proyecto</label>
                <textarea
                  ref={(el) => (inputsRef.current[3] = el)}
                  id="message"
                  name="message"
                  className="form-control"
                  placeholder="Cuéntanos sobre los requisitos, plazos y presupuesto de tu proyecto..."
                  value={form.message}
                  maxLength={1100}
                  rows={4}
                  onChange={(e) => {
                    handleChange(e);
                    e.target.style.height = 'auto';
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                  required
                />
              </div>

              <button type="submit" className="btn-primary glow-effect" disabled={status.sending}>
                {status.sending ? 'Enviando...' : 'Enviar mensaje'}
              </button>

              <div
                id="successMessage"
                className="success-message"
                role="status"
                aria-live="polite"
                style={{ display: status.success ? 'block' : 'none' }}
              >
                ¡Tu mensaje ha sido enviado con éxito!
              </div>

              <div
                id="errorMessage"
                className="error-message"
                role="alert"
                aria-live="assertive"
                style={{ display: status.error ? 'block' : 'none' }}
              >
                ⚠️ {status.error}
              </div>
            </form>
          </div>

          <aside className="contact-info" aria-label="Información de contacto">
            <div className="info-item floating-animation">
              <div className="info-icon" aria-hidden="true">
                <img src={MapIcon} alt="" width="24" height="24" />
              </div>
              <div className="info-content">
                <h4>Nuestra ubicación</h4>
                <p>
                  Ciudad Autónoma de Buenos Aires
                </p>
              </div>
            </div>

            <div className="info-item floating-animation" style={{ animationDelay: '0.2s' }}>
              <div className="info-icon" aria-hidden="true">
                <img src={PhoneIcon} alt="" width="24" height="24" />
              </div>
              <div className="info-content">
                <h4>Número de teléfono</h4>
                <p>
                  <a
                    href="tel:+543885970968"
                    aria-label="Llamar a +54 388 597-0968"
                    title="Llamar"
                  >
                    +54 388 597-0968
                  </a>
                </p>
              </div>
            </div>

            <div className="info-item floating-animation" style={{ animationDelay: '0.4s' }}>
              <div className="info-icon" aria-hidden="true">
                <img src={MailIcon} alt="" width="24" height="24" />
              </div>
              <div className="info-content">
                <h4>Correo electrónico</h4>
                <p>
                  {/* mailto: */}
                  <a
                    href="mailto:codeverse.codes@gmail.com"
                    aria-label="Enviar correo a codeverse.codes@gmail.com"
                    title="Enviar correo"
                  >
                    codeverse.codes@gmail.com
                  </a>
                </p>
              </div>
            </div>

            <div className="info-item floating-animation" style={{ animationDelay: '0.6s' }}>
              <div className="info-icon" aria-hidden="true">
                <img src={ClockIcon} alt="" width="24" height="24" />
              </div>
              <div className="info-content">
                <h4>Horario de atención</h4>
                <p>
                  Lunes - Viernes: 9AM - 7PM
                  <br /> Fines de semana: Soporte de emergencia
                </p>
              </div>
            </div>

            <div className="social-links" aria-hidden="false" role="navigation" aria-label="Redes sociales">
              <a
                href="https://www.facebook.com/profile.php?id=61587283381622"
                className="social-link"
                aria-label="Facebook (se abre en nueva pestaña)"
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
              >
                <img src={FacebookIcon} alt="" width="20" height="20" />
              </a>

              <a
                href="https://wa.me/543885970968"
                className="social-link"
                aria-label="WhatsApp (chatear)"
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
              >
                <img src={WhatsAppIcon} alt="" width="20" height="20" />
              </a>

              <a
                href="https://www.instagram.com/codeverse.codes?igsh=MWJ1N291OXd2MnA0cw=="
                className="social-link"
                aria-label="Instagram (se abre en nueva pestaña)"
                target="_blank"
                rel="noopener noreferrer"
                title="Instagram"
              >
                <img src={InstagramIcon} alt="" width="20" height="20" />
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
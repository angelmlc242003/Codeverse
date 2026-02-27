// src/components/ParticlesBackground/ParticlesBackground.jsx
import React, { useCallback, useRef, useEffect } from "react";
import { Particles } from "@tsparticles/react";
import { loadFull } from "tsparticles";
import "./ParticlesBackground.css";

export default function ParticlesBackground() {
  const containerRef = useRef(null);
  const resizeHandlerRef = useRef(null);

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback((container) => {
    // guardamos referencia al container para limpiar después
    containerRef.current = container;
    const canvas = container?.canvas?.element;
    if (!canvas) return;

    // Forzar estilos visuales (sobre-escribe inline si es necesario)
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "0";
    canvas.style.pointerEvents = "auto"; // permitir interacciones (hover/click)

    // Función que corrige el buffer interno y el estilo visual
    const resizeCanvas = () => {
      // atributos del canvas (buffer real)
      if (canvas.width !== window.innerWidth) canvas.width = window.innerWidth;
      if (canvas.height !== window.innerHeight) canvas.height = window.innerHeight;
      // estilos visuales (como se ve en la página)
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
    };

    // Ejecutar ahora y en resize
    resizeCanvas();
    // Guardar handler para poder removerlo luego
    resizeHandlerRef.current = resizeCanvas;
    window.addEventListener("resize", resizeCanvas);
  }, []);

  // cleanup cuando el componente se desmonta: removemos el listener y destruimos el container si existe
  useEffect(() => {
    return () => {
      if (resizeHandlerRef.current) {
        window.removeEventListener("resize", resizeHandlerRef.current);
      }
      const c = containerRef.current;
      if (c && typeof c.destroy === "function") {
        try { c.destroy(); } catch (e) { /* noop */ }
      }
    };
  }, []);

  const options = {
    fullScreen: { enable: true, zIndex: 0 },
    fpsLimit: 60,
    detectRetina: true,
    particles: {
      number: { value: 80, density: { enable: true, area: 800 } },
      color: { value: "#00aaff" }, // color de prueba visible; luego lo cambiás si querés
      shape: { type: "circle" },
      opacity: { value: 0.7 },
      size: { value: { min: 1, max: 3 }, random: true },
      links: { enable: true, distance: 150, color: "#00aaff", opacity: 0.5, width: 1 },
      move: { enable: true, speed: 2, direction: "none", straight: false, outModes: { default: "out" } },
    },
    interactivity: {
      events: { onHover: { enable: true, mode: "repulse" }, onClick: { enable: true, mode: "push" }, resize: true },
      modes: { repulse: { distance: 100, duration: 0.4 }, push: { quantity: 4 } },
    },
  };

  return <Particles id="tsparticles" init={particlesInit} loaded={particlesLoaded} options={options} />;
}

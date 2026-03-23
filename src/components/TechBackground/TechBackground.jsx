import { useEffect, useRef } from "react";
import "./TechBackground.css";

export default function TechBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const BLUE_RGBA = (a) => `rgba(35,101,237,${a})`;

    let W, H, nodes = [], glyphs = [], animId;
    let mouse = { x: 0, y: 0 };

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      mouse = { x: W / 2, y: H / 2 };
    }

    class Node {
      constructor(init = false) { this.reset(init); }
      reset(init = false) {
        this.x = Math.random() * W;
        this.y = init ? Math.random() * H : Math.random() < 0.5 ? -20 : H + 20;
        this.vx = (Math.random() - 0.5) * 0.45;
        this.vy = (Math.random() - 0.5) * 0.45;
        this.r = Math.random() < 0.07 ? 4 + Math.random() * 3 : 1.5 + Math.random() * 2;
        this.alpha = 0.3 + Math.random() * 0.7;
        this.pulse = Math.random() * Math.PI * 2;
        this.pulseSpeed = 0.02 + Math.random() * 0.03;
        this.isHub = this.r > 4;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += this.pulseSpeed;
        if (this.x < -50 || this.x > W + 50 || this.y < -50 || this.y > H + 50) this.reset(false);
      }
      draw() {
        const a = this.alpha * (0.7 + 0.3 * Math.sin(this.pulse));
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = BLUE_RGBA(a);
        ctx.fill();
        if (this.isHub) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.r + 4 + 2 * Math.sin(this.pulse), 0, Math.PI * 2);
          ctx.strokeStyle = BLUE_RGBA(a * 0.25);
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    class Glyph {
      constructor() { this.reset(); }
      reset() {
        this.x = Math.floor(Math.random() * Math.floor(W / 18)) * 18;
        this.y = -20;
        this.speed = 0.5 + Math.random() * 1.2;
        this.alpha = 0.06 + Math.random() * 0.1;
        this.interval = 8 + Math.floor(Math.random() * 15);
        this.tick = 0;
        const pool = "01アイウエオカキabcdef0123456789</>{}[]";
        const len = 4 + Math.floor(Math.random() * 12);
        this.chars = Array.from({ length: len }, () => pool[Math.floor(Math.random() * pool.length)]);
      }
      update() {
        this.y += this.speed;
        this.tick++;
        if (this.tick % this.interval === 0) {
          const pool = "01アイウエオabcdef0123456789</>{}";
          this.chars[Math.floor(Math.random() * this.chars.length)] = pool[Math.floor(Math.random() * pool.length)];
        }
        if (this.y > H + 200) this.reset();
      }
      draw() {
        ctx.font = '12px "Courier New", monospace';
        this.chars.forEach((ch, i) => {
          ctx.fillStyle = BLUE_RGBA(this.alpha * (1 - i / this.chars.length));
          ctx.fillText(ch, this.x, this.y - i * 16);
        });
      }
    }

    function init() {
      const count = Math.min(Math.floor((W * H) / 12000), 120);
      nodes = Array.from({ length: count }, () => new Node(true));
      glyphs = Array.from({ length: Math.floor(W / 80) }, () => new Glyph());
    }

    function drawGrid() {
      ctx.strokeStyle = "rgba(35,101,237,0.04)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 60) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += 60) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }
    }

    function drawConnections() {
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 150) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = BLUE_RGBA((1 - d / 150) * 0.25);
            ctx.lineWidth = nodes[i].isHub || nodes[j].isHub ? 0.8 : 0.4;
            ctx.stroke();
          }
        }
      }
    }

    function drawMouseAura() {
      nodes.forEach((node) => {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d < 180) {
          ctx.beginPath();
          ctx.moveTo(mouse.x, mouse.y);
          ctx.lineTo(node.x, node.y);
          ctx.strokeStyle = BLUE_RGBA((1 - d / 180) * 0.35);
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      });
    }

    function loop() {
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, W, H);
      drawGrid();
      glyphs.forEach((g) => { g.update(); g.draw(); });
      drawConnections();
      nodes.forEach((n) => { n.update(); n.draw(); });
      drawMouseAura();
      animId = requestAnimationFrame(loop);
    }

    const handleResize = () => { resize(); init(); };
    const handleMouse = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };

    resize();
    init();
    loop();
    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouse);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="tech-background-canvas" />;
}
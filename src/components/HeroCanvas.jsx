import React, { useEffect, useRef } from 'react';

export default function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let width = 0;
    let height = 0;

    // Mouse tracking with smooth lerp interpolation
    const mouse = {
      x: -1000,
      y: -1000,
      targetX: -1000,
      targetY: -1000,
      isHovered: false,
      radius: 160
    };

    // Particles pool
    const particleCount = window.innerWidth < 768 ? 35 : 70;
    const particles = [];

    const handleResize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect() || { width: window.innerWidth, height: window.innerHeight };
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = initial ? Math.random() * (width || window.innerWidth) : Math.random() * width;
        this.y = initial ? Math.random() * (height || window.innerHeight) : Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.baseRadius = Math.random() * 1.5 + 1;
        this.radius = this.baseRadius;
        this.alpha = Math.random() * 0.4 + 0.2;
        // Accent color (mostly cool white/slate with hints of cyan)
        this.isAccent = Math.random() > 0.75;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Wrap around bounds
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse interaction (repel + spring)
        if (mouse.isHovered) {
          const dx = this.x - mouse.x;
          const dy = this.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            const angle = Math.atan2(dy, dx);
            this.x += Math.cos(angle) * force * 3;
            this.y += Math.sin(angle) * force * 3;
            this.radius = this.baseRadius * (1 + force * 1.5);
          } else {
            this.radius += (this.baseRadius - this.radius) * 0.1;
          }
        } else {
          this.radius += (this.baseRadius - this.radius) * 0.1;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        if (this.isAccent) {
          ctx.fillStyle = `rgba(56, 189, 248, ${this.alpha * 1.2})`; // cyan accent
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        }
        ctx.fill();
      }
    }

    handleResize();
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const parent = canvas.parentElement;

    const handleMouseMove = (e) => {
      const rect = parent.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.isHovered = true;
    };

    const handleMouseLeave = () => {
      mouse.isHovered = false;
      mouse.targetX = -1000;
      mouse.targetY = -1000;
    };

    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove, { passive: true });
      parent.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    }
    window.addEventListener('resize', handleResize);

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.1 });
    observer.observe(canvas);

    // Animation Loop
    const render = () => {
      if (isVisible) {
        ctx.clearRect(0, 0, width, height);

        // Interpolate mouse coordinates smoothly
        mouse.x += (mouse.targetX - mouse.x) * 0.12;
        mouse.y += (mouse.targetY - mouse.y) * 0.12;

        // Draw soft ambient spotlight following mouse
        if (mouse.isHovered && mouse.x > 0 && mouse.y > 0) {
          const glow = ctx.createRadialGradient(
            mouse.x, mouse.y, 0,
            mouse.x, mouse.y, 220
          );
          glow.addColorStop(0, 'rgba(99, 102, 241, 0.16)'); // soft indigo
          glow.addColorStop(0.4, 'rgba(56, 189, 248, 0.08)'); // cyan haze
          glow.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(mouse.x, mouse.y, 220, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw proximity connecting lines
        const maxDist = 95;
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
              const alpha = (1 - dist / maxDist) * 0.18;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = `rgba(165, 180, 252, ${alpha})`;
              ctx.lineWidth = 0.75;
              ctx.stroke();
            }
          }
        }

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
          particles[i].update();
          particles[i].draw();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      observer.disconnect();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 pointer-events-none z-10 w-full h-full mix-blend-screen opacity-90 transition-opacity"
    />
  );
}

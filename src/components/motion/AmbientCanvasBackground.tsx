import React, { useEffect, useRef } from 'react';

interface AmbientCanvasBackgroundProps {
  className?: string;
  theme?: 'emerald' | 'gold' | 'chocolate' | 'dark';
}

export const AmbientCanvasBackground: React.FC<AmbientCanvasBackgroundProps> = ({
  className = '',
  theme = 'emerald',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);

    // Color palettes based on theme
    const getPalette = () => {
      switch (theme) {
        case 'gold':
          return ['rgba(217, 165, 43, ', 'rgba(242, 181, 68, ', 'rgba(255, 244, 214, '];
        case 'chocolate':
          return ['rgba(61, 35, 20, ', 'rgba(120, 60, 30, ', 'rgba(217, 165, 43, '];
        case 'dark':
          return ['rgba(11, 93, 67, ', 'rgba(217, 165, 43, ', 'rgba(23, 19, 12, '];
        case 'emerald':
        default:
          return ['rgba(11, 93, 67, ', 'rgba(7, 59, 43, ', 'rgba(217, 165, 43, '];
      }
    };

    const palette = getPalette();

    // Floating organic particles
    const particleCount = Math.min(35, Math.floor(width / 30));
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.5 + 1,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -Math.random() * 0.6 - 0.2, // Upward ambient float
      alpha: Math.random() * 0.4 + 0.1,
      color: palette[Math.floor(Math.random() * palette.length)],
      pulse: Math.random() * 0.02 + 0.005,
      pulseDir: 1,
    }));

    // Soft ambient glow Orbs
    const orbCount = 3;
    const orbs = Array.from({ length: orbCount }, (_, i) => ({
      x: (width / (orbCount + 1)) * (i + 1),
      y: height * (0.3 + i * 0.2),
      radius: Math.min(width, height) * (0.25 + i * 0.05),
      color: palette[i % palette.length],
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Render soft ambient background light orbs
      orbs.forEach((orb) => {
        orb.x += orb.vx;
        orb.y += orb.vy;

        if (orb.x < 0 || orb.x > width) orb.vx *= -1;
        if (orb.y < 0 || orb.y > height) orb.vy *= -1;

        const gradient = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.radius
        );
        gradient.addColorStop(0, orb.color + '0.12)');
        gradient.addColorStop(0.5, orb.color + '0.04)');
        gradient.addColorStop(1, orb.color + '0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Render floating particles
      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Alpha pulse
        p.alpha += p.pulse * p.pulseDir;
        if (p.alpha > 0.55 || p.alpha < 0.1) p.pulseDir *= -1;

        // Wrap around
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none z-0 ${className}`}
    />
  );
};

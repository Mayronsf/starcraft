import { useEffect, useRef } from 'react';

interface ParticlesProps {
  color?: string;
  count?: number;
  type?: 'embers' | 'ender' | 'ash';
}

export default function Particles({ color = '#c9a84c', count = 50, type = 'embers' }: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const targetCount = prefersReducedMotion ? Math.min(count, 8) : isMobile ? Math.min(count, 18) : count;
    const frameInterval = isMobile || prefersReducedMotion ? 1000 / 30 : 1000 / 45;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();

    interface Particle {
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fade: number;
    }

    const particles: Particle[] = [];

    for (let i = 0; i < targetCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedY: type === 'embers' ? -Math.random() * 0.5 - 0.2 : Math.random() * 0.3 + 0.1,
        speedX: (Math.random() - 0.5) * 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        fade: Math.random() * 0.01 + 0.005,
      });
    }

    let animationFrameId: number;
    let lastFrameTime = 0;
    let isPaused = document.hidden;

    const animate = (timestamp: number) => {
      if (isPaused || timestamp - lastFrameTime < frameInterval) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `${color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
        ctx.fill();

        particle.y += particle.speedY;
        particle.x += particle.speedX;

        if (type === 'ender') {
          particle.opacity = Math.sin(Date.now() * 0.001 + particle.x) * 0.3 + 0.4;
        } else {
          particle.opacity -= particle.fade;
        }

        if (particle.y < -10 || particle.opacity <= 0) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
          particle.opacity = Math.random() * 0.5 + 0.2;
        }

        if (particle.y > canvas.height + 10) {
          particle.y = -10;
          particle.x = Math.random() * canvas.width;
          particle.opacity = Math.random() * 0.5 + 0.2;
        }

        if (particle.x < -10 || particle.x > canvas.width + 10) {
          particle.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      setCanvasSize();
    };
    const handleVisibilityChange = () => {
      isPaused = document.hidden;
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [color, count, type]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}

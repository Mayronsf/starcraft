import { useEffect, useRef } from 'react';
import { IdleAnimation, SkinViewer } from 'skinview3d';

type Props = {
  skinUrl: string;
  width: number;
  height: number;
  /** Rotação com o rato (útil no painel expandido) */
  enableControls?: boolean;
  className?: string;
  /** Chamado se a skin não puder ser aplicada ao modelo 3D (ex.: fallback 2D) */
  onLoadError?: () => void;
};

/**
 * - data: → sem crossOrigin (anonymous quebra data URL no browser).
 * - http(s): → crossOrigin anonymous para o WebGL do skinview3d poder usar a textura
 *   (URLs do Supabase Storage são cross-origin; sem CORS o loadSkin falha e cai no fallback 2D).
 */
function loadImageElement(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Falha ao carregar a textura da skin'));
    if (src.startsWith('data:')) {
      image.src = src;
    } else {
      image.crossOrigin = 'anonymous';
      image.src = src;
    }
  });
}

/**
 * Renderiza uma skin Minecraft em 3D (estilo visualizadores tipo SkinMC), com fundo transparente sobre o xadrez do pai.
 */
export default function MinecraftSkinViewer3D({
  skinUrl,
  width,
  height,
  enableControls = false,
  className = '',
  onLoadError,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const onLoadErrorRef = useRef(onLoadError);
  onLoadErrorRef.current = onLoadError;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const viewer = new SkinViewer({
      width,
      height,
      enableControls,
      pixelRatio: Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2),
    });

    el.appendChild(viewer.canvas);
    viewer.canvas.className = 'relative z-[1] block max-h-full max-w-full';
    let cancelled = false;

    const run = async () => {
      try {
        const img = await loadImageElement(skinUrl);
        if (cancelled) return;
        viewer.loadSkin(img, { model: 'auto-detect' });
      } catch {
        if (!cancelled) onLoadErrorRef.current?.();
        return;
      }
      if (cancelled) return;

      viewer.animation = new IdleAnimation();
      viewer.zoom = 0.86;
      viewer.playerObject.rotation.y = 0.42;
      viewer.adjustCameraDistance();

      if (viewer.controls) {
        viewer.controls.enableZoom = false;
        viewer.controls.enablePan = false;
      }
    };

    void run();

    return () => {
      cancelled = true;
      if (viewer.canvas.parentNode === el) {
        el.removeChild(viewer.canvas);
      }
      viewer.dispose();
    };
  }, [skinUrl, width, height, enableControls]);

  return (
    <div
      ref={wrapRef}
      className={`skin-view-bg relative mx-auto overflow-hidden rounded-md border-[2px] border-deep-black ${className}`}
      style={{ width, height }}
    />
  );
}

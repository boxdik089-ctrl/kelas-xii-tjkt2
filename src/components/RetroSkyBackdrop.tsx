'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  phase: number;
  speed: number;
  color: string;
}

interface Cloud {
  x: number;
  yRatio: number;
  scale: number;
  speed: number;
}

interface Packet {
  x: number;
  yRatio: number;
  speed: number;
  length: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
}

interface Bird {
  x: number;
  yRatio: number;
  speed: number;
  phase: number;
}

function getSkyPalette(dark: boolean, wallpaper: string) {
  if (dark) {
    return {
      top: '#030816',
      bottom: '#0a1936',
      cloud: 'rgba(56, 189, 248, 0.14)',
      cloudHighlight: 'rgba(125, 211, 252, 0.22)',
      grid: 'rgba(34, 211, 238, 0.08)',
      skyline: 'rgba(3, 8, 22, 0.92)',
      windowOn: '#22d3ee',
      windowAlt: '#facc15'
    };
  }

  if (wallpaper === 'navy') {
    return {
      top: '#0f2d4a',
      bottom: '#1c4d7a',
      cloud: 'rgba(255, 255, 255, 0.24)',
      cloudHighlight: 'rgba(255, 255, 255, 0.36)',
      grid: 'rgba(255, 255, 255, 0.07)',
      skyline: 'rgba(9, 27, 46, 0.55)',
      windowOn: '#fde047',
      windowAlt: '#7dd3fc'
    };
  }

  if (wallpaper === 'plum') {
    return {
      top: '#2e2144',
      bottom: '#4c386e',
      cloud: 'rgba(255, 245, 250, 0.22)',
      cloudHighlight: 'rgba(255, 255, 255, 0.34)',
      grid: 'rgba(255, 255, 255, 0.07)',
      skyline: 'rgba(25, 16, 40, 0.55)',
      windowOn: '#fde047',
      windowAlt: '#f9a8d4'
    };
  }

  // Classic Windows 98 Teal Day Sky
  return {
    top: '#006d70',
    bottom: '#0c9292',
    cloud: 'rgba(255, 255, 255, 0.28)',
    cloudHighlight: 'rgba(255, 255, 255, 0.42)',
    grid: 'rgba(255, 255, 255, 0.08)',
    skyline: 'rgba(0, 62, 62, 0.55)',
    windowOn: '#fef08a',
    windowAlt: '#a5f3fc'
  };
}

/**
 * Latar animasi piksel Retro OS yang beradaptasi otomatis
 * antara Mode Cerah (matahari, awan bergerak, burung, paket cahaya)
 * dan Mode Malam (bulan sabit, bintang berkedip, bintang jatuh, lampu kota).
 */
export default function RetroSkyBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId = 0;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let time = 0;
    let lastTs = performance.now();
    let nextShootDelay = 2.6;
    let shootingStar: ShootingStar | null = null;

    // Seeded deterministic-feeling particles
    const stars: Star[] = Array.from({ length: 85 }, (_, i) => ({
      x: ((i * 137.5) % 100) / 100,
      y: ((i * 73.1 + 11) % 72) / 100,
      size: i % 5 === 0 ? 3 : 2,
      phase: i * 0.7,
      speed: 1.4 + (i % 4) * 0.5,
      color: i % 7 === 0 ? '#5ee7ff' : i % 11 === 0 ? '#fde047' : '#ffffff'
    }));

    const clouds: Cloud[] = [
      { x: 0.08, yRatio: 0.14, scale: 3.4, speed: 12 },
      { x: 0.44, yRatio: 0.22, scale: 2.8, speed: 8 },
      { x: 0.78, yRatio: 0.12, scale: 3.8, speed: 14 },
      { x: 0.24, yRatio: 0.36, scale: 2.4, speed: 6.5 },
      { x: 0.65, yRatio: 0.42, scale: 3.0, speed: 10 },
      { x: 0.92, yRatio: 0.29, scale: 2.5, speed: 7.5 }
    ];

    const birds: Bird[] = [
      { x: 0.15, yRatio: 0.25, speed: 24, phase: 0 },
      { x: 0.21, yRatio: 0.28, speed: 22, phase: 1.4 },
      { x: 0.68, yRatio: 0.19, speed: 28, phase: 2.8 }
    ];

    const packets: Packet[] = Array.from({ length: 10 }, (_, i) => ({
      x: (i * 0.13) % 1,
      yRatio: 0.56 + (i % 4) * 0.09,
      speed: 35 + (i % 3) * 18,
      length: 10 + (i % 3) * 6,
      color: i % 2 === 0 ? '#5ee7ff' : '#fde047'
    }));

    const buildings = Array.from({ length: 28 }, (_, i) => ({
      w: 28 + ((i * 17) % 34),
      h: 26 + ((i * 29) % 48),
      seed: i
    }));

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.imageSmoothingEnabled = false;
    };

    const drawPixelCloud = (px: number, py: number, s: number, fill: string, hi: string) => {
      ctx.fillStyle = fill;
      ctx.fillRect(Math.round(px), Math.round(py + s * 3), s * 16, s * 4);
      ctx.fillRect(Math.round(px + s * 2), Math.round(py + s), s * 11, s * 2);
      ctx.fillRect(Math.round(px + s * 4), Math.round(py), s * 6, s * 2);
      ctx.fillStyle = hi;
      ctx.fillRect(Math.round(px + s * 4), Math.round(py), s * 6, s);
      ctx.fillRect(Math.round(px + s * 2), Math.round(py + s), s * 3, s);
    };

    const drawPixelSun = (cx: number, cy: number, t: number) => {
      const pulse = Math.sin(t * 2) > 0 ? 1 : 0;
      ctx.fillStyle = 'rgba(253, 224, 71, 0.16)';
      ctx.fillRect(cx - 28 - pulse * 4, cy - 28 - pulse * 4, 56 + pulse * 8, 56 + pulse * 8);
      ctx.fillStyle = 'rgba(253, 224, 71, 0.3)';
      ctx.fillRect(cx - 20, cy - 20, 40, 40);
      ctx.fillStyle = '#fde047';
      ctx.fillRect(cx - 14, cy - 14, 28, 28);
      ctx.fillStyle = '#fef9c3';
      ctx.fillRect(cx - 10, cy - 10, 16, 12);

      // Pixel sun rays
      const rayOff = 24 + pulse * 3;
      ctx.fillStyle = '#fde047';
      ctx.fillRect(cx - 2, cy - rayOff - 6, 4, 6);
      ctx.fillRect(cx - 2, cy + rayOff, 4, 6);
      ctx.fillRect(cx - rayOff - 6, cy - 2, 6, 4);
      ctx.fillRect(cx + rayOff, cy - 2, 6, 4);
    };

    const drawPixelMoon = (cx: number, cy: number, t: number) => {
      const glow = 0.14 + Math.sin(t * 1.4) * 0.04;
      ctx.fillStyle = `rgba(147, 197, 253, ${glow})`;
      ctx.fillRect(cx - 24, cy - 24, 48, 48);

      // Transparent-background pixel crescent moon (3px pixel unit)
      const s = 4;
      const ox = cx - 14;
      const oy = cy - 14;
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(ox + s * 2, oy, s * 4, s);
      ctx.fillRect(ox + s, oy + s, s * 3, s);
      ctx.fillRect(ox, oy + s * 2, s * 2, s * 3);
      ctx.fillRect(ox + s, oy + s * 5, s * 3, s);
      ctx.fillRect(ox + s * 2, oy + s * 6, s * 4, s);

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(ox + s, oy + s * 2, s, s * 2);
    };

    const drawFrame = (dt: number, animate: boolean) => {
      const root = document.documentElement;
      const isDark = root.getAttribute('data-theme') === 'dark';
      const wallpaper = root.getAttribute('data-wallpaper') || 'teal';
      const palette = getSkyPalette(isDark, wallpaper);

      if (animate) time += dt;

      // Sky gradient
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, palette.top);
      grad.addColorStop(1, palette.bottom);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Subtle retro dot/grid matrix
      ctx.fillStyle = palette.grid;
      const step = 32;
      for (let gx = 0; gx < width; gx += step) {
        ctx.fillRect(gx, 0, 1, height);
      }
      for (let gy = 0; gy < height; gy += step) {
        ctx.fillRect(0, gy, width, 1);
      }

      // Celestial body (upper right corner)
      const celX = Math.max(width - 95, width * 0.85);
      const celY = 112;
      if (isDark) {
        // Twinkling 8-bit starfield
        for (const s of stars) {
          const alpha = 0.25 + 0.75 * (0.5 + 0.5 * Math.sin(time * s.speed + s.phase));
          ctx.globalAlpha = alpha;
          ctx.fillStyle = s.color;
          ctx.fillRect(Math.round(s.x * width), Math.round(s.y * height), s.size, s.size);
        }
        ctx.globalAlpha = 1;

        drawPixelMoon(Math.round(celX), Math.round(celY), time);

        // Periodic shooting pixel star
        if (animate) {
          if (!shootingStar) {
            nextShootDelay -= dt;
            if (nextShootDelay <= 0) {
              shootingStar = {
                x: width * (0.2 + Math.random() * 0.55),
                y: height * (0.08 + Math.random() * 0.25),
                vx: 360,
                vy: 150,
                life: 0,
                maxLife: 0.75
              };
              nextShootDelay = 3.5 + Math.random() * 4;
            }
          } else {
            shootingStar.x += shootingStar.vx * dt;
            shootingStar.y += shootingStar.vy * dt;
            shootingStar.life += dt;
            const progress = 1 - shootingStar.life / shootingStar.maxLife;
            if (progress > 0) {
              ctx.globalAlpha = progress;
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(Math.round(shootingStar.x), Math.round(shootingStar.y), 4, 4);
              ctx.fillStyle = '#5ee7ff';
              ctx.fillRect(Math.round(shootingStar.x - 10), Math.round(shootingStar.y - 4), 8, 2);
              ctx.fillRect(Math.round(shootingStar.x - 20), Math.round(shootingStar.y - 8), 8, 2);
              ctx.globalAlpha = 1;
            } else {
              shootingStar = null;
            }
          }
        }
      } else {
        drawPixelSun(Math.round(celX), Math.round(celY), time);

        // Gliding pixel birds in daytime sky
        ctx.fillStyle = 'rgba(255, 255, 255, 0.72)';
        for (const b of birds) {
          if (animate) {
            b.x += (b.speed * dt) / Math.max(width, 600);
            if (b.x > 1.08) b.x = -0.08;
          }
          const bx = Math.round(b.x * width);
          const by = Math.round(b.yRatio * height + Math.sin(time * 3 + b.phase) * 4);
          const flap = Math.sin(time * 7 + b.phase) > 0 ? -2 : 2;
          ctx.fillRect(bx - 6, by + flap, 4, 2);
          ctx.fillRect(bx - 2, by, 4, 2);
          ctx.fillRect(bx + 2, by + flap, 4, 2);
        }
      }

      // Drifting Pixel Clouds (both Day and Night)
      for (const c of clouds) {
        if (animate) {
          c.x += (c.speed * dt) / Math.max(width, 700);
          if (c.x > 1.15) c.x = -0.18;
        }
        drawPixelCloud(c.x * width, c.yRatio * height, c.scale, palette.cloud, palette.cloudHighlight);
      }

      // Traveling network data packets (TJKT signature in lower sky)
      for (const p of packets) {
        if (animate) {
          p.x += (p.speed * dt) / Math.max(width, 700);
          if (p.x > 1.08) p.x = -0.08;
        }
        ctx.globalAlpha = isDark ? 0.35 : 0.25;
        ctx.fillStyle = p.color;
        ctx.fillRect(Math.round(p.x * width), Math.round(p.yRatio * height), p.length, 2);
      }
      ctx.globalAlpha = 1;

      // Pixel skyline silhouette at bottom of viewport (above taskbar)
      const baseH = height - 38;
      let cursorX = 0;
      let idx = 0;
      while (cursorX < width) {
        const b = buildings[idx % buildings.length];
        const bx = cursorX;
        const by = baseH - b.h;
        ctx.fillStyle = palette.skyline;
        ctx.fillRect(bx, by, b.w + 2, b.h + 40);

        // Subtle animated pixel windows
        for (let wy = by + 6; wy < baseH - 10; wy += 10) {
          for (let wx = bx + 5; wx < bx + b.w - 6; wx += 8) {
            const flicker = Math.sin(time * 0.9 + b.seed * 1.7 + wx + wy);
            if (flicker > (isDark ? 0.15 : 0.55)) {
              ctx.globalAlpha = isDark ? 0.45 : 0.3;
              ctx.fillStyle = (wx + wy) % 16 === 0 ? palette.windowAlt : palette.windowOn;
              ctx.fillRect(wx, wy, 3, 4);
            }
          }
        }
        ctx.globalAlpha = 1;
        cursorX += b.w;
        idx += 1;
      }
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTs) / 1000));
      lastTs = now;
      const fxEnabled =
        document.documentElement.getAttribute('data-fx') !== 'off' &&
        !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      drawFrame(dt, fxEnabled);
      animId = requestAnimationFrame(tick);
    };

    resize();
    drawFrame(0, false);
    animId = requestAnimationFrame(tick);

    const observer = new MutationObserver(() => {
      drawFrame(0, false);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-wallpaper', 'data-fx']
    });

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="retro-sky-canvas" aria-hidden="true" />;
}

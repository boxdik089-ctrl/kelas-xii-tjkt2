import type { GallerySceneId, PixelSpriteConfig } from '@/data/classData';

/**
 * Maskot pixel-art orisinil kelas XII TJKT 2: "PIXI-LAN"
 * Digambar pada grid 16x16 integer piksel dengan shapeRendering="crispEdges".
 */
export function MascotSprite({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={className}
      role="img"
      aria-label="Maskot Pixel RPG PIXI-LAN Kelas XII TJKT 2"
    >
      {/* Night meadow sky tile */}
      <rect width="16" height="16" fill="#181a33" />
      <rect x="2" y="2" width="1" height="1" fill="#f6c453" />
      <rect x="13" y="3" width="1" height="1" fill="#5ee7ff" />
      <rect x="0" y="13" width="16" height="3" fill="#233b3b" />
      <rect x="1" y="13" width="14" height="1" fill="#3b6e5c" />

      {/* Glowing Router Antenna Horn */}
      <rect x="7" y="1" width="2" height="1" fill="#5ee7ff" />
      <rect x="7" y="2" width="2" height="2" fill="#f6c453" />
      <rect x="6" y="1" width="1" height="1" fill="#5ee7ff" opacity="0.6" />
      <rect x="9" y="1" width="1" height="1" fill="#5ee7ff" opacity="0.6" />

      {/* Wizard / Adventurer Hat Brim */}
      <rect x="5" y="4" width="6" height="1" fill="#d97706" />
      <rect x="3" y="5" width="10" height="1" fill="#f6c453" />

      {/* Slime-Router Body Outline & Fill */}
      <rect x="4" y="6" width="8" height="1" fill="#1e40af" />
      <rect x="3" y="7" width="10" height="4" fill="#38bdf8" />
      <rect x="4" y="6" width="8" height="1" fill="#5ee7ff" />
      <rect x="2" y="8" width="1" height="3" fill="#0284c7" />
      <rect x="13" y="8" width="1" height="3" fill="#0284c7" />
      <rect x="3" y="11" width="10" height="2" fill="#0284c7" />
      <rect x="4" y="12" width="8" height="1" fill="#1e3a8a" />

      {/* Cute Highlight */}
      <rect x="4" y="7" width="2" height="1" fill="#e0f2fe" />

      {/* Eyes & Blush */}
      <rect x="5" y="8" width="1" height="2" fill="#0f172a" />
      <rect x="10" y="8" width="1" height="2" fill="#0f172a" />
      <rect x="4" y="10" width="1" height="1" fill="#ff6b6b" />
      <rect x="11" y="10" width="1" height="1" fill="#ff6b6b" />
      {/* Smile */}
      <rect x="7" y="10" width="2" height="1" fill="#0f172a" />

      {/* LAN LED Port Strip */}
      <rect x="5" y="11" width="1" height="1" fill="#4ade80" />
      <rect x="7" y="11" width="1" height="1" fill="#f6c453" />
      <rect x="9" y="11" width="1" height="1" fill="#4ade80" />
      <rect x="11" y="11" width="1" height="1" fill="#ff6b6b" />

      {/* Mini Staff on Right */}
      <rect x="14" y="6" width="1" height="7" fill="#92400e" />
      <rect x="14" y="5" width="1" height="1" fill="#4ade80" />
    </svg>
  );
}

/**
 * Sprite karakter hero 16x16 untuk anggota dan wali kelas
 */
export function PixelAvatar({
  config,
  label,
  className = ''
}: {
  config: PixelSpriteConfig;
  label: string;
  className?: string;
}) {
  const { skin, hairStyle, hairColor, tunicColor, accentColor, accessory, bgColor } = config;

  return (
    <svg
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={className}
      role="img"
      aria-label={`Sprite Pixel ${label}`}
    >
      {/* Background tile */}
      <rect width="16" height="16" fill={bgColor} />
      <rect x="1" y="1" width="1" height="1" fill="#ffffff" opacity="0.22" />
      <rect x="14" y="2" width="1" height="1" fill={accentColor} opacity="0.4" />
      <rect x="0" y="14" width="16" height="2" fill="#000000" opacity="0.2" />

      {/* Shoulders / RPG Tunic */}
      <rect x="3" y="12" width="10" height="4" fill={tunicColor} />
      <rect x="4" y="11" width="8" height="1" fill={tunicColor} />
      {/* Collar / Trim */}
      <rect x="6" y="11" width="4" height="1" fill={accentColor} />
      <rect x="7" y="12" width="2" height="3" fill={accentColor} opacity="0.85" />

      {/* Neck */}
      <rect x="7" y="10" width="2" height="1" fill={skin} />

      {/* Hijab or Long Hair Back */}
      {hairStyle === 'hijab' && (
        <>
          <rect x="4" y="3" width="8" height="9" fill={hairColor} />
          <rect x="3" y="5" width="10" height="7" fill={hairColor} />
          <rect x="5" y="11" width="6" height="2" fill={hairColor} />
          <rect x="4" y="3" width="8" height="1" fill={accentColor} opacity="0.45" />
        </>
      )}
      {hairStyle === 'long' && (
        <rect x="4" y="4" width="8" height="8" fill={hairColor} />
      )}
      {hairStyle === 'bob' && (
        <rect x="4" y="4" width="8" height="6" fill={hairColor} />
      )}
      {hairStyle === 'ponytail' && (
        <>
          <rect x="12" y="5" width="2" height="4" fill={hairColor} />
          <rect x="13" y="7" width="1" height="3" fill={hairColor} />
        </>
      )}

      {/* Face */}
      <rect x="5" y="5" width="6" height="5" fill={skin} />

      {/* Hair Top & Bangs */}
      {hairStyle !== 'hijab' && (
        <>
          <rect x="5" y="3" width="6" height="2" fill={hairColor} />
          <rect x="4" y="4" width="1" height="3" fill={hairColor} />
          <rect x="11" y="4" width="1" height="3" fill={hairColor} />
        </>
      )}
      {hairStyle === 'spiky' && (
        <>
          <rect x="5" y="2" width="1" height="1" fill={hairColor} />
          <rect x="7" y="2" width="2" height="1" fill={hairColor} />
          <rect x="10" y="2" width="1" height="1" fill={hairColor} />
        </>
      )}
      {hairStyle === 'curly' && (
        <>
          <rect x="4" y="3" width="2" height="2" fill={hairColor} />
          <rect x="10" y="3" width="2" height="2" fill={hairColor} />
          <rect x="6" y="2" width="4" height="1" fill={hairColor} />
        </>
      )}
      {hairStyle === 'hijab' && (
        <rect x="5" y="4" width="6" height="1" fill={hairColor} />
      )}

      {/* Eyes */}
      <rect x="6" y="7" width="1" height="1" fill="#0f172a" />
      <rect x="9" y="7" width="1" height="1" fill="#0f172a" />
      {/* Warm cheek pixels */}
      <rect x="5" y="8" width="1" height="1" fill="#ff8a8a" opacity="0.65" />
      <rect x="10" y="8" width="1" height="1" fill="#ff8a8a" opacity="0.65" />
      {/* Smile */}
      <rect x="7" y="9" width="2" height="1" fill="#9a5b42" />

      {/* Accessories */}
      {accessory === 'glasses' && (
        <>
          <rect x="5" y="6" width="3" height="2" fill="#ffffff" opacity="0.25" />
          <rect x="8" y="6" width="3" height="2" fill="#ffffff" opacity="0.25" />
          <rect x="5" y="6" width="6" height="1" fill="#e2e8f0" opacity="0.7" />
        </>
      )}
      {accessory === 'visor' && (
        <rect x="5" y="6" width="6" height="2" fill="#5ee7ff" opacity="0.75" />
      )}
      {accessory === 'headband' && (
        <rect x="4" y="4" width="8" height="1" fill={accentColor} />
      )}
      {accessory === 'wizardhat' && (
        <>
          <rect x="3" y="4" width="10" height="1" fill={tunicColor} />
          <rect x="5" y="2" width="6" height="2" fill={tunicColor} />
          <rect x="7" y="1" width="2" height="1" fill={accentColor} />
        </>
      )}
      {accessory === 'headphones' && (
        <>
          <rect x="4" y="3" width="8" height="1" fill={accentColor} />
          <rect x="3" y="6" width="1" height="3" fill={accentColor} />
          <rect x="12" y="6" width="1" height="3" fill={accentColor} />
        </>
      )}
    </svg>
  );
}

/**
 * Adegan pixel-art 24x16 untuk Galeri Inventaris & Easter Egg
 */
export function PixelScene({
  scene,
  title,
  className = ''
}: {
  scene: GallerySceneId | 'easteregg';
  title: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 16"
      shapeRendering="crispEdges"
      className={className}
      role="img"
      aria-label={`Ilustrasi Pixel ${title}`}
    >
      {/* Background dasar ruang/langit RPG */}
      <rect width="24" height="16" fill="#181b34" />
      <rect x="0" y="12" width="24" height="4" fill="#25294a" />
      <rect x="0" y="12" width="24" height="1" fill="#3d4473" />

      {scene === 'crimping' && (
        <>
          {/* RJ45 Head & 8 UTP Colored Wires */}
          <rect x="7" y="2" width="10" height="7" fill="#334155" />
          <rect x="8" y="3" width="8" height="5" fill="#1e293b" />
          <rect x="8" y="3" width="1" height="2" fill="#f6c453" />
          <rect x="10" y="3" width="1" height="2" fill="#f6c453" />
          <rect x="12" y="3" width="1" height="2" fill="#f6c453" />
          <rect x="14" y="3" width="1" height="2" fill="#f6c453" />
          <rect x="8" y="9" width="1" height="5" fill="#fb923c" />
          <rect x="10" y="9" width="1" height="5" fill="#4ade80" />
          <rect x="12" y="9" width="1" height="5" fill="#38bdf8" />
          <rect x="14" y="9" width="1" height="5" fill="#a16207" />
          {/* Cable Tester Green */}
          <rect x="19" y="5" width="3" height="6" fill="#0f172a" />
          <rect x="20" y="6" width="1" height="1" fill="#4ade80" />
          <rect x="20" y="8" width="1" height="1" fill="#4ade80" />
          <rect x="20" y="10" width="1" height="1" fill="#4ade80" />
        </>
      )}

      {scene === 'fiber' && (
        <>
          {/* Glowing Pixel Fiber Core */}
          <rect x="1" y="7" width="8" height="2" fill="#334155" />
          <rect x="15" y="7" width="8" height="2" fill="#334155" />
          <rect x="2" y="7" width="20" height="1" fill="#5ee7ff" />
          <rect x="11" y="5" width="2" height="6" fill="#f6c453" />
          <rect x="11" y="6" width="2" height="4" fill="#ffffff" />
          <rect x="9" y="4" width="1" height="1" fill="#5ee7ff" />
          <rect x="14" y="11" width="1" height="1" fill="#5ee7ff" />
        </>
      )}

      {scene === 'datacenter' && (
        <>
          {/* Three Server Racks */}
          {[3, 9, 15].map((x, i) => (
            <g key={x}>
              <rect x={x} y="2" width="5" height="11" fill="#0f172a" />
              <rect x={x + 1} y="3" width="3" height="2" fill="#1e293b" />
              <rect x={x + 1} y="6" width="3" height="2" fill="#1e293b" />
              <rect x={x + 1} y="9" width="3" height="2" fill="#1e293b" />
              <rect x={x + 1} y="3" width="1" height="1" fill="#4ade80" />
              <rect x={x + 3} y="6" width="1" height="1" fill={i === 1 ? '#f6c453' : '#5ee7ff'} />
              <rect x={x + 1} y="9" width="1" height="1" fill="#4ade80" />
            </g>
          ))}
        </>
      )}

      {scene === 'trophy' && (
        <>
          {/* Golden RPG Trophy */}
          <rect x="8" y="3" width="8" height="5" fill="#f6c453" />
          <rect x="7" y="4" width="1" height="2" fill="#ca8a04" />
          <rect x="16" y="4" width="1" height="2" fill="#ca8a04" />
          <rect x="10" y="4" width="4" height="2" fill="#fef08a" />
          <rect x="11" y="8" width="2" height="3" fill="#ca8a04" />
          <rect x="9" y="11" width="6" height="2" fill="#78350f" />
          <rect x="4" y="3" width="1" height="1" fill="#5ee7ff" />
          <rect x="19" y="4" width="1" height="1" fill="#ff6b6b" />
          <rect x="5" y="9" width="1" height="1" fill="#fde047" />
        </>
      )}

      {scene === 'lks' && (
        <>
          {/* Dual Retro Monitor Setup */}
          <rect x="3" y="4" width="8" height="6" fill="#334155" />
          <rect x="4" y="5" width="6" height="4" fill="#064e3b" />
          <rect x="5" y="6" width="4" height="1" fill="#4ade80" />
          <rect x="5" y="8" width="2" height="1" fill="#5ee7ff" />
          <rect x="13" y="4" width="8" height="6" fill="#334155" />
          <rect x="14" y="5" width="6" height="4" fill="#1e1b4b" />
          <rect x="15" y="6" width="4" height="1" fill="#f6c453" />
          <rect x="15" y="8" width="3" height="1" fill="#ff6b6b" />
          <rect x="6" y="10" width="2" height="2" fill="#64748b" />
          <rect x="16" y="10" width="2" height="2" fill="#64748b" />
        </>
      )}

      {scene === 'gathering' && (
        <>
          {/* Cozy Campfire & Squad Silhouettes */}
          <rect x="3" y="2" width="1" height="1" fill="#fde047" />
          <rect x="19" y="3" width="1" height="1" fill="#5ee7ff" />
          <rect x="11" y="10" width="2" height="2" fill="#f97316" />
          <rect x="11" y="9" width="2" height="1" fill="#fde047" />
          <rect x="10" y="12" width="4" height="1" fill="#78350f" />
          {[5, 8, 15, 18].map((x) => (
            <g key={x}>
              <rect x={x} y="7" width="2" height="2" fill="#f2c29b" />
              <rect x={x} y="9" width="2" height="3" fill={x % 2 === 0 ? '#38bdf8' : '#f6c453'} />
            </g>
          ))}
        </>
      )}

      {scene === 'antenna' && (
        <>
          {/* Rooftop Radio Tower & Waves */}
          <rect x="11" y="5" width="2" height="8" fill="#94a3b8" />
          <rect x="10" y="10" width="4" height="1" fill="#64748b" />
          <rect x="11" y="3" width="2" height="2" fill="#f6c453" />
          <rect x="8" y="3" width="1" height="3" fill="#5ee7ff" />
          <rect x="15" y="3" width="1" height="3" fill="#5ee7ff" />
          <rect x="6" y="2" width="1" height="5" fill="#4ade80" />
          <rect x="17" y="2" width="1" height="5" fill="#4ade80" />
        </>
      )}

      {scene === 'easteregg' && (
        <>
          {/* Funny Unplugged LAN Cable & Sad Router */}
          <rect x="3" y="5" width="7" height="6" fill="#1e293b" />
          <rect x="4" y="6" width="5" height="3" fill="#450a0a" />
          <rect x="5" y="7" width="3" height="1" fill="#ff6b6b" />
          {/* Coiled unplugged cable */}
          <rect x="13" y="10" width="6" height="1" fill="#5ee7ff" />
          <rect x="18" y="6" width="1" height="4" fill="#5ee7ff" />
          <rect x="15" y="6" width="3" height="1" fill="#5ee7ff" />
          <rect x="14" y="5" width="2" height="2" fill="#f6c453" />
          <rect x="11" y="3" width="2" height="2" fill="#fde047" />
        </>
      )}

      {scene === 'bossstage' && (
        <>
          {/* Castle Gate / Final Stage Banner */}
          <rect x="5" y="4" width="14" height="9" fill="#2e3459" />
          <rect x="5" y="3" width="2" height="1" fill="#f6c453" />
          <rect x="9" y="3" width="2" height="1" fill="#f6c453" />
          <rect x="13" y="3" width="2" height="1" fill="#f6c453" />
          <rect x="17" y="3" width="2" height="1" fill="#f6c453" />
          <rect x="10" y="7" width="4" height="6" fill="#0f172a" />
          <rect x="7" y="6" width="2" height="2" fill="#5ee7ff" />
          <rect x="15" y="6" width="2" height="2" fill="#5ee7ff" />
        </>
      )}
    </svg>
  );
}

/**
 * Ikon UI bergaya piksel (SVG crispEdges) — menggantikan emoji agar rapi di semua OS
 */
export function PixelIcon({
  name,
  className = 'w-4 h-4'
}: {
  name:
    | 'sound'
    | 'music'
    | 'spark'
    | 'menu'
    | 'close'
    | 'arrowRight'
    | 'arrowLeft'
    | 'arrowDown'
    | 'search'
    | 'shield'
    | 'share'
    | 'copy'
    | 'heart'
    | 'chest'
    | 'instagram'
    | 'tiktok'
    | 'github'
    | 'youtube';
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 16 16"
      shapeRendering="crispEdges"
      className={className}
      aria-hidden="true"
    >
      {name === 'sound' && (
        <>
          <rect x="2" y="6" width="3" height="4" fill="currentColor" />
          <rect x="5" y="4" width="2" height="8" fill="currentColor" />
          <rect x="7" y="2" width="2" height="12" fill="currentColor" />
          <rect x="11" y="5" width="1" height="6" fill="currentColor" />
          <rect x="13" y="3" width="1" height="10" fill="currentColor" />
        </>
      )}
      {name === 'music' && (
        <>
          <rect x="6" y="2" width="7" height="2" fill="currentColor" />
          <rect x="6" y="4" width="2" height="8" fill="currentColor" />
          <rect x="11" y="4" width="2" height="7" fill="currentColor" />
          <rect x="3" y="10" width="4" height="3" fill="currentColor" />
          <rect x="9" y="9" width="4" height="3" fill="currentColor" />
        </>
      )}
      {name === 'spark' && (
        <>
          <rect x="7" y="1" width="2" height="5" fill="currentColor" />
          <rect x="7" y="10" width="2" height="5" fill="currentColor" />
          <rect x="1" y="7" width="5" height="2" fill="currentColor" />
          <rect x="10" y="7" width="5" height="2" fill="currentColor" />
          <rect x="5" y="5" width="6" height="6" fill="currentColor" opacity="0.6" />
        </>
      )}
      {name === 'menu' && (
        <>
          <rect x="2" y="3" width="12" height="2" fill="currentColor" />
          <rect x="2" y="7" width="12" height="2" fill="currentColor" />
          <rect x="2" y="11" width="12" height="2" fill="currentColor" />
        </>
      )}
      {name === 'close' && (
        <>
          <rect x="3" y="3" width="2" height="2" fill="currentColor" />
          <rect x="5" y="5" width="2" height="2" fill="currentColor" />
          <rect x="7" y="7" width="2" height="2" fill="currentColor" />
          <rect x="9" y="9" width="2" height="2" fill="currentColor" />
          <rect x="11" y="11" width="2" height="2" fill="currentColor" />
          <rect x="11" y="3" width="2" height="2" fill="currentColor" />
          <rect x="9" y="5" width="2" height="2" fill="currentColor" />
          <rect x="5" y="9" width="2" height="2" fill="currentColor" />
          <rect x="3" y="11" width="2" height="2" fill="currentColor" />
        </>
      )}
      {name === 'arrowRight' && (
        <>
          <rect x="2" y="7" width="9" height="2" fill="currentColor" />
          <rect x="8" y="5" width="2" height="6" fill="currentColor" />
          <rect x="10" y="6" width="2" height="4" fill="currentColor" />
          <rect x="12" y="7" width="2" height="2" fill="currentColor" />
        </>
      )}
      {name === 'arrowLeft' && (
        <>
          <rect x="5" y="7" width="9" height="2" fill="currentColor" />
          <rect x="6" y="5" width="2" height="6" fill="currentColor" />
          <rect x="4" y="6" width="2" height="4" fill="currentColor" />
          <rect x="2" y="7" width="2" height="2" fill="currentColor" />
        </>
      )}
      {name === 'arrowDown' && (
        <>
          <rect x="7" y="2" width="2" height="9" fill="currentColor" />
          <rect x="5" y="8" width="6" height="2" fill="currentColor" />
          <rect x="6" y="10" width="4" height="2" fill="currentColor" />
          <rect x="7" y="12" width="2" height="2" fill="currentColor" />
        </>
      )}
      {name === 'search' && (
        <>
          <rect x="4" y="2" width="5" height="2" fill="currentColor" />
          <rect x="2" y="4" width="2" height="5" fill="currentColor" />
          <rect x="9" y="4" width="2" height="5" fill="currentColor" />
          <rect x="4" y="9" width="5" height="2" fill="currentColor" />
          <rect x="10" y="10" width="2" height="2" fill="currentColor" />
          <rect x="12" y="12" width="2" height="2" fill="currentColor" />
        </>
      )}
      {name === 'shield' && (
        <>
          <rect x="3" y="2" width="10" height="2" fill="currentColor" />
          <rect x="3" y="4" width="10" height="5" fill="currentColor" />
          <rect x="4" y="9" width="8" height="2" fill="currentColor" />
          <rect x="6" y="11" width="4" height="2" fill="currentColor" />
          <rect x="7" y="13" width="2" height="1" fill="currentColor" />
        </>
      )}
      {name === 'share' && (
        <>
          <rect x="10" y="2" width="4" height="4" fill="currentColor" />
          <rect x="2" y="6" width="4" height="4" fill="currentColor" />
          <rect x="10" y="10" width="4" height="4" fill="currentColor" />
          <rect x="6" y="5" width="4" height="2" fill="currentColor" />
          <rect x="6" y="9" width="4" height="2" fill="currentColor" />
        </>
      )}
      {name === 'copy' && (
        <>
          <rect x="6" y="2" width="8" height="2" fill="currentColor" />
          <rect x="6" y="4" width="2" height="8" fill="currentColor" />
          <rect x="12" y="4" width="2" height="8" fill="currentColor" />
          <rect x="6" y="10" width="8" height="2" fill="currentColor" />
          <rect x="2" y="5" width="3" height="2" fill="currentColor" />
          <rect x="2" y="7" width="2" height="7" fill="currentColor" />
          <rect x="4" y="12" width="6" height="2" fill="currentColor" />
        </>
      )}
      {name === 'heart' && (
        <>
          <rect x="3" y="3" width="4" height="2" fill="currentColor" />
          <rect x="9" y="3" width="4" height="2" fill="currentColor" />
          <rect x="2" y="5" width="12" height="3" fill="currentColor" />
          <rect x="3" y="8" width="10" height="2" fill="currentColor" />
          <rect x="5" y="10" width="6" height="2" fill="currentColor" />
          <rect x="7" y="12" width="2" height="2" fill="currentColor" />
        </>
      )}
      {name === 'chest' && (
        <>
          <rect x="2" y="4" width="12" height="3" fill="currentColor" />
          <rect x="2" y="8" width="12" height="6" fill="currentColor" />
          <rect x="7" y="6" width="2" height="3" fill="#f6c453" />
        </>
      )}
      {name === 'instagram' && (
        <>
          <rect x="2" y="2" width="12" height="2" fill="currentColor" />
          <rect x="2" y="12" width="12" height="2" fill="currentColor" />
          <rect x="2" y="4" width="2" height="8" fill="currentColor" />
          <rect x="12" y="4" width="2" height="8" fill="currentColor" />
          <rect x="6" y="6" width="4" height="4" fill="currentColor" />
          <rect x="10" y="4" width="1" height="1" fill="currentColor" />
        </>
      )}
      {name === 'tiktok' && (
        <>
          <rect x="8" y="2" width="2" height="10" fill="currentColor" />
          <rect x="10" y="3" width="3" height="2" fill="currentColor" />
          <rect x="4" y="9" width="4" height="4" fill="currentColor" />
        </>
      )}
      {name === 'github' && (
        <>
          <rect x="4" y="3" width="2" height="2" fill="currentColor" />
          <rect x="10" y="3" width="2" height="2" fill="currentColor" />
          <rect x="3" y="5" width="10" height="6" fill="currentColor" />
          <rect x="5" y="11" width="6" height="3" fill="currentColor" />
        </>
      )}
      {name === 'youtube' && (
        <>
          <rect x="1" y="3" width="14" height="10" fill="currentColor" />
          <rect x="6" y="6" width="2" height="4" fill="#141322" />
          <rect x="8" y="7" width="2" height="2" fill="#141322" />
        </>
      )}
    </svg>
  );
}

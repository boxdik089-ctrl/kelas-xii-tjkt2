'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CLASS_DATA as ClassDataType, ClassMember, GalleryItem } from '@/data/classData';
import { MascotSprite, PixelAvatar, PixelIcon, PixelScene } from '@/components/PixelSprites';
import { pixelAudio } from '@/lib/pixelAudio';

interface PixelGuildAppProps {
  data: typeof ClassDataType;
  initialServerNow: number;
}

interface SecretPayload {
  badge: string;
  title: string;
  caption: string;
  story: string;
}

interface QuestLogState {
  cheered: boolean;
  cheersSent: number;
  lastCheerMessage: string;
  easterUnlocked: boolean;
}

const SECTIONS = [
  { id: 'start', label: 'Mulai', level: 'LVL 01 // START' },
  { id: 'about', label: 'Tentang', level: 'LVL 02 // NPC DIALOG' },
  { id: 'members', label: 'Anggota', level: 'LVL 03 // ANGGOTA' },
  { id: 'stats', label: 'Statistik', level: 'LVL 04 // STATUS HUD' },
  { id: 'timeline', label: 'Peta Level', level: 'LVL 05 // PETA LEVEL' },
  { id: 'gallery', label: 'Galeri', level: 'LVL 06 // INVENTARIS' },
  { id: 'outro', label: 'Penutup', level: 'LVL 07 // PENUTUP' }
] as const;

const KONAMI_SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a'
];

const INITIAL_VISIBLE_MEMBERS = 8;

function pad(value: number, length = 2) {
  return String(Math.max(0, Math.floor(value))).padStart(length, '0');
}

function getRarityClass(rarity: GalleryItem['rarity']) {
  switch (rarity) {
    case 'LEGENDARY':
      return 'rarity-tag--legendary';
    case 'EPIC':
      return 'rarity-tag--epic';
    case 'MYTHIC':
      return 'rarity-tag--mythic';
    default:
      return '';
  }
}

export default function PixelGuildApp({ data, initialServerNow }: PixelGuildAppProps) {
  // HUD & Audio/Visual preferences
  const [sfxOn, setSfxOn] = useState(true);
  const [bgmOn, setBgmOn] = useState(false);
  const [fxOn, setFxOn] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('start');
  const [scrollPct, setScrollPct] = useState(14);
  const [apiStatus, setApiStatus] = useState<'ONLINE' | 'CHECKING'>('CHECKING');

  // Live uptime timer
  const [nowMs, setNowMs] = useState(initialServerNow);

  // NPC Dialog state
  const [dialogIdx, setDialogIdx] = useState(0);
  const [typedText, setTypedText] = useState(data.npcDialogs[0].text);
  const [isTyping, setIsTyping] = useState(false);

  // Members Roster (backed by /api/members)
  const [members, setMembers] = useState<ClassMember[]>(data.members);
  const [totalFiltered, setTotalFiltered] = useState(data.members.length);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDivision, setActiveDivision] = useState('Semua');
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [flippedIds, setFlippedIds] = useState<Record<string, boolean>>({});
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Gallery & Lightbox
  const [activeGalleryCat, setActiveGalleryCat] = useState('Semua');
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const touchStartX = useRef(0);

  // Backend Quest Log & Cheer
  const [questLog, setQuestLog] = useState<QuestLogState>({
    cheered: false,
    cheersSent: 0,
    lastCheerMessage: '',
    easterUnlocked: false
  });
  const [cheerPresets, setCheerPresets] = useState<string[]>([
    'Solid terus XII TJKT 2!',
    'Sukses Ujikom & Masa Depan!'
  ]);

  // Easter Egg (verified via /api/easter-egg)
  const [secretModal, setSecretModal] = useState<SecretPayload | null>(null);
  const [secretInput, setSecretInput] = useState('');
  const [mascotTaps, setMascotTaps] = useState(0);
  const mascotTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const konamiBuffer = useRef<string[]>([]);

  // Toast message
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  // Sync FX attribute & reduced motion preference
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let initialFx = !prefersReduced;
    try {
      const saved = localStorage.getItem('tjkt2_pixel_fx');
      if (saved === 'on' || saved === 'off') initialFx = saved === 'on';
    } catch {}
    setFxOn(initialFx);
    document.documentElement.setAttribute('data-fx', initialFx ? 'on' : 'off');
  }, []);

  // Check backend /api/health and /api/quest-log on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.status === 'ONLINE') setApiStatus('ONLINE');
      })
      .catch(() => setApiStatus('ONLINE'));

    fetch('/api/quest-log')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.quest) setQuestLog(json.quest);
        if (Array.isArray(json?.cheerPresets)) setCheerPresets(json.cheerPresets);
      })
      .catch(() => {});
  }, []);

  // Live 1-second timer
  useEffect(() => {
    setNowMs(Date.now());
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.min(100, Math.max(12, (window.scrollY / docHeight) * 100)) : 14;
      setScrollPct(pct);

      const offset = window.scrollY + 140;
      let current = SECTIONS[0].id as string;
      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el && el.offsetTop <= offset) {
          current = sec.id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // NPC Typewriter Effect
  const openDialog = useCallback(
    (idx: number, instant = false) => {
      const len = data.npcDialogs.length;
      const nextIdx = ((idx % len) + len) % len;
      const fullText = data.npcDialogs[nextIdx].text;
      setDialogIdx(nextIdx);

      if (instant || !fxOn) {
        setTypedText(fullText);
        setIsTyping(false);
        return;
      }

      setTypedText('');
      setIsTyping(true);
    },
    [data.npcDialogs, fxOn]
  );

  useEffect(() => {
    if (!isTyping) return;
    const fullText = data.npcDialogs[dialogIdx].text;
    let cursor = 0;
    const id = setInterval(() => {
      cursor += 2;
      if (cursor >= fullText.length) {
        setTypedText(fullText);
        setIsTyping(false);
        clearInterval(id);
      } else {
        setTypedText(fullText.slice(0, cursor));
      }
    }, 20);
    return () => clearInterval(id);
  }, [isTyping, dialogIdx, data.npcDialogs]);

  // Query backend /api/members when search or division filter changes
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoadingMembers(true);
      try {
        const params = new URLSearchParams();
        if (searchQuery.trim()) params.set('q', searchQuery.trim());
        if (activeDivision !== 'Semua') params.set('division', activeDivision);
        const res = await fetch(`/api/members?${params.toString()}`, {
          signal: controller.signal
        });
        if (res.ok) {
          const payload = await res.json();
          setMembers(payload.items);
          setTotalFiltered(payload.filteredCount);
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          // Fallback filter lokal jika offline
          const q = searchQuery.trim().toLowerCase();
          const local = data.members.filter((m) => {
            if (activeDivision !== 'Semua' && m.division !== activeDivision) return false;
            if (!q) return true;
            return (
              m.name.toLowerCase().includes(q) ||
              m.nickname.toLowerCase().includes(q) ||
              m.role.toLowerCase().includes(q) ||
              m.rpgClass.toLowerCase().includes(q)
            );
          });
          setMembers(local);
          setTotalFiltered(local.length);
        }
      } finally {
        setLoadingMembers(false);
      }
    }, 150);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [searchQuery, activeDivision, data.members]);

  // Unlock Easter Egg via Vercel backend /api/easter-egg
  const unlockEasterEgg = useCallback(
    async (code: string) => {
      try {
        const res = await fetch('/api/easter-egg', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code })
        });
        const payload = await res.json();
        if (!res.ok || !payload.unlocked) {
          pixelAudio.playClick();
          showToast(payload.message || 'Kode rahasia belum cocok.');
          return;
        }
        setSecretModal(payload.secret);
        pixelAudio.playEasterEgg();
        showToast('Achievement terbuka! Harta karun Lab 02 ditemukan.');

        // Catat di cookie quest-log backend
        fetch('/api/quest-log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'easter' })
        })
          .then((r) => (r.ok ? r.json() : null))
          .then((q) => {
            if (q?.quest) setQuestLog(q.quest);
          })
          .catch(() => {});
      } catch {
        showToast('Gagal menghubungi server untuk verifikasi kode.');
      }
    },
    [showToast]
  );

  // Global keyboard shortcuts (Konami + Lightbox + Escape)
  const filteredGallery = useMemo(
    () =>
      data.gallery.filter(
        (item) => activeGalleryCat === 'Semua' || item.category === activeGalleryCat
      ),
    [data.gallery, activeGalleryCat]
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIdx(null);
        setSecretModal(null);
        return;
      }

      if (lightboxIdx !== null) {
        if (e.key === 'ArrowLeft') {
          setLightboxIdx((prev) =>
            prev === null ? null : (prev - 1 + filteredGallery.length) % filteredGallery.length
          );
          pixelAudio.playClick();
        } else if (e.key === 'ArrowRight') {
          setLightboxIdx((prev) =>
            prev === null ? null : (prev + 1) % filteredGallery.length
          );
          pixelAudio.playClick();
        }
        return;
      }

      const target = e.target as HTMLElement | null;
      if (target && ['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      const keyNorm = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      konamiBuffer.current.push(keyNorm);
      if (konamiBuffer.current.length > KONAMI_SEQUENCE.length) {
        konamiBuffer.current.shift();
      }
      if (KONAMI_SEQUENCE.every((val, idx) => konamiBuffer.current[idx] === val)) {
        konamiBuffer.current = [];
        void unlockEasterEgg('konami');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [lightboxIdx, filteredGallery.length, unlockEasterEgg]);

  // Derived uptime breakdown
  const formedMs = useMemo(() => new Date(data.classInfo.formedAt).getTime(), [data.classInfo.formedAt]);
  const elapsedSec = Math.max(0, Math.floor((nowMs - formedMs) / 1000));
  const days = Math.floor(elapsedSec / 86400);
  const hours = Math.floor((elapsedSec % 86400) / 3600);
  const minutes = Math.floor((elapsedSec % 3600) / 60);
  const seconds = elapsedSec % 60;

  const isFilteringMembers = activeDivision !== 'Semua' || searchQuery.trim() !== '';
  const visibleMembers =
    showAllMembers || isFilteringMembers
      ? members
      : members.slice(0, INITIAL_VISIBLE_MEMBERS);

  const divisions = useMemo(
    () => ['Semua', ...Array.from(new Set(data.members.map((m) => m.division)))],
    [data.members]
  );

  const galleryCategories = useMemo(
    () => ['Semua', ...Array.from(new Set(data.gallery.map((g) => g.category)))],
    [data.gallery]
  );

  const currentLevelLabel =
    SECTIONS.find((s) => s.id === activeSection)?.level || 'LVL 01 // START';

  // Handlers
  function toggleFx() {
    pixelAudio.playClick();
    const next = !fxOn;
    setFxOn(next);
    document.documentElement.setAttribute('data-fx', next ? 'on' : 'off');
    try {
      localStorage.setItem('tjkt2_pixel_fx', next ? 'on' : 'off');
    } catch {}
    showToast(next ? 'Efek animasi Pixel RPG aktif.' : 'Mode hemat animasi diaktifkan.');
  }

  function toggleSfx() {
    const next = pixelAudio.setSFX(!sfxOn);
    setSfxOn(next);
    showToast(next ? 'Efek suara 8-bit aktif.' : 'Efek suara 8-bit dimatikan.');
  }

  function toggleBgm() {
    const next = pixelAudio.setBGM(!bgmOn);
    setBgmOn(next);
    showToast(next ? 'Musik latar 8-bit diputar.' : 'Musik latar dimatikan.');
  }

  function handleMascotTap() {
    pixelAudio.playClick();
    const nextCount = mascotTaps + 1;
    if (mascotTimer.current) clearTimeout(mascotTimer.current);

    if (nextCount >= 5) {
      setMascotTaps(0);
      void unlockEasterEgg('pixilan');
      return;
    }

    setMascotTaps(nextCount);
    mascotTimer.current = setTimeout(() => setMascotTaps(0), 2200);
  }

  async function handleSendCheer(message: string) {
    pixelAudio.playSuccess();
    try {
      const res = await fetch('/api/quest-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cheer', message })
      });
      const json = await res.json();
      if (json?.quest) {
        setQuestLog(json.quest);
        showToast(`Semangat terkirim! ("${message}")`);
      }
    } catch {
      showToast('Gagal menyimpan semangat, coba lagi.');
    }
  }

  async function handleCopyLink() {
    const url = window.location.href;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
      pixelAudio.playSuccess();
      showToast('Link halaman XII TJKT 2 berhasil disalin!');
    } catch {
      showToast('Salin link langsung dari kolom alamat browser.');
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: data.classInfo.shareTitle,
          text: data.classInfo.shareText,
          url: window.location.href
        });
        pixelAudio.playSuccess();
        return;
      } catch (err) {
        if ((err as Error)?.name === 'AbortError') return;
      }
    }
    await handleCopyLink();
  }

  const activeGalleryItem =
    lightboxIdx !== null ? filteredGallery[lightboxIdx] || null : null;

  return (
    <>
      <div className="pixel-stars" aria-hidden="true" />
      <a className="skip-link" href="#main-content">
        Langsung ke konten
      </a>

      {/* ================================================================= */}
      {/* NAVIGASI TETAP DI ATAS                                            */}
      {/* ================================================================= */}
      <header className="rpg-header">
        <div className="rpg-header__inner">
          <a href="#start" className="brand-rpg">
            <span className="brand-rpg__badge" aria-hidden="true">
              <PixelIcon name="shield" className="px-icon" />
            </span>
            <span className="brand-rpg__text">
              <strong>{data.classInfo.name}</strong>
              <small>{currentLevelLabel}</small>
            </span>
          </a>

          <nav className="rpg-nav" aria-label="Navigasi Halaman">
            {SECTIONS.map((sec) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className={`rpg-nav__link${activeSection === sec.id ? ' is-active' : ''}`}
                onClick={() => pixelAudio.playClick()}
              >
                {sec.label}
              </a>
            ))}
          </nav>

          <div className="hud-actions">
            <button
              type="button"
              className={`hud-btn${sfxOn ? ' is-on' : ''}`}
              aria-pressed={sfxOn}
              onClick={toggleSfx}
              title="Aktifkan/Matikan Efek Suara 8-bit"
            >
              <PixelIcon name="sound" className="px-icon" />
              <span className="hud-btn__text">SFX</span>
            </button>

            <button
              type="button"
              className={`hud-btn${bgmOn ? ' is-on' : ''}`}
              aria-pressed={bgmOn}
              onClick={toggleBgm}
              title="Putar/Hentikan Musik Latar 8-bit"
            >
              <PixelIcon name="music" className="px-icon" />
              <span className="hud-btn__text">BGM</span>
            </button>

            <button
              type="button"
              className={`hud-btn${fxOn ? ' is-on' : ''}`}
              aria-pressed={fxOn}
              onClick={toggleFx}
              title="Matikan/Nyalakan Animasi"
            >
              <PixelIcon name="spark" className="px-icon" />
              <span className="hud-btn__text">FX</span>
            </button>

            <button
              type="button"
              className="menu-toggle-btn"
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label="Buka menu navigasi"
              onClick={() => {
                pixelAudio.playClick();
                setMenuOpen((prev) => !prev);
              }}
            >
              <PixelIcon name={menuOpen ? 'close' : 'menu'} className="px-icon" />
            </button>
          </div>
        </div>

        <div className="xp-bar-track" aria-hidden="true">
          <div className="xp-bar-fill" style={{ width: `${scrollPct}%` }} />
        </div>

        {menuOpen && (
          <div className="mobile-menu" id="mobile-nav-drawer">
            {SECTIONS.map((sec, idx) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className={`mobile-menu__link${activeSection === sec.id ? ' is-active' : ''}`}
                onClick={() => {
                  pixelAudio.playClick();
                  setMenuOpen(false);
                }}
              >
                {pad(idx + 1)} // {sec.label}
              </a>
            ))}
          </div>
        )}
      </header>

      <main id="main-content">
        {/* =============================================================== */}
        {/* SECTION 1: LAYAR PEMBUKA (LAYAR TITLE GAME)                     */}
        {/* =============================================================== */}
        <section id="start" className="section hero-section">
          <div className="container hero-grid">
            <div>
              <div className="status-pills">
                <span className="pixel-pill pixel-pill--online">
                  <span className="pixel-dot" aria-hidden="true" />
                  <span>SERVER: {apiStatus}</span>
                </span>
                <span className="pixel-pill">{data.classInfo.guildName}</span>
                <span className="pixel-pill">{data.classInfo.totalMembers} ANGGOTA</span>
              </div>

              <h1 className="hero-title">{data.classInfo.name}</h1>
              <p className="hero-program">{data.classInfo.program}</p>
              <blockquote className="hero-motto">{data.classInfo.motto}</blockquote>

              <div className="hero-timer-pill" aria-label="Timer hari sejak kelas terbentuk">
                <span>GUILD AKTIF:</span>
                <strong>
                  {pad(days, 3)}H : {pad(hours)}J : {pad(minutes)}M : {pad(seconds)}D
                </strong>
              </div>

              <div className="hero-buttons">
                <button
                  type="button"
                  className="btn-rpg btn-rpg--primary btn-blink"
                  onClick={() => {
                    pixelAudio.playStart();
                    document.getElementById('about')?.scrollIntoView({
                      behavior: fxOn ? 'smooth' : 'auto'
                    });
                  }}
                >
                  <span>MULAI</span>
                  <PixelIcon name="arrowRight" className="px-icon" />
                </button>

                <a
                  href="#members"
                  className="btn-rpg btn-rpg--secondary"
                  onClick={() => pixelAudio.playClick()}
                >
                  <span>36 Karakter</span>
                </a>

                <button
                  type="button"
                  className="btn-rpg btn-rpg--secondary"
                  onClick={() => void handleShare()}
                >
                  <PixelIcon name="share" className="px-icon" />
                  <span>Bagikan</span>
                </button>
              </div>
            </div>

            <div className="mascot-stage">
              <button
                type="button"
                className="rpg-window rpg-window--gold mascot-btn"
                onClick={handleMascotTap}
                aria-label="Maskot PIXI-LAN Kelas XII TJKT 2"
              >
                <div className="card-top-row">
                  <span className="rpg-class-tag">MASKOT ORISINIL</span>
                  <span className="lvl-pill">
                    {mascotTaps >= 2 ? `TAP ${mascotTaps}/5` : 'LV.99'}
                  </span>
                </div>
                <div className="mascot-sprite-frame">
                  <MascotSprite className="mascot-sprite-svg" />
                </div>
                <div className="mascot-caption">
                  <strong>{data.classInfo.mascotName}</strong>
                  <span>{data.classInfo.mascotTagline}</span>
                </div>
              </button>
            </div>
          </div>

          <a
            href="#about"
            className="scroll-down-link"
            onClick={() => pixelAudio.playClick()}
          >
            <span>GULIR KE BAWAH UNTUK NAIK LEVEL</span>
            <PixelIcon name="arrowDown" className="px-icon" />
          </a>
        </section>

        {/* =============================================================== */}
        {/* SECTION 2: TENTANG KELAS (KOTAK DIALOG NPC)                      */}
        {/* =============================================================== */}
        <section id="about" className="section">
          <div className="container">
            <div className="section-head">
              <span className="quest-badge">LVL 02 // KOTAK DIALOG NPC</span>
              <h2 className="section-title">Tentang Kelas Kami</h2>
              <p className="section-desc">
                Profil singkat kelas XII TJKT 2, misi jurusan, dan sosok Wali Kelas yang membimbing kami.
              </p>
            </div>

            <div className="about-grid">
              <div className="rpg-window npc-window">
                <div className="npc-top">
                  <div className="npc-tabs" role="tablist" aria-label="Topik dialog kelas">
                    {data.npcDialogs.map((dlg, idx) => (
                      <button
                        key={dlg.topic}
                        type="button"
                        role="tab"
                        aria-selected={dialogIdx === idx}
                        className={`npc-tab${dialogIdx === idx ? ' is-active' : ''}`}
                        onClick={() => {
                          pixelAudio.playClick();
                          openDialog(idx);
                        }}
                      >
                        {dlg.topic}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="btn-rpg btn-rpg--small"
                    onClick={() => {
                      pixelAudio.playClick();
                      openDialog(dialogIdx, true);
                    }}
                  >
                    Tampilkan Penuh
                  </button>
                </div>

                <div className="npc-body">
                  <div className="npc-portrait" aria-hidden="true">
                    <MascotSprite />
                  </div>
                  <div>
                    <div className="npc-speaker">{data.npcDialogs[dialogIdx].speaker}</div>
                    <p className="npc-speech" aria-live="polite">
                      {typedText}
                    </p>
                  </div>
                </div>

                <div className="npc-footer">
                  <span className="npc-counter">
                    DIALOG {dialogIdx + 1} / {data.npcDialogs.length}
                  </span>
                  <button
                    type="button"
                    className="btn-rpg btn-rpg--small"
                    onClick={() => {
                      pixelAudio.playClick();
                      openDialog(dialogIdx + 1);
                    }}
                  >
                    <span>Lanjut Dialog</span>
                    <PixelIcon name="arrowRight" className="px-icon" />
                  </button>
                </div>
              </div>

              <div className="teacher-side">
                <article className="rpg-window rpg-window--gold">
                  <span className="quest-badge">GUILD MASTER // WALI KELAS</span>
                  <div className="teacher-head">
                    <div className="teacher-sprite">
                      {data.homeroomTeacher.photoConsent && data.homeroomTeacher.photo ? (
                        <img
                          src={data.homeroomTeacher.photo}
                          alt={`Foto ${data.homeroomTeacher.name}`}
                          loading="lazy"
                        />
                      ) : (
                        <PixelAvatar
                          config={data.homeroomTeacher.spriteConfig}
                          label={data.homeroomTeacher.name}
                        />
                      )}
                    </div>
                    <div className="teacher-info">
                      <h3>{data.homeroomTeacher.name}</h3>
                      <p>{data.homeroomTeacher.subject}</p>
                      <span className="teacher-years">{data.homeroomTeacher.yearsGuiding}</span>
                    </div>
                  </div>
                  <blockquote className="teacher-quote">
                    &ldquo;{data.homeroomTeacher.quote}&rdquo;
                  </blockquote>
                </article>

                <div className="spec-grid">
                  <div className="spec-card">
                    <span>ANGGOTA</span>
                    <strong>{data.classInfo.totalMembers} Siswa</strong>
                  </div>
                  <div className="spec-card">
                    <span>ANGKATAN</span>
                    <strong>{data.classInfo.batch}</strong>
                  </div>
                  <div className="spec-card">
                    <span>KOMPETENSI</span>
                    <strong>TJKT</strong>
                  </div>
                  <div className="spec-card">
                    <span>MARKAS</span>
                    <strong>Lab Jaringan 02</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 3: ANGGOTA KELAS (KARTU KARAKTER FLIP + API SEARCH)     */}
        {/* =============================================================== */}
        <section id="members" className="section">
          <div className="container">
            <div className="section-head">
              <span className="quest-badge">LVL 03 // KARTU KARAKTER</span>
              <h2 className="section-title">Anggota Guild XII TJKT 2</h2>
              <p className="section-desc">
                Tap atau klik kartu karakter mana pun untuk membaliknya dan membaca kutipan singkat setiap anggota.
              </p>
            </div>

            <div className="roster-controls">
              <div className="search-wrap">
                <PixelIcon name="search" className="px-icon search-wrap__icon" />
                <label htmlFor="member-search-input" className="sr-only">
                  Cari nama, panggilan, atau peran anggota
                </label>
                <input
                  id="member-search-input"
                  type="search"
                  className="search-input"
                  placeholder="Cari nama, panggilan, atau class RPG..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="filter-row" role="group" aria-label="Filter divisi anggota">
                {divisions.map((divName) => (
                  <button
                    key={divName}
                    type="button"
                    className={`filter-btn${activeDivision === divName ? ' is-active' : ''}`}
                    onClick={() => {
                      pixelAudio.playClick();
                      setActiveDivision(divName);
                    }}
                  >
                    {divName}
                  </button>
                ))}
              </div>
            </div>

            <div className="roster-meta">
              <span>
                {loadingMembers
                  ? 'Memuat dari server...'
                  : `Menampilkan ${visibleMembers.length} dari ${totalFiltered} anggota`}
              </span>
              <span className="privacy-note">
                <PixelIcon name="shield" className="px-icon" />
                <span>Privasi aman · Tanpa No. HP &amp; Alamat</span>
              </span>
            </div>

            <div className="members-grid">
              {visibleMembers.length === 0 ? (
                <div className="rpg-window">
                  Tidak ada anggota yang cocok dengan pencarian &ldquo;{searchQuery}&rdquo;.
                </div>
              ) : (
                visibleMembers.map((member) => {
                  const flipped = Boolean(flippedIds[member.id]);
                  return (
                    <article
                      key={member.id}
                      className={`card-flip-wrap${flipped ? ' is-flipped' : ''}`}
                    >
                      <button
                        type="button"
                        className="card-flip-btn"
                        aria-pressed={flipped}
                        aria-label={`Kartu karakter ${member.name}, ${member.role}. Klik untuk membalik kartu.`}
                        onClick={() => {
                          pixelAudio.playFlip();
                          setFlippedIds((prev) => ({
                            ...prev,
                            [member.id]: !prev[member.id]
                          }));
                        }}
                      >
                        {/* Front */}
                        <div className="card-face">
                          <div className="card-top-row">
                            <span className="rpg-class-tag">{member.rpgClass}</span>
                            <span className="lvl-pill">LV.{member.level}</span>
                          </div>
                          <div className="sprite-box">
                            {member.photoConsent && member.photo ? (
                              <img
                                src={member.photo}
                                alt={`Foto ${member.name}`}
                                loading="lazy"
                              />
                            ) : (
                              <PixelAvatar config={member.spriteConfig} label={member.name} />
                            )}
                          </div>
                          <div className="member-info">
                            <h3>{member.name}</h3>
                            <span className="member-nick">&ldquo;{member.nickname}&rdquo;</span>
                            <p className="member-role">{member.role}</p>
                          </div>
                          <div className="card-hint-row">
                            <span>{member.division}</span>
                            <span>KLIK BALIK</span>
                          </div>
                        </div>

                        {/* Back */}
                        <div className="card-face card-face--back">
                          <div className="card-top-row">
                            <span className="rpg-class-tag">{member.rpgClass}</span>
                            <span className="lvl-pill">{member.division}</span>
                          </div>
                          <blockquote className="back-quote">
                            &ldquo;{member.quote}&rdquo;
                          </blockquote>
                          <div className="back-details">
                            <span>
                              <strong>Panggilan:</strong> {member.nickname}
                            </span>
                            <span>
                              <strong>Keahlian:</strong> {member.specialty}
                            </span>
                          </div>
                          <div className="card-hint-row">
                            <span>{member.name}</span>
                            <span>KEMBALI</span>
                          </div>
                        </div>
                      </button>
                    </article>
                  );
                })
              )}
            </div>

            {!isFilteringMembers && members.length > INITIAL_VISIBLE_MEMBERS && (
              <div className="roster-footer">
                <button
                  type="button"
                  className="btn-rpg btn-rpg--secondary"
                  onClick={() => {
                    pixelAudio.playClick();
                    setShowAllMembers((prev) => !prev);
                  }}
                >
                  {showAllMembers
                    ? 'Ringkas Tampilan (8 Karakter)'
                    : `Tampilkan Semua ${members.length} Karakter`}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 4: STATISTIK KELAS (PANEL STATUS + TIMER + CHEER API)   */}
        {/* =============================================================== */}
        <section id="stats" className="section">
          <div className="container">
            <div className="section-head">
              <span className="quest-badge">LVL 04 // PANEL STATUS GAME</span>
              <h2 className="section-title">Statistik &amp; Fakta Seru Kelas</h2>
              <p className="section-desc">
                Penghitung waktu aktif kelas XII TJKT 2 ala timer game beserta rekap perjalanan kami.
              </p>
            </div>

            <div className="rpg-window rpg-window--gold uptime-box">
              <div className="uptime-head">
                <div>
                  <span className="rpg-class-tag">TIMER GUILD SEJAK 17 JULI 2023</span>
                  <h3>Penghitung Hari Kelas Aktif</h3>
                </div>
                <span className="pixel-pill pixel-pill--online">
                  <span className="pixel-dot" aria-hidden="true" />
                  <span>LIVE TIMER</span>
                </span>
              </div>

              <div className="digits-grid">
                <div className="digit-tile">
                  <strong>{pad(days, 4)}</strong>
                  <span>HARI</span>
                </div>
                <div className="digit-tile">
                  <strong>{pad(hours)}</strong>
                  <span>JAM</span>
                </div>
                <div className="digit-tile">
                  <strong>{pad(minutes)}</strong>
                  <span>MENIT</span>
                </div>
                <div className="digit-tile">
                  <strong>{pad(seconds)}</strong>
                  <span>DETIK</span>
                </div>
              </div>
            </div>

            <div className="stats-grid">
              {data.stats.map((stat) => (
                <article key={stat.id} className="rpg-window stat-tile" data-bar={stat.barColor}>
                  <span className="stat-tile__label">{stat.label}</span>
                  <strong className="stat-tile__val">
                    {stat.value}
                    {stat.suffix}
                  </strong>
                  <p className="stat-tile__detail">{stat.detail}</p>
                  <div className="hp-track" aria-hidden="true">
                    <div className="hp-fill" style={{ width: `${stat.progress}%` }} />
                  </div>
                </article>
              ))}
            </div>

            {/* Quest Log Cheer Widget tersambung ke /api/quest-log */}
            <div className="rpg-window cheer-bar">
              <div>
                <span className="rpg-class-tag">QUEST LOG PENGUNJUNG</span>
                <p style={{ margin: '0.25rem 0 0', fontSize: '0.94rem' }}>
                  {questLog.cheered
                    ? `Kamu sudah mengirim ${questLog.cheersSent}x semangat: "${questLog.lastCheerMessage}"`
                    : 'Kirim semangat untuk kelas XII TJKT 2 (tersimpan di sesi browsermu):'}
                </p>
              </div>
              <div className="filter-row">
                {cheerPresets.slice(0, 2).map((msg) => (
                  <button
                    key={msg}
                    type="button"
                    className="btn-rpg btn-rpg--emerald"
                    onClick={() => void handleSendCheer(msg)}
                  >
                    <PixelIcon name="heart" className="px-icon" />
                    <span>{msg}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 5: KEGIATAN & PRESTASI (PETA LEVEL)                     */}
        {/* =============================================================== */}
        <section id="timeline" className="section">
          <div className="container">
            <div className="section-head">
              <span className="quest-badge">LVL 05 // PETA LEVEL</span>
              <h2 className="section-title">Kegiatan &amp; Prestasi</h2>
              <p className="section-desc">
                Garis waktu petualangan kelas kami dari tahun pertama hingga babak akhir Ujikom.
              </p>
            </div>

            <ol className="quest-map">
              {data.timeline.map((item) => {
                const isActive = item.status === 'ACTIVE';
                return (
                  <li key={item.level} className={`quest-node${isActive ? ' is-active' : ''}`}>
                    <article className="rpg-window">
                      <div className="quest-node__top">
                        <div>
                          <span className="quest-node__lvl">
                            {item.level} · {item.badge}{' '}
                          </span>
                          <span className="quest-node__date">({item.date})</span>
                        </div>
                        <span
                          className={`quest-status${isActive ? ' quest-status--active' : ''}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </article>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 6: GALERI KENANGAN (LAYAR INVENTARIS + LIGHTBOX)        */}
        {/* =============================================================== */}
        <section id="gallery" className="section">
          <div className="container">
            <div className="section-head">
              <span className="quest-badge">LVL 06 // LAYAR INVENTARIS</span>
              <h2 className="section-title">Galeri Kenangan Kelas</h2>
              <p className="section-desc">
                Peti inventaris berisi dokumentasi kegiatan dan kenangan kelas. Klik item untuk melihat detailnya.
              </p>
            </div>

            <div
              className="filter-row"
              style={{ marginBottom: '1.35rem' }}
              role="group"
              aria-label="Filter kategori galeri"
            >
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`filter-btn${activeGalleryCat === cat ? ' is-active' : ''}`}
                  onClick={() => {
                    pixelAudio.playClick();
                    setActiveGalleryCat(cat);
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="inventory-grid">
              {filteredGallery.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  className="inv-item"
                  onClick={() => {
                    pixelAudio.playClick();
                    setLightboxIdx(idx);
                  }}
                >
                  <div className="inv-media">
                    {item.image ? (
                      <img src={item.image} alt={item.title} loading="lazy" />
                    ) : (
                      <PixelScene scene={item.scene} title={item.title} />
                    )}
                    <div className="inv-badges">
                      <span className="inv-id">#{item.id}</span>
                      <span className={`rarity-tag ${getRarityClass(item.rarity)}`}>
                        {item.rarity}
                      </span>
                    </div>
                  </div>
                  <div className="inv-body">
                    <span className="inv-date">
                      {item.category.toUpperCase()} · {item.date}
                    </span>
                    <h3 className="inv-title">{item.title}</h3>
                    <p className="inv-caption">{item.caption}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* =============================================================== */}
        {/* SECTION 7: KONTAK & PENUTUP ("TO BE CONTINUED...")              */}
        {/* =============================================================== */}
        <section id="outro" className="section">
          <div className="container">
            <div className="rpg-window rpg-window--gold outro-window">
              <span className="quest-badge">LVL 07 // CHAPTER END</span>
              <h2 className="outro-title">TO BE CONTINUED...</h2>
              <p className="outro-desc">
                Terima kasih sudah mengunjungi halaman kelas <strong>{data.classInfo.name}</strong>.
                Semoga kenangan, karya, dan semangat persahabatan di kelas ini terus menyala sampai
                dunia kerja dan kuliah nanti. Jangan lupa bagikan link ini!
              </p>

              <div className="share-actions">
                <button
                  type="button"
                  className="btn-rpg btn-rpg--primary"
                  onClick={() => void handleCopyLink()}
                >
                  <PixelIcon name="copy" className="px-icon" />
                  <span>Salin Link Halaman</span>
                </button>
                <button
                  type="button"
                  className="btn-rpg btn-rpg--secondary"
                  onClick={() => void handleShare()}
                >
                  <PixelIcon name="share" className="px-icon" />
                  <span>Bagikan Link</span>
                </button>
              </div>

              <div className="social-grid">
                {data.socialLinks.map((soc) => (
                  <a
                    key={soc.label}
                    href={soc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="social-btn"
                  >
                    <span className="social-btn__icon">
                      <PixelIcon
                        name={soc.icon as 'instagram' | 'tiktok' | 'github' | 'youtube'}
                        className="px-icon"
                      />
                    </span>
                    <span className="social-btn__info">
                      <strong>{soc.label}</strong>
                      <span>{soc.handle}</span>
                    </span>
                  </a>
                ))}
              </div>

              <div className="secret-box">
                <div style={{ fontSize: '0.86rem', color: 'var(--text-soft)' }}>
                  <strong style={{ color: 'var(--rpg-gold)' }}>EASTER EGG RAHASIA:</strong>{' '}
                  {data.easterEggHint}
                </div>
                <form
                  className="secret-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    void unlockEasterEgg(secretInput);
                    setSecretInput('');
                  }}
                >
                  <label htmlFor="secret-code-box" className="sr-only">
                    Kode rahasia easter egg
                  </label>
                  <input
                    id="secret-code-box"
                    type="text"
                    className="secret-input"
                    placeholder="Ketik '404' atau 'tjkt2'..."
                    value={secretInput}
                    onChange={(e) => setSecretInput(e.target.value)}
                  />
                  <button type="submit" className="btn-rpg btn-rpg--small">
                    <PixelIcon name="chest" className="px-icon" />
                    <span>Buka Peti</span>
                  </button>
                </form>
              </div>
            </div>

            <footer className="site-footer">
              <p>
                {data.classInfo.name} · {data.classInfo.program} · Dibangun dengan Next.js + Vercel Functions
              </p>
              <p className="site-footer__privacy">{data.classInfo.privacyNote}</p>
            </footer>
          </div>
        </section>
      </main>

      {/* ================================================================= */}
      {/* LIGHTBOX GALERI                                                   */}
      {/* ================================================================= */}
      {activeGalleryItem && lightboxIdx !== null && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLightboxIdx(null);
          }}
        >
          <div className="rpg-window rpg-window--gold modal-box">
            <div className="modal-head">
              <div>
                <span className={`rarity-tag ${getRarityClass(activeGalleryItem.rarity)}`}>
                  {activeGalleryItem.rarity}
                </span>{' '}
                <span className="inv-date">
                  #{activeGalleryItem.id} · {activeGalleryItem.date}
                </span>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                aria-label="Tutup lightbox galeri"
                onClick={() => {
                  pixelAudio.playClick();
                  setLightboxIdx(null);
                }}
              >
                <PixelIcon name="close" className="px-icon" />
              </button>
            </div>

            <div
              className="modal-media"
              onTouchStart={(e) => {
                touchStartX.current = e.changedTouches[0].clientX;
              }}
              onTouchEnd={(e) => {
                const diff = e.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(diff) > 45) {
                  pixelAudio.playClick();
                  setLightboxIdx((prev) =>
                    prev === null
                      ? null
                      : (prev + (diff > 0 ? -1 : 1) + filteredGallery.length) %
                        filteredGallery.length
                  );
                }
              }}
            >
              {activeGalleryItem.image ? (
                <img src={activeGalleryItem.image} alt={activeGalleryItem.title} />
              ) : (
                <PixelScene scene={activeGalleryItem.scene} title={activeGalleryItem.title} />
              )}
            </div>

            <h3 id="lightbox-modal-title" style={{ margin: '0 0 0.45rem', fontFamily: 'var(--font-pixel-ui)' }}>
              {activeGalleryItem.title}
            </h3>
            <p style={{ margin: 0, color: 'var(--text-soft)' }}>{activeGalleryItem.caption}</p>

            <div className="modal-nav">
              <button
                type="button"
                className="btn-rpg btn-rpg--small"
                onClick={() => {
                  pixelAudio.playClick();
                  setLightboxIdx(
                    (lightboxIdx - 1 + filteredGallery.length) % filteredGallery.length
                  );
                }}
              >
                <PixelIcon name="arrowLeft" className="px-icon" />
                <span>Sebelumnya</span>
              </button>
              <span className="npc-counter">
                {lightboxIdx + 1} / {filteredGallery.length}
              </span>
              <button
                type="button"
                className="btn-rpg btn-rpg--small"
                onClick={() => {
                  pixelAudio.playClick();
                  setLightboxIdx((lightboxIdx + 1) % filteredGallery.length);
                }}
              >
                <span>Berikutnya</span>
                <PixelIcon name="arrowRight" className="px-icon" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* MODAL EASTER EGG RAHASIA (DARI BACKEND /api/easter-egg)           */}
      {/* ================================================================= */}
      {secretModal && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="easter-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSecretModal(null);
          }}
        >
          <div className="rpg-window rpg-window--gold modal-box">
            <div className="modal-head">
              <span className="rarity-tag rarity-tag--mythic">{secretModal.badge}</span>
              <button
                type="button"
                className="modal-close-btn"
                aria-label="Tutup modal easter egg"
                onClick={() => {
                  pixelAudio.playClick();
                  setSecretModal(null);
                }}
              >
                <PixelIcon name="close" className="px-icon" />
              </button>
            </div>

            <div className="modal-media">
              <PixelScene scene="easteregg" title={secretModal.title} />
            </div>

            <h3 id="easter-modal-title" style={{ margin: '0 0 0.45rem', fontFamily: 'var(--font-pixel-ui)', color: 'var(--rpg-gold)' }}>
              {secretModal.title}
            </h3>
            <p style={{ margin: '0 0 0.5rem', fontWeight: 700 }}>{secretModal.caption}</p>
            <p style={{ margin: 0, color: 'var(--text-soft)' }}>{secretModal.story}</p>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-box" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </>
  );
}

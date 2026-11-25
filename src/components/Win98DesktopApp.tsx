'use client';

import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CLASS_DATA as ClassDataType, GalleryItem } from '@/data/classData';
import { PixelAvatar, PixelIcon, PixelScene } from '@/components/PixelSprites';
import RetroSkyBackdrop from '@/components/RetroSkyBackdrop';
import {
  FolderUsersIcon,
  MyComputerIcon,
  NetworkGlobeIcon,
  NotepadIcon,
  PictureGalleryIcon,
  RoadmapHelpIcon,
  RunKeyIcon,
  SysMonitorIcon,
  WinFlagIcon
} from '@/components/Win98Icons';
import { pixelAudio } from '@/lib/pixelAudio';

interface Win98DesktopAppProps {
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

interface PreviewPhotoItem {
  id: string;
  title: string;
  caption?: string;
  image?: string;
  scene?: GalleryItem['scene'];
}

type SectionId = 'beranda' | 'tentang' | 'siswa' | 'kenangan' | 'struktur';
type WallpaperTheme = 'teal' | 'navy' | 'plum';

interface NavSection {
  id: SectionId;
  navLabel: string;
  taskLabel: string;
}

const SECTIONS: NavSection[] = [
  { id: 'beranda', navLabel: 'BERANDA', taskLabel: 'Beranda' },
  { id: 'tentang', navLabel: 'TENTANG', taskLabel: 'Tentang' },
  { id: 'siswa', navLabel: 'SISWA', taskLabel: 'Siswa' },
  { id: 'kenangan', navLabel: 'KENANGAN', taskLabel: 'Kenangan' },
  { id: 'struktur', navLabel: 'STRUKTUR', taskLabel: 'Struktur' }
];

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

function renderSectionIcon(id: SectionId, className: string) {
  switch (id) {
    case 'beranda':
      return <MyComputerIcon className={className} />;
    case 'tentang':
      return <NotepadIcon className={className} />;
    case 'siswa':
      return <FolderUsersIcon className={className} />;
    case 'kenangan':
      return <PictureGalleryIcon className={className} />;
    case 'struktur':
      return <NetworkGlobeIcon className={className} />;
  }
}

function WinTitleControls({
  label,
  minimized = false,
  onMinimize,
  onMaximize,
  onClose
}: {
  label: string;
  minimized?: boolean;
  onMinimize?: () => void;
  onMaximize?: () => void;
  onClose?: () => void;
}) {
  return (
    <div className="win-titlebar__controls">
      {onMinimize && (
        <button
          type="button"
          className="win-ctrl-btn"
          aria-label={`${minimized ? 'Pulihkan' : 'Minimize'} ${label}`}
          title={minimized ? 'Restore' : 'Minimize'}
          onClick={onMinimize}
        >
          _
        </button>
      )}
      {onMaximize && (
        <button
          type="button"
          className="win-ctrl-btn"
          aria-label={`Maximize ${label}`}
          title="Maximize"
          onClick={onMaximize}
        >
          □
        </button>
      )}
      {onClose && (
        <button
          type="button"
          className="win-ctrl-btn"
          aria-label={`Tutup ${label}`}
          title="Close"
          onClick={onClose}
        >
          ×
        </button>
      )}
    </div>
  );
}

function WinExplorerHeader({
  icon,
  windowTitle,
  title,
  subtitle
}: {
  icon: ReactNode;
  windowTitle: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="win-explorer-bar">
      <div className="win-titlebar">
        <div className="win-titlebar__left">
          {icon}
          <span className="win-titlebar__title">{windowTitle}</span>
        </div>
      </div>

      <div className="win-explorer-intro">
        <div>
          <h2>{title}</h2>
          <p>{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

export default function Win98DesktopApp({ data, initialServerNow }: Win98DesktopAppProps) {
  // Appearance & OS controls
  const [darkMode, setDarkMode] = useState(false);
  const [wallpaper, setWallpaper] = useState<WallpaperTheme>('teal');
  const [fxOn, setFxOn] = useState(true);
  const [startMenuOpen, setStartMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>('beranda');
  const [apiStatus, setApiStatus] = useState<'ONLINE' | 'CHECKING'>('CHECKING');

  // Clock & uptime
  const [nowMs, setNowMs] = useState(initialServerNow);

  // Notepad dialog state
  const [dialogIdx, setDialogIdx] = useState(0);
  const [typedText, setTypedText] = useState(data.npcDialogs[0].text);
  const [isTyping, setIsTyping] = useState(false);

  // Members Roster
  const [showAllMembers, setShowAllMembers] = useState(false);

  // Gallery & Photo Lightbox
  const [activeGalleryCat, setActiveGalleryCat] = useState('Semua');
  const [previewList, setPreviewList] = useState<PreviewPhotoItem[]>([]);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const touchStartX = useRef(0);
  const modalOpenedAtRef = useRef(0);
  const lastTapRef = useRef<{ key: string; time: number }>({ key: '', time: 0 });

  const openPreviewAt = useCallback((items: PreviewPhotoItem[], idx: number) => {
    if (Date.now() - modalOpenedAtRef.current < 250) return;
    modalOpenedAtRef.current = Date.now();
    pixelAudio.playClick();
    setPreviewList(items);
    setLightboxIdx(idx);
  }, []);

  const handleTouchDoubleTap = useCallback((key: string, action: () => void) => {
    const now = Date.now();
    if (lastTapRef.current.key === key && now - lastTapRef.current.time < 340) {
      lastTapRef.current = { key: '', time: 0 };
      action();
    } else {
      lastTapRef.current = { key, time: now };
    }
  }, []);

  // Backend Quest Log (/api/quest-log)
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

  // Easter Egg (/api/easter-egg)
  const [secretModal, setSecretModal] = useState<SecretPayload | null>(null);
  const [secretInput, setSecretInput] = useState('');
  const [mascotTaps, setMascotTaps] = useState(0);
  const mascotTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const konamiBuffer = useRef<string[]>([]);

  // Window minimize state
  const [minimizedWins, setMinimizedWins] = useState<Record<string, boolean>>({});

  // Toast
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startMenuRef = useRef<HTMLDivElement | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3200);
  }, []);

  const toggleMinimizeWin = useCallback((key: string, title: string) => {
    pixelAudio.playClick();
    setMinimizedWins((prev) => {
      const next = !prev[key];
      showToast(next ? `${title} diminimize.` : `${title} dipulihkan.`);
      return { ...prev, [key]: next };
    });
  }, [showToast]);

  // Sync theme, wallpaper, FX on mount
  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let initialFx = !prefersReduced;
    try {
      const savedFx = localStorage.getItem('tjkt2_pixel_fx');
      if (savedFx === 'on' || savedFx === 'off') initialFx = savedFx === 'on';
      const savedTheme = localStorage.getItem('tjkt2_win98_theme');
      if (savedTheme === 'dark') {
        setDarkMode(true);
        document.documentElement.setAttribute('data-theme', 'dark');
      }
      const savedWp = localStorage.getItem('tjkt2_win98_wallpaper');
      if (savedWp === 'teal' || savedWp === 'navy' || savedWp === 'plum') {
        setWallpaper(savedWp);
        document.documentElement.setAttribute('data-wallpaper', savedWp);
      }
    } catch {}
    setFxOn(initialFx);
    document.documentElement.setAttribute('data-fx', initialFx ? 'on' : 'off');
  }, []);

  // Backend health & quest log
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

  // 1-second timer
  useEffect(() => {
    setNowMs(Date.now());
    const id = setInterval(() => setNowMs(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  // Scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY + 180;
      let current: SectionId = 'beranda';
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

  // Close Start Menu on outside click
  useEffect(() => {
    if (!startMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (startMenuRef.current && !startMenuRef.current.contains(target)) {
        const startBtn = document.getElementById('win-start-button');
        if (startBtn && startBtn.contains(target)) return;
        setStartMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', onPointerDown);
    return () => window.removeEventListener('mousedown', onPointerDown);
  }, [startMenuOpen]);

  // Notepad typewriter
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
    }, 18);
    return () => clearInterval(id);
  }, [isTyping, dialogIdx, data.npcDialogs]);

  // Unlock Easter Egg
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
        showToast('File rahasia Lab 02 berhasil dibuka!');

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

  const filteredGallery = useMemo(
    () =>
      data.gallery.filter(
        (item) => activeGalleryCat === 'Semua' || item.category === activeGalleryCat
      ),
    [data.gallery, activeGalleryCat]
  );

  // Global keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setStartMenuOpen(false);
        setLightboxIdx(null);
        setSecretModal(null);
        return;
      }

      if (lightboxIdx !== null && previewList.length > 0) {
        if (e.key === 'ArrowLeft') {
          setLightboxIdx((prev) =>
            prev === null ? null : (prev - 1 + previewList.length) % previewList.length
          );
          pixelAudio.playClick();
        } else if (e.key === 'ArrowRight') {
          setLightboxIdx((prev) => (prev === null ? null : (prev + 1) % previewList.length));
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
  }, [lightboxIdx, previewList.length, unlockEasterEgg]);

  // Uptime & clock
  const formedMs = useMemo(() => new Date(data.classInfo.formedAt).getTime(), [data.classInfo.formedAt]);
  const elapsedSec = Math.max(0, Math.floor((nowMs - formedMs) / 1000));
  const days = Math.floor(elapsedSec / 86400);
  const hours = Math.floor((elapsedSec % 86400) / 3600);
  const minutes = Math.floor((elapsedSec % 3600) / 60);
  const seconds = elapsedSec % 60;

  const trayClock = useMemo(() => {
    return new Intl.DateTimeFormat('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Asia/Jakarta'
    }).format(new Date(nowMs));
  }, [nowMs]);

  const visibleMembers = showAllMembers
    ? data.members
    : data.members.slice(0, INITIAL_VISIBLE_MEMBERS);

  const galleryCategories = useMemo(
    () => ['Semua', ...Array.from(new Set(data.gallery.map((g) => g.category)))],
    [data.gallery]
  );

  const pengurusMembers = useMemo(
    () => data.members.filter((m) => m.division === 'Pengurus'),
    [data.members]
  );

  const navigateTo = useCallback(
    (id: SectionId) => {
      pixelAudio.playClick();
      setStartMenuOpen(false);
      setActiveSection(id);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: fxOn ? 'smooth' : 'auto'
        });
      });
    },
    [fxOn]
  );

  function toggleDarkMode() {
    pixelAudio.playClick();
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    try {
      localStorage.setItem('tjkt2_win98_theme', next ? 'dark' : 'classic');
    } catch {}
    showToast(next ? 'Mode Gelap Retro OS aktif.' : 'Mode Klasik Win98 aktif.');
  }

  function cycleWallpaper() {
    pixelAudio.playClick();
    const order: WallpaperTheme[] = ['teal', 'navy', 'plum'];
    const labels: Record<WallpaperTheme, string> = {
      teal: 'Teal Klasik Win98',
      navy: 'Biru Server Lab 02',
      plum: 'Ungu Retro'
    };
    const next = order[(order.indexOf(wallpaper) + 1) % order.length];
    setWallpaper(next);
    document.documentElement.setAttribute('data-wallpaper', next);
    try {
      localStorage.setItem('tjkt2_win98_wallpaper', next);
    } catch {}
    showToast(`Wallpaper: ${labels[next]}`);
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
      showToast('Salin link langsung dari address bar browser.');
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

  const activeGalleryItem = lightboxIdx !== null ? previewList[lightboxIdx] || null : null;

  const galleryPreviewItems = useMemo<PreviewPhotoItem[]>(
    () =>
      filteredGallery.map((g) => ({
        id: g.id,
        title: g.title,
        caption: g.caption,
        image: g.image,
        scene: g.scene
      })),
    [filteredGallery]
  );

  const memberPreviewItems = useMemo<PreviewPhotoItem[]>(
    () =>
      data.members.map((m, i) => ({
        id: m.name || `SISWA-${pad(i + 1)}`,
        title: m.name || `Siswa XII TJKT 2 #${i + 1}`,
        caption: m.role,
        image: m.photoConsent && m.photo ? m.photo : undefined
      })),
    [data.members]
  );

  return (
    <>
      <RetroSkyBackdrop />

      <a className="skip-link" href="#main-content">
        Langsung ke konten
      </a>

      <main id="main-content">
        {/* ================================================================= */}
        {/* SECTION 1: BERANDA                                                */}
        {/* ================================================================= */}
        <section id="beranda" className="hero-stage">
          <div className="hero-container">
            <div className="hero-emblem-col">
              <div className="hero-logo-btn">
                <img
                  src="/logo-tjkt2.png"
                  alt="Logo Kelas XII TJKT 2"
                  className="hero-logo-floating"
                />
              </div>
            </div>

            <div className="hero-copy-col">
              <div className="hero-eyebrow">
                <span>{data.classInfo.heroBadge}</span>
              </div>

              <h1 className="hero-display-title">XII TJKT 2</h1>

              <p className="hero-subtitle">{data.classInfo.program.toUpperCase()}</p>

              <div className="hero-cta-row">
                <button
                  type="button"
                  className="win-btn win-btn--gold"
                  onClick={() => {
                    pixelAudio.playStart();
                    navigateTo('siswa');
                  }}
                >
                  <span>Lihat {data.classInfo.totalMembers} Siswa ↓</span>
                </button>

                <button
                  type="button"
                  className="win-btn win-btn--paper"
                  onClick={() => navigateTo('kenangan')}
                >
                  <span>Galeri Kenangan</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 2: TENTANG KELAS                                          */}
        {/* ================================================================= */}
        <section id="tentang" className="wide-band wide-band--alt">
          <div className="wide-inner">
            <WinExplorerHeader
              icon={<NotepadIcon className="win-titlebar__icon" />}
              windowTitle="Tentang Kelas XII TJKT 2"
              title="Tentang XII TJKT 2"
              subtitle={`Profil singkat dan kebersamaan kelas ${data.classInfo.name} ${data.classInfo.school}.`}
            />

            <div className="about-split">
              {/* Notepad Window */}
              <div className="win-window">
                <div className="win-titlebar">
                  <div className="win-titlebar__left">
                    <NotepadIcon className="win-titlebar__icon" />
                    <span className="win-titlebar__title">Catatan Kelas</span>
                  </div>
                </div>

                <div className="win-body">
                  <div className="win-tabs" role="tablist" aria-label="Topik catatan kelas">
                    {data.npcDialogs.map((dlg, idx) => (
                      <button
                        key={dlg.topic}
                        type="button"
                        role="tab"
                        aria-selected={dialogIdx === idx}
                        className={`win-tab${dialogIdx === idx ? ' is-active' : ''}`}
                        onClick={() => {
                          pixelAudio.playClick();
                          openDialog(idx, true);
                        }}
                      >
                        {dlg.topic}
                      </button>
                    ))}
                  </div>

                  <div className="win-inset notepad-sheet">
                    <div className="notepad-head">
                      <div className="notepad-avatar" aria-hidden="true">
                        <img
                          src="/logo-tjkt2.png"
                          alt="Logo XII TJKT 2"
                          className="notepad-logo-img"
                        />
                      </div>
                      <div>
                        <div className="notepad-speaker">{data.npcDialogs[dialogIdx].speaker}</div>
                        <p className="notepad-text">
                          {data.npcDialogs[dialogIdx].text}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Counter Window */}
              <div className="win-window">
                <div className="win-titlebar">
                  <div className="win-titlebar__left">
                    <SysMonitorIcon className="win-titlebar__icon" />
                    <span className="win-titlebar__title">Waktu Kebersamaan Kelas</span>
                  </div>
                </div>

                <div className="win-body">
                  <div className="win-inset crt-monitor">
                    <span className="win-badge win-badge--online">SEJAK JULI 2023</span>
                    <h3>Perjalanan Bersama XII TJKT 2</h3>
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
                    <p style={{ margin: '0.75rem 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>
                      {data.classInfo.school} · {data.classInfo.batch}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 3: DAFTAR 34 SISWA                                        */}
        {/* ================================================================= */}
        <section id="siswa" className="wide-band">
          <div className="wide-inner">
            <WinExplorerHeader
              icon={<FolderUsersIcon className="win-titlebar__icon" />}
              windowTitle="Anggota Kelas XII TJKT 2"
              title="Anggota XII TJKT 2"
              subtitle="Daftar foto dan nama 34 anggota kelas XII TJKT 2."
            />

            <div className="members-grid">
              {visibleMembers.map((member, idx) => (
                <article key={member.id} className="card-flip-wrap">
                  <div className="card-face">
                    <div
                      className="sprite-box"
                      title="Klik 2x untuk memperbesar foto"
                      onDoubleClick={() => openPreviewAt(memberPreviewItems, idx)}
                      onTouchEnd={() =>
                        handleTouchDoubleTap(`member-${member.id}`, () =>
                          openPreviewAt(memberPreviewItems, idx)
                        )
                      }
                    >
                      {member.photoConsent && member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name ? `Foto ${member.name}` : 'Foto siswa XII TJKT 2'}
                          loading="lazy"
                        />
                      ) : (
                        <PixelAvatar config={member.spriteConfig} label={member.name || 'Siswa XII TJKT 2'} />
                      )}
                    </div>
                    {(member.name || member.nickname) && (
                      <div className="member-info">
                        {member.name && <h3>{member.name}</h3>}
                        {member.nickname && (
                          <span className="member-nick">&ldquo;{member.nickname}&rdquo;</span>
                        )}
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {data.members.length > INITIAL_VISIBLE_MEMBERS && (
              <div className="roster-footer">
                <button
                  type="button"
                  className="win-btn win-btn--gold"
                  onClick={() => {
                    pixelAudio.playClick();
                    setShowAllMembers((prev) => !prev);
                  }}
                >
                  {showAllMembers
                    ? 'Ringkas Tampilan (8 Siswa)'
                    : `Tampilkan Semua ${data.members.length} Siswa`}
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 4: GALERI KENANGAN & PAPAN PESAN                          */}
        {/* ================================================================= */}
        <section id="kenangan" className="wide-band wide-band--alt">
          <div className="wide-inner">
            <WinExplorerHeader
              icon={<PictureGalleryIcon className="win-titlebar__icon" />}
              windowTitle="Galeri Kenangan Kelas"
              title="Galeri Kenangan Kelas"
              subtitle={`Dokumentasi kebersamaan kelas ${data.classInfo.name}.`}
            />

            {galleryCategories.length > 2 && (
              <div
                className="filter-row"
                style={{ marginBottom: '1.1rem' }}
                role="group"
                aria-label="Filter kategori galeri"
              >
                {galleryCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`win-btn win-btn--sm${activeGalleryCat === cat ? ' is-active' : ''}`}
                    onClick={() => {
                      pixelAudio.playClick();
                      setActiveGalleryCat(cat);
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            <div className="inventory-grid">
              {filteredGallery.map((item, idx) => (
                <button
                  key={item.id}
                  type="button"
                  className="inv-item"
                  aria-label={`Klik 2x untuk memperbesar foto ${item.title}`}
                  title="Klik 2x untuk memperbesar foto"
                  onDoubleClick={() => openPreviewAt(galleryPreviewItems, idx)}
                  onTouchEnd={() =>
                    handleTouchDoubleTap(`gallery-${item.id}`, () =>
                      openPreviewAt(galleryPreviewItems, idx)
                    )
                  }
                >
                  <div className="inv-media">
                    {item.image ? (
                      <img src={item.image} alt={item.title} loading="lazy" />
                    ) : (
                      <PixelScene scene={item.scene} title={item.title} />
                    )}
                  </div>
                </button>
              ))}
            </div>

            <div className="roadmap-block">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                <NotepadIcon className="px-icon" />
                <h3 style={{ margin: 0, fontSize: '1.08rem', color: '#ffffff' }}>
                  Papan Pesan, Kesan &amp; Harapan ({data.classInfo.name})
                </h3>
              </div>

              <ol className="quest-list">
                {data.timeline.map((item) => {
                  const isActive = item.status === 'ACTIVE';
                  return (
                    <li key={item.level} className={`quest-item${isActive ? ' is-active' : ''}`}>
                      <div className="quest-item__top">
                        <span className="quest-item__lvl">{item.date}</span>
                        <span
                          className={`win-badge${isActive ? ' win-badge--online' : ' win-badge--navy'}`}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <h4>{item.title}</h4>
                      <p>{item.description}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>

        {/* ================================================================= */}
        {/* SECTION 5: STRUKTUR KELAS                                         */}
        {/* ================================================================= */}
        <section id="struktur" className="wide-band">
          <div className="wide-inner">
            <WinExplorerHeader
              icon={<NetworkGlobeIcon className="win-titlebar__icon" />}
              windowTitle="Struktur Kelas XII TJKT 2"
              title="Struktur Kelas XII TJKT 2"
              subtitle="Wali kelas dan pengurus kelas XII TJKT 2."
            />

            <div className="win-window" style={{ marginBottom: '1.25rem' }}>
              <div className="win-titlebar">
                <div className="win-titlebar__left">
                  <NetworkGlobeIcon className="win-titlebar__icon" />
                  <span className="win-titlebar__title">Wali Kelas Pembimbing</span>
                </div>
              </div>

              <div className="win-body">
                <article className="win-inset teacher-highlight">
                  <div className="teacher-head">
                    <div
                      className="teacher-sprite"
                      title="Klik 2x untuk memperbesar foto"
                      onDoubleClick={() => {
                        if (data.homeroomTeacher.photoConsent && data.homeroomTeacher.photo) {
                          openPreviewAt(
                            [
                              {
                                id: data.homeroomTeacher.name || 'WALI-KELAS',
                                title: data.homeroomTeacher.name || 'Wali Kelas XII TJKT 2',
                                caption: data.homeroomTeacher.subject,
                                image: data.homeroomTeacher.photo
                              }
                            ],
                            0
                          );
                        }
                      }}
                      onTouchEnd={() => {
                        if (data.homeroomTeacher.photoConsent && data.homeroomTeacher.photo) {
                          handleTouchDoubleTap('teacher-photo', () =>
                            openPreviewAt(
                              [
                                {
                                  id: data.homeroomTeacher.name || 'WALI-KELAS',
                                  title: data.homeroomTeacher.name || 'Wali Kelas XII TJKT 2',
                                  caption: data.homeroomTeacher.subject,
                                  image: data.homeroomTeacher.photo
                                }
                              ],
                              0
                            )
                          );
                        }
                      }}
                    >
                      {data.homeroomTeacher.photoConsent && data.homeroomTeacher.photo ? (
                        <img
                          src={data.homeroomTeacher.photo}
                          alt={
                            data.homeroomTeacher.name
                              ? `Foto ${data.homeroomTeacher.name}`
                              : 'Foto Wali Kelas XII TJKT 2'
                          }
                          loading="lazy"
                        />
                      ) : (
                        <PixelAvatar
                          config={data.homeroomTeacher.spriteConfig}
                          label={data.homeroomTeacher.name || 'Wali Kelas XII TJKT 2'}
                        />
                      )}
                    </div>
                    <div className="teacher-info">
                      <h3>{data.homeroomTeacher.name || 'Wali Kelas XII TJKT 2'}</h3>
                      <p>{data.homeroomTeacher.subject}</p>
                      <span className="teacher-years">{data.homeroomTeacher.yearsGuiding}</span>
                    </div>
                  </div>
                  <blockquote className="teacher-quote">
                    &ldquo;{data.homeroomTeacher.quote}&rdquo;
                  </blockquote>
                </article>
              </div>
            </div>

            <div className="org-grid">
              {pengurusMembers.map((member) => {
                const memberIdx = data.members.findIndex((m) => m.id === member.id);
                return (
                  <article key={member.id} className="org-card">
                    <div
                      className="org-card__avatar"
                      title="Klik 2x untuk memperbesar foto"
                      onDoubleClick={() =>
                        openPreviewAt(memberPreviewItems, memberIdx >= 0 ? memberIdx : 0)
                      }
                      onTouchEnd={() =>
                        handleTouchDoubleTap(`org-${member.id}`, () =>
                          openPreviewAt(memberPreviewItems, memberIdx >= 0 ? memberIdx : 0)
                        )
                      }
                    >
                      {member.photoConsent && member.photo ? (
                        <img
                          src={member.photo}
                          alt={member.name ? `Foto ${member.name}` : `Foto ${member.role}`}
                          loading="lazy"
                        />
                      ) : (
                        <PixelAvatar
                          config={member.spriteConfig}
                          label={member.name || member.role}
                        />
                      )}
                    </div>
                    <div>
                      <span className="org-card__role">{member.role}</span>
                      {member.name && <h3 className="org-card__name">{member.name}</h3>}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="site-footer">
          <p>
            {data.classInfo.name} · {data.classInfo.program} · {data.classInfo.school}
          </p>
          <p className="site-footer__privacy">{data.classInfo.batch}</p>
        </footer>
      </main>

      {/* ================================================================= */}
      {/* START MENU WINDOWS 98                                             */}
      {/* ================================================================= */}
      {startMenuOpen && (
        <div
          ref={startMenuRef}
          className="start-menu"
          role="menu"
          aria-label="Menu Start Windows 98"
        >
          <div className="start-menu__spine">XII TJKT 2 · 98</div>
          <div className="start-menu__list">
            {SECTIONS.map((sec) => (
              <button
                key={sec.id}
                type="button"
                role="menuitem"
                className="start-menu__item"
                onClick={() => navigateTo(sec.id)}
              >
                {renderSectionIcon(sec.id, 'px-icon')}
                <span>{sec.taskLabel}</span>
              </button>
            ))}

            <div className="start-menu__divider" />

            <button
              type="button"
              role="menuitem"
              className="start-menu__item"
              onClick={toggleDarkMode}
            >
              <span>{darkMode ? '☀' : '☾'}</span>
              <span>Tema: {darkMode ? 'Klasik Terang' : 'Mode Gelap'}</span>
            </button>

            <button
              type="button"
              role="menuitem"
              className="start-menu__item"
              onClick={cycleWallpaper}
            >
              <SysMonitorIcon className="px-icon" />
              <span>Wallpaper: {wallpaper.toUpperCase()}</span>
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* SLIM TASKBAR WINDOWS 98 DI BAWAH LAYAR                            */}
      {/* ================================================================= */}
      <div className="win-taskbar" role="region" aria-label="Taskbar Windows 98">
        <button
          id="win-start-button"
          type="button"
          className={`win-btn win-start-btn${startMenuOpen ? ' is-active' : ''}`}
          aria-expanded={startMenuOpen}
          onClick={() => {
            pixelAudio.playClick();
            setStartMenuOpen((prev) => !prev);
          }}
        >
          <WinFlagIcon className="px-icon" />
          <span>Start</span>
        </button>

        <nav className="win-tasklist" aria-label="Pintasan Taskbar">
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              type="button"
              className={`win-btn win-task-btn${activeSection === sec.id ? ' is-active' : ''}`}
              onClick={() => navigateTo(sec.id)}
            >
              {renderSectionIcon(sec.id, 'px-icon')}
              <span>{sec.taskLabel}</span>
            </button>
          ))}
        </nav>

        <div className="win-tray">
          <button
            type="button"
            className={`tray-toggle${darkMode ? ' is-on' : ''}`}
            aria-pressed={darkMode}
            onClick={toggleDarkMode}
            title="Ganti Mode Gelap / Klasik Win98"
          >
            <span>{darkMode ? '☀ TERANG' : '☾ GELAP'}</span>
          </button>

          <span className="tray-clock" title="Waktu Indonesia Barat (WIB)">
            {trayClock}
          </span>
        </div>
      </div>

      {/* ================================================================= */}
      {/* IMAGE PREVIEW DIALOG (LIGHTBOX GALERI)                            */}
      {/* ================================================================= */}
      {activeGalleryItem && lightboxIdx !== null && (
        <div
          className="modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lightbox-modal-title"
          onClick={(e) => {
            if (e.target === e.currentTarget && Date.now() - modalOpenedAtRef.current > 350) {
              setLightboxIdx(null);
            }
          }}
        >
          <div className="win-window modal-dialog">
            <div className="win-titlebar">
              <div className="win-titlebar__left">
                <PictureGalleryIcon className="win-titlebar__icon" />
                <span id="lightbox-modal-title" className="win-titlebar__title">
                  Image Preview — {activeGalleryItem.id}
                  {activeGalleryItem.image ? '.JPG' : '.BMP'}
                </span>
              </div>
              <WinTitleControls
                label="preview gambar"
                onClose={() => {
                  pixelAudio.playClick();
                  setLightboxIdx(null);
                }}
              />
            </div>

            <div className="win-body">
              <div
                className={`modal-media${activeGalleryItem.image ? ' modal-media--photo' : ''}`}
                onTouchStart={(e) => {
                  touchStartX.current = e.changedTouches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  const diff = e.changedTouches[0].clientX - touchStartX.current;
                  if (Math.abs(diff) > 45 && previewList.length > 1) {
                    pixelAudio.playClick();
                    setLightboxIdx((prev) =>
                      prev === null
                        ? null
                        : (prev + (diff > 0 ? -1 : 1) + previewList.length) %
                          previewList.length
                    );
                  }
                }}
              >
                {activeGalleryItem.image ? (
                  <img src={activeGalleryItem.image} alt={activeGalleryItem.title} />
                ) : (
                  <PixelScene
                    scene={activeGalleryItem.scene || 'gathering'}
                    title={activeGalleryItem.title}
                  />
                )}
              </div>

              {!activeGalleryItem.image && (
                <>
                  <h3 style={{ margin: '0 0 0.35rem', color: 'var(--ink)' }}>
                    {activeGalleryItem.title}
                  </h3>
                  <p style={{ margin: 0, color: 'var(--ink-soft)' }}>{activeGalleryItem.caption}</p>
                </>
              )}

              {previewList.length > 1 && (
                <div className="modal-nav">
                  <button
                    type="button"
                    className="win-btn win-btn--sm"
                    onClick={() => {
                      pixelAudio.playClick();
                      setLightboxIdx(
                        (lightboxIdx - 1 + previewList.length) % previewList.length
                      );
                    }}
                  >
                    <PixelIcon name="arrowLeft" className="px-icon" />
                    <span>Sebelumnya</span>
                  </button>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                    {lightboxIdx + 1} / {previewList.length}
                  </span>
                  <button
                    type="button"
                    className="win-btn win-btn--sm"
                    onClick={() => {
                      pixelAudio.playClick();
                      setLightboxIdx((lightboxIdx + 1) % previewList.length);
                    }}
                  >
                    <span>Berikutnya</span>
                    <PixelIcon name="arrowRight" className="px-icon" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* DIALOG EASTER EGG RAHASIA                                         */}
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
          <div className="win-window modal-dialog">
            <div className="win-titlebar">
              <div className="win-titlebar__left">
                <RunKeyIcon className="win-titlebar__icon" />
                <span className="win-titlebar__title">C:\LAB_02\SECRET_ARCHIVE.TXT</span>
              </div>
              <WinTitleControls
                label="dialog rahasia"
                onClose={() => {
                  pixelAudio.playClick();
                  setSecretModal(null);
                }}
              />
            </div>

            <div className="win-body">
              <div style={{ marginBottom: '0.65rem' }}>
                <span className="rarity-tag rarity-tag--mythic">{secretModal.badge}</span>
              </div>

              <div className="modal-media">
                <PixelScene scene="easteregg" title={secretModal.title} />
              </div>

              <h3 id="easter-modal-title" style={{ margin: '0 0 0.35rem', color: 'var(--ink)' }}>
                {secretModal.title}
              </h3>
              <p style={{ margin: '0 0 0.45rem', fontWeight: 700 }}>{secretModal.caption}</p>
              <p style={{ margin: '0 0 0.9rem', color: 'var(--ink-soft)' }}>{secretModal.story}</p>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="win-btn win-btn--primary"
                  onClick={() => {
                    pixelAudio.playClick();
                    setSecretModal(null);
                  }}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast-balloon" role="status" aria-live="polite">
          {toast}
        </div>
      )}
    </>
  );
}

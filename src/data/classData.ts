/**
 * ============================================================================
 * PUSAT DATA LANDING PAGE KELAS XII TJKT 2 (RETRO OS EDITION)
 * ============================================================================
 * Semua konten kelas tersimpan di satu file ini agar mudah diperbarui.
 * Data ini juga dibaca oleh Vercel Route Handlers (/api/class, /api/members,
 * /api/health) dan Server Component utama.
 *
 * ATURAN PRIVASI (PRD):
 * - JANGAN masukkan nomor HP, WhatsApp pribadi, atau alamat rumah anggota.
 * - Foto asli hanya tampil jika `photoConsent: true` DAN `photo` diisi.
 * ============================================================================
 */

export interface PixelSpriteConfig {
  skin: string;
  hairStyle:
    | 'spiky'
    | 'bob'
    | 'long'
    | 'ponytail'
    | 'hijab'
    | 'fade'
    | 'curly'
    | 'undercut'
    | 'slick';
  hairColor: string;
  tunicColor: string;
  accentColor: string;
  accessory: 'none' | 'glasses' | 'headband' | 'wizardhat' | 'visor' | 'headphones';
  bgColor: string;
}

export interface ClassMember {
  id: string;
  name: string;
  nickname: string;
  rpgClass: string;
  role: string;
  division: 'Pengurus' | 'Jaringan' | 'Sistem' | 'Kreatif' | 'Support';
  level: number;
  specialty: string;
  quote: string;
  photo: string;
  photoConsent: boolean;
  spriteConfig: PixelSpriteConfig;
}

export interface ClassStat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  detail: string;
  barColor: 'gold' | 'sky' | 'emerald' | 'crimson';
  progress: number;
}

export interface TimelineQuest {
  level: string;
  date: string;
  title: string;
  status: 'CLEARED' | 'ACTIVE';
  badge: string;
  description: string;
}

export type GallerySceneId =
  | 'crimping'
  | 'fiber'
  | 'datacenter'
  | 'trophy'
  | 'lks'
  | 'gathering'
  | 'antenna'
  | 'bossstage';

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Praktikum' | 'Prestasi' | 'Acara' | 'Kenangan';
  rarity: 'RARE' | 'EPIC' | 'LEGENDARY' | 'MYTHIC';
  date: string;
  scene: GallerySceneId;
  image: string;
  caption: string;
}

export const CLASS_DATA = {
  classInfo: {
    name: 'XII TJKT 2',
    guildName: 'XII TJKT 2',
    program: 'Teknik Jaringan Komputer & Telekomunikasi',
    school: 'SMK Negeri 1 Beringin',
    batch: 'Angkatan 2024 – 2027',
    formedAt: '2024-07-15T07:00:00+07:00',
    totalMembers: 34,
    motto: 'Solidaritas Tanpa Batas',
    heroBadge: 'SOLIDARITAS TANPA BATAS · ANGKATAN 2024 – 2027',
    mascotName: 'XII TJKT 2',
    mascotTagline: 'SMK Negeri 1 Beringin',
    shareTitle: 'XII TJKT 2 · SMK Negeri 1 Beringin',
    shareText:
      'Profil kelas, daftar 34 siswa, dan galeri kenangan XII TJKT 2 SMK Negeri 1 Beringin.',
    privacyNote: ''
  },

  homeroomTeacher: {
    name: 'Sabarina Br Munte, S. Kom',
    title: 'Wali Kelas',
    subject: 'Wali Kelas Pembimbing · SMK Negeri 1 Beringin',
    yearsGuiding: 'Angkatan 2024 – 2027',
    photo: '/wali-kelas.jpg',
    photoConsent: true,
    spriteConfig: {
      skin: '#f2c29b',
      hairStyle: 'slick',
      hairColor: '#334155',
      tunicColor: '#2563eb',
      accentColor: '#f6c453',
      accessory: 'glasses',
      bgColor: '#1e294b'
    } satisfies PixelSpriteConfig,
    quote:
      'Terima kasih atas kebersamaan, kerja keras, dan semangat belajar kalian selama di XII TJKT 2. Semoga langkah kalian ke depan selalu dimudahkan dan membawa kebanggaan.'
  },

  npcDialogs: [
    {
      speaker: 'PROFIL KELAS XII TJKT 2',
      topic: 'Tentang Kami',
      text: 'Selamat datang di halaman kelas XII TJKT 2 SMK Negeri 1 Beringin. Kelas kami terdiri dari 34 siswa jurusan Teknik Jaringan Komputer dan Telekomunikasi yang belajar dan tumbuh bersama sejak kelas X hingga kelas XII.'
    },
    {
      speaker: 'KEBERSAMAAN KELAS',
      topic: 'Cerita Kelas',
      text: 'Tiga tahun belajar di ruang kelas, praktik di laboratorium, hingga menjalani PKL bersama menjadi kenangan berharga sebelum kami melangkah menuju masa depan masing-masing.'
    }
  ],

  stats: [
    {
      id: 'members',
      label: 'ANGGOTA GUILD',
      value: 34,
      suffix: '',
      detail: 'Semua aktif dalam satu party kelas',
      barColor: 'sky',
      progress: 100
    },
    {
      id: 'utp',
      label: 'KABEL UTP DIKRIMPING',
      value: 1480,
      suffix: '+',
      detail: 'Termasuk yang urutan pin 1–8 sempat tertukar',
      barColor: 'gold',
      progress: 92
    },
    {
      id: 'lab-hours',
      label: 'JAM PRAKTIK LAB',
      value: 960,
      suffix: 'j',
      detail: 'Mikrotik, Cisco, Linux, & Splicing FO',
      barColor: 'emerald',
      progress: 88
    },
    {
      id: 'quests',
      label: 'QUEST & PRESTASI',
      value: 14,
      suffix: '',
      detail: 'Lomba LKS, classmeeting, & proyek sekolah',
      barColor: 'crimson',
      progress: 84
    },
    {
      id: 'solidarity',
      label: 'HP SOLIDARITAS',
      value: 99.9,
      suffix: '%',
      detail: 'Selalu siap bantu teman saat error topologi',
      barColor: 'emerald',
      progress: 99
    },
    {
      id: 'potions',
      label: 'KOPI & ES TEH POTION',
      value: 4200,
      suffix: '+',
      detail: 'Penambah mana saat mengejar deadline laporan',
      barColor: 'gold',
      progress: 95
    }
  ] satisfies ClassStat[],

  members: [
    {
      id: 'tjkt2-01',
      name: 'YUANA INDRIANI',
      nickname: '',
      rpgClass: 'Guild Knight',
      role: 'Anggota Kelas',
      division: 'Jaringan',
      level: 99,
      specialty: 'Routing & Koordinator Tim',
      quote: 'Server boleh restart sebentar, tapi semangat XII TJKT 2 tidak boleh padam.',
      photo: '/members/01_0072426765.jpg',
      photoConsent: true,
      spriteConfig: { skin: '#e0a67c', hairStyle: 'spiky', hairColor: '#1e1b2e', tunicColor: '#d97706', accentColor: '#f6c453', accessory: 'headband', bgColor: '#25294a' }
    },
    {
      id: 'tjkt2-02',
      name: 'FERDY HARDIANSYAH',
      nickname: '',
      rpgClass: 'Shield Paladin',
      role: 'Anggota Kelas',
      division: 'Jaringan',
      level: 96,
      specialty: 'Firewall & Manajemen Jadwal',
      quote: 'Kalau ping masih RTO, tarik napas dulu lalu cek kabel dan gateway pelan-pelan.',
      photo: '/members/03_0084840406.jpg',
      photoConsent: true,
      spriteConfig: { skin: '#f5cfa8', hairStyle: 'bob', hairColor: '#3b1d5e', tunicColor: '#e11d48', accentColor: '#f6c453', accessory: 'none', bgColor: '#2c2246' }
    },
    {
      id: 'tjkt2-03',
      name: 'M. REFLAND ZACKY',
      nickname: '',
      rpgClass: 'Lore Scribe',
      role: 'Anggota Kelas',
      division: 'Sistem',
      level: 92,
      specialty: 'Arsip & Notulensi Kelas',
      quote: 'Setiap pengumuman, jadwal piket, dan momen penting tercatat rapi di scroll kelas.',
      photo: '/members/04_0085223688.png',
      photoConsent: true,
      spriteConfig: { skin: '#f0c29a', hairStyle: 'long', hairColor: '#1f2937', tunicColor: '#0284c7', accentColor: '#5ee7ff', accessory: 'glasses', bgColor: '#1f2c4d' }
    },
    {
      id: 'tjkt2-04',
      name: 'ALVINO GIO FAHRI',
      nickname: '',
      rpgClass: 'Vault Keeper',
      role: 'Anggota Kelas',
      division: 'Sistem',
      level: 91,
      specialty: 'Kas Guild & Anggaran Event',
      quote: 'Bayar kas tepat waktu adalah sihir paling ampuh biar acara kelas jalan lancar.',
      photo: '/members/05_0085388490.jpg',
      photoConsent: true,
      spriteConfig: { skin: '#cd8e63', hairStyle: 'fade', hairColor: '#111827', tunicColor: '#ca8a04', accentColor: '#fde047', accessory: 'none', bgColor: '#29253f' }
    },
    {
      id: 'tjkt2-05',
      name: 'RACEL PETRUS',
      nickname: '',
      rpgClass: 'Scroll Clerk',
      role: 'Anggota Kelas',
      division: 'Kreatif',
      level: 89,
      specialty: 'Presensi & Agenda Lab',
      quote: 'Tugas seberat apa pun terasa lebih ringan kalau dikerjakan bareng party.',
      photo: '/members/06_0087583790.jpg',
      photoConsent: true,
      spriteConfig: { skin: '#f6d2b0', hairStyle: 'ponytail', hairColor: '#312e81', tunicColor: '#059669', accentColor: '#6ee7b7', accessory: 'none', bgColor: '#1e3242' }
    },
    {
      id: 'tjkt2-06',
      name: 'ADYA KHARISMA NUR AENI',
      nickname: '',
      rpgClass: 'Gold Steward',
      role: 'Anggota Kelas',
      division: 'Support',
      level: 88,
      specialty: 'Laporan Kas & Perlengkapan',
      quote: 'Saldo aman, kas kelas transparan, beli gorengan sehabis praktik pun tenang.',
      photo: '/members/07_0088766272.png',
      photoConsent: true,
      spriteConfig: { skin: '#dfa77f', hairStyle: 'undercut', hairColor: '#1e293b', tunicColor: '#b45309', accentColor: '#f6c453', accessory: 'glasses', bgColor: '#282644' }
    },
    {
      id: 'tjkt2-07',
      name: 'M. SYAWAL DWI DARMA',
      nickname: '',
      rpgClass: 'Router Mage',
      role: 'Spesialis Mikrotik',
      division: 'Jaringan',
      level: 95,
      specialty: 'OSPF, BGP & Manajemen Hotspot',
      quote: 'Winbox sudah terbuka sebelum jam pelajaran dimulai. Gateway aman, semua senang.',
      photo: '/members/08_0089366475.png',
      photoConsent: true,
      spriteConfig: { skin: '#cf9268', hairStyle: 'spiky', hairColor: '#0f172a', tunicColor: '#2563eb', accentColor: '#5ee7ff', accessory: 'wizardhat', bgColor: '#1d274b' }
    },
    {
      id: 'tjkt2-08',
      name: 'M. FAJAR ANDIKA',
      nickname: '',
      rpgClass: 'Fiber Enchanter',
      role: 'Wakil Ketua Kelas',
      division: 'Pengurus',
      level: 93,
      specialty: 'Fusion Splicing & OTDR',
      quote: 'Menyambung inti serat optik butuh tangan stabil dan doa seluruh penghuni lab.',
      photo: '/members/09_0091402563.jpg',
      photoConsent: true,
      spriteConfig: { skin: '#f0c29a', hairStyle: 'hijab', hairColor: '#312e81', tunicColor: '#db2777', accentColor: '#f9a8d4', accessory: 'glasses', bgColor: '#2c2046' }
    },
    {
      id: 'tjkt2-09',
      name: 'ENDA NESTIA',
      nickname: '',
      rpgClass: 'Cable Ranger',
      role: 'Ahli Crimping & Patch',
      division: 'Jaringan',
      level: 90,
      specialty: 'UTP Cat6 & Patch Panel',
      quote: 'Putih-oranye, oranye, putih-hijau, biru... hafal di luar kepala bahkan sambil merem!',
      photo: '/members/10_0091552862.jpg',
      photoConsent: true,
      spriteConfig: { skin: '#be8058', hairStyle: 'fade', hairColor: '#111827', tunicColor: '#16a34a', accentColor: '#86efac', accessory: 'headband', bgColor: '#1f313e' }
    },
    {
      id: 'tjkt2-10',
      name: 'KESYA AURA PUTRI',
      nickname: '',
      rpgClass: 'Switch Tactician',
      role: 'Admin VLAN & Switch',
      division: 'Jaringan',
      level: 91,
      specialty: 'VLAN Trunking & STP',
      quote: 'Salah satu port trunk saja bisa bikin seisi lab saling tanya siapa yang bikin loop.',
      photo: '/members/11_0091672342.png',
      photoConsent: true,
      spriteConfig: { skin: '#f5cfa8', hairStyle: 'bob', hairColor: '#1e293b', tunicColor: '#0891b2', accentColor: '#67e8f9', accessory: 'glasses', bgColor: '#1d2b49' }
    },
    {
      id: 'tjkt2-11',
      name: 'KIRANA QISTI',
      nickname: '',
      rpgClass: 'Signal Scout',
      role: 'Teknisi Wireless',
      division: 'Jaringan',
      level: 87,
      specialty: 'Point-to-Point & Access Point',
      quote: 'Naik atap sekolah demi dapat sinyal -45 dBm itu misi paling berkesan.',
      photo: '/members/12_0092428581.jpg',
      photoConsent: true,
      spriteConfig: { skin: '#dfa77f', hairStyle: 'curly', hairColor: '#1f2937', tunicColor: '#ea580c', accentColor: '#fdba74', accessory: 'headband', bgColor: '#2c2541' }
    },
    {
      id: 'tjkt2-12',
      name: 'KENZIE ADITYA',
      nickname: '',
      rpgClass: 'Subnet Scholar',
      role: 'Taktisi IP Address',
      division: 'Jaringan',
      level: 89,
      specialty: 'VLSM & Subnetting Kilat',
      quote: 'Hitung prefix /27 lebih cepat daripada menunggu komputer lab selesai booting.',
      photo: '/members/13_0092637887.png',
      photoConsent: true,
      spriteConfig: { skin: '#cd8e63', hairStyle: 'slick', hairColor: '#18181b', tunicColor: '#4f46e5', accentColor: '#a5b4fc', accessory: 'glasses', bgColor: '#212349' }
    },
    {
      id: 'tjkt2-13',
      name: 'ANGGI RAHMAYANI',
      nickname: '',
      rpgClass: 'Linux Alchemist',
      role: 'SysAdmin Debian',
      division: 'Sistem',
      level: 95,
      specialty: 'Debian, Nginx & Container',
      quote: 'Jangan lupa backup file konfigurasi sebelum ujian praktik dimulai!',
      photo: '/members/14_0093446212.png',
      photoConsent: true,
      spriteConfig: { skin: '#f0c29a', hairStyle: 'undercut', hairColor: '#0f172a', tunicColor: '#0d9488', accentColor: '#5eead4', accessory: 'wizardhat', bgColor: '#1a2d3d' }
    },
    {
      id: 'tjkt2-14',
      name: 'M. KEVIN ALDAFFA',
      nickname: '',
      rpgClass: 'Cipher Guardian',
      role: 'Keamanan Jaringan',
      division: 'Sistem',
      level: 94,
      specialty: 'Hardening Server & Audit',
      quote: 'Password admin123 itu musuh bersama seluruh warga Lab Jaringan 02.',
      photo: '/members/15_0093629516.jpg',
      photoConsent: true,
      spriteConfig: { skin: '#f6d2b0', hairStyle: 'hijab', hairColor: '#1e1b4b', tunicColor: '#9333ea', accentColor: '#e9d5ff', accessory: 'visor', bgColor: '#281f47' }
    },
    {
      id: 'tjkt2-15',
      name: 'ASA RAMADHAN',
      nickname: '',
      rpgClass: 'Cloud Summoner',
      role: 'Virtualisasi Server',
      division: 'Sistem',
      level: 92,
      specialty: 'Proxmox VE & Homelab',
      quote: 'Satu mesin server fisik bisa melahirkan belasan mesin virtual eksperimen.',
      photo: '/members/16_0093775772.png',
      photoConsent: true,
      spriteConfig: { skin: '#f7d8bb', hairStyle: 'spiky', hairColor: '#1e293b', tunicColor: '#0284c7', accentColor: '#7dd3fc', accessory: 'glasses', bgColor: '#1d2b4c' }
    },
    {
      id: 'tjkt2-16',
      name: 'NAUVAL ALIF',
      nickname: '',
      rpgClass: 'Packet Seer',
      role: 'Analis Trafik',
      division: 'Sistem',
      level: 88,
      specialty: 'Wireshark & Monitoring',
      quote: 'Semua paket data yang lewat pasti terbaca, asal koneksinya jangan putus.',
      photo: '/members/02_0084640626___NAUVAL_ALIF.png',
      photoConsent: true,
      spriteConfig: { skin: '#dfa77f', hairStyle: 'fade', hairColor: '#111827', tunicColor: '#d97706', accentColor: '#fde68a', accessory: 'visor', bgColor: '#2a243e' }
    },
    {
      id: 'tjkt2-17',
      name: 'EGY SYAHPUTRA',
      nickname: '',
      rpgClass: 'Data Cleric',
      role: 'Admin Web & Database',
      division: 'Sistem',
      level: 89,
      specialty: 'MariaDB, Apache & SSL',
      quote: 'Melihat status HTTPS hijau tanpa warning error rasanya melegakan sekali.',
      photo: '/members/17_0094223589.png',
      photoConsent: true,
      spriteConfig: { skin: '#f0c29a', hairStyle: 'long', hairColor: '#27272a', tunicColor: '#e11d48', accentColor: '#fda4af', accessory: 'none', bgColor: '#2b2040' }
    },
    {
      id: 'tjkt2-18',
      name: 'IGNASIUS PUTRA',
      nickname: '',
      rpgClass: 'Hardware Medic',
      role: 'Perakit & Teknisi PC',
      division: 'Sistem',
      level: 90,
      specialty: 'Hardware PC & BIOS',
      quote: 'Bunyi beep panjang di motherboard jauh lebih menegangkan daripada kuis dadakan.',
      photo: '/members/18_0094463709.png',
      photoConsent: true,
      spriteConfig: { skin: '#cd8e63', hairStyle: 'curly', hairColor: '#111827', tunicColor: '#15803d', accentColor: '#86efac', accessory: 'headband', bgColor: '#1e303e' }
    },
    {
      id: 'tjkt2-19',
      name: 'DIO ANDIKA',
      nickname: '',
      rpgClass: 'Pixel Artisan',
      role: 'Anggota Kelas',
      division: 'Kreatif',
      level: 92,
      specialty: 'UI/UX & Web Kelas',
      quote: 'Bukan cuma topologi kabel yang harus rapi, tampilan web kelas juga wajib estetik.',
      photo: '/members/19_0094863418.png',
      photoConsent: true,
      spriteConfig: { skin: '#f5cfa8', hairStyle: 'ponytail', hairColor: '#4c1d95', tunicColor: '#ec4899', accentColor: '#fbcfe8', accessory: 'none', bgColor: '#2e2048' }
    },
    {
      id: 'tjkt2-20',
      name: 'FEBRI ARTA SINANTRIO',
      nickname: '',
      rpgClass: 'Chronicle Bard',
      role: 'Fotografer & Dokumentasi',
      division: 'Kreatif',
      level: 90,
      specialty: 'Foto Kegiatan & Video',
      quote: 'Tiap acara kelas wajib ada foto bersama yang rapi plus satu foto candaan.',
      photo: '/members/20_0096186650.jpg',
      photoConsent: true,
      spriteConfig: { skin: '#dfa77f', hairStyle: 'undercut', hairColor: '#18181b', tunicColor: '#0ea5e9', accentColor: '#bae6fd', accessory: 'visor', bgColor: '#1f2b49' }
    },
    {
      id: 'tjkt2-21',
      name: 'DIKA ARMADANA',
      nickname: '',
      rpgClass: 'Sprite Crafter',
      role: 'Desainer Grafis',
      division: 'Kreatif',
      level: 89,
      specialty: 'Poster, Banner & Stiker',
      quote: 'Revisi desain kesepuluh adalah hal biasa sebelum poster kelas dicetak.',
      photo: '/members/21_0096589201.png',
      photoConsent: true,
      spriteConfig: { skin: '#f0c29a', hairStyle: 'hijab', hairColor: '#1e293b', tunicColor: '#eab308', accentColor: '#fef08a', accessory: 'glasses', bgColor: '#292544' }
    },
    {
      id: 'tjkt2-22',
      name: 'KRISNA JJ PRAMANA',
      nickname: '',
      rpgClass: 'Motion Illusionist',
      role: 'Editor Video',
      division: 'Kreatif',
      level: 88,
      specialty: 'Aftermovie & Reels',
      quote: 'Render video kenangan kelas bikin laptop ngebut sekaligus menghangatkan meja.',
      photo: '/members/22_0096847598.png',
      photoConsent: true,
      spriteConfig: { skin: '#cf9268', hairStyle: 'spiky', hairColor: '#0f172a', tunicColor: '#dc2626', accentColor: '#fecaca', accessory: 'headphones', bgColor: '#2b203f' }
    },
    {
      id: 'tjkt2-23',
      name: 'HENDRA RIKKI DAMANIK',
      nickname: '',
      rpgClass: 'Herald Messenger',
      role: 'Ketua Kelas',
      division: 'Pengurus',
      level: 87,
      specialty: 'Konten IG & Caption',
      quote: 'Di sosmed kita jaga citra rapi buat guru dan seru buat teman seangkatan.',
      photo: '/members/23_0096935573.png',
      photoConsent: true,
      spriteConfig: { skin: '#f6d2b0', hairStyle: 'bob', hairColor: '#1e1b4b', tunicColor: '#06b6d4', accentColor: '#a5f3fc', accessory: 'none', bgColor: '#1d2d4a' }
    },
    {
      id: 'tjkt2-24',
      name: 'FAJAR LUTFIANSYAH',
      nickname: '',
      rpgClass: 'Chiptune Bard',
      role: 'Penata Musik & Acara',
      division: 'Kreatif',
      level: 86,
      specialty: 'Audio Event & Sound 8-Bit',
      quote: 'Suasana acara kelas tanpa musik pembuka rasanya seperti game tanpa soundtrack.',
      photo: '/members/24_0097106146.jpg',
      photoConsent: true,
      spriteConfig: { skin: '#be8058', hairStyle: 'fade', hairColor: '#111827', tunicColor: '#10b981', accentColor: '#a7f3d0', accessory: 'headphones', bgColor: '#1d3240' }
    },
    {
      id: 'tjkt2-25',
      name: 'AYU RAMADHANI',
      nickname: '',
      rpgClass: 'Spark Tinkerer',
      role: 'Bendahara',
      division: 'Pengurus',
      level: 90,
      specialty: 'ESP32 & Sensor Otomasi',
      quote: 'Lampu indikator ruang praktik nyala otomatis dari HP itu karya bareng anak kelas.',
      photo: '/members/25_0097313180.jpg',
      photoConsent: true,
      spriteConfig: { skin: '#dfa77f', hairStyle: 'slick', hairColor: '#111827', tunicColor: '#0284c7', accentColor: '#5ee7ff', accessory: 'wizardhat', bgColor: '#1d284b' }
    },
    {
      id: 'tjkt2-26',
      name: 'RENA JULIA NINGSIH',
      nickname: '',
      rpgClass: 'Camp Healer',
      role: 'Anggota Kelas',
      division: 'Support',
      level: 88,
      specialty: 'Konsumsi & Kesehatan Tim',
      quote: 'Selalu bawa kotak P3K dan permen penyemangat saat teman-teman lembur praktikum.',
      photo: '/members/26_0097435851.png',
      photoConsent: true,
      spriteConfig: { skin: '#f0c29a', hairStyle: 'hijab', hairColor: '#312e81', tunicColor: '#16a34a', accentColor: '#bbf7d0', accessory: 'none', bgColor: '#1f3141' }
    },
    {
      id: 'tjkt2-27',
      name: 'YOGA SYAHPUTRA',
      nickname: '',
      rpgClass: 'Arena Champion',
      role: 'Sekretaris',
      division: 'Pengurus',
      level: 89,
      specialty: 'Futsal & Strategi Tim',
      quote: 'Di lab kita adu rapi konfigurasi, di lapangan kita main sportif sampai juara.',
      photo: '/members/27_0098146946.png',
      photoConsent: true,
      spriteConfig: { skin: '#cd8e63', hairStyle: 'spiky', hairColor: '#0f172a', tunicColor: '#eab308', accentColor: '#fef08a', accessory: 'headband', bgColor: '#292642' }
    },
    {
      id: 'tjkt2-28',
      name: 'SAMUEL STIVEN',
      nickname: '',
      rpgClass: 'Guild Diplomat',
      role: 'MC & Presenter',
      division: 'Support',
      level: 90,
      specialty: 'Presentasi Proyek & Tamu',
      quote: 'Karya bagus akan makin bersinar kalau diceritakan dengan percaya diri di depan juri.',
      photo: '/members/28_0098564494.png',
      photoConsent: true,
      spriteConfig: { skin: '#f5cfa8', hairStyle: 'long', hairColor: '#1e1b4b', tunicColor: '#f43f5e', accentColor: '#fecdd3', accessory: 'glasses', bgColor: '#2b2044' }
    },
    {
      id: 'tjkt2-29',
      name: 'HUSEA PRADINUS',
      nickname: '',
      rpgClass: 'Rack Warden',
      role: 'Penjaga Infrastruktur Lab',
      division: 'Support',
      level: 87,
      specialty: 'Rak Server & Cable Ties',
      quote: 'Kabel ties adalah senjata rahasia supaya rak server tampak sedap dipandang guru.',
      photo: '/members/29_00987149870.png',
      photoConsent: true,
      spriteConfig: { skin: '#dfa77f', hairStyle: 'undercut', hairColor: '#111827', tunicColor: '#3b82f6', accentColor: '#bfdbfe', accessory: 'none', bgColor: '#1e2a4a' }
    },
    {
      id: 'tjkt2-30',
      name: 'HALINIO BALQIS',
      nickname: '',
      rpgClass: 'Spirit Bard',
      role: 'Penyemangat Kelas',
      division: 'Support',
      level: 86,
      specialty: 'Icebreaker & Kekompakan',
      quote: 'Sesibuk apa pun persiapan Ujikom, jangan lupa ketawa bareng teman sebangku.',
      photo: '/members/30_0098959201.jpg',
      photoConsent: true,
      spriteConfig: { skin: '#f6d2b0', hairStyle: 'ponytail', hairColor: '#1e293b', tunicColor: '#ec4899', accentColor: '#f9a8d4', accessory: 'none', bgColor: '#2c2146' }
    },
    {
      id: 'tjkt2-31',
      name: 'ARDIYANTO SIMBOLON',
      nickname: '',
      rpgClass: 'Telecom Scout',
      role: 'Teknisi VoIP',
      division: 'Jaringan',
      level: 88,
      specialty: 'Asterisk & IP Phone',
      quote: 'Panggilan tes ekstensi 101 ke 102 berhasil tanpa putus adalah kepuasan tersendiri.',
      photo: '/members/31_0099542757.jpg',
      photoConsent: true,
      spriteConfig: { skin: '#cf9268', hairStyle: 'fade', hairColor: '#111827', tunicColor: '#0891b2', accentColor: '#a5f3fc', accessory: 'headphones', bgColor: '#1d2c4a' }
    },
    {
      id: 'tjkt2-32',
      name: 'M. AULIA RAHMAN',
      nickname: '',
      rpgClass: 'Order Keeper',
      role: 'Koordinator 5R Lab',
      division: 'Support',
      level: 87,
      specialty: 'Kebersihan & Kerapian Lab',
      quote: 'Meja praktik yang bersih bikin troubleshooting lebih cepat dan nyaman.',
      photo: '/members/32_0099707146.png',
      photoConsent: true,
      spriteConfig: { skin: '#f0c29a', hairStyle: 'hijab', hairColor: '#0f172a', tunicColor: '#059669', accentColor: '#a7f3d0', accessory: 'none', bgColor: '#1d3242' }
    },
    {
      id: 'tjkt2-33',
      name: 'DELA WIDYA RISMA',
      nickname: '',
      rpgClass: 'Backup Paladin',
      role: 'Tim Recovery Sistem',
      division: 'Sistem',
      level: 89,
      specialty: 'Clonezilla & RAID',
      quote: 'Selalu siapkan flashdisk bootable cadangan sebelum badai error datang.',
      photo: '/members/33_307738458.png',
      photoConsent: true,
      spriteConfig: { skin: '#be8058', hairStyle: 'curly', hairColor: '#111827', tunicColor: '#ca8a04', accentColor: '#fef08a', accessory: 'none', bgColor: '#292542' }
    },
    {
      id: 'tjkt2-34',
      name: 'ADIT TIA',
      nickname: '',
      rpgClass: 'Memory Weaver',
      role: 'Penulis Buku Tahunan',
      division: 'Kreatif',
      level: 86,
      specialty: 'Cerita Kelas & Mading',
      quote: 'Lelahnya hari ini di lab suatu saat bakal jadi cerita paling hangat untuk dikenang.',
      photo: '/members/34_3099359071.jpg',
      photoConsent: true,
      spriteConfig: { skin: '#f5cfa8', hairStyle: 'bob', hairColor: '#27272a', tunicColor: '#db2777', accentColor: '#fbcfe8', accessory: 'glasses', bgColor: '#2c2045' }
    }
  ] satisfies ClassMember[],

  timeline: [
    {
      level: 'KESAN #01',
      date: 'Awal Masa SMK',
      title: 'Awalnya Canggung, Akhirnya Jadi Keluarga',
      status: 'CLEARED',
      badge: 'MASA SMK',
      description:
        'Dari hari pertama masuk kelas dengan seragam baru dan masih malu-malu menyapa, sampai akhirnya ruang kelas XII TJKT 2 selalu ramai oleh tawa dan cerita setiap hari.'
    },
    {
      level: 'KENANGAN #02',
      date: 'Suka Duka Praktikum',
      title: 'Kabel UTP, Mikrotik, dan Lembur di Lab',
      status: 'CLEARED',
      badge: 'LAB TJKT',
      description:
        'Urutan warna kabel yang sempat tertukar, koneksi yang tiba-tiba RTO saat jam praktik, hingga rasa lega luar biasa waktu konfigurasi akhirnya berhasil.'
    },
    {
      level: 'TERIMA KASIH #03',
      date: 'Untuk Pembimbing Kami',
      title: 'Terima Kasih Wali Kelas & Bapak/Ibu Guru',
      status: 'CLEARED',
      badge: 'GURU & WALI KELAS',
      description:
        'Terima kasih atas kesabaran, ilmu, dan nasihat yang diberikan kepada kami selama tiga tahun ini. Semua bimbingan akan selalu jadi bekal berharga bagi kami.'
    },
    {
      level: 'PERSAHABATAN #04',
      date: '34 Anggota Kelas',
      title: 'Teman Sebangku & Solidaritas Tanpa Batas',
      status: 'CLEARED',
      badge: 'KEBERSAMAAN',
      description:
        'Bukan sekadar teman satu absen, tapi teman yang selalu siap saling bantu saat ada kesulitan tugas, berbagi jajanan kantin, dan saling menyemangati.'
    },
    {
      level: 'PESAN #05',
      date: 'Menjelang Kelulusan',
      title: 'Jangan Pernah Lupa Rumah Kita di XII TJKT 2',
      status: 'CLEARED',
      badge: 'PESAN KELAS',
      description:
        'Ke mana pun langkah kita setelah lulus nanti, jangan sungkan untuk tetap saling menyapa dan mengenang masa-masa putih abu-abu yang pernah kita lalui bersama.'
    },
    {
      level: 'HARAPAN #06',
      date: 'Langkah Berikutnya',
      title: 'Sukses Kuliah, Kerja, dan Cita-Cita Kita Semua!',
      status: 'ACTIVE',
      badge: 'DOA & HARAPAN',
      description:
        'Semoga seluruh 34 anggota XII TJKT 2 dimudahkan jalannya menuju masa depan impian masing-masing, sukses selalu, dan kelak berkumpul kembali dengan cerita membanggakan.'
    }
  ] satisfies TimelineQuest[],

  gallery: [
    {
      id: 'MEM-001',
      title: 'Momen Kenangan #01',
      category: 'Kenangan',
      rarity: 'LEGENDARY',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-01.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-002',
      title: 'Momen Kenangan #02',
      category: 'Kenangan',
      rarity: 'EPIC',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-02.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-003',
      title: 'Momen Kenangan #03',
      category: 'Kenangan',
      rarity: 'RARE',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-03.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-004',
      title: 'Momen Kenangan #04',
      category: 'Kenangan',
      rarity: 'LEGENDARY',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-04.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-005',
      title: 'Momen Kenangan #05',
      category: 'Kenangan',
      rarity: 'EPIC',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-05.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-006',
      title: 'Momen Kenangan #06',
      category: 'Kenangan',
      rarity: 'RARE',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-06.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-007',
      title: 'Momen Kenangan #07',
      category: 'Kenangan',
      rarity: 'EPIC',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-07.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-008',
      title: 'Momen Kenangan #08',
      category: 'Kenangan',
      rarity: 'MYTHIC',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-08.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-009',
      title: 'Momen Kenangan #09',
      category: 'Kenangan',
      rarity: 'RARE',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-09.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-010',
      title: 'Momen Kenangan #10',
      category: 'Kenangan',
      rarity: 'EPIC',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-10.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-011',
      title: 'Momen Kenangan #11',
      category: 'Kenangan',
      rarity: 'RARE',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-11.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-012',
      title: 'Momen Kenangan #12',
      category: 'Kenangan',
      rarity: 'LEGENDARY',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-12.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-013',
      title: 'Momen Kenangan #13',
      category: 'Kenangan',
      rarity: 'EPIC',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-13.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-014',
      title: 'Momen Kenangan #14',
      category: 'Kenangan',
      rarity: 'RARE',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-14.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-015',
      title: 'Momen Kenangan #15',
      category: 'Kenangan',
      rarity: 'EPIC',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-15.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-016',
      title: 'Momen Kenangan #16',
      category: 'Kenangan',
      rarity: 'MYTHIC',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-16.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-017',
      title: 'Video Kenangan #17',
      category: 'Kenangan',
      rarity: 'MYTHIC',
      date: '25 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-17.mp4',
      caption: 'Video kebersamaan kelas XII TJKT 2. Klik 2x untuk memutar video.'
    },
    {
      id: 'MEM-018',
      title: 'Momen Kenangan #18',
      category: 'Kenangan',
      rarity: 'LEGENDARY',
      date: '23 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-18.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-019',
      title: 'Momen Kenangan #19',
      category: 'Kenangan',
      rarity: 'EPIC',
      date: '23 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-19.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-020',
      title: 'Momen Kenangan #20',
      category: 'Kenangan',
      rarity: 'RARE',
      date: '23 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-20.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-021',
      title: 'Momen Kenangan #21',
      category: 'Kenangan',
      rarity: 'LEGENDARY',
      date: '23 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-21.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-022',
      title: 'Momen Kenangan #22',
      category: 'Kenangan',
      rarity: 'EPIC',
      date: '23 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-22.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-023',
      title: 'Momen Kenangan #23',
      category: 'Kenangan',
      rarity: 'RARE',
      date: '23 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-23.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-024',
      title: 'Momen Kenangan #24',
      category: 'Kenangan',
      rarity: 'EPIC',
      date: '23 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-24.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-025',
      title: 'Momen Kenangan #25',
      category: 'Kenangan',
      rarity: 'MYTHIC',
      date: '23 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-25.jpeg',
      caption: 'Dokumentasi kebersamaan kelas XII TJKT 2. Klik foto untuk melihat ukuran penuh.'
    },
    {
      id: 'MEM-026',
      title: 'Video Kenangan #26',
      category: 'Kenangan',
      rarity: 'MYTHIC',
      date: '26 November 2026',
      scene: 'gathering',
      image: '/gallery/kenangan-26.mp4',
      caption: 'Video kebersamaan kelas XII TJKT 2. Klik 2x untuk memutar video.'
    }
  ] satisfies GalleryItem[],

  socialLinks: [
    {
      label: 'Instagram Kelas',
      handle: '@techoftwelve',
      url: 'https://www.instagram.com/techoftwelve',
      icon: 'instagram'
    },
    {
      label: 'TikTok Kelas',
      handle: 'XII TJKT 2 (@techoftwelve)',
      url: 'https://www.tiktok.com/@techoftwelve',
      icon: 'tiktok'
    },
    {
      label: 'GitHub',
      handle: 'github.com/boxdik089-ctrl',
      url: 'https://github.com/boxdik089-ctrl',
      icon: 'github'
    }
  ],

  easterEggHint:
    'Tekan Konami Code (↑↑↓↓←→←→BA) di keyboard, tap logo XII TJKT 2 5x, atau masukkan kode rahasia di bawah!'
};

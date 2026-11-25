# XII TJKT 2 — Landing Page Pixel RPG (Next.js + Vercel Backend)

Landing page satu halaman bergaya **Pixel RPG** untuk kelas **XII TJKT 2**, dibangun menggunakan **Next.js App Router (TypeScript)** dan **Vercel Route Handlers (Fluid Compute Node.js)**.

## Fitur & Struktur Proyek

- **Tema Pixel RPG Hangat & Ramah Semua Umur**:
  - Judul & label game memakai font pixel (`Press Start 2P` & `Silkscreen`), sedangkan teks panjang & kutipan memakai `Plus Jakarta Sans` agar nyaman dibaca di HP maupun laptop.
  - Sprite piksel orisinil (`16x16` & `24x16`) untuk maskot **PIXI-LAN**, avatar hero 36 anggota, wali kelas, dan 8 adegan galeri di [src/components/PixelSprites.tsx](src/components/PixelSprites.tsx).
  - Musik latar dan efek suara 8-bit Web Audio API tanpa file MP3 eksternal di [src/lib/pixelAudio.ts](src/lib/pixelAudio.ts), lengkap dengan tombol mute **SFX**, **BGM**, dan tombol matikan animasi **FX**.
- **7 Section PRD + Sticky Navbar**:
  1. **Layar Pembuka** (`#start`) — Nama kelas, motto, sprite `PIXI-LAN`, timer guild aktif, tombol `MULAI`.
  2. **Tentang Kelas** (`#about`) — Kotak dialog NPC interaktif, profil Wali Kelas, dan info ringkas kelas.
  3. **Anggota Kelas** (`#members`) — 36 kartu karakter 3D yang bisa dibalik, pencarian, & filter divisi.
  4. **Statistik Kelas** (`#stats`) — Timer hari sejak kelas dibentuk + 6 panel status RPG + kirim semangat pengunjung.
  5. **Kegiatan & Prestasi** (`#timeline`) — Peta level `LVL 01` hingga `LVL 06`.
  6. **Galeri Kenangan** (`#gallery`) — Layar inventaris + Lightbox modal dengan navigasi keyboard & swipe HP.
  7. **Penutup** (`#outro`) — Layar `"TO BE CONTINUED..."`, tombol salin & bagikan link, tautan medsos, dan Easter Egg.
- **Backend Vercel Functions (`src/app/api/`)**:
  - `GET /api/health` — Status server dan hitungan uptime kelas.
  - `GET /api/class` — Data kelas, statistik, peta level, dan galeri.
  - `GET /api/members` — Pencarian dan filter daftar anggota kelas.
  - `POST /api/easter-egg` — Verifikasi kode rahasia (`404`, `tjkt2`, Konami Code, atau tap maskot `5x`).
  - `GET & POST /api/quest-log` — Menyimpan semangat pengunjung & progres quest di cookie HTTP.

## Mengubah Data Kelas

Semua teks, daftar 36 siswa, profil wali kelas, kegiatan, galeri, dan media sosial ada di satu file:
- `src/data/classData.ts`

Simpan foto berizin ke folder `public/members/` atau `public/gallery/`, lalu ubah `photoConsent: true` dan isi path foto (misal `"/members/raka.jpg"`). Demi privasi, jangan masukkan nomor HP atau alamat rumah.

## Menjalankan Lokal & Deploy ke Vercel

```bash
npm install
npm run dev
```

Lalu buka `http://localhost:3000`.

Untuk deploy ke Vercel:
1. Push repository ini ke GitHub.
2. Buka Vercel, pilih **Add New Project**, lalu import repository.
3. Konfigurasi di [vercel.ts](vercel.ts) otomatis terdeteksi—klik **Deploy**.

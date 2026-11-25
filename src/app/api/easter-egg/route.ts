const SECRET_ARCHIVE = {
  badge: 'SECRET ACHIEVEMENT: PACKET HUNTER',
  title: 'HARTA KARUN LAB 02 // KISAH KABEL BELUM DICOLOK',
  caption: 'Momen Legendaris Jam 16.45 di Lab Jaringan 02',
  story:
    'Legenda XII TJKT 2 mencatat: satu kelompok pernah panik 45 menit mengecek firewall, IP gateway, dan routing table karena tidak bisa ping server... sampai akhirnya sadar kabel LAN UTP-nya masih tergulung rapi di dalam tas! Semua langsung tertawa dan merayakan keberhasilan dengan gorengan kantin.'
};

const VALID_CODES = new Set(['404', 'tjkt2', 'xiitjkt2', 'konami', 'sudo', 'rahasia', 'packet', 'pixilan']);

/**
 * POST /api/easter-egg
 * Verifikasi kode rahasia di backend Vercel agar cerita easter egg hanya
 * terbuka ketika pengunjung menemukan kode atau Konami Code.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { code?: unknown };
    const normalized = typeof body.code === 'string' ? body.code.trim().toLowerCase() : '';

    if (!VALID_CODES.has(normalized)) {
      return Response.json(
        {
          unlocked: false,
          message: "Kode belum tepat! Coba ketik '404', 'tjkt2', atau tekan Konami Code."
        },
        { status: 400 }
      );
    }

    return Response.json({
      unlocked: true,
      secret: SECRET_ARCHIVE
    });
  } catch (error) {
    console.error('[api/easter-egg] Error unlocking easter egg:', error);
    return Response.json(
      { unlocked: false, message: 'Gagal memverifikasi kode rahasia.' },
      { status: 500 }
    );
  }
}

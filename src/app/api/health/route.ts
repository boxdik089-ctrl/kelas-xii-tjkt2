import { CLASS_DATA } from '@/data/classData';

/**
 * GET /api/health
 * Menyediakan status server Vercel Function dan waktu aktif kelas (uptime)
 * yang dihitung langsung di backend Node.js (Fluid Compute).
 */
export async function GET() {
  try {
    const formedMs = new Date(CLASS_DATA.classInfo.formedAt).getTime();
    const nowMs = Date.now();
    const elapsedSeconds = Math.max(0, Math.floor((nowMs - formedMs) / 1000));

    return Response.json(
      {
        status: 'ONLINE',
        guild: CLASS_DATA.classInfo.guildName,
        className: CLASS_DATA.classInfo.name,
        runtime: 'nodejs',
        serverTime: new Date(nowMs).toISOString(),
        uptimeSeconds: elapsedSeconds,
        uptimeDays: Math.floor(elapsedSeconds / 86400),
        totalMembers: CLASS_DATA.members.length
      },
      {
        headers: {
          'Cache-Control': 'no-store'
        }
      }
    );
  } catch (error) {
    console.error('[api/health] Failed to compute guild health:', error);
    return Response.json(
      { status: 'ERROR', message: 'Gagal membaca status guild' },
      { status: 500 }
    );
  }
}

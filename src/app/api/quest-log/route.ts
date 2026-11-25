import { cookies } from 'next/headers';

interface QuestState {
  cheered: boolean;
  cheersSent: number;
  lastCheerMessage: string;
  easterUnlocked: boolean;
  updatedAt: string;
}

const COOKIE_NAME = 'tjkt2_quest_log';

const ALLOWED_CHEERS = [
  'Solid terus XII TJKT 2!',
  'Sukses Ujikom & Masa Depan!',
  'Keren banget karya kelasnya!',
  'Salam hangat untuk Wali Kelas & Siswa!'
];

function parseQuestCookie(raw?: string): QuestState {
  const fallback: QuestState = {
    cheered: false,
    cheersSent: 0,
    lastCheerMessage: '',
    easterUnlocked: false,
    updatedAt: ''
  };
  if (!raw) return fallback;
  try {
    const parsed = JSON.parse(raw) as Partial<QuestState>;
    return {
      cheered: Boolean(parsed.cheered),
      cheersSent: typeof parsed.cheersSent === 'number' ? Math.max(0, parsed.cheersSent) : 0,
      lastCheerMessage:
        typeof parsed.lastCheerMessage === 'string' ? parsed.lastCheerMessage.slice(0, 80) : '',
      easterUnlocked: Boolean(parsed.easterUnlocked),
      updatedAt: typeof parsed.updatedAt === 'string' ? parsed.updatedAt : ''
    };
  } catch {
    return fallback;
  }
}

/**
 * GET /api/quest-log
 * Membaca catatan petualangan pengunjung dari HTTP cookie secara aman.
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    const state = parseQuestCookie(cookieStore.get(COOKIE_NAME)?.value);
    return Response.json({
      quest: state,
      cheerPresets: ALLOWED_CHEERS
    });
  } catch (error) {
    console.error('[api/quest-log] GET error:', error);
    return Response.json({ error: 'Gagal membaca quest log.' }, { status: 500 });
  }
}

/**
 * POST /api/quest-log
 * Menyimpan ucapan semangat (cheer) atau status unlock easter egg di cookie
 * tanpa membutuhkan database eksternal maupun menulis filesystem lokal.
 */
export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const current = parseQuestCookie(cookieStore.get(COOKIE_NAME)?.value);
    const body = (await request.json().catch(() => ({}))) as {
      action?: string;
      message?: string;
    };

    const next: QuestState = {
      ...current,
      updatedAt: new Date().toISOString()
    };

    if (body.action === 'cheer') {
      const msg =
        typeof body.message === 'string' && body.message.trim()
          ? body.message.trim().slice(0, 80)
          : ALLOWED_CHEERS[0];
      next.cheered = true;
      next.cheersSent = Math.min(99, current.cheersSent + 1);
      next.lastCheerMessage = msg;
    } else if (body.action === 'easter') {
      next.easterUnlocked = true;
    } else {
      return Response.json({ error: 'Aksi quest log tidak dikenali.' }, { status: 400 });
    }

    cookieStore.set(COOKIE_NAME, JSON.stringify(next), {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30
    });

    return Response.json({
      ok: true,
      quest: next
    });
  } catch (error) {
    console.error('[api/quest-log] POST error:', error);
    return Response.json({ error: 'Gagal menyimpan quest log.' }, { status: 500 });
  }
}

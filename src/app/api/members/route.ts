import { CLASS_DATA } from '@/data/classData';

/**
 * GET /api/members
 * API pencarian & filter kartu anggota kelas XII TJKT 2.
 * Parameter: ?q=kata_kunci&division=Jaringan&limit=8&offset=0
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim().toLowerCase();
    const division = (searchParams.get('division') || 'Semua').trim();
    const limitParam = searchParams.get('limit');
    const offsetParam = searchParams.get('offset');

    const filtered = CLASS_DATA.members.filter((member) => {
      if (division && division !== 'Semua' && member.division !== division) {
        return false;
      }
      if (!query) return true;
      return (
        member.name.toLowerCase().includes(query) ||
        member.nickname.toLowerCase().includes(query) ||
        member.rpgClass.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.specialty.toLowerCase().includes(query)
      );
    });

    const offset = Math.max(0, Number.parseInt(offsetParam || '0', 10) || 0);
    const limit = limitParam
      ? Math.max(1, Math.min(100, Number.parseInt(limitParam, 10) || filtered.length))
      : filtered.length;

    const items = filtered.slice(offset, offset + limit).map((member) => ({
      ...member,
      // Pastikan hanya path foto yang sudah berizin yang dikirim ke klien
      photo: member.photoConsent ? member.photo : ''
    }));

    return Response.json({
      totalRoster: CLASS_DATA.members.length,
      filteredCount: filtered.length,
      offset,
      limit,
      items
    });
  } catch (error) {
    console.error('[api/members] Error querying members:', error);
    return Response.json(
      { error: 'Gagal memuat daftar anggota guild.' },
      { status: 500 }
    );
  }
}

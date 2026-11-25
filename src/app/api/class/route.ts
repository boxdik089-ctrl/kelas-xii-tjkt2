import { CLASS_DATA } from '@/data/classData';

/**
 * GET /api/class
 * Mengembalikan data profil kelas, wali kelas, statistik, peta level, atau galeri.
 * Mendukung query opsional: ?section=gallery&category=Praktikum
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');
    const category = searchParams.get('category');

    if (section === 'gallery') {
      const items =
        category && category !== 'Semua'
          ? CLASS_DATA.gallery.filter((item) => item.category === category)
          : CLASS_DATA.gallery;
      return Response.json({ items, total: items.length });
    }

    if (section === 'stats') {
      return Response.json({ stats: CLASS_DATA.stats });
    }

    if (section === 'timeline') {
      return Response.json({ timeline: CLASS_DATA.timeline });
    }

    return Response.json({
      classInfo: CLASS_DATA.classInfo,
      homeroomTeacher: CLASS_DATA.homeroomTeacher,
      npcDialogs: CLASS_DATA.npcDialogs,
      stats: CLASS_DATA.stats,
      timeline: CLASS_DATA.timeline,
      gallery: CLASS_DATA.gallery,
      socialLinks: CLASS_DATA.socialLinks
    });
  } catch (error) {
    console.error('[api/class] Error fetching class data:', error);
    return Response.json(
      { error: 'Terjadi kesalahan saat memuat data kelas.' },
      { status: 500 }
    );
  }
}

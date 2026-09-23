import { NextRequest, NextResponse } from 'next/server';
import { getProjects, saveProjects } from '../../../../lib/projects-store';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { ids } = await req.json();
    if (!Array.isArray(ids)) return NextResponse.json({ error: 'ids kerak' }, { status: 400 });
    const projects = await getProjects();
    const pos = new Map<string, number>(ids.map((id: string, i: number) => [id, i]));
    const updated = projects
      .map((p) => ({ ...p, order: pos.has(p.id) ? pos.get(p.id)! : ids.length + p.order }))
      .sort((a, b) => a.order - b.order)
      .map((p, i) => ({ ...p, order: i }));
    await saveProjects(updated);
    return NextResponse.json({ projects: updated });
  } catch (err) {
    console.error('POST /api/admin/projects/reorder error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getProjects, upsertProject, deleteProject } from '../../../../lib/projects-store';
import { deleteBlobFile } from '../../../../lib/products-store';
import { normalizeProject } from '../normalize';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projects = await getProjects();
    const existing = projects.find((p) => p.id === params.id);
    if (!existing) return NextResponse.json({ error: 'Loyiha topilmadi' }, { status: 404 });

    const body = await req.json();
    const { project, error } = normalizeProject(body);
    if (error || !project) return NextResponse.json({ error }, { status: 400 });

    // Olib tashlangan rasmlarni Blob'dan tozalash
    const removed = existing.images.filter((url) => !project.images.includes(url));
    await Promise.all(removed.map(deleteBlobFile));

    const updated = await upsertProject({ ...existing, ...project });
    return NextResponse.json({ projects: updated });
  } catch (err) {
    console.error('PUT /api/admin/projects/[id] error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const projects = await getProjects();
    const existing = projects.find((p) => p.id === params.id);
    if (!existing) return NextResponse.json({ error: 'Loyiha topilmadi' }, { status: 404 });
    await Promise.all(existing.images.map(deleteBlobFile));
    const updated = await deleteProject(params.id);
    return NextResponse.json({ projects: updated });
  } catch (err) {
    console.error('DELETE /api/admin/projects/[id] error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

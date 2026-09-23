import { NextRequest, NextResponse } from 'next/server';
import { getProjects, upsertProject } from '../../../lib/projects-store';
import { Project } from '../../../types';
import { normalizeProject } from './normalize';

export const dynamic = 'force-dynamic';

export async function GET() {
  const projects = await getProjects();
  return NextResponse.json({ projects });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { project, error } = normalizeProject(body);
    if (error || !project) return NextResponse.json({ error }, { status: 400 });

    const projects = await getProjects();
    const newProject: Project = {
      ...project,
      id: `p_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
      order: projects.length,
    };
    const updated = await upsertProject(newProject);
    return NextResponse.json({ projects: updated }, { status: 201 });
  } catch (err) {
    console.error('POST /api/admin/projects error:', err);
    return NextResponse.json({ error: 'Server xatosi' }, { status: 500 });
  }
}

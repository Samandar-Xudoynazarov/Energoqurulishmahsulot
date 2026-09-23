import { notFound } from 'next/navigation';
import { getProjects } from '../../../../lib/projects-store';
import ProjectForm from '../../../components/ProjectForm';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const projects = await getProjects();
  const project = projects.find((p) => p.id === params.id);
  if (!project) notFound();
  return <ProjectForm initial={project} />;
}

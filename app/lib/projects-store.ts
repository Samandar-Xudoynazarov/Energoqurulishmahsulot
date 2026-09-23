import { Project } from '../types';
import { createJsonStore } from './json-store';

const store = createJsonStore<Project[]>('projects', () => []);

export async function getProjects(): Promise<Project[]> {
  const data = await store.get();
  return [...data].sort((a, b) => a.order - b.order);
}

export async function getProjectsFresh(): Promise<Project[]> {
  const data = await store.getFresh();
  return [...data].sort((a, b) => a.order - b.order);
}

export async function saveProjects(projects: Project[]): Promise<void> {
  await store.save(projects);
}

export async function upsertProject(project: Project): Promise<Project[]> {
  const projects = await getProjectsFresh();
  const idx = projects.findIndex((p) => p.id === project.id);
  if (idx >= 0) projects[idx] = project;
  else projects.push(project);
  await saveProjects(projects);
  return projects;
}

export async function deleteProject(id: string): Promise<Project[]> {
  const projects = await getProjectsFresh();
  const filtered = projects.filter((p) => p.id !== id);
  await saveProjects(filtered);
  return filtered;
}

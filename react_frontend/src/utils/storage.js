import { nowISOString } from './id';

const STORAGE_KEY = 'tasks:v1';

export function loadTasksFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function seedDemoTasksIfEmpty() {
  const existing = loadTasksFromStorage();
  if (existing && existing.length > 0) return existing;
  const now = nowISOString();
  const demo = [
    {
      id: 'demo-1',
      title: 'Welcome to your Task Manager',
      description: 'Use the + button to add new tasks. Click a status to cycle through states.',
      dueDate: '',
      status: 'in-progress',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'demo-2',
      title: 'Try editing or deleting a task',
      description: 'Open the menu on a task to edit details or remove it.',
      dueDate: new Date(Date.now() + 86400000).toISOString(),
      status: 'todo',
      createdAt: now,
      updatedAt: now
    },
    {
      id: 'demo-3',
      title: 'Mark tasks as done',
      description: 'Cycle the status to Done when completed.',
      dueDate: new Date(Date.now() + 3 * 86400000).toISOString(),
      status: 'done',
      createdAt: now,
      updatedAt: now
    }
  ];
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demo));
  } catch {
    // ignore
  }
  return demo;
}

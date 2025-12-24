const STORAGE_KEY = 'tasks:v1';

const getApiBase = () => {
  const base = process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || '';
  return (base && base.trim().length > 0) ? base : '';
};

const readAll = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeAll = (tasks) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // ignore quota errors for now
  }
};

// PUBLIC_INTERFACE
const ApiService = {
  /** List tasks. Defaults to local storage. */
  async list() {
    const apiBase = getApiBase();
    if (!apiBase) {
      return readAll();
    }
    // Prepared for future; do not call network by default
    return readAll();
  },
  /** Save all tasks (helper for persistence) */
  saveAll(tasks) {
    writeAll(tasks);
  },
  /** Create a task */
  async create(task) {
    const tasks = readAll();
    tasks.unshift(task);
    writeAll(tasks);
    return task;
  },
  /** Update a task */
  async update(task) {
    const tasks = readAll().map(t => (t.id === task.id ? task : t));
    writeAll(tasks);
    return task;
  },
  /** Delete a task by id */
  async remove(id) {
    const tasks = readAll().filter(t => t.id !== id);
    writeAll(tasks);
    return true;
  },
  /** Bulk delete by ids */
  async bulkRemove(ids) {
    const tasks = readAll().filter(t => !ids.includes(t.id));
    writeAll(tasks);
    return true;
  }
};

export default ApiService;

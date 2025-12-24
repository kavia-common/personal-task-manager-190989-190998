import React, { useMemo, useState } from 'react';
import { useTasks, useTaskDispatch } from '../context/TaskContext';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';
import FloatingActionButton from '../components/FloatingActionButton';

/**
 * PUBLIC_INTERFACE
 * TaskPage: Main page with filters/search/sort and CRUD flows.
 */
function TaskPage() {
  const { tasks, loading } = useTasks();
  const { addTask, updateTask } = useTaskDispatch();

  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [sort, setSort] = useState('due-asc');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const filtered = useMemo(() => {
    let list = [...tasks];
    if (status !== 'all') {
      list = list.filter(t => t.status === status);
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(t => (t.title + ' ' + (t.description || '')).toLowerCase().includes(q));
    }
    const sortByDue = (a, b, dir) => {
      const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dir === 'asc' ? ad - bd : bd - ad;
    };
    if (sort === 'due-asc') list.sort((a, b) => sortByDue(a, b, 'asc'));
    if (sort === 'due-desc') list.sort((a, b) => sortByDue(a, b, 'desc'));
    return list;
  }, [tasks, status, query, sort]);

  const openCreate = () => {
    setEditTask(null);
    setModalOpen(true);
  };

  const openEdit = (task) => {
    setEditTask(task);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const submit = async (data) => {
    if (editTask) {
      await updateTask(editTask.id, data);
    } else {
      await addTask(data);
    }
    setModalOpen(false);
    setEditTask(null);
  };

  return (
    <section aria-label="Task Manager">
      <div className="controls">
        <input
          className="input"
          placeholder="Search tasks..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search by title or description"
        />
        <select
          className="select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          aria-label="Filter by status"
        >
          <option value="all">All</option>
          <option value="todo">To do</option>
          <option value="in-progress">In progress</option>
          <option value="done">Done</option>
        </select>
        <select
          className="select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort by due date"
        >
          <option value="due-asc">Due date ↑</option>
          <option value="due-desc">Due date ↓</option>
        </select>
      </div>
      <TaskList tasks={filtered} onEdit={openEdit} loading={loading} />
      <FloatingActionButton onClick={openCreate} />
      <TaskForm open={modalOpen} onClose={closeModal} onSubmit={submit} initial={editTask} />
    </section>
  );
}

export default TaskPage;

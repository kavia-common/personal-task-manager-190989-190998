import React, { useEffect, useRef, useState } from 'react';

/**
 * PUBLIC_INTERFACE
 * TaskForm: Modal for creating/editing a task.
 */
function TaskForm({ open, onClose, onSubmit, initial }) {
  const [title, setTitle] = useState(initial?.title || '');
  const [description, setDescription] = useState(initial?.description || '');
  const [dueDate, setDueDate] = useState(initial?.dueDate ? initial.dueDate.slice(0, 10) : '');
  const [status, setStatus] = useState(initial?.status || 'todo');
  const [error, setError] = useState('');
  const firstFieldRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    if (open) {
      setTitle(initial?.title || '');
      setDescription(initial?.description || '');
      setDueDate(initial?.dueDate ? initial.dueDate.slice(0, 10) : '');
      setStatus(initial?.status || 'todo');
      setError('');
      setTimeout(() => firstFieldRef.current?.focus(), 0);
    }
  }, [open, initial]);

  useEffect(() => {
    const handleKey = (e) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, onClose]);

  if (!open) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required.');
      firstFieldRef.current?.focus();
      return;
    }
    const payload = {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : '',
      status
    };
    onSubmit(payload);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="task-form-title">
      <div className="modal" ref={dialogRef}>
        <div className="modal-header">
          <h2 id="task-form-title" className="modal-title">
            {initial ? 'Edit Task' : 'Add Task'}
          </h2>
          <button className="btn btn-ghost" onClick={onClose} aria-label="Close form">✕</button>
        </div>
        <form onSubmit={submit} noValidate>
          <div className="modal-body">
            <div className="form-grid">
              <div>
                <div className="label">Title</div>
                <input
                  ref={firstFieldRef}
                  className="input"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Task title"
                  required
                />
                {error ? <div className="error">{error}</div> : <div className="help">Required</div>}
              </div>
              <div>
                <div className="label">Description</div>
                <textarea
                  className="input textarea"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional details"
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <div className="label">Due Date</div>
                  <input
                    className="input"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
                <div>
                  <div className="label">Status</div>
                  <select className="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="todo">To do</option>
                    <option value="in-progress">In progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{initial ? 'Save' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;

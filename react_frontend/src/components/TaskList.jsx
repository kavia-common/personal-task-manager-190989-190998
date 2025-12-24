import React from 'react';
import TaskItem from './TaskItem';

/**
 * PUBLIC_INTERFACE
 * TaskList: Renders a list of tasks or empty state.
 */
function TaskList({ tasks, onEdit, loading }) {
  if (loading) {
    return (
      <div className="card" role="status" aria-live="polite" aria-busy="true">
        <div className="task-item">
          <div className="item-main" style={{ width: '100%' }}>
            <div className="skeleton" style={{ height: 16, width: '60%', marginBottom: 10 }} />
            <div className="skeleton" style={{ height: 12, width: '40%' }} />
          </div>
          <div className="item-actions">
            <div className="skeleton" style={{ height: 36, width: 72 }} />
            <div className="skeleton" style={{ height: 36, width: 72 }} />
            <div className="skeleton" style={{ height: 36, width: 72 }} />
          </div>
        </div>
      </div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="card empty" role="status">
        No tasks yet. Click the + button to add your first task.
      </div>
    );
  }

  return (
    <div className="card" aria-label="Task list">
      {tasks.map((t) => (
        <TaskItem key={t.id} task={t} onEdit={onEdit} />
      ))}
    </div>
  );
}

export default TaskList;

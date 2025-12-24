import React from 'react';
import { useTaskDispatch } from '../context/TaskContext';
import { formatDate } from '../utils/date';

/**
 * PUBLIC_INTERFACE
 * TaskItem: Renders a single task with actions.
 */
function TaskItem({ task, onEdit }) {
  const { toggleStatus, deleteTask } = useTaskDispatch();

  const confirmDelete = async () => {
    if (window.confirm('Delete this task?')) {
      await deleteTask(task.id);
    }
  };

  return (
    <div className="task-item">
      <div className="item-main">
        <h3 className="item-title">{task.title}</h3>
        <div className="item-meta">
          <span className={`badge ${task.status}`}>
            <span aria-hidden="true">●</span>
            {task.status.replace('-', ' ')}
          </span>
          <span title={task.dueDate ? new Date(task.dueDate).toString() : ''}>
            Due: {formatDate(task.dueDate)}
          </span>
          {task.description ? <span>•</span> : null}
          {task.description ? <span>{task.description}</span> : null}
        </div>
      </div>
      <div className="item-actions">
        <button className="btn" onClick={() => toggleStatus(task.id)} aria-label="Toggle status">
          Toggle
        </button>
        <button className="btn" onClick={() => onEdit(task)} aria-label="Edit task">
          Edit
        </button>
        <button className="btn btn-danger" onClick={confirmDelete} aria-label="Delete task">
          Delete
        </button>
      </div>
    </div>
  );
}

export default TaskItem;

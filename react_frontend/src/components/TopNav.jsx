import React from 'react';
import { useTasks, useTaskDispatch } from '../context/TaskContext';

/**
 * PUBLIC_INTERFACE
 * TopNav: Displays app title and theme toggle.
 */
function TopNav() {
  const { theme } = useTasks();
  const { setTheme } = useTaskDispatch();

  const next = theme === 'light' ? 'dark' : 'light';
  return (
    <nav className="navbar" aria-label="Top Navigation">
      <div className="navbar-inner">
        <div className="brand" aria-label="App brand">
          <div className="brand-logo" aria-hidden="true" />
          <div className="brand-title">Ocean Tasks</div>
        </div>
        <div className="nav-actions">
          <button
            className="btn btn-ghost"
            onClick={() => setTheme(next)}
            aria-label={`Switch to ${next} mode`}
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </div>
    </nav>
  );
}

export default TopNav;

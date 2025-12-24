import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { TaskProvider } from './context/TaskContext';
import TopNav from './components/TopNav';
import TaskPage from './pages/TaskPage';

/**
 * PUBLIC_INTERFACE
 * App: Root of the Task Manager application.
 * Provides Router and TaskProvider contexts and renders the main task page.
 */
function App() {
  return (
    <Router>
      <TaskProvider>
        <div className="app-shell">
          <TopNav />
          <main className="app-main" role="main">
            <Routes>
              <Route path="/" element={<TaskPage />} />
            </Routes>
          </main>
        </div>
      </TaskProvider>
    </Router>
  );
}

export default App;

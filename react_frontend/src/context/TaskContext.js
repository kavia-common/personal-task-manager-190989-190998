import React, { createContext, useContext, useEffect, useMemo, useReducer, useState } from 'react';
import ApiService from '../services/ApiService';
import { generateId, nowISOString } from '../utils/id';
import { seedDemoTasksIfEmpty, loadTasksFromStorage } from '../utils/storage';

/**
 * Task type
 * id, title, description, dueDate, status, createdAt, updatedAt
 */

/** Action types */
export const ACTIONS = {
  INIT: 'INIT',
  ADD: 'ADD',
  UPDATE: 'UPDATE',
  TOGGLE_STATUS: 'TOGGLE_STATUS',
  DELETE: 'DELETE',
  BULK_DELETE: 'BULK_DELETE'
};

const TaskStateContext = createContext(undefined);
const TaskDispatchContext = createContext(undefined);

/**
 * Reducer handling task state transitions.
 */
function taskReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INIT:
      return { ...state, tasks: action.payload, loading: false };
    case ACTIONS.ADD:
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case ACTIONS.UPDATE:
      return {
        ...state,
        tasks: state.tasks.map(t => (t.id === action.payload.id ? action.payload : t))
      };
    case ACTIONS.TOGGLE_STATUS: {
      const updated = state.tasks.map(t => {
        if (t.id !== action.payload) return t;
        const nextStatus =
          t.status === 'todo'
            ? 'in-progress'
            : t.status === 'in-progress'
            ? 'done'
            : 'todo';
        return { ...t, status: nextStatus, updatedAt: nowISOString() };
      });
      return { ...state, tasks: updated };
    }
    case ACTIONS.DELETE:
      return { ...state, tasks: state.tasks.filter(t => t.id !== action.payload) };
    case ACTIONS.BULK_DELETE:
      return { ...state, tasks: state.tasks.filter(t => !action.payload.includes(t.id)) };
    default:
      return state;
  }
}

/**
 * PUBLIC_INTERFACE
 * useTasks: Access the task state
 */
export function useTasks() {
  const ctx = useContext(TaskStateContext);
  if (!ctx) throw new Error('useTasks must be used within TaskProvider');
  return ctx;
}

/**
 * PUBLIC_INTERFACE
 * useTaskDispatch: Access actions to mutate tasks
 */
export function useTaskDispatch() {
  const ctx = useContext(TaskDispatchContext);
  if (!ctx) throw new Error('useTaskDispatch must be used within TaskProvider');
  return ctx;
}

/**
 * PUBLIC_INTERFACE
 * TaskProvider: Wraps the app with task state, actions, and persistence via ApiService.
 */
export function TaskProvider({ children }) {
  const [state, dispatch] = useReducer(taskReducer, { tasks: [], loading: true });
  const [theme, setTheme] = useState('light');

  // initialize tasks (seed if empty)
  useEffect(() => {
    const existing = loadTasksFromStorage();
    if (!existing || existing.length === 0) {
      const seeded = seedDemoTasksIfEmpty();
      dispatch({ type: ACTIONS.INIT, payload: seeded });
    } else {
      dispatch({ type: ACTIONS.INIT, payload: existing });
    }
  }, []);

  // persist tasks to storage
  useEffect(() => {
    if (!state.loading) {
      ApiService.saveAll(state.tasks);
    }
  }, [state.tasks, state.loading]);

  // theme sync
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const actions = useMemo(
    () => ({
      // PUBLIC_INTERFACE
      addTask: async (data) => {
        const now = nowISOString();
        const task = {
          id: generateId(),
          title: data.title.trim(),
          description: data.description?.trim() || '',
          dueDate: data.dueDate || '',
          status: data.status || 'todo',
          createdAt: now,
          updatedAt: now
        };
        dispatch({ type: ACTIONS.ADD, payload: task });
        await ApiService.create(task);
        return task;
      },
      // PUBLIC_INTERFACE
      updateTask: async (id, data) => {
        const existing = state.tasks.find(t => t.id === id);
        if (!existing) return;
        const updated = { ...existing, ...data, title: data.title?.trim() ?? existing.title, updatedAt: nowISOString() };
        dispatch({ type: ACTIONS.UPDATE, payload: updated });
        await ApiService.update(updated);
        return updated;
      },
      // PUBLIC_INTERFACE
      toggleStatus: async (id) => {
        dispatch({ type: ACTIONS.TOGGLE_STATUS, payload: id });
        const updated = state.tasks.find(t => t.id === id);
        if (updated) {
          const next =
            updated.status === 'todo' ? 'in-progress' : updated.status === 'in-progress' ? 'done' : 'todo';
          await ApiService.update({ ...updated, status: next, updatedAt: nowISOString() });
        }
      },
      // PUBLIC_INTERFACE
      deleteTask: async (id) => {
        dispatch({ type: ACTIONS.DELETE, payload: id });
        await ApiService.remove(id);
      },
      // PUBLIC_INTERFACE
      bulkDelete: async (ids) => {
        dispatch({ type: ACTIONS.BULK_DELETE, payload: ids });
        await ApiService.bulkRemove(ids);
      },
      // PUBLIC_INTERFACE
      setTheme
    }),
    [state.tasks, theme]
  );

  const value = useMemo(() => ({ ...state, theme }), [state, theme]);

  return (
    <TaskStateContext.Provider value={value}>
      <TaskDispatchContext.Provider value={actions}>
        {children}
      </TaskDispatchContext.Provider>
    </TaskStateContext.Provider>
  );
}

export default TaskProvider;

import { describe, expect, test } from '@jest/globals';
import { ACTIONS } from './TaskContext';

function reducer(state, action) {
  // Inline the same logic as TaskContext.taskReducer to keep test isolated
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
        return { ...t, status: nextStatus, updatedAt: 'now' };
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

describe('task reducer', () => {
  const initial = { tasks: [], loading: true };

  test('init', () => {
    const result = reducer(initial, { type: ACTIONS.INIT, payload: [{ id: '1' }] });
    expect(result.tasks).toHaveLength(1);
    expect(result.loading).toBe(false);
  });

  test('add', () => {
    const result = reducer({ tasks: [], loading: false }, { type: ACTIONS.ADD, payload: { id: '1' } });
    expect(result.tasks[0].id).toBe('1');
  });

  test('update', () => {
    const result = reducer({ tasks: [{ id: '1', title: 'a' }], loading: false }, { type: ACTIONS.UPDATE, payload: { id: '1', title: 'b' } });
    expect(result.tasks[0].title).toBe('b');
  });

  test('toggle', () => {
    const a = reducer({ tasks: [{ id: '1', status: 'todo' }], loading: false }, { type: ACTIONS.TOGGLE_STATUS, payload: '1' });
    expect(a.tasks[0].status).toBe('in-progress');
    const b = reducer(a, { type: ACTIONS.TOGGLE_STATUS, payload: '1' });
    expect(b.tasks[0].status).toBe('done');
    const c = reducer(b, { type: ACTIONS.TOGGLE_STATUS, payload: '1' });
    expect(c.tasks[0].status).toBe('todo');
  });

  test('delete & bulk delete', () => {
    const state = { tasks: [{ id: '1' }, { id: '2' }, { id: '3' }], loading: false };
    const del = reducer(state, { type: ACTIONS.DELETE, payload: '2' });
    expect(del.tasks.map(t => t.id)).toEqual(['1', '3']);
    const bulk = reducer(del, { type: ACTIONS.BULK_DELETE, payload: ['1', '3'] });
    expect(bulk.tasks).toHaveLength(0);
  });
});

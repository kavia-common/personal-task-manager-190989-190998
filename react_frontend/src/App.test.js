import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders app and shows controls', () => {
  render(<App />);
  expect(screen.getByRole('navigation', { name: /Top Navigation/i })).toBeInTheDocument();
  expect(screen.getByPlaceholderText(/Search tasks/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Add task/i })).toBeInTheDocument();
});

test('can add, edit, and delete a task', async () => {
  const user = userEvent.setup();
  render(<App />);

  // Add a task
  await user.click(screen.getByRole('button', { name: /Add task/i }));
  const titleField = screen.getByPlaceholderText(/Task title/i);
  await user.type(titleField, 'New Task');
  await user.click(screen.getByRole('button', { name: /Create/i }));
  expect(await screen.findByText('New Task')).toBeInTheDocument();

  // Edit the task
  const editBtn = screen.getAllByRole('button', { name: /Edit task/i })[0];
  await user.click(editBtn);
  const titleFieldEdit = screen.getByPlaceholderText(/Task title/i);
  await user.clear(titleFieldEdit);
  await user.type(titleFieldEdit, 'Updated Task');
  await user.click(screen.getByRole('button', { name: /Save/i }));
  expect(await screen.findByText('Updated Task')).toBeInTheDocument();

  // Delete the task (confirm dialog)
  // Mock confirm to auto-accept
  const confirmSpy = jest.spyOn(window, 'confirm').mockImplementation(() => true);
  const deleteBtn = screen.getAllByRole('button', { name: /Delete task/i })[0];
  await user.click(deleteBtn);
  confirmSpy.mockRestore();
});

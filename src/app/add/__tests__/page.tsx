import { act, fireEvent, render, screen } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import AddTask from '../page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('AddTask', () => {
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    global.fetch = jest.fn(() => Promise.resolve({ ok: true })) as jest.Mock;
  });

  it('renders form fields', () => {
    render(<AddTask />);
    expect(screen.getByPlaceholderText('Task Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Task Description')).toBeInTheDocument();
    expect(screen.getByRole('spinbutton')).toBeInTheDocument();
  });

  it('shows validation errors for empty fields', async () => {
    render(<AddTask />);

    await act(async () => {
      fireEvent.click(screen.getByText('Save Task'));
    });

    expect(screen.getByText('Title is required')).toBeInTheDocument();
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(screen.getByText('Due date is required')).toBeInTheDocument();
  });

  it('submits form with valid data', async () => {
    render(<AddTask />);

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Task Title'), {
        target: { value: 'Test Task' },
      });
      fireEvent.change(screen.getByPlaceholderText('Task Description'), {
        target: { value: 'Test Description' },
      });
      fireEvent.change(screen.getByDisplayValue(''), {
        target: { value: '2024-03-20' },
      });
      fireEvent.change(screen.getByRole('spinbutton'), {
        target: { value: '1' },
      });
    });

    await act(async () => {
      fireEvent.click(screen.getByText('Save Task'));
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/tasks',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({
          title: 'Test Task',
          description: 'Test Description',
          dueDate: '2024-03-20',
          priority: 1,
        }),
      })
    );
    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });

  it('clears validation errors when fields are filled', async () => {
    render(<AddTask />);

    await act(async () => {
      fireEvent.click(screen.getByText('Save Task'));
    });

    expect(screen.getByText('Title is required')).toBeInTheDocument();

    await act(async () => {
      fireEvent.change(screen.getByPlaceholderText('Task Title'), {
        target: { value: 'Test Task' },
      });
      fireEvent.click(screen.getByText('Save Task'));
    });

    expect(screen.queryByText('Title is required')).not.toBeInTheDocument();
  });
}); 
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import TaskDetail from '../page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('TaskDetail', () => {
  const mockRouter = { push: jest.fn() };
  const mockTask = {
    id: '1',
    title: 'Test Task',
    description: 'Test Description',
    dueDate: '2024-03-20',
    priority: 1
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    global.fetch = jest.fn();
  });

  it('renders task details', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTask)
    });

    render(<TaskDetail params={{ id: '1' }} />);

    await waitFor(() => {
      expect(screen.getByText('Test Task')).toBeInTheDocument();
      expect(screen.getByText('Test Description')).toBeInTheDocument();
      expect(screen.getByText('Due: 2024-03-20')).toBeInTheDocument();
      expect(screen.getByText('Priority: 1')).toBeInTheDocument();
    });
  });

  it('handles delete action', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTask)
      })
      .mockResolvedValueOnce({ ok: true }); 

    render(<TaskDetail params={{ id: '1' }} />);

    await act(async () => {
      fireEvent.click(screen.getByText('Delete'));
    });

    expect(mockRouter.push).toHaveBeenCalledWith('/');
  });
}); 
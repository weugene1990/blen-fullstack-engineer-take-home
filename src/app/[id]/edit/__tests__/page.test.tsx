import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import EditTask from '../page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('EditTask', () => {
  const mockRouter = { push: jest.fn() };
  const mockTask = {
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

  it('loads and displays task data', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockTask)
    });

    render(<EditTask params={{ id: '1' }} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
      expect(screen.getByDisplayValue('2024-03-20')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
    });
  });

  it('handles form submission', async () => {
    (global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockTask)
      })
      .mockResolvedValueOnce({ ok: true });

    render(<EditTask params={{ id: '1' }} />);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Task')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/1');
    });
  });
}); 
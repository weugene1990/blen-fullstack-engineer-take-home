import '@testing-library/jest-dom';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import Home from '../page';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

const mockTasks = [
  {
    id: '1',
    title: 'Test Task 1',
    priority: 'High',
    dueDate: '2024-03-20',
    createdAt: '2024-03-15T10:00:00Z'
  },
  {
    id: '2',
    title: 'Test Task 2',
    priority: 'Low',
    dueDate: '2024-03-21',
    createdAt: '2024-03-16T11:00:00Z'
  },
];

// Add mock for date-fns to avoid timezone issues in tests
jest.mock('date-fns', () => ({
  parseISO: jest.fn(str => new Date(str)),
  format: jest.fn(() => 'Mar 15, 2024, 10:00 AM')
}));

describe('Home Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      json: () => Promise.resolve({
        tasks: mockTasks,
        pagination: { totalPages: 3 }
      })
    });
  });

  test('renders main components', async () => {
    render(<Home />);
    
    await waitFor(() => {
      expect(screen.getByText('Task List')).toBeInTheDocument();
      expect(screen.getByText('Tasks per page:')).toBeInTheDocument();
      expect(screen.getByText('Sort by:')).toBeInTheDocument();
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });
  });

  test('displays tasks from API', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });
  });

  test('handles limit change', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByLabelText('Tasks per page:')).toBeInTheDocument();
    });

    const limitSelect = screen.getByLabelText('Tasks per page:');
    await act(async () => {
      fireEvent.change(limitSelect, { target: { value: '15' } });
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=15')
      );
    });
  });

  test('handles sort change', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByLabelText('Sort by:')).toBeInTheDocument();
    });

    const sortSelect = screen.getByLabelText('Sort by:');
    await act(async () => {
      fireEvent.change(sortSelect, { target: { value: 'priority-desc' } });
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('sortField=priority')
      );
    });
  });

  test('pagination controls work correctly', async () => {
    render(<Home />);

    await waitFor(() => {
      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('Next');
    await act(async () => {
      fireEvent.click(nextButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('page=2')
      );
    });
  });

  test('prev button is disabled on first page', async () => {
    render(<Home />);

    await waitFor(() => {
      const prevButton = screen.getByText('Prev');
      expect(prevButton).toBeDisabled();
    });
  });
}); 
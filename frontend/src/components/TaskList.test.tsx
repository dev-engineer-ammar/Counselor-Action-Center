import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Task } from '../types';
import { TaskList } from './TaskList';

const renderTaskList = (tasks: Task[]) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false }
    }
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <TaskList tasks={tasks} />
    </QueryClientProvider>
  );
};

describe('TaskList', () => {
  it('summarizes open, urgent, and completed student requirements', () => {
    renderTaskList([
      {
        id: 'tsk_test_1',
        studentId: 'stu_test',
        title: 'Submit FAFSA application',
        description: 'Student has not started the form.',
        status: 'todo',
        priority: 'urgent',
        dueDate: '2026-06-05',
        createdAt: '2026-05-13T14:00:00Z',
        updatedAt: '2026-05-13T14:00:00Z'
      },
      {
        id: 'tsk_test_2',
        studentId: 'stu_test',
        title: 'Review college list',
        description: 'Finalize target schools.',
        status: 'completed',
        priority: 'medium',
        dueDate: '2026-05-20',
        createdAt: '2026-05-01T14:00:00Z',
        updatedAt: '2026-05-22T14:00:00Z'
      }
    ]);

    expect(screen.getByText('1 of 2 requirements complete')).toBeInTheDocument();
    expect(screen.getByText('1 open')).toBeInTheDocument();
    expect(screen.getByText('1 urgent')).toBeInTheDocument();
    expect(screen.getByText('Submit FAFSA application')).toBeInTheDocument();
    expect(screen.getByText('Review college list')).toBeInTheDocument();
  });
});

import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { StudentService } from '../services/studentService';
import { Task } from '../types';

interface TaskItemProps {
  task: Task;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: Task['status'] }) => 
      StudentService.updateTaskStatus(taskId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actionCenter'] });
    },
  });

  const priorityColors = {
    low: 'bg-slate-100 text-slate-600 border-slate-200',
    medium: 'bg-blue-50 text-blue-700 border-blue-100',
    high: 'bg-amber-50 text-amber-700 border-amber-100',
    urgent: 'bg-rose-50 text-rose-700 border-rose-100 font-semibold',
  };
  const statusStyles = {
    todo: 'bg-slate-100 text-slate-700 border-slate-200',
    in_progress: 'bg-blue-50 text-blue-700 border-blue-100',
    completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  };
  const dueDate = new Date(task.dueDate);
  const isOverdue = task.status !== 'completed' && dueDate < new Date();

  return (
    <div className={`p-4 border rounded-lg bg-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-150 ${
      isOverdue ? 'border-rose-200 shadow-rose-100/60' : 'border-slate-200 hover:border-slate-300'
    }`}>
      <div className="space-y-2 flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className={`font-semibold text-slate-800 ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h4>
          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${statusStyles[task.status]}`}>
            {task.status.replace('_', ' ')}
          </span>
        </div>
        <p className="text-sm text-slate-500 max-w-xl">{task.description}</p>
        <span className={`text-xs font-semibold block ${isOverdue ? 'text-rose-600' : 'text-slate-400'}`}>
          {isOverdue ? 'Overdue since ' : 'Due '}
          {dueDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </span>
      </div>

      <div className="w-full sm:w-auto">
        <select
          value={task.status}
          disabled={mutation.isPending}
          onChange={(e) => mutation.mutate({ taskId: task.id, status: e.target.value as Task['status'] })}
          className="w-full sm:w-36 text-xs font-semibold border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 disabled:cursor-wait disabled:opacity-60"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};

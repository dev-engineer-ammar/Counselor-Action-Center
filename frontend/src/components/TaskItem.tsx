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
    low: 'bg-slate-100 text-slate-600',
    medium: 'bg-blue-50 text-blue-600 border-blue-100',
    high: 'bg-orange-50 text-orange-600 border-orange-100',
    urgent: 'bg-red-50 text-red-700 border-red-100 font-semibold',
  };

  return (
    <div className="p-4 border border-slate-200 rounded-xl bg-white shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 transition-colors duration-150">
      <div className="space-y-1 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className={`font-semibold text-slate-800 ${task.status === 'completed' ? 'line-through text-slate-400' : ''}`}>
            {task.title}
          </h4>
          <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md border ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>
        <p className="text-sm text-slate-500 max-w-xl">{task.description}</p>
        <span className="text-xs text-slate-400 block">Due by {new Date(task.dueDate).toLocaleDateString()}</span>
      </div>

      <div className="w-full sm:w-auto">
        <select
          value={task.status}
          disabled={mutation.isPending}
          onChange={(e) => mutation.mutate({ taskId: task.id, status: e.target.value as Task['status'] })}
          className="w-full sm:w-auto text-xs font-semibold border border-slate-200 rounded-lg p-2 bg-slate-50 text-slate-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        >
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
    </div>
  );
};
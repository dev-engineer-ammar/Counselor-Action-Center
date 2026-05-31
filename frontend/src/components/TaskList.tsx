import React from 'react';
import { TaskItem } from './TaskItem';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const openTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          Pending Requirements 
          <span className="bg-slate-200 text-slate-600 px-2 py-0.5 text-xs rounded-full normal-case font-semibold">
            {openTasks.length} left
          </span>
        </h3>
        {openTasks.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-xl p-6 text-center text-slate-400 text-sm">
            All caught up! No pending assignments for this student.
          </div>
        ) : (
          openTasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Completed Logs ({completedTasks.length})</h3>
          <div className="space-y-2 opacity-65">
            {completedTasks.map((task) => <TaskItem key={task.id} task={task} />)}
          </div>
        </div>
      )}
    </div>
  );
};
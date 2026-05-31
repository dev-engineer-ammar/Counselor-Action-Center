import React from 'react';
import { TaskItem } from './TaskItem';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
}

export const TaskList: React.FC<TaskListProps> = ({ tasks }) => {
  const openTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const urgentOpenTasks = openTasks.filter((t) => t.priority === 'urgent').length;
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Task Progress</h3>
            <p className="text-xs text-slate-500 mt-1">{completedTasks.length} of {tasks.length} requirements complete</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">{openTasks.length} open</span>
            <span className="text-xs font-bold text-rose-700 bg-rose-50 border border-rose-100 px-2.5 py-1 rounded-md">{urgentOpenTasks} urgent</span>
          </div>
        </div>
        <div className="mt-4 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-slate-950 rounded-full transition-all duration-300" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Pending Requirements</h3>
        {openTasks.length === 0 ? (
          <div className="border border-dashed border-slate-200 rounded-lg p-6 text-center text-slate-400 text-sm bg-white">
            All caught up! No pending assignments for this student.
          </div>
        ) : (
          openTasks.map((task) => <TaskItem key={task.id} task={task} />)
        )}
      </div>

      {completedTasks.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Completed Logs</h3>
          <div className="space-y-2 opacity-75">
            {completedTasks.map((task) => <TaskItem key={task.id} task={task} />)}
          </div>
        </div>
      )}
    </div>
  );
};

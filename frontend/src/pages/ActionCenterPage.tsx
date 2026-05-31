import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUiStore } from '../store/useUiStore';
import { StudentService } from '../services/studentService';
import { StudentSummary } from '../components/StudentSummary';
import { TaskList } from '../components/TaskList';
import { StudentSelector } from '../components/StudentSelector';

export const ActionCenterPage: React.FC = () => {
  const { selectedStudentId } = useUiStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['actionCenter', selectedStudentId],
    queryFn: () => StudentService.getActionCenter(selectedStudentId),
    enabled: !!selectedStudentId,
  });

  return (
    <div className="space-y-6">
      <section className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Today&apos;s action queue</p>
          <h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">Prioritize student follow-ups</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Review risk signals, pending requirements, and inbox updates from one focused workspace.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:flex">
          <div className="rounded-lg bg-white border border-slate-200 px-4 py-3 shadow-sm">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Sync</span>
            <span className="text-sm font-black text-emerald-700">Connected</span>
          </div>
          <div className="rounded-lg bg-white border border-slate-200 px-4 py-3 shadow-sm">
            <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">Mode</span>
            <span className="text-sm font-black text-slate-900">Counselor</span>
          </div>
        </div>
      </section>

      <div className="bg-white p-5 border border-slate-200 rounded-lg shadow-sm">
        <StudentSelector />
      </div>

      {isLoading && (
        <div className="space-y-4 animate-pulse">
          <div className="bg-slate-200 h-28 rounded-xl" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 p-4 rounded-lg text-sm font-medium">
          Error syncing data metrics with Action Center backplane. Verify network container state.
        </div>
      )}

      {data && (
        <>
          <StudentSummary 
            student={data.student} 
            urgencyLevel={data.urgencyLevel} 
            unreadCount={data.unreadMessagesCount} 
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <TaskList tasks={data.tasks} />
            </div>

            <aside className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
              <div className="p-5 border-b border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Inbox Pipeline</h3>
                  <p className="text-xs text-slate-500 mt-1">{data.unreadMessagesCount} unread messages</p>
                </div>
                <span className="h-9 w-9 rounded-lg bg-blue-50 border border-blue-100 text-blue-700 grid place-items-center text-sm font-black">
                  {data.messages.length}
                </span>
              </div>
              <div className="divide-y divide-slate-100 max-h-[460px] overflow-y-auto">
                {data.messages.map((msg) => (
                  <div key={msg.id} className={`p-4 group transition-colors ${!msg.read ? 'bg-blue-50/35 hover:bg-blue-50/60' : 'hover:bg-slate-50'}`}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-700 group-hover:text-blue-700 transition-colors">
                        {msg.from}
                      </span>
                      {!msg.read && (
                        <span className="h-2 w-2 rounded-full bg-blue-600 ring-4 ring-blue-100" />
                      )}
                    </div>
                    <h5 className={`text-sm tracking-tight ${!msg.read ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                      {msg.subject}
                    </h5>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{msg.preview}</p>
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mt-3">
                      {new Date(msg.receivedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
};

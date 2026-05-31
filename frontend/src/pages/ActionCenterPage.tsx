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
      <div className="bg-white p-5 border border-slate-200 rounded-xl shadow-sm">
        <StudentSelector />
      </div>

      {isLoading && (
        <div className="space-y-4 animate-pulse">
          <div className="bg-slate-200 h-28 rounded-xl" />
          <div className="h-64 bg-slate-200 rounded-xl" />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-medium">
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

            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Unread Mail Pipeline</h3>
              <div className="divide-y divide-slate-100 max-h-[400px] overflow-y-auto pr-1">
                {data.messages.map((msg) => (
                  <div key={msg.id} className="py-3 first:pt-0 last:pb-0 group">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-bold text-slate-700 group-hover:text-blue-600 transition-colors">
                        {msg.from}
                      </span>
                      {!msg.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-600 ring-4 ring-blue-50" />
                      )}
                    </div>
                    <h5 className={`text-sm tracking-tight ${!msg.read ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>
                      {msg.subject}
                    </h5>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">{msg.preview}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
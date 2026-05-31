import React from 'react';
import { Student } from '../types';

interface StudentSummaryProps {
  student: Student;
  urgencyLevel: 'low' | 'high' | 'critical';
  unreadCount: number;
}

export const StudentSummary: React.FC<StudentSummaryProps> = ({ student, urgencyLevel, unreadCount }) => {
  const urgencyBadges = {
    low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    high: 'bg-amber-50 text-amber-700 border-amber-200',
    critical: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="h-1.5 bg-slate-950" />
      <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="h-14 w-14 shrink-0 rounded-lg bg-slate-100 border border-slate-200 grid place-items-center text-lg font-black text-slate-700">
            {student.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}
          </div>
          <div className="space-y-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
              <span className={`text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${urgencyBadges[urgencyLevel]}`}>
                {urgencyLevel} urgency
              </span>
            </div>
            <p className="text-sm text-slate-500 truncate">{student.email}</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Grade {student.grade} · Counselor ID {student.counselorId}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 sm:gap-4 lg:min-w-[420px]">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">GPA</span>
            <span className="text-2xl font-black text-slate-900">{student.gpa.toFixed(2)}</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Status</span>
            <span className={`text-xs font-bold capitalize inline-block mt-2 px-2 py-1 rounded-md ${
              student.enrollmentStatus === 'at_risk' ? 'bg-rose-50 text-rose-700 border border-rose-100' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
            }`}>
              {student.enrollmentStatus.replace('_', ' ')}
            </span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
            <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Unread</span>
            <span className={`text-2xl font-black ${unreadCount > 0 ? 'text-blue-700' : 'text-slate-500'}`}>
              {unreadCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

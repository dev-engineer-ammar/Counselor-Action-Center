import React from 'react';
import { Student } from '../types';

interface StudentSummaryProps {
  student: Student;
  urgencyLevel: 'low' | 'high' | 'critical';
  unreadCount: number;
}

export const StudentSummary: React.FC<StudentSummaryProps> = ({ student, urgencyLevel, unreadCount }) => {
  const urgencyBadges = {
    low: 'bg-green-50 text-green-700 border-green-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    critical: 'bg-rose-50 text-rose-700 border-rose-200 animate-pulse font-bold',
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-6">
      <div className="space-y-1">
        <div className="flex flex-wrap items-center gap-3">
          <h2 className="text-2xl font-bold text-slate-900">{student.name}</h2>
          <span className={`text-xs uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${urgencyBadges[urgencyLevel]}`}>
            {urgencyLevel} Urgency
          </span>
        </div>
        <p className="text-sm text-slate-500">{student.email} • Grade {student.grade}</p>
      </div>

      <div className="grid grid-cols-3 gap-8 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-8">
        <div>
          <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">GPA</span>
          <span className="text-xl font-bold text-slate-800">{student.gpa.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Status</span>
          <span className={`text-xs font-bold capitalize inline-block mt-1 px-2 py-0.5 rounded ${
            student.enrollmentStatus === 'at_risk' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
          }`}>
            {student.enrollmentStatus.replace('_', ' ')}
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-400 block font-semibold uppercase tracking-wider">Unread Inbox</span>
          <span className={`text-xl font-bold ${unreadCount > 0 ? 'text-blue-600' : 'text-slate-500'}`}>
            {unreadCount}
          </span>
        </div>
      </div>
    </div>
  );
};
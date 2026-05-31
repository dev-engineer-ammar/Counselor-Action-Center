import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUiStore } from '../store/useUiStore';
import { StudentService } from '../services/studentService';

export const StudentSelector: React.FC = () => {
  const { selectedStudentId, setSelectedStudentId } = useUiStore();

  const { data: students, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: StudentService.getStudents,
  });

  if (isLoading) {
    return (
      <div className="flex gap-2">
        {[1, 2, 3].map((n) => (
          <div key={n} className="animate-pulse bg-slate-200 h-9 w-28 rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) return <p className="text-red-500 text-xs">Failed to load student selection records.</p>;

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Student Record</label>
      <div className="flex flex-wrap gap-2">
        {students?.map((student) => (
          <button
            key={student.id}
            onClick={() => setSelectedStudentId(student.id)}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg border transition-all duration-150 ${
              selectedStudentId === student.id
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-200'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
            }`}
          >
            {student.name}
          </button>
        ))}
      </div>
    </div>
  );
};
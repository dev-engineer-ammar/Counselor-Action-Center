import React, { useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUiStore } from '../store/useUiStore';
import { StudentService } from '../services/studentService';

export const StudentSelector: React.FC = () => {
  const { selectedStudentId, setSelectedStudentId } = useUiStore();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: students, isLoading, error } = useQuery({
    queryKey: ['students'],
    queryFn: StudentService.getStudents,
  });

  const selectedStudent = students?.find((student) => student.id === selectedStudentId);
  const filteredStudents = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    if (!query) return students ?? [];

    return (students ?? []).filter((student) =>
      [student.name, student.email, String(student.grade), student.enrollmentStatus]
        .some((value) => value.toLowerCase().includes(query))
    );
  }, [searchTerm, students]);

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-lg border border-slate-200 bg-slate-100 h-16" />
    );
  }

  if (error) return <p className="text-red-500 text-xs">Failed to load student selection records.</p>;

  if (!selectedStudent) {
    return (
      <div className="rounded-lg border border-dashed border-slate-200 p-4 text-sm font-medium text-slate-400">
        No student records available.
      </div>
    );
  }

  return (
    <div className="relative flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Student Record</label>
          <p className="text-sm text-slate-500 mt-1">Switch context without losing the counselor workflow.</p>
        </div>
        <span className="w-fit text-xs font-semibold text-slate-500 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-md">
          {students?.length ?? 0} records
        </span>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="flex w-full items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white px-4 py-3 text-left shadow-sm transition hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-100"
      >
        <span className="min-w-0">
          <span className="block truncate text-sm font-bold text-slate-900">{selectedStudent.name}</span>
          <span className="mt-0.5 block truncate text-xs font-medium text-slate-500">
            {selectedStudent.email} · Grade {selectedStudent.grade} · GPA {selectedStudent.gpa.toFixed(2)}
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-3">
          <span className={`h-2 w-2 rounded-full ${
            selectedStudent.enrollmentStatus === 'at_risk' ? 'bg-rose-500' : 'bg-emerald-500'
          }`} />
          <span className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>⌄</span>
        </span>
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-200/70">
          <div className="border-b border-slate-100 p-3">
            <input
              type="search"
              value={searchTerm}
              autoFocus
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search students..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-800 outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="max-h-72 overflow-y-auto py-1">
            {filteredStudents.length > 0 ? (
              filteredStudents.map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => {
                    setSelectedStudentId(student.id);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                  className={`flex w-full items-center justify-between gap-4 px-4 py-2.5 text-left transition ${
                    selectedStudentId === student.id ? 'bg-slate-950 text-white' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-bold">{student.name}</span>
                    <span className={`mt-0.5 block truncate text-xs ${
                      selectedStudentId === student.id ? 'text-slate-300' : 'text-slate-500'
                    }`}>
                      {student.email}
                    </span>
                  </span>
                  <span className={`hidden shrink-0 text-xs font-semibold sm:inline ${
                    selectedStudentId === student.id ? 'text-slate-300' : 'text-slate-500'
                  }`}>
                    Grade {student.grade}
                  </span>
                </button>
              ))
            ) : (
              <div className="p-5 text-center text-sm font-medium text-slate-400">
                No students match this search.
              </div>
            )}
          </div>
        </div>
      )}

      {isOpen && (
        <button
          type="button"
          aria-label="Close student selector"
          className="fixed inset-0 z-40 cursor-default bg-transparent"
          onClick={() => {
            setIsOpen(false);
            setSearchTerm('');
          }}
          tabIndex={-1}
        />
      )}
    </div>
  );
};

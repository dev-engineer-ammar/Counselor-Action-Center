import axiosInstance from '../api/axiosInstance';
import { Student, ActionCenterData, Task } from '../types';

export const StudentService = {
  getStudents: async (): Promise<Student[]> => {
    const response = await axiosInstance.get<Student[]>('/students');
    return response.data;
  },

  getActionCenter: async (studentId: string): Promise<ActionCenterData> => {
    const response = await axiosInstance.get<ActionCenterData>(`/students/${studentId}/action-center`);
    return response.data;
  },

  updateTaskStatus: async (taskId: string, status: Task['status']): Promise<Task> => {
    const response = await axiosInstance.patch<Task>(`/tasks/${taskId}/status`, { status });
    return response.data;
  },
};
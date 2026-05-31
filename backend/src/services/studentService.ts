import { MockDatabaseStore, Student, Task, Message } from '../data/mockData';
// import { ActionCenterPayload } from './studentService';

export interface ActionCenterPayload {
  student: Student;
  urgencyLevel: 'low' | 'high' | 'critical';
  unreadMessagesCount: number;
  tasks: Task[];
  messages: Message[];
}

export class StudentService {
  // Injected data access backplane via structural composition
  constructor(private readonly db: MockDatabaseStore) {}

  public fetchAllStudents(): Student[] {
    console.log(this.db.students)
    return this.db.students;
  }

  public fetchStudentActionCenterData(studentId: string): ActionCenterPayload | null {
    const student = this.db.students.find(s => s.id === studentId);
    if (!student) return null;

    const studentTasks = this.db.tasks.filter(t => t.studentId === studentId);
    const studentMessages = this.db.messages.filter(m => m.studentId === studentId);
    const unreadMessagesCount = studentMessages.filter(m => !m.read).length;

    const baseUrgency = student.enrollmentStatus === 'at_risk' ? 'high' : 'low';
    const hasUrgentTasks = studentTasks.some(t => t.priority === 'urgent' && t.status !== 'completed');
    const urgencyLevel = hasUrgentTasks ? 'critical' : baseUrgency;

    return {
      student,
      urgencyLevel,
      unreadMessagesCount,
      tasks: studentTasks,
      messages: studentMessages
    };
  }

  public updateTaskState(taskId: string, status: Task['status']): Task | null {
    const taskIndex = this.db.tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return null;

    this.db.tasks[taskIndex] = {
      ...this.db.tasks[taskIndex],
      status,
      updatedAt: new Date().toISOString()
    };
    
    return this.db.tasks[taskIndex];
  }
}
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentService = void 0;
class StudentService {
    db;
    // Injected data access backplane via structural composition
    constructor(db) {
        this.db = db;
    }
    fetchAllStudents() {
        console.log(this.db.students);
        return this.db.students;
    }
    fetchStudentActionCenterData(studentId) {
        const student = this.db.students.find(s => s.id === studentId);
        if (!student)
            return null;
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
    updateTaskState(taskId, status) {
        const taskIndex = this.db.tasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1)
            return null;
        this.db.tasks[taskIndex] = {
            ...this.db.tasks[taskIndex],
            status,
            updatedAt: new Date().toISOString()
        };
        return this.db.tasks[taskIndex];
    }
}
exports.StudentService = StudentService;

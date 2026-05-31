"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StudentController = void 0;
class StudentController {
    studentService;
    constructor(studentService) {
        this.studentService = studentService;
    }
    // Arrow functions automatically bind execution context to the instance
    getAllStudents = (req, res) => {
        try {
            const {} = req?.params;
            const data = this.studentService.fetchAllStudents();
            res.status(200).json(data);
        }
        catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
    getStudentActionCenter = (req, res) => {
        try {
            const { id } = req.params;
            const actionCenterData = this.studentService.fetchStudentActionCenterData(id);
            if (!actionCenterData) {
                res.status(404).json({ error: `Student trace record ${id} not found` });
                return;
            }
            res.status(200).json(actionCenterData);
        }
        catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
    updateTaskStatus = (req, res) => {
        try {
            const { taskId } = req.params;
            const { status } = req.body;
            if (!status || !['todo', 'in_progress', 'completed'].includes(status)) {
                res.status(400).json({ error: 'Invalid payload status validation data state' });
                return;
            }
            const updatedTask = this.studentService.updateTaskState(taskId, status);
            if (!updatedTask) {
                res.status(404).json({ error: `Task trace record ${taskId} not found` });
                return;
            }
            res.status(200).json(updatedTask);
        }
        catch (error) {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    };
}
exports.StudentController = StudentController;

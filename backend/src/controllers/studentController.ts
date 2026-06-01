import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/httpError';
import { StudentService } from '../services/studentService';

export class StudentController {
  constructor(private readonly studentService: StudentService) {}

  public getAllStudents = (_req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = this.studentService.fetchAllStudents();
      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public getStudentActionCenter = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { id } = req.params;
      const actionCenterData = this.studentService.fetchStudentActionCenterData(id);

      if (!actionCenterData) {
        next(new HttpError(404, `Student trace record ${id} not found`));
        return;
      }

      res.status(200).json(actionCenterData);
    } catch (error) {
      next(error);
    }
  };

  public updateTaskStatus = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const { taskId } = req.params;
      const { status } = req.body;

      if (!status || !['todo', 'in_progress', 'completed'].includes(status)) {
        next(new HttpError(400, 'Invalid payload status validation data state'));
        return;
      }

      const updatedTask = this.studentService.updateTaskState(taskId, status);
      if (!updatedTask) {
        next(new HttpError(404, `Task trace record ${taskId} not found`));
        return;
      }

      res.status(200).json(updatedTask);
    } catch (error) {
      next(error);
    }
  };
}

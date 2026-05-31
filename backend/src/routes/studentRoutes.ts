import { Router } from 'express';
import { StudentController } from '../controllers/studentController';

export const createStudentRouter = (controller: StudentController): Router => {
  const router = Router();

  router.get('/students', controller.getAllStudents);
  router.get('/students/:id/action-center', controller.getStudentActionCenter);
  router.patch('/tasks/:taskId/status', controller.updateTaskStatus);

  return router;
};
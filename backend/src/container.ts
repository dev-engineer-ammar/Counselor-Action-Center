import { MockDatabaseStore } from './data/mockData';
import { StudentService } from './services/studentService';
import { StudentController } from './controllers/studentController';
import { createStudentRouter } from './routes/studentRoutes';
import { Router } from 'express';

interface Container {
  dbStore: MockDatabaseStore;
  studentService: StudentService;
  studentController: StudentController;
  studentRouter: Router;
}

// Instantiate and export single reference instance maps
const dbStore = new MockDatabaseStore();
const studentService = new StudentService(dbStore);
const studentController = new StudentController(studentService);
const studentRouter = createStudentRouter(studentController);

export const AppContainer: Container = {
  dbStore,
  studentService,
  studentController,
  studentRouter
};
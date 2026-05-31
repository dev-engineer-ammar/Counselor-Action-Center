"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppContainer = void 0;
const mockData_1 = require("./data/mockData");
const studentService_1 = require("./services/studentService");
const studentController_1 = require("./controllers/studentController");
const studentRoutes_1 = require("./routes/studentRoutes");
// Instantiate and export single reference instance maps
const dbStore = new mockData_1.MockDatabaseStore();
const studentService = new studentService_1.StudentService(dbStore);
const studentController = new studentController_1.StudentController(studentService);
const studentRouter = (0, studentRoutes_1.createStudentRouter)(studentController);
exports.AppContainer = {
    dbStore,
    studentService,
    studentController,
    studentRouter
};

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createStudentRouter = void 0;
const express_1 = require("express");
const createStudentRouter = (controller) => {
    const router = (0, express_1.Router)();
    router.get('/students', controller.getAllStudents);
    router.get('/students/:id/action-center', controller.getStudentActionCenter);
    router.patch('/tasks/:taskId/status', controller.updateTaskStatus);
    return router;
};
exports.createStudentRouter = createStudentRouter;

require('dotenv').config();
const TaskController = require('../controllers/taskController');
const TaskRouter = require('express').Router();
const passport = require('./../auth/passportConfig');


//  use token validation
TaskRouter.use(passport.authenticate(process.env.JWT_SCHEME, { session: false }));


TaskRouter.get('/', TaskController.getTaskList);
TaskRouter.get('/:taskId', TaskController.getOneTask)
TaskRouter.post('/', TaskController.createNewTask);
TaskRouter.put('/:taskId', TaskController.updateTaskById)
TaskRouter.delete('/:taskId', TaskController.deleteTaskById)


module.exports = TaskRouter;

const Task = require('../mongo/entities/task');

const getTaskList = async (req, res) => {
    const taskList = await Task.find({});
    res.json(taskList);
}

const getOneTask = async (req, res) => {
    if (req.params && req.params.taskId) {
        const taskId = req.params.taskId;
        const task = await Task.findById(taskId);
        if (task) {
            return res.status(200).json({
                success: true,
                task: task
            })
        }

        return res.status(404).json({
            success: false,
            message: 'Task not found.'
        })
    } else {
        return res.status(400).json({
            success: false,
            message: 'Task id is required.'
        })
    }
}

const createNewTask = async (req, res) => {
    let taskModel = new Task(req.body);
    if (taskModel.isValid()) {
        let task = await taskModel.save();
        res.status(201).send({
            success: true,
            task: task
        })
    } else {
        res.status(400).send({
            success: false,
            message: 'Bad request! Summary and Description required!'
        })
    }
}
const updateTaskById = (req, res) => {
    if (req.body && req.params && req.params.taskId) {
        const taskId = req.params.taskId;

        Task.findByIdAndUpdate({ _id: taskId }, { $set: { ...req.body, updated: new Date() } }, { useFindAndModify: false, new: true }, (errorOnUpdateTask, updatedTask) => {
            if (errorOnUpdateTask) {
                return res.status(400).json({
                    success: false,
                    message: errorOnUpdateTask.message
                })
            }

            // updated successfully
            return res.status(200).send({
                success: true,
                task: updatedTask
            })
        });
    } else {
        return res.status(400).json({
            success: false,
            message: 'Task id is required.'
        })
    }
}

const deleteTaskById = (req, res) => {
    if (req.body && req.params && req.params.taskId) {
        const taskId = req.params.taskId;
        Task.findByIdAndDelete(taskId, (errorOnDeleteTask, result) => {
            if (errorOnDeleteTask) {
                return res.status(400).json({
                    success: false,
                    message: errorOnDeleteTask.message
                })
            }

            // deleted successfully
            return res.status(204).send({
                success: true
            })
        })

    } else {
        return res.status(400).json({
            success: false,
            message: 'Task id is required.'
        })
    }
}

const TaskController = {
    getTaskList: getTaskList,
    getOneTask: getOneTask,
    createNewTask: createNewTask,
    updateTaskById: updateTaskById,
    deleteTaskById: deleteTaskById
}

module.exports = TaskController;
const Task = require("../models/Task");
const User = require("../models/User");

// Create Task
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo
        } = req.body;

        // Check assigned user exists
        const user = await User.findById(assignedTo);

        if (!user) {
            return res.status(404).json({
                message: "Assigned user not found"
            });
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            assignedBy: req.user.userId,
            createdBy: req.user.userId
        });

        res.status(201).json(task);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get All Tasks
const getTasks = async (req, res) => {
    try {

        const tasks = await Task.find()
            .populate("assignedTo", "name email role")
            .populate("assignedBy", "name email")
            .populate("createdBy", "name email");

        res.json(tasks);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

// Get Single Task
const getTaskById = async (req, res) => {

    try {

        const task = await Task.findById(req.params.id)
            .populate("assignedTo", "name email role")
            .populate("assignedBy", "name email")
            .populate("createdBy", "name email");

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(task);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Update Task
const updateTask = async (req, res) => {

    try {

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        Object.assign(task, req.body);

        await task.save();

        res.json(task);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

// Delete Task
const deleteTask = async (req, res) => {

    try {

        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        await task.deleteOne();

        res.json({
            message: "Task deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};

module.exports = {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
};
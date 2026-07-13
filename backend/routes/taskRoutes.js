const express = require("express");

const {
    createTask,
    getTasks,
    getTaskById,
    updateTask,
    deleteTask
} = require("../controllers/taskController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/roleMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    authorize("Admin", "Manager"),
    createTask
);

router.get(
    "/",
    protect,
    getTasks
);

router.get(
    "/:id",
    protect,
    getTaskById
);

router.put(
    "/:id",
    protect,
    updateTask
);

router.delete(
    "/:id",
    protect,
    authorize("Admin", "Manager"),
    deleteTask
);

module.exports = router;
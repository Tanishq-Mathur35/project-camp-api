import mongoose from "mongoose"
import { Subtask } from "../models/subtask.model.js"
import { Tasks } from "../models/task.model.js"
import { ApiError } from "../utils/api-error.js"
import { asyncHandler } from "../utils/async-handler.js"


const validateTask = asyncHandler(async (req, res, next) => {
    const { projectId, taskId } = req.params

    if (
        !mongoose.isValidObjectId(projectId) ||
        !mongoose.isValidObjectId(taskId)
    ) {
        throw new ApiError(400, "Invalid project or task ID")
    }

    const task = await Tasks.findOne({
        _id: taskId,
        project: projectId
    })

    if (!task) {
        throw new ApiError(404, "Task not found in this project")
    }

    req.task = task

    next()
})


const validateSubTask = asyncHandler(async (req, res, next) => {
    const { projectId, subTaskId } = req.params

    if (
        !mongoose.isValidObjectId(projectId) ||
        !mongoose.isValidObjectId(subTaskId)
    ) {
        throw new ApiError(400, "Invalid project or subtask ID")
    }

    const subtask = await Subtask.findById(subTaskId)
        .populate("task", "project")

    if (
        !subtask ||
        !subtask.task ||
        subtask.task.project.toString() !== projectId
    ) {
        throw new ApiError(404, "Subtask not found in this project")
    }

    req.subtask = subtask

    next()
})



export {
    validateSubTask,
    validateTask
}


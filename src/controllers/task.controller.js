import mongoose from "mongoose"

import { Project } from "../models/project.model.js"
import { Subtask } from "../models/subtask.model.js"
import { Tasks } from "../models/task.model.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"


const getTasks = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    const project = await Project.findById(projectId)

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    const tasks = await Tasks.find({
        project: new mongoose.Types.ObjectId(projectId)
    }).populate("assignedTo", "avatar username fullName")

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tasks,
                "Tasks fetched successfully."
            )
        )
})


const createTask = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, status } = req.body
    const { projectId } = req.params

    const project = await Project.findById(projectId)

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    const files = req.files || []

    const attachments = files.map((file) => {
        return {
            url: `${process.env.SERVER_URL}/images/${file.originalname}`,
            mimetype: file.mimetype,
            size: file.size
        }
    })

    const task = await Tasks.create({
        title,
        description,
        project: new mongoose.Types.ObjectId(projectId),
        assignedTo: assignedTo
            ? new mongoose.Types.ObjectId(assignedTo)
            : undefined,
        status,
        assignedBy: new mongoose.Types.ObjectId(req.user._id),
        attachments
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                task,
                "Task created successfully."
            )
        )
})


const getTaskById = asyncHandler(async (req, res) => {
    const task = req.task

    await task.populate(
        "assignedTo",
        "username fullName avatar"
    )

    const subtasks = await Subtask.find({
        task: task._id
    }).populate(
        "createdBy",
        "username fullName avatar"
    )

    const taskData = {
        ...task.toObject(),
        subtasks
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                taskData,
                "Task fetched successfully."
            )
        )
})


const updateTask = asyncHandler(async (req, res) => {
    const { title, description, assignedTo, status } = req.body

    const updateFields = {}

    if (title !== undefined) {
        updateFields.title = title
    }

    if (description !== undefined) {
        updateFields.description = description
    }

    if (assignedTo !== undefined) {
        updateFields.assignedTo = assignedTo || null
    }

    if (status !== undefined) {
        updateFields.status = status
    }

    const task = await Tasks.findByIdAndUpdate(
        req.task._id,
        { $set: updateFields },
        { new: true, runValidators: true }
    ).populate(
        "assignedTo",
        "username fullName avatar"
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                task,
                "Task updated successfully."
            )
        )
})


const deleteTask = asyncHandler(async (req, res) => {
    const taskId = req.task._id

    await Tasks.findByIdAndDelete(taskId)

    await Subtask.deleteMany({
        task: taskId
    })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Task and its subtasks deleted successfully."
            )
        )
})


const createSubTask = asyncHandler(async (req, res) => {
    const { title } = req.body

    if (!title?.trim()) {
        throw new ApiError(400, "Subtask title is required")
    }

    const subtask = await Subtask.create({
        title,
        task: req.task._id,
        createdBy: req.user._id
    })

    const populatedSubtask = await Subtask.findById(subtask._id)
        .populate(
            "createdBy",
            "username fullName avatar"
        )

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                populatedSubtask,
                "Subtask created successfully."
            )
        )
})


const updateSubTask = asyncHandler(async (req, res) => {
    const { title, isCompleted } = req.body

    const updateFields = {}

    if (title !== undefined) {
        if (typeof title !== "string" || !title.trim()) {
            throw new ApiError(400, "Subtask title cannot be empty")
        }

        updateFields.title = title
    }

    if (isCompleted !== undefined) {
        updateFields.isCompleted = isCompleted
    }

    const subtask = await Subtask.findByIdAndUpdate(
        req.subtask._id,
        { $set: updateFields },
        { new: true, runValidators: true }
    ).populate(
        "createdBy",
        "username fullName avatar"
    )

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subtask,
                "Subtask updated successfully."
            )
        )
})


const deleteSubTask = asyncHandler(async (req, res) => {
    await Subtask.findByIdAndDelete(req.subtask._id)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Subtask deleted successfully."
            )
        )
})


export {
    createSubTask,
    createTask,
    deleteSubTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateSubTask,
    updateTask
}


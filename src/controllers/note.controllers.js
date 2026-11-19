import mongoose from "mongoose"
import { ProjectNote } from "../models/note.model.js"
import { Project } from "../models/project.model.js"
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"


const getNotes = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    const project = await Project.findById(projectId)

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    const notes = await ProjectNote.find({
        project: new mongoose.Types.ObjectId(projectId)
    })
        .populate("createdBy", "username avatar")
        .sort({ createdAt: -1 })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                notes,
                "Notes fetched successfully"
            )
        )
})


const getNoteById = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params

    if (!mongoose.isValidObjectId(noteId)) {
        throw new ApiError(404, "Note not found")
    }

    const note = await ProjectNote.findOne({
        _id: new mongoose.Types.ObjectId(noteId),
        project: new mongoose.Types.ObjectId(projectId)
    }).populate("createdBy", "username avatar")

    if (!note) {
        throw new ApiError(404, "Note not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                note,
                "Note fetched successfully"
            )
        )
})


const createNote = asyncHandler(async (req, res) => {
    const { projectId } = req.params
    const { content } = req.body

    const note = await ProjectNote.create({
        project: new mongoose.Types.ObjectId(projectId),
        createdBy: new mongoose.Types.ObjectId(req.user._id),
        content
    })

    const populatedNote = await ProjectNote.findById(note._id).populate(
        "createdBy",
        "username avatar"
    )

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                populatedNote || note,
                "Note created successfully"
            )
        )
})


const updateNote = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params
    const { content } = req.body

    if (!mongoose.isValidObjectId(noteId)) {
        throw new ApiError(404, "Note not found")
    }

    const note = await ProjectNote.findOneAndUpdate(
        {
            _id: new mongoose.Types.ObjectId(noteId),
            project: new mongoose.Types.ObjectId(projectId)
        },
        {
            $set: { content }
        },
        {
            new: true,
            runValidators: true
        }
    ).populate("createdBy", "username avatar")

    if (!note) {
        throw new ApiError(404, "Note not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                note,
                "Note updated successfully"
            )
        )
})


const deleteNote = asyncHandler(async (req, res) => {
    const { projectId, noteId } = req.params

    if (!mongoose.isValidObjectId(noteId)) {
        throw new ApiError(404, "Note not found")
    }

    const note = await ProjectNote.findOneAndDelete({
        _id: new mongoose.Types.ObjectId(noteId),
        project: new mongoose.Types.ObjectId(projectId)
    })

    if (!note) {
        throw new ApiError(404, "Note not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                { noteId: note._id },
                "Note deleted successfully"
            )
        )
})


export {
    createNote,
    deleteNote,
    getNoteById,
    getNotes,
    updateNote
}

import mongoose from 'mongoose'
import { Project } from '../models/project.model.js'
import { ProjectMember } from '../models/projectMember.model.js'
import { ProjectNote } from '../models/note.model.js'
import { Subtask } from '../models/subtask.model.js'
import { Tasks } from '../models/task.model.js'
import { User } from "../models/user.model.js"
import { ApiError } from '../utils/api-error.js'
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import { AvailableUserRole, UserRolesEnum } from '../utils/constants.js'


const getProjects = asyncHandler(async (req, res) => {
    const projects = await ProjectMember.aggregate([
        {
            $match: {
                user: new mongoose.Types.ObjectId(req.user._id),
            }
        },

        {
            $lookup: {
                from: "projects",
                localField: "project",
                foreignField: "_id",
                as: "project",
                pipeline: [
                    {
                        $lookup: {
                            from: "projectmembers",
                            localField: "_id",
                            foreignField: "project",
                            as: "projectmembers"
                        }
                    },
                    {
                        $addFields: {
                            members: {
                                $size: "$projectmembers"
                            }
                        }
                    }
                ]
            }
        },

        {
            $unwind: "$project"
        },

        {
            $project: {
                project: {
                    _id: 1,
                    name: 1,
                    description: 1,
                    members: 1,
                    createdAt: 1,
                    createdBy: 1
                },
                role: 1,
                _id: 0
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projects,
                "Projects fetched successfully"
            )
        )
})


const getProjectById = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!mongoose.isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project ID")
    }

    const project = await Project.findById(projectId)

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                project,
                "Project fetched successfully"
            )
        )
})


const createProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    const project = await Project.create({
        name,
        description,
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    })

    await ProjectMember.create({
        user: new mongoose.Types.ObjectId(req.user._id),
        project: new mongoose.Types.ObjectId(project._id),
        role: UserRolesEnum.ADMIN
    })

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                project,
                "Project Created Successfully."
            )
        )
})


const updateProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const { projectId } = req.params

    if (!mongoose.isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project ID")
    }

    const project = await Project.findByIdAndUpdate(
        projectId,
        {
            name,
            description
        },
        { new: true }
    )

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                project,
                "Project Updated Successfully"
            )
        )
})


const deleteProject = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!mongoose.isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project ID")
    }

    const project = await Project.findByIdAndDelete(projectId)

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    // Cascade delete project-associated documents
    const tasks = await Tasks.find({ project: projectId }).select("_id")
    const taskIds = tasks.map((t) => t._id)

    await Subtask.deleteMany({ task: { $in: taskIds } })
    await Tasks.deleteMany({ project: projectId })
    await ProjectMember.deleteMany({ project: projectId })
    await ProjectNote.deleteMany({ project: projectId })

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                project,
                "Project Deleted Successfully"
            )
        )
})


const addMembersToProject = asyncHandler(async (req, res) => {
    const { email, role } = req.body
    const { projectId } = req.params

    if (!mongoose.isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project ID")
    }

    const user = await User.findOne({ email })

    if (!user) {
        throw new ApiError(404, "User does not exist")
    }

    await ProjectMember.findOneAndUpdate(
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId)
        },
        {
            user: new mongoose.Types.ObjectId(user._id),
            project: new mongoose.Types.ObjectId(projectId),
            role: role
        },
        {
            new: true,
            upsert: true
        }
    )

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                {},
                "Project member added successfully."
            )
        )
})


const getProjectMembers = asyncHandler(async (req, res) => {
    const { projectId } = req.params

    if (!mongoose.isValidObjectId(projectId)) {
        throw new ApiError(400, "Invalid project ID")
    }

    const project = await Project.findById(projectId)

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

    const projectMembers = await ProjectMember.aggregate([
        {
            $match: {
                project: new mongoose.Types.ObjectId(projectId)
            }
        },

        {
            $lookup: {
                from: "users",
                localField: "user",
                foreignField: "_id",
                as: "user",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },

        {
            $addFields: {
                user: {
                    $arrayElemAt: ["$user", 0]
                }
            }
        },

        {
            $project: {
                project: 1,
                user: 1,
                role: 1,
                createdAt: 1,
                updatedAt: 1,
                _id: 0
            }
        }
    ])

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMembers,
                "Project members fetched.."
            )
        )
})


const updateMemberRole = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params
    const role = req.body.role || req.body.newRole

    if (!role || !AvailableUserRole.includes(role)) {
        throw new ApiError(400, "Invalid Role")
    }

    if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid project or user ID")
    }

    let projectMember = await ProjectMember.findOne({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId)
    })

    if (!projectMember) {
        throw new ApiError(404, "Project member not found")
    }

    projectMember.role = role
    await projectMember.save()

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMember,
                "Project member role updated successfully",
            )
        )
})


const deleteMember = asyncHandler(async (req, res) => {
    const { projectId, userId } = req.params

    if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid project or user ID")
    }

    let projectMember = await ProjectMember.findOneAndDelete({
        project: new mongoose.Types.ObjectId(projectId),
        user: new mongoose.Types.ObjectId(userId)
    })

    if (!projectMember) {
        throw new ApiError(404, "Project member not found")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                projectMember,
                "Project member deleted successfully"
            )
        )
})



export {
    addMembersToProject,
    createProject,
    deleteMember,
    deleteProject,
    getProjectById,
    getProjectMembers,
    getProjects,
    updateMemberRole,
    updateProject
}

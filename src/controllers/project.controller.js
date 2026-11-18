import mongoose from 'mongoose'
import { Project } from '../models/project.model.js'
import { ProjectMember } from '../models/projectMember.model.js'
import { ApiError } from '../utils/api-error.js'
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"
import { UserRolesEnum } from '../utils/constants.js'


const getProjects = asyncHandler(async (req, res) => {
    // test
})


const getProjectById = asyncHandler(async (req, res) => {
    // test
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
        .status(200)
        .json(
            new ApiResponse(
                200,
                project,
                "Project Created Successfully."
            )
        )
})


const updateProject = asyncHandler(async (req, res) => {
    const { name, description } = req.body
    const { projectId } = req.params

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

    const project = await Project.findByIdAndDelete(projectId)

    if (!project) {
        throw new ApiError(404, "Project not found")
    }

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
    // test
})


const getProjectMembers = asyncHandler(async (req, res) => {
    // test
})


const updateMemberRole = asyncHandler(async (req, res) => {
    // test
})


const deleteMember = asyncHandler(async (req, res) => {
    // test
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


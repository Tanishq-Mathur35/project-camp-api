import { User } from "../models/note.model.js"
import { Project } from '../models/project.model.js'
import { ProjectMember } from '../models/projectMember.model.js'
import { ApiError } from "../utils/api-error.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"


const getProjects = asyncHandler(async (req, res) => {
    // test
})


const getProjectById = asyncHandler(async (req, res) => {
    // test
})


const createProject = asyncHandler(async (req, res) => {
    // test
})


const updateProject = asyncHandler(async (req, res) => {
    // test
})


const deleteProject = asyncHandler(async (req, res) => {
    // test
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


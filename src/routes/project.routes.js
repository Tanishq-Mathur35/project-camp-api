import { Router } from 'express'
import {
    addMembersToProject,
    createProject,
    deleteMember,
    deleteProject,
    getProjectById,
    getProjectMembers,
    getProjects,
    updateMemberRole,
    updateProject
} from '../controllers/project.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { validateProjectPermission } from '../middlewares/project.middleware.js'
import { validate } from "../middlewares/validator.middleware.js"
import { AvailableUserRole, UserRolesEnum } from '../utils/constants.js'
import {
    addMemberToProjectValidator,
    createProjectValidator
} from '../validators/index.js'


const router = Router()
router.use(verifyJWT)


router
    .route("/")
    .get(getProjects)
    .post(createProjectValidator(), validate, createProject)

router
    .route("/:projectId")
    .get(validateProjectPermission(AvailableUserRole), getProjectById)
    .put(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        createProjectValidator(),
        validate,
        updateProject
    )
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteProject
    )

router
    .route("/:projectId/members")
    .get(validateProjectPermission(AvailableUserRole), getProjectMembers)
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        addMemberToProjectValidator(),
        validate,
        addMembersToProject
    )

router
    .route("/:projectId/members/:userId")
    .put(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        updateMemberRole
    )
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteMember
    )

export default router

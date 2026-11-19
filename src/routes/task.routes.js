import { Router } from "express"

import {
    createSubTask,
    createTask,
    deleteSubTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateSubTask,
    updateTask
} from "../controllers/task.controller.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"
import { upload } from "../middlewares/multer.middleware.js"
import { validateProjectPermission } from "../middlewares/project.middleware.js"

import {
    validateSubTask,
    validateTask
} from "../middlewares/task.middleware.js"

import {
    AvailableUserRole,
    UserRolesEnum
} from "../utils/constants.js"


const router = Router()

router.use(verifyJWT)


// Project Tasks
router
    .route("/:projectId")
    .get(
        validateProjectPermission(AvailableUserRole),
        getTasks
    )
    .post(
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN
        ]),
        upload.array("attachments"),
        createTask
    )


// Individual Task
router
    .route("/:projectId/t/:taskId")
    .get(
        validateProjectPermission(AvailableUserRole),
        validateTask,
        getTaskById
    )
    .put(
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN
        ]),
        validateTask,
        updateTask
    )
    .delete(
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN
        ]),
        validateTask,
        deleteTask
    )


// Create Subtask
router
    .route("/:projectId/t/:taskId/subtasks")
    .post(
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN
        ]),
        validateTask,
        createSubTask
    )


// Individual Subtask
router
    .route("/:projectId/st/:subTaskId")
    .put(
        validateProjectPermission(AvailableUserRole),
        validateSubTask,
        updateSubTask
    )
    .delete(
        validateProjectPermission([
            UserRolesEnum.ADMIN,
            UserRolesEnum.PROJECT_ADMIN
        ]),
        validateSubTask,
        deleteSubTask
    )



export default router

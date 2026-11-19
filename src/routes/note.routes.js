import { Router } from "express"

import {
    createNote,
    deleteNote,
    getNoteById,
    getNotes,
    updateNote
} from "../controllers/note.controllers.js"

import { verifyJWT } from "../middlewares/auth.middleware.js"
import { validateProjectPermission } from "../middlewares/project.middleware.js"
import { validate } from "../middlewares/validator.middleware.js"

import {
    AvailableUserRole,
    UserRolesEnum
} from "../utils/constants.js"

import {
    createNoteValidator,
    updateNoteValidator
} from "../validators/index.js"


const router = Router()

router.use(verifyJWT)

router
    .route("/:projectId")
    .get(
        validateProjectPermission(AvailableUserRole),
        getNotes
    )
    .post(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        createNoteValidator(),
        validate,
        createNote
    )

router
    .route("/:projectId/n/:noteId")
    .get(
        validateProjectPermission(AvailableUserRole),
        getNoteById
    )
    .put(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        updateNoteValidator(),
        validate,
        updateNote
    )
    .delete(
        validateProjectPermission([UserRolesEnum.ADMIN]),
        deleteNote
    )

export default router

import { Router } from 'express'
import { login, logoutUser, registerUser } from '../controllers/auth.controller.js'
import { verifyJWT } from '../middlewares/auth.middleware.js'
import { validate } from "../middlewares/validator.middleware.js"
import { userLoginValidator, userRegisterValidator } from '../validators/index.js'


const router = Router()

router.route("/register").post(userRegisterValidator(), validate, registerUser)
router.route("/login").post(userLoginValidator(), validate, login)

//Secure Routes
router.route("/logout").get(verifyJWT, logoutUser)

export default router

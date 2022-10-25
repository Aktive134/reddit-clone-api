import { Router } from "express" 
import authController from "./auth.controller"
import validateLoginData from "../../middleware/validate-user-login"
import validateSignupData from "../../middleware/validate-user-signup"


const { createUserHandler, loginUserHandler, logoutUserHandler } = authController;
const authRouter = Router();

authRouter.post("/sign-up", validateSignupData, createUserHandler);
authRouter.post("/login", validateLoginData, loginUserHandler );
authRouter.get("/logout", logoutUserHandler);


export default authRouter;
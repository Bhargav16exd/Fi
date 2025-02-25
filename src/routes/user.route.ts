import { Router } from "express";
import { login, signup } from "../controllers/user.controller";

const router = Router();


/*
    AccessType : @Public
    What it does: Route incoming request to desired controller
*/
router.route("/signup").post(signup);
router.route("/login").post(login);




export default router;
import { Router } from "express";
import { login, logout, repaymentSchedule, signup } from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();


/*
    AccessType : @Public
    What it does: Route incoming request to desired controller
*/
router.route("/signup").post(signup);
router.route("/login").post(login);


/*
    AccessType : @Private
    What it does: Route incoming request to -> Middleware -> desired controller
*/
router.route("/logout").get(authMiddleware,logout);
router.route("/repayment-schedule").post(authMiddleware,repaymentSchedule);




export default router;
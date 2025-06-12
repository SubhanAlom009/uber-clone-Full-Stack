import express from "express";
import { body } from "express-validator";
import { getUserProfile, login, logout, register } from "../controllers/user.controller.js";
import { authUser } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/register",[
    body('email').isEmail().withMessage("Please enter a valid email"),
    body('fullname.firstname').isLength({min: 3}).withMessage("First name must be at least 3 characters"),
    body('password').isLength({min: 6}).withMessage("Password must be at least 6 characters"),
], register);

router.post("/login",[
    body('email').isEmail().withMessage("Please enter a valid email"),
    body('password').isLength({min: 6}).withMessage("Password must be at least 6 characters"),
],login);

router.get("/profile",authUser,getUserProfile);

router.get("/logout",authUser, logout);

export default router;
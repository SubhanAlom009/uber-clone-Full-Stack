import express from "express";
import { body } from "express-validator";
import { getCaptainProfile, login, logout, register } from "../controllers/captain.controller.js";
import { authCaptain } from "../middlewares/auth.middleware.js";

const router = express.Router()

router.post('/register',[
    body('email').isEmail().withMessage("Please enter a valid email"),
    body('fullname.firstname').isLength({min: 3}).withMessage("First name must be at least 3 characters"),
    body('password').isLength({min: 6}).withMessage("Password must be at least 6 characters"),
    body('vehicle.color').isLength({min: 3}).withMessage("Vehicle color must be at least 3 characters"),
    body('vehicle.plate').isLength({min: 3}).withMessage("Vehicle plate must be at least 3 characters"),
    body('vehicle.capacity').isNumeric().withMessage("Vehicle capacity must be a number"),
    body('vehicle.vehicleType').isIn(['car', 'motorcycle', 'auto']).withMessage("Vehicle type must be car, motorcycle or auto"),
],register )

router.post('/login',[
    body('email').isEmail().withMessage("Please enter a valid email"),
    body('password').isLength({min: 6}).withMessage("Password must be at least 6 characters"),
], login)

router.get('/profile',authCaptain,getCaptainProfile)

router.get('/logout',authCaptain, logout)

export default router;
import express from "express";
import { body, query } from "express-validator";
import {  confirmRides, createRideFunction, endRide, getFareFunction, startRide } from "../controllers/ride.controller.js";
import { authCaptain, authUser } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/create",
    authUser,
    body("pickup").isString().isLength({ min: 3 }).withMessage("Pickup location is required"),
    body("destination").isString().isLength({ min: 3 }).withMessage("Destination location is required"),
    body("vehicleType").isString().isIn(["car", "motorcycle", "auto"]).withMessage("Vehicle type is required"),
    createRideFunction
)

router.get("/get-fare",
    authUser,
    query("pickup").isString().isLength({ min: 3 }).withMessage("Pickup location is required"),
    query("destination").isString().isLength({ min: 3 }).withMessage("Destination location is required"),
    getFareFunction
)

router.post("/confirm",
    authCaptain,
    body("rideId").isString().withMessage("Ride ID is required"),
    confirmRides
)

router.get("/start-ride",
    authCaptain,
    query("rideId").isString().withMessage("Ride ID is required"),
    query("otp").isString().isLength({ min: 6 }).withMessage("OTP is required"),
    startRide
)

router.post("/end-ride",
    authCaptain,
    body("rideId").isString().withMessage("Ride ID is required"),
    endRide
);

export default router;
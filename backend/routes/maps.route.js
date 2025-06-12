import express from "express";
import { authUser } from "../middlewares/auth.middleware.js";
import { getCoordinates, getDistanceTimeDetails, getSuggestions } from "../controllers/maps.controller.js";
import { query } from "express-validator";
import { getAutocompleteSuggestions } from "../services/maps.service.js";

const router = express.Router();

router.get("/get-coordinates",
    query("address").isString().isLength({ min: 3 }).withMessage("Address length must be at least 3 characters"),
    // authUser, //its doing issue with the token, so we will comment it for now
    getCoordinates)

router.get("/get-distance-time",
    query("origin").isString().isLength({ min: 3 }).withMessage("Origin length must be at least 3 characters"),
    query("destination").isString().isLength({ min: 3 }).withMessage("Destination length must be at least 3 characters"),
    // authUser, //its doing issue with the token, so we will comment it for now
    getDistanceTimeDetails)

router.get("/get-suggestions",
    query("input").isString().isLength({ min: 3 }).withMessage("Input length must be at least 3 characters"),
    // authUser, //its doing issue with the token, so we will comment it for now
    getSuggestions)

export default router;
import { Ride } from "../models/ride.model.js";
import { getFare, createRide, confirmRideService, startRideService, endRideService } from "../services/ride.service.js";
import { validationResult } from "express-validator";
import { handleError } from "../utils/errorHandler.js"; // Import error handler utility
import {
  getAddressCoordinates,
  getCaptainsInTheRadius,
} from "../services/maps.service.js";
import { sendMessageToSocketId } from "../socket.js";

export const createRideFunction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { pickup, destination, vehicleType } = req.body;

    // Get pickup coordinates
    const pickupCoordinates = await getAddressCoordinates(pickup);

    if (
      !pickupCoordinates ||
      typeof pickupCoordinates.lat !== "number" ||
      typeof pickupCoordinates.lng !== "number"
    ) {
      console.error(
        "Invalid or missing coordinates for pickup address:",
        pickup
      );
      return res
        .status(400)
        .json({
          message: "Could not find valid coordinates for the pickup address.",
        });
    }

    console.log("Pickup Coordinates:", pickupCoordinates);

    const captainInRadius = await getCaptainsInTheRadius(
      pickupCoordinates.lng,
      pickupCoordinates.lat,
      20 // Radius in kilometers
    );
    console.log("Captains in radius:", captainInRadius); // Debugging log

    if (captainInRadius.length === 0) {
      return res
        .status(404)
        .json({ message: "No captains available in the area." });
    }

    const ride = await createRide(
      req.user._id,
      pickup,
      destination,
      vehicleType
    );

    ride.otp = "";

    const rideWithUser = await Ride.findOne({ _id: ride._id }).populate("user");

    captainInRadius.map(async (captain) => {
      sendMessageToSocketId(captain.socketId, {
        event: "new-ride",
        data: rideWithUser,
      });
    });

    res.status(201).json({
      message: "Ride created successfully",
      ride: rideWithUser,
    });
  } catch (error) {
    handleError(res, error, "Failed to create ride"); // Improved error handling
  }
};

export const getFareFunction = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { pickup, destination } = req.query;
    const fare = await getFare(pickup, destination);

    res.status(200).json({
      message: "Fare retrieved successfully",
      fare,
    });
  } catch (error) {
    handleError(res, error, "Failed to retrieve fare"); // Improved error handling
  }
};

export const confirmRides = async (req,res)=>{
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { rideId } = req.body;

    const ride = await confirmRideService({
      rideId,
      captain: req.captain
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-confirmed",
      data: ride,
    });

    res.status(200).json({
      message: "Ride confirmed successfully",
      ride,
    });
  } catch (error) {
    handleError(res, error, "Failed to confirm ride"); // Improved error handling
  }
}

export const startRide = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { rideId, otp } = req.query;

    const ride = await startRideService({
      rideId,
      otp,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-started",
      data: ride,
    });

    res.status(200).json({
      message: "Ride started successfully",
      ride,
    });
  } catch (error) {
    handleError(res, error, "Failed to start ride"); // Improved error handling
  }
}

export const endRide = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { rideId } = req.body;

    const ride = await endRideService({
      rideId,
      captain: req.captain,
    });

    sendMessageToSocketId(ride.user.socketId, {
      event: "ride-ended",
      data: ride,
    });

    res.status(200).json({
      message: "Ride ended successfully",
      ride,
    });
  } catch (error) {
    handleError(res, error, "Failed to end ride"); // Improved error handling
  }
};

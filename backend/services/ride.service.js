import { getDistanceTime } from "./maps.service.js";
import { Ride } from "../models/ride.model.js";
import crypto from "crypto";

export const getOtp = (num) => {
  const otpLength = num || 6; // Default to 6 digits if not provided
  const otp = crypto.randomInt(10 ** (otpLength - 1), 10 ** otpLength);
  return otp;
};

export const getFare = async (pickup, destination) => {
  if (!pickup || !destination) {
    throw new Error("Pickup and destination are required");
  }

  try {
    const distanceData = await getDistanceTime(pickup, destination);
    console.log("Original data:", distanceData);

    // Extract numerical values from strings with units
    let km, time;

    if (distanceData) {
      // Handle distance - extract number from "X.X km" format
      if (distanceData.distance) {
        const distanceMatch = distanceData.distance.match(/(\d+\.?\d*)/);
        km = distanceMatch ? parseFloat(distanceMatch[0]) : NaN;
      }

      // Handle duration - extract number from "XX mins" format
      if (distanceData.duration) {
        const durationMatch = distanceData.duration.match(/(\d+\.?\d*)/);
        time = durationMatch ? parseFloat(durationMatch[0]) : NaN;
      }
    }

    console.log("Extracted values:", { km, time });

    // Validate the extracted values
    if (isNaN(km) || isNaN(time)) {
      console.log("Invalid data after parsing:", {
        km,
        time,
        originalData: distanceData,
      });
      throw new Error("Could not extract valid distance or time data");
    }

    const baseFare = {
      car: 50,
      auto: 30,
      motorcycle: 20,
    };

    const perKmRate = {
      car: 10,
      auto: 7,
      motorcycle: 5,
    };

    const perMinuteRate = {
      car: 2,
      auto: 1.5,
      motorcycle: 1,
    };

    const fare = {
      car: Math.floor(
        baseFare.car + km * perKmRate.car + time * perMinuteRate.car
      ),
      auto: Math.floor(
        baseFare.auto + km * perKmRate.auto + time * perMinuteRate.auto
      ),
      motorcycle: Math.floor(
        baseFare.motorcycle +
          km * perKmRate.motorcycle +
          time * perMinuteRate.motorcycle
      ),
    };

    return fare;
  } catch (error) {
    console.log("Error in getFare:", error);
    throw new Error("Error fetching fare details");
  }
};

export const createRide = async (user, pickup, destination, vehicleType) => {
  try {
    if (!user || !pickup || !destination || !vehicleType) {
      throw new Error("All fields are required");
    }

    const fare = await getFare(pickup, destination);

    const ride = await Ride.create({
      user,
      pickup,
      destination,
      otp: getOtp(6),
      fare: fare[vehicleType],
    });

    return ride;
  } catch (error) {
    console.log(error);
    throw new Error("Error creating ride");
  }
};

export const confirmRideService = async ({ rideId, captain }) => {
  try {
    if (!rideId) {
      throw new Error("Ride ID is required");
    }

    // Update the ride
    await Ride.findOneAndUpdate(
      { _id: rideId },
      { status: "accepted", captain: captain }
    );

    // Fetch the updated ride with populated captain and user
    const updatedRide = await Ride.findById(rideId)
      .select("+otp")
      .populate("user")
      .populate("captain");

    if (!updatedRide) {
      throw new Error("Ride not found after update");
    }

    return updatedRide;
  } catch (error) {
    console.log(error);
    throw new Error("Error confirming ride");
  }
};

export const startRideService = async ({ rideId, otp, captain }) => {
  try {
    if (!rideId || !otp) {
      throw new Error("Ride ID and OTP are required");
    }

    if (!captain) {
      throw new Error("Captain ID is required");
    }

    // Find the ride and select the OTP field
    const ride = await Ride.findById(rideId).select("+otp");
    if (!ride) {
      throw new Error("Ride not found");
    }

    // Check if the provided OTP matches
    if (ride.otp !== otp) {
      throw new Error("Invalid OTP");
    }

    // Update the ride status to ongoing and set the captain
    const updatedRide = await Ride.findOneAndUpdate(
      { _id: rideId, otp: otp },
      { status: "ongoing", captain: captain },
      { new: true }
    )
      .populate("user")
      .populate("captain");

    if (!updatedRide) {
      throw new Error("Ride not found or OTP is incorrect");
    }

    return updatedRide;
  } catch (error) {
    console.error("Error in startRideService:", error);
    throw new Error(error.message || "Error starting ride");
  }
};

export const endRideService = async ({ rideId, captain }) => {
  try {
    if (!rideId) {
      throw new Error("Ride ID is required");
    }

    if (!captain) {
      throw new Error("Captain ID is required");
    }

    // Find the ride and update its status to completed
    const updatedRide = await Ride.findOneAndUpdate(
      { _id: rideId, status: "ongoing", captain: captain },
      { status: "completed" },
      { new: true }
    )
      .populate("user")
      .populate("captain");

    if (!updatedRide) {
      throw new Error("Ride not found or not in ongoing status");
    }

    return updatedRide;
  } catch (error) {
    console.error("Error in endRideService:", error);
    throw new Error(error.message || "Error ending ride");
  }
};

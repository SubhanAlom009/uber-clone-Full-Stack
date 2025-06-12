import mongoose from "mongoose";

const rideSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    captain:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Captain",
    },
    pickup: {
        type: String,
        required: true,
        minlength: 3
    },
    destination: {
        type: String,
        required: true,
        minlength: 3
    },
    fare:{
        type: Number,
        required: true,
    },
    distance:{
        type: Number,
    },
    duration:{
        type: Number,
    },
    status: {
        type: String,
        enum: ["pending", "ongoing", "accepted", "completed", "cancelled"],
        default: "pending",
    },
    paymentId: {
        type: String,
    },
    orderId: {
        type: String,
    },
    signature:{
        type: String,
    },
    otp:{
        type: String,
        select: false,
        required: true,
    },
})

export const Ride = mongoose.model("Ride", rideSchema);
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname:{
            type: String,
            required: true,
            minlength: [3,"First name must be at least 3 characters"],
        },
        lastname:{
            type: String,
            minlength: [3,"Last name must be at least 3 characters"],
        }
        },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'please enter a valid email'],
    },
    password:{
        type: String,
        required: true,
        minlength: [6,"Password must be at least 6 characters"],
        select: false,
    },
    socketId:{
        type: String,
    },
    status:{
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
    },
    vehicle:{
        color:{
            type: String,
            required: true,
            minlength: [3,"Color must be at least 3 characters"],
        },
        plate:{
            type: String,
            required: true,
            minlength: [3,"Plate must be at least 3 characters"],
        },
        capacity:{
            type: Number,
            required: true,
            min: [1, "Capacity must be at least 1"],
        },
        vehicleType:{
            type: String,
            required: true,
            enum: ["car", "motorcycle", "auto"],
        }
    },
    location: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point'
        },
        coordinates: {
          type: [Number], // [lng, ltd]
          default: [0, 0]
        }
      }

})

captainSchema.index({ location: '2dsphere' });

captainSchema.methods.generateAuthToken = function(){
    const token = jwt.sign(
        {
            id: this._id,
            email: this.email,
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "24h",
        }
    )
    return token;
}

captainSchema.methods.comparePassword = async function(password){
    return await bcrypt.compare(password, this.password);
}

captainSchema.statics.hashPassword = async function(password) {
    return await bcrypt.hash(password, 10);
};


export const Captain = mongoose.model("Captain", captainSchema);
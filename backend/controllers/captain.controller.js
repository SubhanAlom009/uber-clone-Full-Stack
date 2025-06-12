import { Captain } from "../models/captain.model.js";
import { createCaptain } from "../services/captain.service.js";
import { validationResult } from "express-validator";
import { BlacklistToken } from './../models/blacklistToken.model.js';


export const register = async (req, res) => {
    try {

        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() });
        }
        const { fullname:{firstname, lastname}, email, password, vehicle:{color, plate, capacity, vehicleType} } = req.body;

        console.log("Request body:", req.body);

        const isCaptainExist = await Captain.findOne({email});

        if(isCaptainExist){
            return res.status(400).json({
                message: "Captain already exists",
            });
        }

        const hashedPassword = await Captain.hashPassword(password);

        const captain = await createCaptain({
            firstname,
            lastname,
            email,
            password:hashedPassword,
            color,
            plate,
            capacity,
            vehicleType
        });

        const token = await captain.generateAuthToken();

        res.status(201).json({
            message: "Captain created successfully",
            captain: {
                id: captain._id,
                email: captain.email,
                fullname: captain.fullname,
                vehicle: captain.vehicle,
            },
            token
        });

    } catch(error){
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
} 

export const login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        const captain = await Captain.findOne({email}).select("+password");

        if(!captain){
            return res.status(401).json({
                message: "Captain not found",
            });
        }

        const isMatch = await captain.comparePassword(password);

        if(!isMatch){
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = await captain.generateAuthToken();

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "None",
        })

        res.status(200).json({
            message: "Captain logged in successfully",
            captain: {
                id: captain._id,
                email: captain.email,
                fullname: captain.fullname,
                vehicle: captain.vehicle,
            },
            token
        })

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        })
    }
}

export const getCaptainProfile = async (req, res) => {
    try {
        res.status(200).json({
            message: "Captain profile fetched successfully",
            captain: req.captain
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        })
    }
}

export const logout = async (req, res) => {
    try {

        const token = await req.cookies.token || req.headers.authorization?.split(" ")[1];
        
        res.clearCookie("token");

        await BlacklistToken.create({token});

        res.status(200).json({
            message: "Captain logged out successfully",
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        })
    }
}
import { User } from "../models/user.model.js";
import { validationResult } from "express-validator";
import { BlacklistToken } from "../models/blacklistToken.model.js";
import { createUser } from "../services/user.service.js";

export const register = async (req, res) => {
    try {

        console.log("Request body:", req.body);
        // console.log(req.body);
        const errors = validationResult(req);
        

        if(!errors.isEmpty()){
            return res.status(422).json({ errors: errors.array() });
        }

        const { fullname:{firstname, lastname}, email, password } = req.body;
        
        const isUserExist = await User.findOne({email});
        if(isUserExist){
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await User.hashPassword(password);

        const user = await createUser({
            firstname,
            lastname,
            email,
            password: hashedPassword,
        });
        
        const token = user.generateAuthToken();

        res.status(201).json({
            message: "User created successfully",
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
            },
            token,
        });

    } catch (error) {
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

        const user = await User.findOne({email}).select("+password");

        if(!user){
            return res.status(401).json({
                message: "user not found",
            });
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }

        const token = user.generateAuthToken();
        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "None",
        })

        res.status(200).json({
            message: "User logged in successfully",
            user: {
                id: user._id,
                email: user.email,
                fullname: user.fullname,
            },
            token,
        });

    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        })
    }
}

export const getUserProfile = async (req,res) =>{
    try {
        res.status(200).json({
            message: "User profile fetched successfully",
            user: req.user,
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        })
    }
}

export const logout = async (req,res)=>{

    const token = await req.cookies.token || req.headers.authorization?.split(" ")[1];
    
    res.clearCookie("token");

    await BlacklistToken.create({token});

    res.status(200).json({
        message: "User logged out successfully",
    });

}
import { getAddressCoordinates, getAutocompleteSuggestions, getDistanceTime } from "../services/maps.service.js"
import { validationResult } from "express-validator";


export const getCoordinates = async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    const { address } = req.query; 

    try {

        if(!address){
            return res.status(400).json({
                message: "Address is required",
            })
        }

        const coordinates = await getAddressCoordinates(address);

        res.status(200).json({
            message: "Coordinates fetched successfully",
            coordinates,
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        })
        
    }
}

export const getDistanceTimeDetails = async (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({ errors: errors.array() });
    }

    const { origin, destination } = req.query;

    try {

        if(!origin || !destination){
            return res.status(400).json({
                message: "Origin and destination are required",
            })
        }

        const distanceTime = await getDistanceTime(origin, destination);

        res.status(200).json({
            message: "Distance and time fetched successfully",
            distanceTime,
        })
        
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        })   
    }
}

export const getSuggestions = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    const { input } = req.query;

    try {
        console.log("Fetching suggestions for input:", input); // Log input for debugging
        const suggestions = await getAutocompleteSuggestions(input);

        res.status(200).json({
            message: "Suggestions fetched successfully",
            suggestions,
        });
    } catch (error) {
        if (error.message === "No results found") {
            console.warn("No suggestions found for input:", input); // Log warning for no results
            return res.status(200).json({
                message: "No suggestions found",
                suggestions: [],
            });
        }

        console.error("Error in getSuggestions controller:", error.message); // Log error message
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};
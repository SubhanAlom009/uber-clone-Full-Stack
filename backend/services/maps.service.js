import axios from 'axios';
import { Captain } from '../models/captain.model.js';

export const getAddressCoordinates = async (address) => {
    try {
        console.log("Fetching coordinates for address:", address);
        console.log("Using API Key:", process.env.GOOGLE_MAP_API_KEY);

        const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: address,
                key: process.env.GOOGLE_MAP_API_KEY
            }
        });

        const data = response.data;
        console.log("Google Geocoding API Response:", data);

        if (data.status === "OK") {
            const { lat, lng } = data.results[0].geometry.location;
            return { lat, lng };
        } else {
            throw new Error(`Unable to get coordinates: ${data.status}`);
        }
    } catch (error) {
        console.error("Error fetching coordinates:", error.message);
        throw new Error(error.message || "An error occurred while fetching coordinates");
    }
};

export const getDistanceTime = async (origin, destination) => {
    if(!origin || !destination){
        throw new Error("Origin and destination are required");
    }
    try {
        
        const response = await axios.get('https://maps.googleapis.com/maps/api/distancematrix/json', {
            params: {
                origins: origin,
                destinations: destination,
                key: process.env.GOOGLE_MAP_API_KEY
            }
        });
        const data = response.data;
        if (data.status === "OK") {
            const { distance, duration } = data.rows[0].elements[0];
            return {
                distance: distance.text,
                duration: duration.text
            };
        } else{
            throw new Error("Unable to get distance and time");
        }

    } catch (error) {
        throw new Error(error.message || "An error occurred while fetching distance and time");
    }
}
export const getAutocompleteSuggestions = async (input) => {
    if (!input) {
        throw new Error("Input query is required");
    }
    console.log("Autocomplete input:", input); // Debugging log
    try {
        const response = await axios.get('https://maps.googleapis.com/maps/api/place/autocomplete/json', {
            params: {
                input: input,
                key: process.env.GOOGLE_MAP_API_KEY
            }
        });
        const data = response.data;
        console.log("Google API Response:", data); // Log the full API response for debugging
        if (data.status === "OK") {
            return data.predictions;
        } else if (data.status === "ZERO_RESULTS") {
            console.warn("No autocomplete results found for input:", input); // Warning for no results
            throw new Error("No results found");
        } else {
            console.error("Google Maps API error:", data); // Log API errors
            throw new Error(`Google Maps API error: ${data.status}`);
        }
    } catch (error) {
        console.error("Error fetching autocomplete suggestions:", error.message); // Log error message
        throw new Error(error.message || "An error occurred while fetching autocomplete suggestions");
    }
};

export const getCaptainsInTheRadius = async (lng, ltd, radius) => {
    console.log("Querying captains with coordinates:", { lon: lng, lat: ltd, radius });

    if (typeof ltd !== 'number' || typeof lng !== 'number' || isNaN(ltd) || isNaN(lng)) {
        console.error(`Invalid coordinates received: ltd=${ltd}, lng=${lng}`);
        throw new Error("Invalid coordinates: Latitude and Longitude must be numeric values.");
    }

    try {
        const captains = await Captain.find({
            location: {
                $geoWithin: {
                    $centerSphere: [[lng, ltd], radius / 6371], // Radius in kilometers
                },
            },
            
        });
        console.log("Captains found:", captains);
        return captains;
    } catch (error) {
        console.error("Error finding captains in radius:", error.message);
        throw new Error("Failed to find nearby captains.");
    }
};
import React from "react";
import userProfile from "../assets/images/captain-pic.jpeg";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FinishRide(props) {

  const navigate = useNavigate();

  const endRideHandler = async () => {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/ride/end-ride`,
      {
        rideId: props.ride._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    if (response.status === 200) {
      // Handle successful ride completion
      console.log("Ride ended successfully:", response.data);
      navigate("/captain-home"); // Navigate to captain home or any other page
    } else {
      // Handle errors
      console.error("Error ending ride:", response.data);
    }
  };

  return (
    <div className="space-y-4 px-2 py-4">
      {/* Rider Info */}
      <div className="flex items-center gap-4">
        <img
          src={userProfile}
          alt="Rider"
          className="w-16 h-16 rounded-full object-cover border-2 border-gray-300"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-800">
            {props.ride?.user.fullname.firstname}{" "}
            {props.ride?.user.fullname.lastname}
          </h3>
          <p className="text-sm text-gray-500">4.8 ★ | 150+ rides</p>
        </div>
      </div>

      {/* pickup Location */}
      <div className="flex items-start gap-3">
        <i className="ri-map-pin-line text-xl text-gray-700 mt-1"></i>
        <div>
          <p className="text-gray-500 text-sm">pickup Location</p>
          <p className="font-semibold text-lg text-gray-800">
            {props.ride?.pickup}
          </p>
        </div>
      </div>

      {/* Drop Location */}
      <div className="flex items-start gap-3">
        <i className="ri-map-pin-line text-xl text-gray-700 mt-1"></i>
        <div>
          <p className="text-gray-500 text-sm">Drop Location</p>
          <p className="font-semibold text-lg text-gray-800">
            {props.ride?.destination}
          </p>
        </div>
      </div>

      {/* Trip Progress */}
      <div className="flex justify-between text-center py-2 px-4 bg-gray-100 rounded-xl">
        <div>
          <p className="text-gray-500 text-sm">Time</p>
          <p className="font-bold text-lg">12 min</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Distance</p>
          <p className="font-bold text-lg">4.2 km</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Fare</p>
          <p className="font-bold text-lg">₹{props.ride?.fare}</p>
        </div>
      </div>

      {/* Complete Ride Button */}
      <button 
      onClick={endRideHandler}
      className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg">
        Mark as Completed
      </button>
    </div>
  );
}

export default FinishRide;

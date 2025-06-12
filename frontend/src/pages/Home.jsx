import React, { useContext, useEffect, useRef, useState } from "react";
import uberLogo from "../assets/images/uber-pic.png";
import uberMap from "../assets/images/uber-map.webp";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../components/LocationSearchPanel";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import VehiclePanel from "../components/VehiclePanel";
import ConfirmRide from "../components/ConfirmRide";
import LookingForDriver from "./../components/LookingForDriver";
import WaitingForDriver from "../components/WaitingForDriver";
import axios from "axios";
import { SocketContext } from "../context/SocketContext";
import { UserDataContext } from './../context/UserContext';
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [skipToDriverPanel, setSkipToDriverPanel] = useState(false); // State to control the driver panel visibility
  const [panel, setPanel] = useState("none"); // State to control the panel visibility

  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pickupSuggestions, setPickupSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [fareDetails, setFareDetails] = useState({});
  const [ride, setRide] = useState(null);

  const vehiclePanelRef = useRef(null);
  const confirmRideRef = useRef(null);
  const vehicleFoundRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (panel !== "vehicle") return;

      if (
        vehiclePanelRef.current &&
        !vehiclePanelRef.current.contains(e.target)
      ) {
        setPanel("none");
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [panel]);

  useGSAP(() => {
    const panelMap = {
      vehicle: vehiclePanelRef,
      confirm: confirmRideRef,
      driver: vehicleFoundRef,
    };

    Object.entries(panelMap).forEach(([key, ref]) => {
      // Only animate if that panel's DOM element exists
      if (!ref.current) return;

      if (panel === key) {
        gsap.to(ref.current, {
          y: 0,
          duration: 0.3,
          ease: "power2.out",
        });
      } else {
        gsap.to(ref.current, {
          y: "100%",
          duration: 0.3,
          ease: "power2.in",
        });
      }
    });
  }, [panel]);

  const {sendMessage, receiveMessage, socket} = useContext(SocketContext)
  const { user } = useContext(UserDataContext)

  useEffect(() => {
    if(user) {
      sendMessage('join', {userType: 'user', userId: user._id})
    }
  },[user])

  useEffect(() => {
    if (!socket) return;
  
    const handleRideConfirmed = (ride) => {
      console.log("Ride confirmed:", ride);
      // You can update state here if needed
      setPanel("confirmRide");
      setSelectedVehicle(ride);
      setRide(ride);
    };
  
    socket.on("ride-confirmed", handleRideConfirmed);
  
    // Cleanup to avoid duplicate listeners
    return () => {
      socket.off("ride-confirmed", handleRideConfirmed);
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleRideStarted = (ride) => {
      console.log("Ride started:", ride);
      // You can update state here if needed
      setPanel("none");
      setSelectedVehicle(ride);
      navigate("/riding", { state: { ride } });
    };

    socket.on("ride-started", handleRideStarted);

    // Cleanup to avoid duplicate listeners
    return () => {
      socket.off("ride-started", handleRideStarted);
    };
  },[socket])

  const handleFocus = () => setIsExpanded(true);
  const handleClose = (e) => {
    e.stopPropagation();
    setIsExpanded(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsExpanded(false); // Close the panel when submitting the form
    setPanel("vehicle"); // Show the vehicle panel
    setPickupSuggestions([]); // Clear suggestions when submitting
    setDestinationSuggestions([]);

    return;

    if (!pickup || !destination) {
      alert("Please enter both pickup and destination locations");
      return;
    }

    // Validate input fields
    if (!pickup || pickup.length < 3) {
      alert("Pickup location must be at least 3 characters long");
      return;
    }

    if (!destination || destination.length < 3) {
      alert("Destination must be at least 3 characters long");
      return;
    }

    try {
      console.log("Submitting form with data:", { pickup, destination });

      // Show loading state
      setIsLoading(true);

      // Get the user token from localStorage
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please log in to book a ride");
        // Redirect to login page if needed
        return;
      }

      // Send ride request to backend
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          pickup,
          destination,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Ride request response:", response.data);

      // If successful, show vehicle options panel
      if (response.status === 201) {
        setIsExpanded(false);
        setPanel("vehicle");
      }
    } catch (error) {
      console.error("Error requesting ride:", error);
      alert(
        error.response?.data?.message ||
          "Failed to request ride. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getRideAndUserDetails = async (vehicleType)=>{
    
    const token = localStorage.getItem("token")
    if (!token) {
      alert("Please log in to book a ride");
      return;
    }
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/ride/create`,
        {
          pickup,
          destination,
          vehicleType,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Ride and user details:", response.data);
    } catch (error) {
      console.error("Error fetching ride and user details:", error);
      alert(
        error.response?.data?.message ||
          "Failed to fetch ride and user details. Please try again."
      );
      
    }
  }

  const getFareDetails = async (e) => {
    e.stopPropagation();
    try {
      if (!pickup || !destination) {
        alert("Please enter both pickup and destination locations");
        return;
      }
      setIsExpanded(false); // Close the panel when submitting the form
      setPanel("vehicle"); // Show the vehicle panel
      setPickupSuggestions([]); // Clear suggestions when submitting
      setDestinationSuggestions([]);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/ride/get-fare`,
        {
          params: {
            pickup,
            destination,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("Fare details:", response.data.fare);
      setFareDetails(response.data);
    } catch (error) {
      console.error("Error fetching fare details:", error);
    }
  };

  // Log fareDetails whenever it changes
  useEffect(() => {
    console.log("Updated fareDetails in Home:", fareDetails);
  }, [fareDetails]);

  const fetchPickupSuggestions = async (input) => {
    if (!input) {
      setPickupSuggestions([]);
      return;
    }

    console.log("Fetching pickup suggestions with input:", input); // Log input

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        { params: { input } }
      );
      setPickupSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching pickup suggestions:", error);
    }
  };

  const fetchDestinationSuggestions = async (input) => {
    if (!input) {
      setDestinationSuggestions([]);
      return;
    }

    console.log("Fetching destination suggestions with input:", input); // Log input

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        { params: { input } }
      );
      setDestinationSuggestions(response.data.suggestions);
    } catch (error) {
      console.error("Error fetching destination suggestions:", error);
    }
  };

  const handlePickupChange = (e) => {
    const value = e.target.value;
    setPickup(value);
    fetchPickupSuggestions(value);
  };

  const handleDestinationChange = (e) => {
    const value = e.target.value;
    setDestination(value);
    fetchDestinationSuggestions(value);
  };

  const handleSuggestionClick = (suggestion, type) => {
    if (type === "pickup") {
      setPickup(suggestion);
      setPickupSuggestions([]);
    } else {
      setDestination(suggestion);
      setDestinationSuggestions([]);
    }
  };

  return (
    <div className="h-screen relative overflow-hidden">
      {/* Logo */}
      <img
        src={uberLogo}
        className="w-24 absolute left-5 top-5 z-20"
        alt="Logo"
      />

      {/* Background Map */}
      <div className="h-screen w-screen">
        <LiveTracking />
      </div>

      {/* Sliding Panel */}
      <div
        className="absolute left-0 right-0 top-0 h-screen z-50 bg-white shadow-xl rounded-t-2xl overflow-hidden transition-transform duration-500 ease-in-out"
        style={{
          transform: isExpanded ? "translateY(0)" : "translateY(65%)",
        }}
        onClick={handleFocus}
      >
        {/* Close Button */}
        {isExpanded && (
          <button
            type="button"
            className="absolute top-5 right-5 text-gray-500 text-2xl z-10"
            onClick={handleClose}
          >
            <i className="ri-close-large-line"></i>
          </button>
        )}

        {/* Trip Form */}
        <div className="px-6 pt-10 pb-6 bg-white">
          {!isExpanded && (
            <h4 className="text-2xl font-semibold text-center mb-6 text-black">
              Find a trip
            </h4>
          )}

          <form onSubmit={handleSubmit}>
            <label className="block text-gray-700 font-medium">
              Pickup Location:
              <input
                type="text"
                value={pickup}
                onChange={handlePickupChange}
                placeholder="Enter pickup location"
                className="mt-2 block w-full bg-[#eeeeee] rounded-lg py-4 px-2 shadow-sm outline-none"
                disabled={isLoading}
                required
              />
            </label>

            <label className="block text-gray-700 font-medium mt-6">
              Destination:
              <input
                type="text"
                value={destination}
                onChange={handleDestinationChange}
                placeholder="Enter destination"
                className="mt-2 block w-full bg-[#eeeeee] rounded-lg py-4 px-2 shadow-sm outline-none"
                disabled={isLoading}
                required
              />
            </label>

            <button
              type="submit"
              onClick={getFareDetails}
              className={`mt-6 w-full bg-black text-white py-4 rounded-lg font-medium text-lg ${
                isLoading
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:bg-gray-800"
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Find Trip"
              )}
            </button>
          </form>
        </div>

        {/* Location suggestions */}
        <div className="px-6 pb-6">
          <div className="mt-10 text-gray-600">
            <LocationSearchPanel
              pickupSuggestions={pickupSuggestions}
              destinationSuggestions={destinationSuggestions}
              onSuggestionClick={(suggestion, type) => {
                if (type === "pickup") {
                  setPickup(suggestion);
                  setPickupSuggestions([]);
                } else {
                  setDestination(suggestion);
                  setDestinationSuggestions([]);
                }
                // setIsExpanded(false);
              }}
            />
          </div>
        </div>
      </div>

      {/* Booking options */}
      <div
        ref={vehiclePanelRef}
        className="mt-6 px-4 py-4 translate-y-100 fixed w-full bottom-0 z-[51] bg-white"
      >
        {panel === "vehicle" && (
          <VehiclePanel
            setPanel={setPanel}
            setSelectedVehicle={setSelectedVehicle}
            setFareDetails={setFareDetails}
            fareDetails={fareDetails} // Pass fareDetails as a prop
          />
        )}
      </div>

      {/* Confirm ride */}
      <div
        ref={confirmRideRef}
        className="mt-6 px-4 py-4 translate-y-100 fixed w-full bottom-0 z-[61] bg-white"
      >
        {panel === "confirm" && (
          <ConfirmRide 
          selectedVehicle={selectedVehicle} 
          setPanel={setPanel}
          getRideAndUserDetails={getRideAndUserDetails}
          pickup={pickup}
          destination={destination}
          // fareDetails={fareDetails} // Pass fareDetails
           />
        )}
      </div>

      {/* Vehicle found */}
      <div
        ref={vehicleFoundRef}
        className="mt-6 px-4 py-4 translate-y-100 fixed w-full bottom-0 z-61 bg-white"
      >
        {panel === "driver" && (
          <LookingForDriver
            selectedVehicle={selectedVehicle}
            setPanel={setPanel}
            setSkipToDriverPanel={setSkipToDriverPanel}
            pickup={pickup}
            destination={destination}
          />
        )}
      </div>

      {/* Waiting for driver */}
      {panel === "confirmRide" && (
        <div className="fixed bottom-0 left-0 right-0 z-[62] bg-white px-4 py-4">
          <WaitingForDriver 
          ride={ride}
          setPanel={setPanel} 
          />
        </div>
      )}
    </div>
  );
}

export default Home;

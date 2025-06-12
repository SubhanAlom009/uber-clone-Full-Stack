import React, { useContext, useEffect, useRef, useState } from "react";
import uberCar from "../assets/images/UberCar.webp";
import uberLogo from "../assets/images/uber-pic.png";
import uberMap from "../assets/images/Uber-map.webp";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

import CaptainDetails from "../components/CaptainDetails";
import RidePopUp from "../components/RidePopUp";
import ConfirmRidePopUp from "../components/ConfirmRidePopUp";
import { SocketContext } from "../context/SocketContext";
import { CaptainDataContext } from "../context/CaptainContext";
import axios from "axios";
import LiveTracking from "../components/LiveTracking";

function CaptainHome() {
  const [ridePopupPanel, setRidePopupPanel] = useState(false);
  const [confirmRidePopupPanel, setConfirmRidePopupPanel] = useState(false);
  const [ride, setRide] = useState(null);

  const ridePopupPanelRef = useRef(null);
  const confirmRidePopupPanelRef = useRef(null);

  const { sendMessage, receiveMessage, socket } = useContext(SocketContext);
  const { captain } = useContext(CaptainDataContext);

  useEffect(() => {
    if (!captain || !captain._id) {
      console.log("Captain data not yet available for location watching.");
      return; // Exit if captain data isn't ready
    }

    sendMessage("join", { userType: "captain", userId: captain._id });
    console.log("Captain joined, socket id:", captain.socketId);

    let watchId = null;

    if (navigator.geolocation) {
      console.log("Starting location watch...");
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          // Success Callback
          const { latitude, longitude } = position.coords;
          console.log("Location updated (watchPosition):", {
            latitude,
            longitude,
          });

          // No need to check captain._id again here if we checked at the start
          sendMessage("update-location-captain", {
            userId: captain._id,
            location: {
              ltd: latitude,
              lng: longitude,
            },
          });
        },
        (error) => {
          // Error Callback
          console.error(
            "Error watching geolocation:",
            error.message,
            "Code:",
            error.code
          );
        },
        {
          // Options
          enableHighAccuracy: true,
          timeout: 10000, // Increased timeout for watchPosition
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }

    // Cleanup function
    return () => {
      if (watchId !== null) {
        console.log("Stopping location watch, ID:", watchId);
        navigator.geolocation.clearWatch(watchId); // Use clearWatch for watchPosition
      }
    };
  }, [captain, sendMessage]); // Add sendMessage to dependencies if it's stable

  useEffect(() => {
    if (!socket) return;
    const handleNewRide = (data) => {
      console.log("New ride request received:", data);
      // You can update state here if needed
      setRide(data);
      setRidePopupPanel(true);
    };
    socket.on("new-ride", handleNewRide);

    // Cleanup to avoid duplicate listeners
    return () => {
      socket.off("new-ride", handleNewRide);
    };
  }, [socket]);

  useGSAP(() => {
    if (ridePopupPanel) {
      gsap.to(ridePopupPanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(ridePopupPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [ridePopupPanel]);

  useGSAP(() => {
    if (confirmRidePopupPanel) {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(confirmRidePopupPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [confirmRidePopupPanel]);

  const confirmRide = async () => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/ride/confirm`,
      {
        rideId: ride._id,
        captainId: captain._id,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    console.log("Ride confirmed:", response.data);

    setRidePopupPanel(false);
    setConfirmRidePopupPanel(true);
  };

  return (
    <div className="relative h-screen w-screen">
      <img
        src={uberLogo}
        className="w-24 absolute left-5 top-5 z-20"
        alt="Logo"
      />
      {/* Fullscreen Background Map */}
      <div className="h-screen w-screen">
        <LiveTracking />
      </div>

      {/* Foreground Content */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-6 space-y-6 bg-white bg-opacity-90 z-10">
        <CaptainDetails />
      </div>
      <div
        ref={ridePopupPanelRef}
        className="fixed bottom-0 left-0 right-0 z-[62] bg-white px-4 py-4 translate-y-full"
      >
        <RidePopUp
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
          ride={ride}
          confirmRide={confirmRide}
        />
      </div>
      <div
        ref={confirmRidePopupPanelRef}
        className="fixed bottom-0 left-0 right-0 z-[62] bg-white px-4 py-4 translate-y-full"
      >
        <ConfirmRidePopUp
          ride={ride}
          setRidePopupPanel={setRidePopupPanel}
          setConfirmRidePopupPanel={setConfirmRidePopupPanel}
        />
      </div>
    </div>
  );
}

export default CaptainHome;

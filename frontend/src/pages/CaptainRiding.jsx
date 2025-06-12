import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import uberLogo from "../assets/images/uber-pic.png";
import uberMap from "../assets/images/Uber-map.webp";
import FinishRide from "../components/FinishRide";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { SocketContext } from "../context/SocketContext";
import LiveTracking from "../components/LiveTracking";

function CaptainRiding() {
  const location = useLocation();
  const ride = location.state?.ride;

  const [finishRidePanel, setFinishRidePanel] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const finishRidePopupPanelRef = useRef(null);

  const { socket } = useContext(SocketContext); // Add this line
  const navigate = useNavigate(); // Add this line

  useEffect(() => {
    if (!socket) return;

    const handleRideEnded = (data) => {
      console.log("Ride ended (captain):", data);
      navigate("/captain-home"); // Or "/home" if you want
    };

    socket.on("ride-ended", handleRideEnded);

    return () => {
      socket.off("ride-ended", handleRideEnded);
    };
  }, [socket, navigate]);

  useGSAP(() => {
    if (finishRidePanel) {
      gsap.to(finishRidePopupPanelRef.current, {
        transform: "translateY(0)",
      });
    } else {
      gsap.to(finishRidePopupPanelRef.current, {
        transform: "translateY(100%)",
      });
    }
  }, [finishRidePanel]);

  useGSAP(() => {
    if (isExpanded) {
      gsap.to(finishRidePopupPanelRef.current, {
        height: "70vh",
        duration: 0.2,
        ease: "power2.out",
      });
    } else {
      gsap.to(finishRidePopupPanelRef.current, {
        height: "25vh",
        duration: 0.2,
        ease: "power2.inOut",
      });
    }
  }, [isExpanded]);

  return (
    <div className="h-screen">
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
      <div
        ref={finishRidePopupPanelRef}
        className="absolute bottom-0 left-0 right-0 bg-white z-50 overflow-hidden transition-all rounded-t-2xl shadow-lg"
        style={{ height: "25vh" }}
      >
        {/* Expand/Collapse Arrow */}
        <div
          className="flex justify-center items-center py-2 border-b-2 border-gray-200 cursor-pointer"
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          <i
            className={`text-2xl ri-arrow-up-wide-line transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          ></i>
        </div>

        {/* Finish Ride Details (Reveal on Expand) */}
        <div
          className={`transition-opacity duration-300 `}
        >
          <FinishRide 
          ride={ride}
          />
        </div>
      </div>
    </div>
  );
}

export default CaptainRiding;

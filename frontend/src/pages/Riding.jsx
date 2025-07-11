import React, { useContext, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import uberCar from "../assets/images/UberCar.webp";
import { SocketContext } from "../context/SocketContext";
import { useNavigate } from "react-router-dom";
import LiveTracking from "../components/LiveTracking";

function Riding() {
  const location = useLocation();
  const ride = location.state?.ride;

  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!socket) return;

    const handleRideEnded = (data) => {
      console.log("Ride ended:", data);
      navigate("/home");
    };

    socket.on("ride-ended", handleRideEnded);

    // Cleanup listener on unmount
    return () => {
      socket.off("ride-ended", handleRideEnded);
    };
  }, [navigate, socket]);

  return (
    <div className="relative h-screen w-screen">
      {/* Fullscreen Background Map */}
      <div className="h-screen w-screen">
        <LiveTracking />
      </div>

      {/* Background Overlay */}
      <Link
        to="/home"
        className="absolute bg-[#eeeeee] border-2 border-gray-300 px-2 py-1 text-black rounded-full right-8 top-8"
      >
        <i className="ri-home-5-line"></i>
      </Link>

      {/* Foreground Content */}
      <div className="absolute bottom-0 left-0 right-0 px-6 py-6 space-y-6 bg-white bg-opacity-90 z-10">
        {/* Driver info */}
        <div className="flex items-center justify-between gap-4 p-4 bg-gray-100 rounded-xl">
          <img
            src={uberCar}
            alt="Driver"
            className="w-20 h-20 object-cover rounded-md"
          />
          <div className="text-left">
            {ride?.captain?.fullname?.firstname ||
            ride?.captain?.fullname?.lastname ? (
              <p className="font-semibold text-gray-500 text-lg">
                {ride?.captain?.fullname?.firstname}{" "}
                {ride?.captain?.fullname?.lastname}
              </p>
            ) : null}
            {ride?.captain?.vehicle?.plate ? (
              <p className=" text-2xl font-bold">
                {ride?.captain?.vehicle?.plate}
              </p>
            ) : null}
          </div>
        </div>

        {/* Location info */}
        <div className="flex items-center gap-4 text-lg font-semibold">
          <i className="ri-map-pin-user-fill text-xl"></i>
          <div className="flex flex-col items-start">
            {ride?.destination && (
              <span className="text-gray-500 text-sm">{ride?.destination}</span>
            )}
          </div>
          <br />
          <div className="flex flex-col ">
            {ride?.fare && <p className="text-2xl">₹{ride?.fare}</p>}
            <p className="text-gray-500">Cash</p>
          </div>
        </div>

        {/* Make Payment Button */}
        <button className="mt-4 bg-red-500 w-full hover:bg-red-600 text-white font-semibold px-6 py-3 rounded-lg">
          Make Payment
        </button>
      </div>
    </div>
  );
}

export default Riding;

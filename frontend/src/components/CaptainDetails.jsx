import React, { useContext, useEffect } from "react";
import captainPic from "../assets/images/captain-pic.jpeg";
import { CaptainDataContext } from "../context/CaptainContext";

function CaptainDetails() {
  const { captain, setCaptain } = useContext(CaptainDataContext);

  useEffect(() => {
    console.log("Captain context updated:", captain);
  }, [captain]);
  return (
    <div>
      {/* Driver info */}
      <div className="flex items-center justify-between gap-4 p-4 bg-gray-100 rounded-xl">
        <img
          src={captainPic}
          alt="Driver"
          className="w-20 h-20 object-cover rounded-full"
        />
        <div className="text-left">
          <p className="font-semibold mb-2 text-gray-500 text-lg">
            {captain?.fullname?.firstname} {captain?.fullname?.lastname}
          </p>
          <p className=" text-2xl font-bold">₹995</p>
          <p className="text-sm text-gray-500">Earned</p>
        </div>
      </div>
      <hr className="my-4 text-gray-400" />

      {/* captain dashboard */}
      <div className="flex mb-8 bg-gray-200 p-4 rounded-lg items-center justify-evenly gap-4 text-lg font-semibold">
        <div className="flex flex-col items-center text-center">
          <i className="ri-timer-2-line text-gray-800 text-4xl"></i>
          <p className="font-bold text-2xl">10.2</p>
          <p className="text-slate-500 text-sm">Hours Online</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <i className="ri-time-line text-gray-800 text-4xl"></i>
          <p className="font-bold text-2xl">10.2</p>
          <p className="text-slate-500 text-sm">Hours Online</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <i className="ri-booklet-line text-gray-800 text-4xl"></i>
          <p className="font-bold text-2xl">10.2</p>
          <p className="text-slate-500 text-sm">Hours Online</p>
        </div>
      </div>
    </div>
  );
}

export default CaptainDetails;

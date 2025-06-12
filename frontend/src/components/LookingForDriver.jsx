import React from "react";

function LookingForDriver({
  selectedVehicle,
  setSkipToDriverPanel,
  pickup,
  destination,
}) {
  if (!selectedVehicle) return null;

  return (
    <div className="flex flex-col items-center justify-center px-4 py-6 space-y-6">
      {/* Animated loading bar */}
      <div className="w-full h-1 bg-gray-200 relative overflow-hidden rounded">
        <div className="absolute w-1/3 h-full bg-blue-500 animate-loadingBar"></div>
      </div>

      {/* Vehicle icon with radar pulse */}
      <div className="relative mt-6">
        <img
          src={selectedVehicle?.image}
          alt={selectedVehicle?.name}
          className="w-28 mx-auto z-10 relative"
        />
        <span className="absolute top-1/2 left-1/2 w-32 h-32 bg-blue-300 opacity-70 rounded-full animate-ping -translate-x-1/2 -translate-y-1/2"></span>
      </div>

      <h2 className="text-xl font-semibold text-gray-700">
        Looking for nearby drivers...
      </h2>

      <div>
        <div className="flex pb-4 leading-5 items-center gap-6 text-lg font-semibold">
          <i className="ri-map-pin-user-fill text-xl"></i>
          <div>
            <span className="block text-gray-500">{pickup}</span>
          </div>
        </div>
        <div className="flex pb-4 leading-5 items-center gap-6 text-lg font-semibold">
          <i className="ri-map-pin-2-fill text-xl"></i>
          <div>
            <span className="block text-gray-500">{destination}</span>
          </div>
        </div>
        <div className="text-lg flex gap-6 font-semibold">
          <i className="ri-currency-line"></i>
          <div className="flex flex-col ">
            <p className="text-2xl text-gray-500">₹{selectedVehicle.price}</p>
            <p className="text-gray-500">Cash</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LookingForDriver;

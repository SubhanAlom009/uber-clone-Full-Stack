import React from "react";
import uberCar from "../assets/images/UberCar.webp";
import uberAuto from "../assets/images/UberAuto.webp";
import uberMoto from "../assets/images/UberMoto.webp";

function VehiclePanel(props) {
  const vehicles = [
    {
      name: "UberGo",
      selectedVehicle:"car",
      image: uberCar,
      capacity: 4,
      price: props.fareDetails?.fare?.car?.toFixed(2) || "processing",
      description: "Affordable, compact rides",
      eta: "2 mins away",
    },
    {
      name: "Moto",
      selectedVehicle:"motorcycle",
      image: uberMoto,
      capacity: 1,
      price: props.fareDetails?.fare?.motorcycle?.toFixed(2) || "processing",
      description: "Affordable motorcycle rides",
      eta: "3 mins away",
    },
    {
      name: "UberAuto",
      selectedVehicle:"auto",
      image: uberAuto,
      capacity: 3,
      price: props.fareDetails?.fare?.auto?.toFixed(2) || "processing",
      description: "Affordable Auto rides",
      eta: "3 mins away",
    },
  ];

  console.log("Fare details in VehiclePanel:", props.fareDetails); // Debugging line to check fareDetails

  return (
    <div>
      <h4 className="text-2xl font-semibold mb-4 text-black">
        Choose a vehicle
      </h4>

      <div className="space-y-3">
        {vehicles.map((vehicle, index) => (
          <div
            key={index}
            onClick={() => {
              props.setSelectedVehicle(vehicle);
              props.setPanel("confirm");
            }}
            className="flex border-2 border-gray-300 active:border-gray-600 items-center justify-between px-4 py-3 rounded-xl shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-3">
              <img src={vehicle.image} alt={vehicle.name} className="w-18" />
              <div>
                <p className="font-medium text-base text-black">
                  {vehicle.name} <i className="ri-user-fill"></i>
                  <span>{vehicle.capacity}</span>
                </p>
                <p className="text-sm font-semibold">{vehicle.eta}</p>
                <p className="text-sm text-gray-500">{vehicle.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-lg font-semibold text-black">
                ₹{vehicle.price}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehiclePanel;

function ConfirmRide({ selectedVehicle,setPanel,getRideAndUserDetails,pickup,destination }) {
  if (!selectedVehicle) return null; // If no vehicle is selected, return nothing

  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">Confirm your ride</h1>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col items-center justify-center">
            <img
            src={selectedVehicle.image}
            alt={selectedVehicle.name}
            className="w-50"
            />
        </div>
        <div className="mt-4 mx-4 space-y-6">
            <div className="flex border-b border-gray-400 pb-4 leading-5 items-center gap-6 text-lg font-semibold">
                <i className="ri-map-pin-user-fill text-xl"></i>
                <div>
                   <span className="block text-gray-500">{pickup}</span> 
                </div>
            </div>
            <div className="flex border-b border-gray-400 pb-4 leading-5 items-center gap-6 text-lg font-semibold">
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
        <div>
            <button 
            onClick={() => {
              getRideAndUserDetails(selectedVehicle.selectedVehicle); // Pass the selected vehicle type to the function
              setPanel("driver"); // or whatever panel comes next (like a success page)
            }}
            className="bg-blue-500 w-full text-white py-2 px-4 text-lg font-semibold cursor-pointer rounded-lg mt-6">Confirm</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmRide;

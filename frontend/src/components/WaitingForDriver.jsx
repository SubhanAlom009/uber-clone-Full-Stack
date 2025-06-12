import React from 'react';
import uberCar from '../assets/images/UberCar.webp';

function WaitingForDriver({ ride, setPanel }) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-6 space-y-6">
      {/* Header */}
      <div className='flex items-center justify-between w-full mb-4'>
        <h2 className="text-lg font-semibold text-gray-800">Meet at the pick up point</h2>
        <div className='bg-black p-4 rounded text-white'>
          <p className='flex flex-col'>2 Min</p>
        </div>
      </div>

      {/* Driver info */}
      <div className="flex bg-gray-200 rounded-lg items-center justify-between gap-4 p-4  w-full">
        <img
          src={uberCar}
          alt="Driver"
          className="w-20 h-20 object-cover"
        />
        <div className="text-left">
          <p className="font-semibold text-gray-500 text-lg capitalize">{ride?.captain.fullname.firstname} {ride?.captain.fullname.lastname}</p>
          <p className=" text-md text-gray-500 font-bold">{ride?.captain.vehicle.plate}</p>
          <p className="text-xl font-semibold ">{ride?.otp}</p>
        </div>
      </div>

      <div className="flex border-gray-400 pb-4 leading-5 text-left gap-6 text-lg font-semibold">
          <i className="ri-map-pin-user-fill text-xl"></i>
          <div className='flex flex-col items-start'>
              <span className="block text-gray-500">{ride?.pickup}</span> 
          </div>
      </div>

      <div className="flex border-gray-400 pb-4 leading-5 text-left gap-6 text-lg font-semibold">
          <i className="ri-map-pin-user-fill text-xl"></i>
          <div className='flex flex-col items-start'>
              <span className="block text-gray-500">{ride?.destination}</span> 
          </div>
      </div>

      <div className="flex w-full border-gray-400 pb-4 leading-5 text-left gap-6 text-lg font-semibold">
          <h3 className='text-3xl text-green-500 font-medium'>₹ {ride?.fare}</h3>
      </div>

      {/* Cancel Ride Button */}
      <button
        className="mt-6 bg-red-500 w-full hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-lg"
        onClick={() => setPanel('none')}
      >
        Cancel Ride
      </button>
    </div>
  );
}

export default WaitingForDriver;

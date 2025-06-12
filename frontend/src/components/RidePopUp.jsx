import React from 'react'
import captainPic from "../assets/images/captain-pic.jpeg";

function RidePopUp(props) {
  return (
    <div>
      <h1 className="text-3xl font-semibold mb-4">New Ride Available</h1>
      <div className="flex flex-col gap-4">
        <div className='bg-yellow-400 p-4 rounded-xl'>
            <div className="flex items-center justify-between gap-4">
                <div className='flex items-center gap-4'>
                    <img src={captainPic} alt="Captain" className="w-16 h-16 rounded-full" />
                    <p className="font-semibold text-lg">{props.ride?.user.fullname.firstname + " " + props.ride?.user.fullname.lastname}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <p className="text-gray-500 text-lg">2.2 KM</p>
                </div>
            </div>
        </div>
        <div className="mt-4 mx-4 space-y-6">
            <div className="flex border-b border-gray-400 pb-4 leading-5 items-center gap-6 text-lg font-semibold">
                <i className="ri-map-pin-user-fill text-xl"></i>
                <div>
                   <span className="block text-gray-500">{props.ride?.pickup}</span> 
                </div>
            </div>
            <div className="flex border-b border-gray-400 pb-4 leading-5 items-center gap-6 text-lg font-semibold">
                <i className="ri-map-pin-2-fill text-xl"></i>
                <div>
                   <span className="block text-gray-500">{props.ride?.destination}</span> 
                </div>
            </div>
            <div className="text-lg flex gap-6 font-semibold">
                <i className="ri-currency-line"></i>
                <div className="flex flex-col ">
                    <p className="text-2xl">₹{props.ride?.fare}</p>
                    <p className="text-gray-500">Cash</p>
                </div>
            </div>
        </div>
        <div className='flex flex-col '>
            <button 
            onClick={() => {
                props.setRidePopupPanel(false);
                props.setConfirmRidePopupPanel(true);
                props.confirmRide()
            }}
            className="bg-blue-500 w-full text-white py-2 px-4 text-lg font-semibold cursor-pointer rounded-lg mt-6">Accept</button>
            <button 
            onClick={() => props.setRidePopupPanel(false)}
            className="bg-gray-300 w-full text-black py-2 px-4 text-lg font-semibold cursor-pointer rounded-lg mt-3">Ignore</button>
        </div>
      </div>
    </div>
  )
}

export default RidePopUp

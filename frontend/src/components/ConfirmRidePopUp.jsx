import React from "react";
import captainPic from "../assets/images/captain-pic.jpeg";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";

function ConfirmRidePopUp(props) {

    const [otp, setOtp] = React.useState("");

    const navigate = useNavigate();

    const submitHnadler = async (e)=>{
        e.preventDefault();

        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/ride/start-ride`,
        {
            params: {
                otp: otp,
                rideId: props.ride._id,
            },
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })

        console.log("Ride confirmed:", response.data);
        if(response.data.ride){
            props.setConfirmRidePopupPanel(false);
            props.setRidePopupPanel(false);
            navigate("/captain-riding", { state: { ride: response.data.ride } });
        } else {
            alert("Failed to confirm ride. Please check your OTP and try again.");
        }
    }

  return (
    <div className="">
      <h1 className="text-3xl font-semibold mb-4">Confirm ride to start</h1>
      <div className="flex flex-col gap-4">
        <div className="bg-yellow-400 p-4 rounded-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <img
                src={captainPic}
                alt="Captain"
                className="w-16 h-16 rounded-full"
              />
              <p className="font-semibold text-lg capitalize">
                {props.ride?.user.fullname.firstname} {props.ride?.user.fullname.lastname}
              </p>
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
              <span className="block text-gray-500">
                {props.ride?.pickup}
              </span>
            </div>
          </div>
          <div className="flex border-b border-gray-400 pb-4 leading-5 items-center gap-6 text-lg font-semibold">
            <i className="ri-map-pin-2-fill text-xl"></i>
            <div>
              <span className="block text-gray-500">
                {props.ride?.destination}
              </span>
            </div>
          </div>
          <div className="text-lg flex gap-6 font-semibold">
            <i className="ri-currency-line"></i>
            <div className="flex flex-col ">
              <p className="text-2xl">₹ {props.ride?.fare}</p>
              <p className="text-gray-500">Cash</p>
            </div>
          </div>
        </div>
        <div className="flex flex-col ">
          <form onSubmit={submitHnadler} className="w-full flex flex-col">
            <label className="block text-center text-2xl text-gray-700 font-medium">
              OTP
              <input
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                type="number"
                placeholder="Enter OTP"
                className="mt-2 block w-full bg-[#eeeeee] rounded-lg py-4 px-2 shadow-sm outline-none"
                required
              />
            </label>
            <button type="submit" className="bg-blue-500 text-center w-full text-white py-2 px-4 text-lg font-semibold cursor-pointer rounded-lg mt-6">
                Confirm
            </button>
            {/* <button
                onClick={() => props.setConfirmRidePopupPanel(false)}
                className="bg-gray-300 w-full text-black py-2 px-4 text-lg font-semibold cursor-pointer rounded-lg mt-3"
            >
                Cancel
            </button> */}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ConfirmRidePopUp;

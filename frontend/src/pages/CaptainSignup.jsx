import React, { useContext, useState } from 'react'
import uberLogo from '../assets/images/uber-pic.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { CaptainDataContext } from '../context/CaptainContext'
function CaptainSignup() {

    const [authData,setAuthData] = useState({
      
      fullname:{
        firstname: '',
        lastname: ''
      },
      email: '',
      password: '',
      vehicle: {
        color: '',
        plate: '',
        capacity: '',
        vehicleType: ''
      }
    })

    const navigate = useNavigate();

    const {captain,setCaptain} = useContext(CaptainDataContext);
    
      const submitHandler = async (e)=>{
        e.preventDefault();
        
        try {

          const userData = {
            fullname: {
              firstname: authData.fullname.firstname,
              lastname: authData.fullname.lastname
            },
            email: authData.email,
            password: authData.password,
            vehicle: {
              color: authData.vehicle.color,
              plate: authData.vehicle.plate,
              capacity: authData.vehicle.capacity,
              vehicleType: authData.vehicle.vehicleType
            }
          }

          console.log("Captain signup data",userData);
          const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captain/register`,userData)

          console.log("Captain signup response",response.data);

          if (response.status === 200 || response.status === 201) {
            const data = response.data;

            setCaptain(data.captain); // Update captain state
            console.log("Updated captain state:", data.captain); // Debugging log

            localStorage.setItem("token", data.token);

            navigate("/captain-home");
          }
          console.log("Captain context is updated:",captain);
          
          setAuthData({
            fullname: {
              firstname: '',
              lastname: '',
            },
            email: '',
            password: '',
            vehicle: {
              color: '',
              plate: '',
              capacity: '',
              vehicleType: '',
            },
          });
        } catch (error) {
          console.log("Captain signup failed",error);
          alert(error.response?.data?.message);
        }
        
      }

  return (
    <div className='h-screen flex flex-col justify-between pb-8'>
      <div>
        <div className='p-6'>
          <img src={uberLogo} className='w-24 ' alt="Logo" />
        </div>
        <form onSubmit={submitHandler} className='flex px-6 space-y-4 mt-5 flex-col justify-center'>

          <h3 className='text-lg mb-2 font-semibold'>Captain name</h3>
          <div className='flex w-full gap-4'>
            <input 
              type="text" 
              value={authData.fullname.firstname}
              onChange={(e) => setAuthData({ ...authData, fullname:{
                ...authData.fullname,
                firstname: e.target.value
              }})}
              placeholder='First name'
              className="px-2 py-4 bg-[#eeeeee] rounded-lg outline-none" 
             />
            <input 
              type="text" 
              value={authData.fullname.lastname}
              onChange={(e) => setAuthData({ ...authData, fullname:{
                ...authData.fullname,
                lastname: e.target.value
              } })} 
              placeholder='Last name'
              className="px-2 py-4 bg-[#eeeeee] rounded-lg outline-none" 
             />
          </div>
          <h3 className='text-lg mb-2 font-semibold'>Captain email</h3>
          <input 
            required 
            value={authData.email}
            onChange={(e)=>setAuthData({
              ...authData,
              email:e.target.value
            })}
            type="email" 
            className="px-2 py-4 bg-[#eeeeee] rounded-lg outline-none" 
            placeholder='email@example.com' 
          />
          <h3 className='text-lg mb-2 font-semibold'>Captain password</h3>
          <input 
            required 
            value={authData.password}
            onChange={(e)=>setAuthData({
              ...authData,
              password:e.target.value
            })}
            type="password" 
            className="px-2 py-4 bg-[#eeeeee] rounded-lg outline-none" 
            placeholder='password' 
          />
          <h3 className='text-lg mb-2 font-semibold'>Vehicle Details</h3>
          <div className='grid grid-cols-2 sm:grid-cols-2 gap-4'>
            <input 
              required 
              value={authData.vehicle.color}
              onChange={(e) => setAuthData({
                ...authData,
                vehicle: {
                  ...authData.vehicle,
                  color: e.target.value
                }
              })}
              type="text" 
              className="px-2 py-4 bg-[#eeeeee] rounded-lg outline-none w-full" 
              placeholder='Vehicle color' 
            />
            <input 
              required 
              value={authData.vehicle.plate}
              onChange={(e) => setAuthData({
                ...authData,
                vehicle: {
                  ...authData.vehicle,
                  plate: e.target.value
                }
              })}
              type="text" 
              className="px-2 py-4 bg-[#eeeeee] rounded-lg outline-none w-full" 
              placeholder='Vehicle plate' 
            />
            <input 
              required 
              value={authData.vehicle.capacity}
              onChange={(e) => setAuthData({
                ...authData,
                vehicle: {
                  ...authData.vehicle,
                  capacity: e.target.value
                }
              })}
              type="number" 
              className="px-2 py-4 bg-[#eeeeee] rounded-lg outline-none w-full" 
              placeholder='Vehicle capacity' 
            />
            <select
              required
              value={authData.vehicle.vehicleType}
              onChange={(e) => setAuthData({
                ...authData,
                vehicle: {
                  ...authData.vehicle,
                  vehicleType: e.target.value
                }
              })}
              className="px-2 py-4 bg-[#eeeeee] rounded-lg outline-none w-full"
            >
              <option value="" disabled>Select vehicle type</option>
              <option value="auto">Auto</option>
              <option value="car">Car</option>
              <option value="motorcycle">Motorcycle</option>
            </select>
          </div>
          <button className='px-2 text-center py-4 bg-black text-white rounded-lg font-medium text-xl' type='submit'>Sign Up as Captain</button>
        </form>
        <Link to={'/captain-login'}>
          <p className='text-center text-gray-500 mt-4'>Already have an account? <span className='text-black font-medium'>Login</span></p>
        </Link>
      </div>
      <div>
        <Link to={'/signup'}>
          <p className='text-center text-black bg-[#a7a7a7] font-semibold py-4 mx-6 rounded-lg'>Sign up as a user</p>
        </Link>
      </div>
    </div>
  )
}

export default CaptainSignup

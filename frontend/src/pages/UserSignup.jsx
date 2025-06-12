import React, { useContext, useState } from 'react'
import uberLogo from '../assets/images/uber-pic.png'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserDataContext } from '../context/userContext'

function UserSignup() {

    const [authData,setAuthData] = useState({
      
      fullname:{
        firstname: '',
        lastname: ''
      },
      email: '',
      password: ''
    })

    const {user,setUser} = useContext(UserDataContext);

    const naviate = useNavigate();
  
    const submitHandler = async (e)=>{
      e.preventDefault();
      
      try {

        const userData = {
          fullname: {
            firstname: authData.fullname.firstname,
            lastname: authData.fullname.lastname
          },
          email: authData.email,
          password: authData.password
        }
        

        console.log("Sending userData:", JSON.stringify(userData, null, 2));
        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/register`,userData)

        console.log("Response from server:", response.data);

        setAuthData({
          fullname:{
            firstname: '',
            lastname: ''
          },
          email: '',
          password: ''
        })
        if(response.status === 200 || response.status === 201){
          const data = response.data;

          setUser(data.user);

          localStorage.setItem('token', data.token);
          
          naviate('/home')
        }

      } catch (error) {
        const message = error.response?.data?.message || "Signup failed. Try again.";
        alert(message);
      }
      
    }

  return (
    <div className='h-screen flex flex-col justify-between pb-8'>
      <div>
        <div className='p-6'>
          <img src={uberLogo} className='w-24 ' alt="Logo" />
        </div>
        <form onSubmit={submitHandler} className='flex px-6 space-y-4 mt-5 flex-col justify-center'>

          <h3 className='text-lg mb-2 font-semibold'>Enter your name</h3>
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
          <h3 className='text-lg mb-2 font-semibold'>Enter your email</h3>
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
          <h3 className='text-lg mb-2 font-semibold'>Enter your password</h3>
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
          <button className='px-2 text-center py-4 bg-black text-white rounded-lg font-medium text-xl' type='submit'>Sign Up</button>
        </form>
        <Link to={'/login'}>
          <p className='text-center text-gray-500 mt-4'>Already have an account? <span className='text-black font-medium'>Login</span></p>
        </Link>
      </div>
      <div>
        <Link to={'/captain-signup'}>
          <p className='text-center text-black bg-[#a7a7a7] font-semibold py-4 mx-6 rounded-lg'>Sign up as a captain</p>
        </Link>
      </div>
    </div>
  )
}

export default UserSignup

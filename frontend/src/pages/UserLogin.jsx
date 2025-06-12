import React, { useContext, useState } from 'react'
import uberLogo from '../assets/images/uber-pic.png'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { UserDataContext } from '../context/userContext'

function UserLogin() {

  const [authData,setAuthData] = useState({
    email: '',
    password: ''
  })

  const navigate = useNavigate();

  const {user,setUser} = useContext(UserDataContext);

  const submitHandler = async (e)=>{
    e.preventDefault();

    try {

      const userData = {
        email: authData.email,
        password: authData.password
      }

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/user/login`,userData)

      console.log("Response from server:", response.data);

      if(response.status === 200 || response.status === 201){
        const data = response.data;

        setUser(data.user);

        localStorage.setItem('token', data.token);
        
        navigate("/home");
      }
      
      setAuthData({
        email: '',
        password: ''
      })

    } catch (error) {
      const message = error.response?.data?.message || "Login failed. Try again.";
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
          <button className='px-2 text-center py-4 bg-black text-white rounded-lg font-medium text-xl' type='submit'>Login</button>
        </form>
        <Link to={'/signup'}>
          <p className='text-center text-gray-500 mt-4'>Don't have an account? <span className='text-black font-medium'>Sign up</span></p></Link>
      </div>
      <div>
        <Link to={'/captain-login'}>
          <p className='text-center text-black bg-[#a7a7a7] font-semibold py-4 mx-6 rounded-lg'>Sign in as a captain</p>
        </Link>
      </div>
    </div>
  )
}

export default UserLogin

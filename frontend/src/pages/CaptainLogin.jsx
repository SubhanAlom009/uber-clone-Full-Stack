import React, { useContext, useEffect, useState } from 'react';
import uberLogo from '../assets/images/uber-pic.png';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';

function CaptainLogin() {
  const [authData, setAuthData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const {captain,setCaptain} = useContext(CaptainDataContext);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {

      const userData = {
        email: authData.email,
        password: authData.password
      }

      console.log("Captain login data",userData);
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captain/login`, userData)

      console.log("Captain login response",response.data);

      if(response.status === 200 || response.status === 201){
        const data = response.data;
        setCaptain(data.captain); // Update captain state
        console.log("Updated captain state:", data.captain); // Debugging log

        localStorage.setItem('token', data.token);
        
        navigate("/captain-home");
      }
      console.log("Captain context is updated:",captain);
      

      setAuthData({
        email: '',
        password: ''
      });
      
    } catch (error) {
      console.log("Captain login failed",error);
      alert(error.response?.data?.message);
    }
  };

  useEffect(() => {
    console.log("Captain context updated:", captain);
  }, [captain]);

  return (
    <div className='h-screen flex flex-col justify-between pb-8'>
      <div>
        <div className='p-6'>
          <img src={uberLogo} className='w-24' alt="Logo" />
        </div>
        <form onSubmit={submitHandler} className='flex px-6 space-y-4 mt-5 flex-col justify-center'>
          <h3 className='text-lg mb-2 font-semibold'>Captain Email</h3>
          <input 
            required 
            value={authData.email}
            onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
            type="email" 
            className="px-2 py-4 bg-[#eeeeee] rounded-lg outline-none" 
            placeholder='captain@example.com' 
          />
          <h3 className='text-lg mb-2 font-semibold'>Captain Password</h3>
          <input 
            required 
            value={authData.password}
            onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
            type="password" 
            className="px-2 py-4 bg-[#eeeeee] rounded-lg outline-none" 
            placeholder='password' 
          />
          <button 
            type="submit" 
            className='px-2 text-center py-4 bg-black text-white rounded-lg font-medium text-xl'
          >
            Login as Captain
          </button>
        </form>

        <Link to={'/captain-signup'}>
          <p className='text-center text-gray-500 mt-4'>
            Not a captain yet? <span className='text-black font-medium'>Register now!</span>
          </p>
        </Link>
      </div>
      <div>
        <Link to={'/login'}>
          <p className='text-center text-black bg-[#a7a7a7] font-semibold py-4 mx-6 rounded-lg'>Sign in as a user</p>
        </Link>
      </div>
    </div>
  );
}

export default CaptainLogin;

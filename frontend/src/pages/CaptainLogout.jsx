import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CaptainLogout() {

    const navigate = useNavigate()

    useEffect(() => {
        const captainLogout = async ()=>{
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/captain/logout`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if(res.status === 200 || res.status === 201){
                    localStorage.removeItem("token");
                    navigate("/captain-login");
                }
            } catch (error) {
                console.log("Logout failed:",error);
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/captain-login");
                }
            }
        }

        captainLogout();

    },[navigate])

  return (
    <div className="flex items-center justify-center h-screen text-lg font-semibold">
    Logging captain out...
  </div>
  )
}

export default CaptainLogout

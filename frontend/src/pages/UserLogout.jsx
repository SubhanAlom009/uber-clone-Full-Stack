import React, { useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function UserLogout() {

    const navigate = useNavigate();

    useEffect(()=>{
        const logoutUser = async ()=>{

            const token = localStorage.getItem('token');

            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/logout`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (res.status === 200 || res.status === 201) {
                    localStorage.removeItem("token");
                    navigate("/login");
                  }
            } catch (error) {   
                console.log("Logout failed:",error);
                if (error.response?.status === 401) {
                    localStorage.removeItem("token");
                    navigate("/login");
                }
            }
        }
        logoutUser();
    },[navigate])
    
  return (
    <div className="flex items-center justify-center h-screen text-lg font-semibold">
      Logging you out...
    </div>
  )
}

export default UserLogout

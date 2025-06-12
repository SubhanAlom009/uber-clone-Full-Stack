import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import { CaptainDataContext } from '../context/CaptainContext';

function CaptainProtectedWrapper({children}) {

    const navigate = useNavigate();

    const {captain, setCaptain} = useContext(CaptainDataContext);

    useEffect(()=>{

        const token = localStorage.getItem('token');
        if(!token ) {
            navigate('/captain-login');
        }

        const getCaptain = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/captain/profile`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(res.status === 200 || res.status === 201) {
                    setCaptain(res.data.captain);

                } else {
                    return null;
                }
            } catch (error) {
                console.log("Error in getting captain:", error);
                localStorage.removeItem("token");
                navigate("/captain-login");
            }
        }
        getCaptain();

    },[navigate])

    

  return (
    <div>
      {children}
    </div>
  )
}

export default CaptainProtectedWrapper

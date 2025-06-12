import axios from 'axios';
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { UserDataContext } from '../context/userContext';

function UserProtectedWrapper({children}) {
    
    const navigate = useNavigate();

    const {user, setUser} = useContext(UserDataContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token ) {
            navigate('/login');
        }

        const getUser = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/user/profile`,{
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if(res.status === 200 || res.status === 201) {
                    setUser(res.data.user);
                } else {
                    return null;
                }
            } catch (error) {
                console.log("Error in getting user:", error);
                localStorage.removeItem("token");
                navigate("/login");
            }
        }
        getUser();

    }, [navigate]);


  return (
    <div>
      {children}
    </div>
  )
}

export default UserProtectedWrapper

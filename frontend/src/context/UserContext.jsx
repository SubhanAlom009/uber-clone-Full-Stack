import React, { createContext, useState } from 'react'

export const UserDataContext = createContext();

const UserContext = ({children}) => {

  const [user,setUser] = useState({
    fullname:{
      firstname: '',
      lastname: ''
    },
    email: '',
  })

  return (
    <UserDataContext.Provider value={{user,setUser}}>
      {children}
    </UserDataContext.Provider>
  )
}

export default UserContext

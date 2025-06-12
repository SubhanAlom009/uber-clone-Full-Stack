import React, { createContext, useEffect, useState } from "react";
import axios from "axios";

export const CaptainDataContext = createContext();

function CaptainContext({ children }) {
  const [captain, setCaptain] = useState(null);

  return (
    <CaptainDataContext.Provider value={{ captain, setCaptain }}>
      {children}
    </CaptainDataContext.Provider>
  );
}

export default CaptainContext;
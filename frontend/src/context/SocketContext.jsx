import React, { createContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export const SocketContext = createContext();

const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_BASE_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = (eventName, data) => {
    if (socket) {
      socket.emit(eventName, data);
    }
  };

  const receiveMessage = (eventName, callback) => {
    if (socket) {
      socket.on(eventName, callback);
    }
  };

  return (
    <SocketContext.Provider value={{ sendMessage, receiveMessage, socket, setSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;

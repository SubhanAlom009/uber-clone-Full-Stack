import { Server } from 'socket.io';
import { User } from './models/user.model.js';
import { Captain } from './models/captain.model.js';

let io;

export function initializeSocketId(server) {
  io = new Server(server, {
    cors: {
      origin: '*', // Adjust this to your frontend's URL
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join', async (data) => {
        const { userId, userType } = data;

        if (userType === 'user') {
            await User.findByIdAndUpdate(userId, { socketId: socket.id });
            console.log(`User ${userId} joined with socket ID: ${socket.id}`);
        } else if (userType === 'captain') {
            await Captain.findByIdAndUpdate(userId, { socketId: socket.id });
            console.log(`Captain ${userId} joined with socket ID: ${socket.id}`);
        } else {
            console.error('Invalid user type:', userType);
        }
    })

    socket.on('update-location-captain', async (data) => {
      const { userId, location } = data;

      if(!location || !location.ltd || !location.lng){
        console.error('Invalid location data:', location);
        return;
      }
      console.log(`Captain ${userId} updated location:`, location);

      await Captain.findByIdAndUpdate(userId, { 
        location:{
          type: 'Point',
          coordinates: [location.lng, location.ltd]
        }
    });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}

export function sendMessageToSocketId(socketId, messageObject) {
  
  console.log(`Sending message to socket ID: ${socketId}`, messageObject);
  

  if (io) {
    io.to(socketId).emit(messageObject.event, messageObject.data);
  } else {
    console.error('Socket.io is not initialized');
  }
}

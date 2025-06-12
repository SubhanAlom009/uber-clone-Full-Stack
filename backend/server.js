import http from 'http';
import app from './app.js';
import { connectDB } from './db/db.js';
import { initializeSocketId } from './socket.js';

const port = process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocketId(server);

connectDB().then(() => {
  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});

# Uber Clone MERN - Fullstack

This project is a fullstack Uber-like ride-hailing application built with the MERN stack (MongoDB, Express, React, Node.js). It features real-time ride tracking, user and driver authentication, live map updates, and a modern UI inspired by Uber.

---

## Frontend (React + Vite)

### Features
- Live Google Maps tracking for user, driver, and destination
- Real-time ride updates using Socket.io
- User and driver authentication and registration
- Ride booking, confirmation, and payment UI
- Responsive, mobile-friendly design

### Tech Stack
- React (with Vite for fast development)
- @react-google-maps/api for Google Maps integration
- Socket.io-client for real-time updates
- Tailwind CSS for styling
- React Router for navigation

### Setup Instructions

1. **Clone the Repository**
   ```
   git clone <your-repo-url>
   cd frontend
   ```
2. **Install Dependencies**
   ```
   npm install
   ```
3. **Configure Environment Variables**
   - Create a `.env` file in the `frontend` folder with your Google Maps API key:
     ```
     VITE_GOOGLE_MAP_API_KEY=your_google_maps_api_key_here
     ```
   - Get your API key from the [Google Cloud Console](https://console.cloud.google.com/).
   - Make sure the Maps JavaScript API is enabled for your project.
4. **Run the App**
   ```
   npm run dev
   ```
   The app will be available at `http://localhost:5173` by default.

### Project Structure
- `src/components/` — Reusable UI components (LiveTracking, ConfirmRide, etc.)
- `src/pages/` — Main pages (Home, Riding, CaptainHome, etc.)
- `src/context/` — React context for user, captain, and socket state
- `src/assets/images/` — App images and icons

### Live Tracking
- The `LiveTracking` component uses Google Maps to show:
  - Your live location (auto-updated every 10 seconds)
  - Driver and destination markers (if available)
- Map is fullscreen and mobile-friendly
- Requires location permissions

### Real-Time Ride Updates
- Uses Socket.io for instant ride status changes (e.g., ride ended)
- UI updates automatically when ride status changes

### Customization
- Update styles in `index.css` or use Tailwind classes
- Add more features or UI elements as needed

---

## Backend (Node.js + Express + MongoDB)

### Features
- RESTful API for users, captains, rides, and maps
- JWT-based authentication for users and captains
- Real-time ride status updates via Socket.io
- MongoDB for data storage
- Modular controller/service structure

### Tech Stack
- Node.js
- Express.js
- MongoDB (with Mongoose)
- Socket.io
- JWT for authentication

### Setup Instructions
1. **Navigate to the backend folder**
   ```
   cd backend
   ```
2. **Install Dependencies**
   ```
   npm install
   ```
3. **Configure Environment Variables**
   - Create a `.env` file in the `backend` folder with the following (example):
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```
4. **Run the Server**
   ```
   npm start
   ```
   The backend will run on `http://localhost:5000` by default.

### Project Structure
- `controllers/` — Business logic for users, captains, rides, and maps
- `models/` — Mongoose models for MongoDB collections
- `routes/` — Express route handlers
- `services/` — Service layer for business logic
- `middlewares/` — Authentication and error handling
- `db/` — Database connection
- `utils/` — Utility functions

### Real-Time Communication
- Socket.io is used for real-time ride status updates between users and captains.
- See `socket.js` for event handling logic.

---

## License
This project is for educational/demo purposes. Not for production use.

---

For any issues or contributions, please open an issue or pull request.

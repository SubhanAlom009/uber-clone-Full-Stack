import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(cors({
  origin: "*",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World!");
});


// Import routes
import userRoutes from "./routes/user.route.js";
import captainRoutes from "./routes/captain.route.js";
import mapRoutes from "./routes/maps.route.js";
import rideRoutes from "./routes/rides.route.js";

app.use('/user', userRoutes);
app.use('/captain', captainRoutes);
app.use('/maps', mapRoutes);
app.use('/ride', rideRoutes);

export default app;
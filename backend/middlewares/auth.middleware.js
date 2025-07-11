import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { BlacklistToken } from "../models/blacklistToken.model.js";
import { Captain } from "./../models/captain.model.js";

export const authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
  console.log("Token received in auth middleware:", token);

  const isBlackListed = await BlacklistToken.findOne({ token });

  if (isBlackListed) {
    return res.status(401).json({
      message: "you are not authorized to access!",
    });
  }

  try {
    if (!token) {
      return res.status(401).json({
        message: "you are not authorized to access!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "user not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const authCaptain = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  const isBlackListed = await BlacklistToken.findOne({ token });

  if (isBlackListed) {
    return res.status(401).json({
      message: "you are not authorized to access!",
    });
  }

  try {
    if (!token) {
      return res.status(401).json({
        message: "you are not authorized to access!",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const captain = await Captain.findById(decoded.id);
    if (!captain) {
      return res.status(401).json({
        message: "Captain not found",
      });
    }

    req.captain = captain;
    next();
  } catch (error) {
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

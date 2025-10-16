import jwt from "jsonwebtoken";

import User from "../models/userSchema.js";

/*  Usage:  protect  →  req.user  =  userDoc  */
export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }
  if (!token) return res.status(401).json({ message: "Not authorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ message: "Token failed" });
  }
};

export const roles =
  (...allowedRoles) =>
  (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access is denied" });
    }
    next();
  };

export const signToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || "secret", { expiresIn: "7d" });

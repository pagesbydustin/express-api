const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.JWT_SECRET || "supersecretkey";

// Middleware to authenticate JWT
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Token is expected to be in format "Bearer <token>"

  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // Attach user info to request object
    next(); // Proceed to next middleware or route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authenticateJWT;

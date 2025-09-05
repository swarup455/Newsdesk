import admin from "../utils/firebaseAdmin.js"; // your firebase-admin config

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];

    // 2. Verify token using Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token)
    // 3. Attach user info to request object
    req.user = decodedToken;
    // 4. Move to next middleware / controller
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error.message);
    return res.status(401).json({ message: "Unauthorized or invalid token" });
  }
};

export default authMiddleware;
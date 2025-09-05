import express from 'express'
import { googleLogin, getUser, logoutUser, loginUser, registerUser, updateProfile} from '../controllers/auth.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';

const authRouter = express.Router()

// Public routes
authRouter.post('/google-login', googleLogin);
authRouter.post('/register-user', registerUser);
authRouter.post('/login-user', loginUser);

// Protected routes
authRouter.get('/get-user', authMiddleware, getUser);
authRouter.post('/logout-user', authMiddleware, logoutUser);
authRouter.put('/update-profile', authMiddleware, upload.single("profileImage"), updateProfile);

export default authRouter
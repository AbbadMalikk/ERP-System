import express from 'express'
import { loginUser, logoutUser, signupUser, googleLogin} from '../controller/userController.js'; 
const router=express.Router();

router.post("/signup",signupUser)
router.post("/login",loginUser)
router.post("/logout",logoutUser)
router.post('/google-login',googleLogin )
export default router
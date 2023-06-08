import { Router } from "express";
//Import all controllers//
import * as controller from '../controllers/app.controller.js'
import Auth from "../middleware/auth.js"
import localVariables from "../middleware/auth.js";
const router = Router();



// POST METHODS //

router.post("/register", controller.register)


router.post("/registerMail", (req, res) => {//Send the email"

    res.json("register mail");
});

router.post("/authenticate", (req, res) => res.end());//Auhenticate user"   

router.post("/login",controller.verifyUser, controller.login)





// GET METHODS //

router.get("/user/:username",controller.getUser) // user with username

router.get("/generateOTP",controller.verifyUser,localVariables,controller.generateOTP); // generate random OTP

router.get("/verifyOTP",controller.verifyOTP );// verify generated OTP


router.get("/user/createResetSession", (req, res) => {// reset all the variables
    res.send("reset all the variables");
});





// PUT METHODS //

router.put("/updateuser",Auth, controller.updateUser) // update user profile

router.put("/resetPassword", (req, res) => {// reset password
    res.send("reset password");
});

export default router;

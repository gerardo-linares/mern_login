import { Router } from "express";

const router = Router();


// POST METHODS //

router.post("/register", (req, res) => {
    //Register user"

    res.json("register route");
});

router.post("/registerMail", (req, res) => {
    //Send the email"

    res.json("register mail");
});

router.post("/authenticate", (req, res) => {
    //Auhenticate user"

    res.json("Auhenticate user");
});

router.post("/login", (req, res) => {
//login user
    res.json("login route");
});





// GET METHODS //

router.get("/user/username", (req, res) => {
    // user with username
    res.send("username");
});

router.get("/user/generateOTP", (req, res) => {
    // generate random OTP
    res.send("generate random OTP");
});
router.get("/user/verifyOTP", (req, res) => {
    // verify generated OTP
    res.send("verify generated OTP");
});
router.get("/user/createResetSession", (req, res) => {
    // reset all the variables
    res.send("reset all the variables");
});





// PUT METHODS //

router.put("/updateUser", (req, res) => {
    // update user profile
    res.send("update user profile");
});
router.put("/resetPassword", (req, res) => {
    // reset password
    res.send("reset password");
});

export default router;

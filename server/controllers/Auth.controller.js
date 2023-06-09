import UserModel from "../models/User.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import ENV from "../config.js";
import otpGenerator from 'otp-generator';

// Middleware for verifying the existence of a user
export const verifyUser = async (req, res, next) => {
    try {
        const { username } = req.method === 'GET' ? req.query : req.body;

        // Check user existence
        const exist = await UserModel.findOne({ username });
        if (!exist) {
            return res.status(404).send({ error: 'Could not find the user' });
        }

        // If the user exists, proceed with execution
        next();
    } catch (error) {
        return res.status(404).send({ error: 'Authentication error' });
    }
};

// POST
export const register = async (req, res) => {
    try {
        const { username, password, profile, email } = req.body;
        // check exist username
        const existUsername = UserModel.findOne({ username });
        // check exist email
        const existEmail = UserModel.findOne({ email });

        Promise.all([existUsername, existEmail])
            .then(([existingUsername, existingEmail]) => {
                if (existingUsername) {
                    throw new Error('Please use a unique username');
                }
                if (existingEmail) {
                    throw new Error('Please use a unique email');
                }
                // Hash password, 10 salts
                return bcrypt.hash(password, 10);
            })
            .then((hashedPassword) => {
                // Create new user
                const user = new UserModel({
                    username,
                    password: hashedPassword,
                    profile,
                    email,
                });
                // Save user in db
                return user.save();
            })
            .then((result) => {
                res.status(201).send({ msg: 'User registered successfully' });
            })
            .catch((error) => {
                res.status(500).send({ error: error.message });
            });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
};

// POST
export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        UserModel.findOne({ username })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {
                        if (!passwordCheck) return res.status(400).send({ error: "Incorrect Password" });
                        //create jwt token
                        const token = jwt.sign(
                            {
                                userId: user._id,
                                username: user.username
                            },
                            ENV.JWT_SECRET,
                            { expiresIn: "24h" }
                        );
                        return res.status(200).send({
                            msg: "Login successful...!",
                            username: user.username,
                            token
                        });
                    })
                    .catch(error => {
                        return res.status(404).send({ error: "Password does not match" });
                    });
            })
            .catch(error => {
                return res.status(404).send({ error: "Username not found" });
            });
    } catch (error) {
        return res.status(500).send({ error: "internal server" });
    }
};

// GET
export const getUser = async (req, res) => {
    const { username } = req.params;

    if (!username) {
        return res.status(400).send({ error: "Username is required" });
    }

    try {
        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        // Remove password from user
        const { password, ...rest } = user.toObject();

        return res.status(200).send(rest);
    } catch (error) {
        return res.status(500).send({ error: "Internal server error" });
    }
};

// PUT
export const updateUser = async (req, res) => {
    try {
        const { userId } = req.user; // Obtener el ID del usuario del objeto de solicitud

        if (!userId) {
            return res.status(401).send({ error: "User Not Found" });
        }

        const body = req.body;

        const updatedUser = await UserModel.updateOne(
            { _id: userId },
            body,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ error: "User not found" });
        }

        // Enviar la respuesta al cliente una vez
        return res.status(200).send({ msg: "Record Updated", user: updatedUser });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal server error" });
    }
};

// GET
export const generateOTP = async (req, res) => {
    req.app.locals.OTP = await otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
    });
    res.status(201).send({ code: req.app.locals.OTP });
};

// GET
export const verifyOTP = async (req, res) => {
    const { code } = req.query;
    if (parseInt(req.app.locals.OTP) === parseInt(code)) {
        req.app.locals.OTP = null; //reset opt value
        req.app.locals.resetSession = true; //start session for reset password
        return res.status(201).send({ msg: 'Verify Successfully' });
    }
    return res.status(400).send({ error: "Invalid OTP" });
};

// GET
export const createResetSession = async (req, res) => {
    if (req.app.locals.resetSession) {
        req.app.locals.resetSession = false;
        return res.status(201).send({ msg: "Access granted" });
    }
    return res.status(440).send({ error: "Session expired" });
};

// POST
export const resetPassword = async (req, res) => {
    try {
        if (!req.app.locals.resetSession) {
            return res.status(440).send({ error: "Session expired" });
        }

        const { username, password } = req.body;

        const user = await UserModel.findOne({ username });

        if (!user) {
            return res.status(404).send({ error: "Username not found" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await UserModel.updateOne(
            { username: user.username },
            { password: hashedPassword }
        );

        return res.status(201).send({ msg: "Password reset successfully" });
    } catch (error) {
        return res.status(500).send({ error: "Internal server error" });
    }
};

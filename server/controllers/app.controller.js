import UserModel from "../models/User.model.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import ENV from "../config.js"






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


//POST

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

//POST
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

//GET
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
        const { password, ...userData } = user.toObject();

        return res.status(200).send(userData);
    } catch (error) {
        return res.status(500).send({ error: "Internal server error" });
    }
};





//PUT
export const updateUser = async (req, res) => {
    try {
        const userId = req.query.id;

        if (!userId) {
            return res.status(401).send({ error: "User Not Found" });
        }

        const body = req.body;

        const updatedUser = await UserModel.findOneAndUpdate(
            { _id: userId },
            body,
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).send({ error: "User not found" });
        }

        return res.status(200).send({ msg: "Record Updated", user: updatedUser });
    } catch (error) {
        return res.status(500).send({ error: "Internal server error" });
    }
};




//GET
export async function generateOTP(req,res){
    res.json('ugenerateOTP route')
}
//GET
export async function verifyOTP(req,res){
    res.json('verifyOTP route')
}
//GET
export async function createResetSession(req,res){
    res.json('createResetSession route')
}

export async function resetPassword(req,res){
    res.json('resetPassword route')
}
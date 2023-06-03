import UserModel from "../models/User.model.js"
import bcrypt from "bcrypt"



//POST

export async function register(req, res) {
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
}

//POST
export async function login (req,res){
    res.json('login route')
}

//GET
export async function getUser (req,res){
    res.json('getUser route')
}
//PUT
export async function updateUser (req,res){
    res.json('updateUser route')
}

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
import mongoose from 'mongoose';


const UserSchema = new mongoose.Schema({
    username: {
        type:String,
        required :[true, "Please provie unique Username"],
        unique: [true, "User exist"]
    },
    password:{
        type:String,
        required:[true, "Please provide a Password"],
        unique: false
    },
    email:{
        type:String,
        required:[true, "Please provide a Email"],
        unique: [true, "Email exist"]
    },

    firstName:{type:String},
    lastName:{type:String},
    mobile:{type:String},
    address:{type:String},
    profile:{type:String},
})



export default mongoose.model.Users || mongoose.model("User",UserSchema);
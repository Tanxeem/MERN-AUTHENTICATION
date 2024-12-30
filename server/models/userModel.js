import mongoose from 'mongoose';
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email:{
        type: String,
        required: [true, "Please enter valid email"],
        unique: [true, 'Email already Exists'],
    },
    password:{
        type: String,
        minLength: [8, "Password must have at least 8 charactors."],
        maxLength: [32, "Password cant have more then 32 charactors."],
    },
    phone:{
        type:String
    },
    accountVerified:{
        type:Boolean,
        default: false,
    },
    verificationCode: Number,
    verificationCodeExpire: Date,
    resetPasswordtoken: String,
    resetPasswordExpire: Date,
}, {timestamps:true});

userSchema.pre("save", async function (next){
    if(!this.isModified("password")){
        next();
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.method.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}

export const User = mongoose.model("User", userSchema);





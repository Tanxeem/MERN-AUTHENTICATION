import { catchAsyncError } from "../middlewares/error.js"
import ErrorHandler from "../middlewares/error.js"
import { User } from "../models/userModel.js"

export const register = catchAsyncError(async(req, res, next) =>{
    try {
        const {name, email, phone, password, verificationMethod } = req.body;
        if(!name || !email || phone || !password || !verificationMethod){
            return next(ErrorHandler("All fields are required.", 400))
        }
        function validatePhoneNumber(phone){
            const phoneRegex = /^+923\d{9}$/;
            return phoneRegex.test(phone);
        }

        if(!validatePhoneNumber(phone)){
            return next(new ErrorHandler("Invalid Phone Number.", 400));
        };

        const existingUser = await User.findOne({
            $or:{
                email,
                accountVerified:true
            },
            phone,
            accountVerified: true
        });

        if(existingUser){
            return next(new ErrorHandler("Phone or email already used", 400))
        }

        const registerationAttempByUser = await User.find({
            $or: [
                {phone, accountVerified:false},
                {email, accountVerified:false}
            ],
        })

        if(registerationAttempByUser.length > 3){
            return next(new ErrorHandler("You have axcceded the maximum of attemps (3)please try again after 1hr", 400 ))
        }

        const userData = {
            name,
            email,
            phone,
            password,
        };

        const user = await User.create(userData);
        
        const verificationCode = await user.generateVerificationCode();
        await user.save;

        sendVerificationCode(verificationMethod, verificationCode, email, phone);
        res.status(200).json({
            success: true,
        })

    } catch (error) {
        next(error)
    }
})
import errResponse from "../utils/errResponse";
import {User} from "../models/user.model";
import sucResponse from "../utils/sucResponse";
import crypto from "crypto";
import { generateRepaymentSchedule } from "../utils/PaymentSchedule";


export const signup = async (req:any, res:any,next:any) =>{

    try {

        const {email, username, password} = req.body;

        if(!email || !username || !password){
            throw new errResponse("Please provide all fields",400)
        }

        const userExists = await User.findOne({
            $or : [
                {email},
                {username}
            ]
        })


        if(userExists){
            throw new errResponse("User already exists",400)
        }

        const user = await User.create({
            email,
            username,
            password
        })

        await user.save();
        
        // email user about account got created sucessfully


        return res.status(201)
        .json(
            new sucResponse(true,200,"User created successfully")
        )
        
    } catch (error) {
        next(error)        
    }

}


export const login = async (req:any, res:any,next:any) => {
    try {

        const {email, password} = req.body;

        if(!email || !password){
            throw new errResponse("Please provide all fields",400)
        }

        const user = await User.findOne({email}).select("+password");

        if(!user){
            throw new errResponse("Invalid credentials",400)
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            throw new errResponse("Invalid credentials",400)
        }

        const token = await user.getSignedToken();

        // send email to user about login
        

        return res.status(200)
        .json(
            new sucResponse(true,200,"User logged in successfully",token)
        )
        .cookie("token",token,{
            sameSite:"None",
            secure:true ,
            httpOnly:true ,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })
        
    } catch (error) {
        next(error)
    }
}

export const logout = async (req:any, res:any,next:any) => {
    try {

        return res.status(200)
        .json(
            new sucResponse(true,200,"User logged out successfully")
        )
        .clearCookie("token")
        
    } catch (error) {
        next(error)
    }
}


export const forgotPassword = async (req:any, res:any,next:any) => {

    try {

        const {email} = req.body;

        if(!email){
            throw new errResponse("Please provide email",400)
        }

        const user = await User.findOne({email});

        if(!user){
            throw new errResponse("User not found",404)
        }

        const resetToken = await user.generateResetPasswordToken();

        if(!resetToken){
            throw new errResponse("Token generation failed",500)
        }

        // send email to user about reset password 
        // email (url/token)
        
        return res.status(200)
        .json(
            new sucResponse(true,200,"Reset password email sent successfully")
        )

    } catch (error) {
        next(error)
    }
    
}

export const resetPassword = async (req:any, res:any,next:any) => {

    try {

        const {password} = req.body;
        const {token} = req.params;

        if(!token){
            throw new errResponse("Invalid Request",400)
        }

        if(!password){
            throw new errResponse("Please provide password",400)
        }

        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            forgotPasswordToken: hashedToken,
            forgotPasswordExpire: {$gt: Date.now()}
        })

        if(!user){
            throw new errResponse("Invalid token",400)
        }

        user.password = password;
        user.forgotPasswordToken = null;
        user.forgotPasswordExpire = null;

        await user.save();

        return res.status(200)
        .json(
            new sucResponse(true,200,"Password reset successfully")
        )
        
    } catch (error) {
        next(error)
    }

}

export const updatePassword = async (req:any, res:any,next:any) => {
 
    try {

        const {password, newPassword} = req.body;

        if(!password || !newPassword){
            throw new errResponse("Please provide all fields",400)
        }

        const user  = await User.findById(req.user.id).select("+password");

        if(!user){
            throw new errResponse("User not found",404)
        }

        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            throw new errResponse("Invalid credentials",400)
        }

        user.password = newPassword;
        await user.save();

        // send email to user about password change

        return res.status(200)
        .json(
            new sucResponse(true,200,"Password updated successfully")
        )
        
    } catch (error) {
        next(error)
    }
}


export const repaymentSchedule = async (req:any, res:any,next:any) => {
    try {
        const schedule = generateRepaymentSchedule(req.body);

        if (schedule.length === 0){
            return res.status(400).json(new sucResponse(true, 204, "Invalid input data"));
        }

        
        return res.status(200).json(new sucResponse(true, 200, "Repayment schedule generated successfully", schedule));

    } catch (error) {
        res.status(400).json({ error: "Invalid input data" });
    }
} 



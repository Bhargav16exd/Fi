import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

interface User extends Document {
    email: string;
    username: string;
    password: string;
    forgotPasswordToken: string | null;
    forgotPasswordExpire: Date | null;
    matchPassword(password:string): any;
    getSignedToken(): any;
    generateResetPasswordToken(): any;
}

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true
    },
    username:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        select:false
    },
    forgotPasswordToken : String,
    forgotPasswordExpire : Date,

},{timestamps: true});


userSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.matchPassword = async function(enteredPassword:string){
    return await bcrypt.compare(enteredPassword, this.password)
}   


userSchema.methods.getSignedToken = function(){

    const JWT_SECRET : any = process.env.JWT_SECRET;

    if(!JWT_SECRET){
        throw new Error("No JWT_SECRET found")
    }
    
    return jwt.sign({
        id: this._id,
        role: this.role
    },
     JWT_SECRET ,
    {
        expiresIn:'7d'

    })

}

userSchema.methods.generateResetPasswordToken = function(){

    const resetToken = crypto.randomBytes(20).toString('hex');

    const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    this.forgotPasswordToken = hashedResetToken;
    this.forgotPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);

    return resetToken;

}

export const User = mongoose.model<User>("User", userSchema); 
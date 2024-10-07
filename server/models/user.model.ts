import mongoose from 'mongoose'
import { IUserDocument } from '../types/types';


const userSchema = new mongoose.Schema<IUserDocument>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    contact: {
        type: Number,
        required: true
    },
    address: {
        type: String,
        default: "Update Your Address"
    },
    city: {
        type: String,
        default: "Update Your City"
    },
    country: {
        type: String,
        default: "Update Your Country"
    }, 
    profilePic: {
        type: String,
        default: ""
    },
    admin: {
        type: Boolean,
        default: false
    }, 
    // advanced authentication
    lastLogin: {
        type: Date,
        default: Date.now
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date
}, {timestamps: true});
 
export const User = mongoose.model("User", userSchema);
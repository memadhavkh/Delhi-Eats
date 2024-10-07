import { Request, Response } from "express";
import { User } from "../models/user.model";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import cloudinary from "../utils/cloudinary";
import { generateVerificationToken } from "../utils/generateVerificationToken";
import { generateToken } from "../utils/generateToken";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/email";
import { UploadApiResponse } from "cloudinary";
import { CustomRequest } from "../types/types";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, contact } = req.body;
    // validate inputs is being done by zod
    let user = await User.findOne({ email });
    if (user) {
      res.status(400).json({
        success: false,
        message: "User already registered. Please Go To Login Page",
      });
      return;
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);
      // verification token
      const verificationToken = generateVerificationToken();
      const success =  sendVerificationEmail(email, verificationToken);
      if(Boolean(success)){
        user = await User.create({
          name,
          email,
          password: hashedPassword,
          contact: Number(contact),
          verificationToken,
          verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
        });
        generateToken(user, res);
        const userWithoutPassword = await User.findOne({ email }).select(
          "-password"
        ); // not sending password to the frontend
        res.status(201).json({
          success: true,
          message: "Account Created successfully",
          user: userWithoutPassword,
          verificationToken: verificationToken
        });
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Incorrect email or password",
      });
      return;
    } 
    else {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        res.status(400).json({
          success: false,
          message: "Incorrect email or password",
        });
        return;
      }
      generateToken(user, res);
      user.lastLogin = new Date();
      await user.save();

      // send user without password
      const userWithoutPassword = await User.findOne({ email }).select(
        "-password"
      );
      res.json({
        success: true,
        message: `Welcome back ${user.name}`,
        user: userWithoutPassword,
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { verificationCode } = req.body;
    const user = await User.findOne({
      verificationToken: verificationCode,
      verificationTokenExpiresAt: { $gt: Date.now() },
    }).select("-password");
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired verification code",
      });
      return;
    } else {
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiresAt = undefined;
      await user.save();
      // send welcome email
      await sendWelcomeEmail(user?.email, user.name);
      res.status(200).json({
        success: true,
        message: "Email verified successfully",
        user,
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    res.clearCookie("token").status(200).json({
      success: true,
      message: "Logged out successfully",
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    } else {
      const resetToken = crypto.randomBytes(40).toString("hex");
      const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1hr
      user.resetPasswordToken = resetToken;
      user.resetPasswordTokenExpiresAt = resetTokenExpiresAt;
      await user.save();
      // send reset password email
      await sendPasswordResetEmail(
        user.email,
        `${process.env.FRONTEND_URL}/reset-password/${resetToken}`
      );
      res.status(200).json({
        success: true,
        message: "Reset password link sent to your email. Check your email",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const resetPassword = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired reset password token",
      });
      return;
    } else {
      //update password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      user.resetPasswordToken = undefined;
      user.resetPasswordTokenExpiresAt = undefined;
      await user.save();
      // send success reset email
      await sendResetSuccessEmail(user.email);
      res.status(200).json({
        success: true,
        message: "Password reset successfully",
      });
      return;
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const checkAuth = async (req: CustomRequest, res: Response): Promise<void> => {
  try {
    const userId = req.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    } else {
      res.status(200).json({
        success: true,
        message: "User authenticated successfully",
        user,
      });
      return;
    }
    
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

export const updateProfile = async (
  req: CustomRequest,
  res: Response
): Promise<void> => {
  const userId = req.id;
  const { name, email, address, city, country, profilePic } = req.body;
  //upload image
  let cloudResponse: UploadApiResponse;
  try {
    cloudResponse = await cloudinary.uploader.upload(profilePic);
    const updatedData = { name, email, address, city, country, profilePic };
    const user = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");
    if(!user){
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
    return;
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
    return;
  }
};

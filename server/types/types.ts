import { Multer } from "multer";
import { Request } from "express";
import mongoose from "mongoose";

export interface CustomRequest extends Request {
  id?: string;
  file?: Express.Multer.File;
}
export type CheckoutSessionRequest = {
  cartItems: {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    description: string;
    image: string;
    price: number;
    quantity: number;
  }[];
  deliveryDetails: {
    name: string;
    email: string;
    address: string;
    city: string;
  };
  restaurantId: string;
};

export interface IUser {
  name: string;
  email: string;
  password: string;
  contact: number;
  address?: string;
  city: string;
  country: string;
  profilePic?: string;
  admin: boolean;
  lastLogin?: Date;
  isVerified?: boolean;
  resetPasswordToken?: string;
  resetPasswordTokenExpiresAt?: Date;
  verificationToken?: string;
  verificationTokenExpiresAt?: Date;
}
// created at aur updated at, compulsory hota hai, agar kisi jagah hume uski aavashayakta nhi hai toh hum IUser use krlenge
export interface IUserDocument extends IUser, Document {
  _id: any;
  createdAt: Date;
  updatedAt: Date;
}
export interface IMenu {
    menuId: string,
    name: string,
    description: string,
    price: number,
    image: string
}

export interface IMenuDocument extends IMenu , Document {
    
    createdAt: Date,
    updatedAt: Date   
}

export type DeliveryDetails = {
    name: string,
    email: string,
    address: string,
    city: string
}

export type CartItem = {
    menuId: string,
    name: string,
    image: string,
    price: number,
    quantity: number
}
export interface IOrderDocument extends Document {
    user: mongoose.Schema.Types.ObjectId,
    restaurant: mongoose.Schema.Types.ObjectId,
    deliveryDetails: DeliveryDetails,
    cartItems: CartItem[],
    totalAmount: number,
    // single pipe sign (|) means only one option is possible between them
    status: "pending" | "confirmed" | "preparing" | "outfordelivery" | "delivered"
}
interface IRestaurant {
    user: mongoose.Schema.Types.ObjectId,
    restaurantName: string,
    city: string,
    country: string,
    deliveryTime: number,
    cuisines: string[],
    imageURL: string,
    menus: mongoose.Schema.Types.ObjectId[]
}

export interface IRestaurantDocument extends IRestaurant, Document {
    createdAt: Date,
    updatedAt: Date
}
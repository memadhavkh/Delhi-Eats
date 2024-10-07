import mongoose from 'mongoose';
import { IOrderDocument } from '../types/types';



const orderSchema = new mongoose.Schema<IOrderDocument>({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    restaurant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true
    },
    deliveryDetails: {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        }
    },
    cartItems: [
        {
            name: {
                type: String,
                required: true
            },
            image: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number
    },
    status: {
        type: String,
        // enum is case mai use krte hai, jab kuch strict choices ho ek variable ke liye
        enum: ['pending', 'confirmed', 'preparing', 'outfordelivery', 'delivered'],
        default: 'pending',
        required: true
    }
}, {timestamps: true});

export const Order = mongoose.model<IOrderDocument>('Order', orderSchema);

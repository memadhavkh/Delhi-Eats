import {z} from 'zod';

// Zod also provides types, so we dont have to create a custom type
export const userSignupSchema = z.object({
    name: z.string().min(1, "Name Is Required"),
    email: z.string().email("Invalid Email Address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    contact: z.string().min(10, "Invalid Contact Number"),
});
export type SignUpInputState = z.infer<typeof userSignupSchema>;

export const userLoginSchema = z.object({
    email: z.string().email("Invalid Email Address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginInputState = z.infer<typeof userLoginSchema>;
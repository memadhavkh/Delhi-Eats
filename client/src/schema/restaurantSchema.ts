import {z} from 'zod';

export const restaurantSchema = z.object({
    restaurantName: z.string().min(3, {message: "Restaurant Name must be 3 characters!"}),
    city: z.string().min(3, {message: "Please provide a valid city name!"}),
    country: z.string().min(3, {message: "Please provide a valid country name!"}),
    deliveryTime: z.number().min(0, {message: "Delivery Time cannot be negative"}),
    cuisines: z.array(z.string()),
    imageFile: z.instanceof(File).optional().refine((file) => file?.size !== 0, {message: "Image File Is Required!"}),
});

export type RestaurantInputState = z.infer<typeof restaurantSchema>;
import { Request, Response } from "express"
import {Restaurant} from '../models/restaurant.model'
import uploadImageOnCloudinary from "../utils/uploadImage";
import {Order} from '../models/order.model'
import { CustomRequest } from "../types/types";
export const createRestaurant = async(req: CustomRequest, res: Response): Promise<void> => {
    try {
        const {restaurantName, city, country, deliveryTime, cuisines} = req.body;
        const file = req.file;
        const restaurant = await Restaurant.findOne({user: req.id});
        if(restaurant){
            res.status(400).json({success: false,
            message: "Restaurant already exists"})
            return;
        }
        if(!file){
            res.status(400).json({
            success: false,
            message: "Please upload a restaurant image"})
            return;
        }
        const imageURL = await uploadImageOnCloudinary(file as Express.Multer.File);
        await Restaurant.create({
            user: req.id,
            restaurantName,
            city,
            country,
            deliveryTime,
            cuisines: JSON.parse(cuisines).map((cuisine: string) => cuisine.trim()),
            imageURL: imageURL.toString()
        });
        res.status(201).json({success: true, message: "Restaurant created successfully"})
        return;
    } catch (error) {
        res.status(500).json({success: false, message: "Internal Server Error"})
        return;
    }
}

export const getRestaurant = async(req: CustomRequest, res: Response): Promise<void> => {
    try {
        const restaurant = await Restaurant.findOne({user: req.id}).populate('menus');
        if(!restaurant){
            res.status(404).json({success: false, restaurant: [], message: "Restaurant not found"})
            return;
        };
        res.status(200).json({success: true, restaurant})
        return;
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
        return;
    }
}

export const updateRestaurant = async(req: CustomRequest, res: Response): Promise<void> => {
    const {restaurantName, city, country, deliveryTime, cuisines} = req.body;
    const file = req.file;
    try {
        const restaurant = await Restaurant.findOne({user: req.id})
        if(!restaurant){
            res.status(404).json({success: false, message: "Restaurant not found"})
            return;
        }
        restaurant.restaurantName = restaurantName;
        restaurant.city = city;
        restaurant.country = country;
        restaurant.deliveryTime = deliveryTime;
        restaurant.cuisines = JSON.parse(cuisines);
        
        if(file){
            const imageURL = await uploadImageOnCloudinary(file as Express.Multer.File);
            restaurant.imageURL = imageURL;
        }
        await restaurant.save();
        res.status(200).json({success: true, message: "Restaurant updated successfully", restaurant});
        return;
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
        return;
    }
}

export const getRestaurantOrder = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const restaurant = await Restaurant.findOne({user: req.id});
        if(!restaurant){
            res.status(404).json({success: false, message: "Restaurant not found"})
            return;
        }
        const orders = await Order.find({restaurant: restaurant._id}).populate('restaurant').populate('user');
        res.status(200).json({success: true, orders})
        return;
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
        return;
    }
}

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const {orderId} = req.params;
        const {status} = req.body;
        const order = await Order.findById(orderId);
        if(!order){
            res.status(404).json({success: false, message: "Order not found"})
            return;
        }
        order.status = status;
        await order.save();
        res.status(200).json({success: true, message: "Order status updated successfully", order, status: order.status})
        return;
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
        return;
    }
}

// important!!! , will have to come back later
export const searchRestaurant = async (req: Request, res: Response): Promise<void> => {
    try {
        // advanced searching in mongo db
        // based on search text
        const searchText = req.params.searchText || "";
        // based on searchQuery
        const searchQuery = req.query.searchQuery || "";
        // filtering on cuisines
        const selectedCuisines = (req.query.selectedCuisines as string || "").split(",").filter(cuisine => cuisine); // returning the cuisines one by one

        const query: any = {};
        // basic search based on searchText(name, city, country)
        if(searchText){
            // query.$or ka matlab hai ki teeno mai sai koi bhi query aaye toh query mai add krdo
            query.$or = [
                {restaurantName: {$regex: searchText, $options: "i"}},
                {city: {$regex: searchText, $options: "i"}},
                {country: {$regex: searchText, $options: "i"}}
            ]
        };

        // filter on basis of searchQuery
        if(searchQuery){
            query.$or = [
                {restaurantName: {$regex: searchQuery, $options: "i"}},
                {cuisines: {$regex: searchQuery, $options: 'i'}}
            ]
        };

        if(selectedCuisines.length > 0){
            query.cuisines = {$in: selectedCuisines}
        };

        const restaurants = await Restaurant.find(query);
        res.status(200).json({success: true, restaurants})
        return;
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
        return;
    }
}

export const getSingleRestaurant = async(req: Request, res: Response): Promise<void> => {
    try {
        const restaurantId = req.params.id;
        const restaurant = await Restaurant.findById(restaurantId).populate({
            path: 'menus',
            options: {createdAt: -1}
        });
        if(!restaurant){
            res.status(404).json({success: false, message: "Restaurant not found"})
            return;
        }
        res.status(200).json({success: true, restaurant})
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
        return;
    }
}
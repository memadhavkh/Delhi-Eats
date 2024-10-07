import {Request, Response} from 'express'
import uploadImageOnCloudinary from '../utils/uploadImage'
import {Menu} from '../models/menu.model'
import {Restaurant} from '../models/restaurant.model'
import mongoose from 'mongoose';
import { CustomRequest } from '../types/types';

export const addMenu = async (req: CustomRequest, res: Response): Promise<void> => {
    try {
        const {name, description, price} = req.body;
        const file = req.file;
        if(!file){
            res.status(400).json({message: "Image is Required"});
            return;
        }
        const imageURL = await uploadImageOnCloudinary(file as Express.Multer.File);
        const menu = await Menu.create({
            name, 
            description,
            price,
            image: imageURL
        });
        const restaurant = await Restaurant.findOne({user: req.id});
        if(restaurant){
            (restaurant.menus as mongoose.Schema.Types.ObjectId[]).push(menu._id);
            await restaurant.save();
            res.status(201).json({success: true, menu, message: "Menu Added Successfully"});
            return;
        }
        return;
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
        return;
    }
}

export const editMenu = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;
        const {name, description, price} = req.body;
        const file = req.file;
        const menu = await Menu.findById(id);
        if(!menu){
            res.status(404).json({success: false,message: "Menu not found"});
            return;
        } else{
            if(name) menu.name = name;
            if(description) menu.description = description;
            if(price) menu.price = price;
            if(file){
                const imageURL = await uploadImageOnCloudinary(file as Express.Multer.File);
                menu.image = imageURL;
            } 
            await menu.save();

            res.status(200).json({success: true, menu, message: "Menu updated successfully"});
            }
            return;
        
    } catch (error) {
        res.status(500).json({message: "Internal Server Error"})
        return;
    }
}
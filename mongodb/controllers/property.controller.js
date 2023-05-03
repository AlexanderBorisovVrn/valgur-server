import mongoose from 'mongoose'
import UserModel from '../models/user.js';
import PropertyModel from '../models/property.js'
import { v2 as cloudinary } from 'cloudinary'
import { cloudinaryApiKey, cloudinaryApiSecret, cloudinaryName } from 'enviroment.js'

cloudinary.config({
    cloud_name: cloudinaryName,
    api_key: cloudinaryApiKey,
    api_secret: cloudinaryApiSecret,
    secure: true
});





const getAllProperies = async (req, res) => {
    return 'properties'
}

const getPropertyDetail = async (req, res) => {

}
const createProperty = async (req, res) => {

    try {

        const { title, description, price, location, photo, propertyType, email } = req.body;

        const session = await mongoose.startSession();
        session.startTransaction();

        const user = await UserModel.findOne({ email }).session(session);
        if (!user) throw new Error('User not found')

        const photoUrl = await cloudinary.uploader.upload(photo);

        const newProperty = await PropertyModel.create({
            title,
            price,
            propertyType,
            description,
            location,
            photo: photoUrl,
            creator: user_id
        })
        user.allProperties.push(newProperty._id)
        await user.save({ session })
        await session.commitTransaction
        res.status(200).send("Property created successfully")
    } catch (error) {
        res.status(500).send(error)
    }
}
const updateProperty = async (req, res) => { }
const deleteProperty = async (req, res) => { }


export {
    getAllProperies,
    getPropertyDetail,
    createProperty,
    updateProperty,
    deleteProperty
}
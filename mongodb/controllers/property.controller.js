import mongoose from "mongoose";
import UserModel from "../models/user.js";
import PropertyModel from "../models/property.js";
import { v2 as cloudinary } from "cloudinary";
import {
  cloudinaryApiKey,
  cloudinaryApiSecret,
  cloudinaryName,
} from "../../enviroment.js";

cloudinary.config({
  cloud_name: cloudinaryName,
  api_key: cloudinaryApiKey,
  api_secret: cloudinaryApiSecret,
  secure: true,
});

const getAllProperies = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    title_like = "",
    propertyType = "",
  } = req.query;

  const query = {};
  if (propertyType) {
    query.propertyType = propertyType;
  }
  if (title_like) {
    query.title = { $regex: title_like, $options: "i" };
  }

  try {
    const count = await PropertyModel.countDocuments({ query });
    const properties = await PropertyModel.find(query)
      .limit(_end)
      .skip(_start)
      .sort({ [_sort]: _order });
    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");
    res.status(200).send(properties);
  } catch (error) {
    res.status(500).send(error);
  }
};

const getPropertyDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const property = await PropertyModel.findOne({ _id: id }).populate(
      "creator"
    );
    if (property) {
      res.status(200).send(property);
    }
    res.status(404).send({ message: "Property not found" });
  } catch (error) {
    res.status(500).send(error);
  }
};

const createProperty = async (req, res) => {
  try {
    const { title, description, price, location, photo, propertyType, email } =
      req.body;

    const session = await mongoose.startSession();
    session.startTransaction();

    const user = await UserModel.findOne({ email }).session(session);
    if (!user) throw new Error("User not found");

    const photoUrl = await cloudinary.uploader.upload(photo);

    const newProperty = await PropertyModel.create({
      title,
      price,
      propertyType,
      description,
      location,
      photo: photoUrl.url,
      photoId: photoUrl.public_id,
      creator: user._id,
    });
    user.allProperties.push(newProperty._id);
    await user.save({ session });
    await session.commitTransaction();
    res.status(200).send("Property created successfully");
  } catch (error) {
    res.status(500).send(error);
  }
};
const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req)
    const { title, description, price, location, photo, propertyType, email } =
      req.body;
    const photoUrl = (await cloudinary.uploader.upload(photo)).url;
    await PropertyModel.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        price,
        location,
        photo: photoUrl || photo,
        photoId: photoUrl.public_id,
        propertyType,
        email,
      }
    );
    res.status(200).send("Property updated");
  } catch (error) {
    res.status(500).send(error);
  }
};
const deleteProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const propertyToDelete = await PropertyModel.findOne({ _id: id }).populate(
      "creator"
    );
    if (!propertyToDelete) throw new Error("Property not found");
    const session = await mongoose.startSession();
    session.startTransaction();
    cloudinary.uploader
      .destroy(propertyToDelete.photoId)
      .then(() => console.log("deleted"));
    propertyToDelete.deleteOne({ session });
    propertyToDelete.creator.allProperties.pull(propertyToDelete);
    await propertyToDelete.creator.save({ session });
    await session.commitTransaction();
    res.status(200).send({ message: "Property delete successfully" });
  } catch (error) {
    res.status(500).send(error);
  }
};

export {
  getAllProperies,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty,
};

import {
  findToken,
  generateToken,
  saveToken,
  validateRefreshToken,
} from "../../helpers/tokenHelper.js";
import bcrypt from "bcrypt";

import { userDTO } from "../../helpers/userDTO.js";
import UserModel from "../models/user.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}).limit(req.query._end);
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};

const googleLogin = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    const userExists = await UserModel.findOne({ email });

    if (userExists) return res.status(200).send(userDTO(userExists));

    const newUser = await UserModel.create({
      name,
      email,
      avatar,
      pass: "google",
    });
    res.status(200).send(userDTO(newUser));
  } catch (error) {
    res.status(500).send(error);
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, avatar, pass = "" } = req.body;
    const userExist = await UserModel.findOne({ email });
    if (userExist) {
      const { accessToken, refreshToken } = generateToken({
        email,
        name,
      });
      saveToken(userExist._id, refreshToken);
      res.status(200).send({ ...userDTO(userExist), accessToken });
    }

    const hashPass = await bcrypt.hash(pass, 5);

    const newUser = await UserModel.create({
      name,
      email,
      avatar,
      pass: hashPass,
    });
    const { accessToken, refreshToken } = generateToken({
      email,
      name,
    });
    saveToken(newUser._id, refreshToken);
    res.setCookie("refreshToken", refreshToken, {
      maxAge: 2592000,
      httpOnly: true,
    });
    res.status(200).send({ ...userDTO(newUser), accessToken });
  } catch (error) {
    return res.status(500).send(error);
  }
};
const login = async (req, res) => {
  try {
    const { email, pass, name, avatar } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(401).send("User not found");
    }
    const checkPass = await bcrypt.compare(pass, user.pass);
    if (!checkPass) {
      res.status(401).send("Incorrect password");
    }
    const { accessToken, refreshToken } = generateToken({
      email,
      name,
    });
    saveToken(user._id, refreshToken);
    res.setCookie("refreshToken", refreshToken, {
      maxAge: 2592000,
      httpOnly: true,
    });
    res.status(200).send({ ...userDTO(user), accessToken });
  } catch (error) {
    return res.status(500).send(error);
  }
};
const refresh = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      res.status(401).send("User not found");
    }
    const userData = validateRefreshToken(refreshToken);
    const isTokenInDb = await findToken(refreshToken);
    if (!userData || !isTokenInDb) {
      res.status(401).send("Unautorized");
    }
    const user = await UserModel.findOne({ email: userData.email });
    const { email, name, avatar } = userData;
    const newUserToken = generateToken({ email, name });
    saveToken(user._id, newUserToken.refreshToken);
    res.setCookie("refreshToken", newUserToken.refreshToken, {
      maxAge: 2592000,
      httpOnly: true,
    });
    const { accessToken } = newUserToken;
    res.status(200).send({ ...userDTO(user), accessToken });
  } catch (e) {
    return res.status(500).send(error);
  }
};

const getUserInfoById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await UserModel.findOne({ _id: id }).populate("allProperties");
    if (user) {
      const { allProperties } = user;
      res.status(200).send({ ...userDTO(user), allProperties });
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send(error);
  }
};

export { getAllUsers, createUser, getUserInfoById, googleLogin, refresh, login };

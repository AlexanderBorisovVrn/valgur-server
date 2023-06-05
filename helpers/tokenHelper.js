import jwt from "jsonwebtoken";
import TokenModel from "../mongodb/models/token.js";
import { accessTokenSycret, refreshTokenSycret } from "../enviroment.js";

export const generateToken = (payload) => {
  const accessToken = jwt.sign(payload, accessTokenSycret, { expiresIn: "5m" });
  const refreshToken = jwt.sign(payload, refreshTokenSycret, {
    expiresIn: "30d",
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const saveToken = async (userId, refreshToken) => {
  const token = await TokenModel.findOne({ user: userId });
  if (token) {
    token.refreshToken = refreshToken;
    token.save();
  }

  const newUserToken = await TokenModel.create({
    user: userId,
    refreshToken,
  });
  return newUserToken;
};

export const validateRefreshToken = (token) => {
  try {
    const data = jwt.verify(token, refreshTokenSycret);
    return data;
  } catch (error) {
    return null;
  }
};
export const validateAccessToken = (token) => {
  try {
    const data = jwt.verify(token, accessTokenSycret);
    return data;
  } catch (error) {
    return null;
  }
};

export const findToken =async (refreshToken)=>{const token = await TokenModel.findOne({refreshToken});return token}

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    const validUser = await User.findOne({ email }).select("+password");
    if (!validUser) {
      return next(errorHandler(400, "User not found or password is incorrect"));
    }
    const isMatch = bcrypt.compareSync(password, validUser.password);
    if (!isMatch) {
      return next(errorHandler(400, "User not found or password is incorrect"));
    }
    const { password: pass, ...userWithoutPassword } = validUser._doc;

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
      })
      .json({
        success: true,
        message: "User logged in successfully",
        data: userWithoutPassword,
      });
  } catch (error) {
    next(error);
  }
};
export const signUp = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    next(errorHandler(400, "All fields are required"));
  }

  try {
    const hashPassword = bcrypt.hashSync(password, 10);

    const user = await User.create({ username, email, password: hashPassword });
    //remove password
    const { password: pass, ...userWithoutPassword } = user._doc;

    res.status(201).json({
      sucuess: true,
      message: "User created successfully",
      datat: userWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

export const signUp = async (req, res, next) => {
  const { userName, email, password } = req.body;

  // Hash the the plain Password
  const hashedPassword = bcryptjs.hashSync(password, 10);

  // Create new User
  const newUser = new User({ userName, email, password: hashedPassword });

  // Save the Newly Created User
  try {
    await newUser.save();

    res.status(201).json("User created Successfully!");
  } catch (error) {
    next(error);
  }
};
export const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Find the User
    const validUser = await User.findOne({ email });

    if (!validUser) return next(errorHandler(404, "User Not Found"));

    // Check its Password
    const validPassword = bcryptjs.compareSync(password, validUser.password);

    if (!validPassword) return next(errorHandler(401, "Wrong Credentials!"));

    // Create Token
    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);

    // Leave Password
    const { password: pass, ...restUserInfo } = validUser._doc;

    // Response
    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(restUserInfo);
  } catch (error) {
    next(error);
  }
};

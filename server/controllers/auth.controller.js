import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

// User Register Controller
export const signUp = async (req, res, next) => {
  const { userName, email, password } = req.body;

  // Hash the the   plain Password
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

// User SignIn Controller
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

    // Separate the Password
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

// User SignOut Controller
export const signOut = async (req, res, next) => {
  try {
    res.clearCookie("access_token");

    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      const { password: pass, ...restUserInfo } = user._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(restUserInfo);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      const FullName =
        req.body.name.split(" ").join("").toLowerCase() +
        Math.random().toString(36).slice(-8);

      const newUser = new User({
        userName: FullName,
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);

      const { password: pass, ...restUserInfo } = newUser._doc;

      res
        .cookie("access_token", token, { httpOnly: true })
        .status(200)
        .json(restUserInfo);
    }
  } catch (error) {
    next(error);
  }
};

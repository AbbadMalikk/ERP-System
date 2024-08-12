import User from "../models/userModel.js"
import generateTokenAndSetCookies from "../utils/helpers/generateTokenAndSetCookies.js";
import mongoose from "mongoose";

const googleLogin = async (req, res) => {
    const { email, username } = req.body;
  
    try {
      let user = await User.findOne({ email, username });
  
      if (!user) {
        user = new User({ email,username });
        await user.save();
      }

      generateTokenAndSetCookies(user._id, res);
  
       res.status(200).json(user);
    //    res.status(200).json({
    //         _id: user._id,
    //         email: user.email,
    //         username: user.username
    //     });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

const signupUser = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const user = await User.findOne({ $or: [{ email }, { username }] });

        if (user) {
            return res.status(400).json({ error: "User already exists." });
        }

        const newUser = new User({
            email,
            username,
            password,
        });
        await newUser.save();

        if (newUser) {
            generateTokenAndSetCookies(newUser._id, res);
            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                username: newUser.username
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in signupUser:", err.message);
    }
};

const loginUser = async (req, res) => {
    try {
        const { password, email } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) return res.status(400).json({ error: "Invalid username or password" });

        generateTokenAndSetCookies(user._id, res);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            username: user.username
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
        console.log("Error in loginUser: ", err.message);
    }
};

const logoutUser = async (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 1 });
        res.status(200).json({
            message: "User Logged out successfully! "
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log("Error in logoutUser: ", error.message);
    }
};
export{signupUser,loginUser,logoutUser,googleLogin}
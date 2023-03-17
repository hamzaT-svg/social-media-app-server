import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

import User from "../model/user.js";

// signUp
export const signUp = async (req, res) => {
  const { firstName, lastName, email, password, confirmPassword } = req.body;
  try {
    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({ message: "User Already Exist" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords dont match" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      name: `${firstName} ${lastName}`,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { email: result.email, id: result._id },
      "testedSecret",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ result, token });
  } catch (err) {
    res.status(500).json({ message: "Something Wrong!" });
  }
};

// signIn
export const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: "User does not Exist" });
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentials" });
    }

    const token = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      "testedSecret",
      {
        expiresIn: "1h",
      }
    );

    res.status(200).json({ result: existingUser, token });
  } catch (err) {
    res.status(500).json({ message: "Something Wrong!" });
  }
};

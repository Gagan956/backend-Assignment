import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import 'dotenv/config'  


const generatedToken  = (id) => {
  return jwt.sign({id} , process.env.JWT_SECRET)
}
export const Register = async () => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(404).json({
        success: false,
        message: "Please provide all required fields",
      });
    }
    const ExistingUser = await User.findOne({ email });
    if (!ExistingUser) {
      return res.status(404).json({
        success: false,
        message: "User already exists",
      });
    }
    const passwordhash = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: passwordhash,
      role: role || "user",
    });

const token  = generatedToken(user._id)
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxage: 7 *24 * 60 * 60 * 1000, // 7 day
    });
     res.status(201).json({
      success: true,
      meassge: "user create successfully",
      data: {
        id: user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
     res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

//login controller

export const Login = async () => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        success: false,
        message: "Email and password must be wrong",
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: true,
        message: "invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({
        success: false,
        message: "invalid email or password",
      });
    }
  const token  = generatedToken(user._id)

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxage: 24 * 60 * 60 * 1000, // 1 day
    });

    return res.status(201).json({
      success: true,
      message: "user login successfully",
      data: {
        id: user_id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);
     res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

// logout controller

export const Logout = async (req, res) => {
  try {
    res.clearCookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
    });
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      message: "user data",
      data: user,
    });
  } catch (error) {
    console.log(error);
     res.status(500).json({
      success: false,
      message: "Internal Server error",
    });
  }
};

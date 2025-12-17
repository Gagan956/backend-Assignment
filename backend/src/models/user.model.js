
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    eum: ["admin", "agent", "user"],
    default: "user",
  },
},
{timestamps: true})



const User = mongoose.model("User", userSchema)

export default User;

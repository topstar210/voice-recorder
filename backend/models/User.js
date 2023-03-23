import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

// user role
export const USER_TYPES = {
  ADMIN: "admin",
  USER: "user",
};

const userSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    name: String,
    pin_code: String,
    username: String,
    email: String,
    password: String,
    refresh_token: String,
    role: String,
    filePwd: String,
    isShowRemoved: Boolean
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export default mongoose.model("User", userSchema);
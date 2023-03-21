import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const fileSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: () => uuidv4().replace(/\-/g, ""),
    },
    name: String,
    pinCode: String,
  },
  {
    timestamps: true,
    collection: "users",
  }
);

export default mongoose.model("File", fileSchema);
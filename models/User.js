import mongoose from "mongoose";
import { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    img: {
      type: String,
      default: "",
    },
  },

  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", UserSchema);

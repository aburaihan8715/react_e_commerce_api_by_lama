import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const ProductSchema = new Schema(
  {
    title: { type: String, required: true, unique: true },
    desc: { type: String, required: true },
    img: { type: String },
    // img: {
    //   type: Buffer,
    //   contentType: String,
    // },
    categories: { type: Array },
    size: { type: Array },
    color: { type: Array },
    price: { type: Number, required: true },
    cost: { type: Number, required: true },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Product =
  mongoose.models.Product || mongoose.model('Product', ProductSchema);

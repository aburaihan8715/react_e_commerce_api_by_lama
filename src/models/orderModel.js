import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const OrderSchema = new Schema(
  {
    userId: { type: String, required: true },
    products: [
      {
        productId: {
          type: String,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],
    costAmount: { type: Number, required: true },
    amount: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

export const Order =
  mongoose.models.Order || mongoose.model('Order', OrderSchema);

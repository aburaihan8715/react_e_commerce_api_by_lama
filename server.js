import mongoose from 'mongoose';

import { app } from './src/app.js';
import { mongodbAtlasUri, serverPort } from './src/config/secret.js';

// database connection
mongoose
  .connect(mongodbAtlasUri)
  .then(() => {
    console.log('Db is connected');
    mongoose.connection.on('error', (error) => {
      console.log('Db connection error', error);
    });
  })
  .catch((error) => {
    console.log('Db connection failed', error);
    process.exit(1);
  });

// server running
app.listen(serverPort, () => {
  console.log(`Server running at http://localhost:${serverPort}`);
});

/*
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

import { authRoute } from "./routes/auth.js";
import { userRoute } from "./routes/user.js";
import { productRoute } from "./routes/product.js";
import { cartRoute } from "./routes/cart.js";
import { orderRoute } from "./routes/order.js";
import { stripeRoute } from "./routes/stripe.js";
import { seedRoute } from "./routes/seed.js";

const app = express();
const serverPort = process.env.SERVER_PORT || 5001;

// database connection
mongoose
  .connect(process.env.MONGODB_ALIAS_URI)
  .then(() => {
    console.log("Db is connected");
  })
  .catch((error) => {
    console.log("Db connection error" + error);
  });

// middlewares
app.use(express.json());
app.use(cors());

app.use("/api/seed", seedRoute);

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

// server running
app.listen(serverPort, () => {
  console.log(`Server running at http://localhost:${serverPort}`);
});
*/

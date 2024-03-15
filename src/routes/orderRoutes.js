import express from 'express';

import * as orderController from '../controllers/orderController.js';

const router = express.Router();

// ALIAS ROUTES
router.get(
  '/new-5',
  orderController.aliasNewOrders,
  orderController.getAllOrders
);

router.get('/myOrders', orderController.getMyOrders);
router.get('/income', orderController.getMonthlyIncome);

router
  .route('/')
  .post(orderController.createOrder)
  .get(orderController.getAllOrders);
router
  .route('/:id')
  .get(orderController.getOrder)
  .put(orderController.updateOrder)
  .delete(orderController.deleteOrder);

export { router as orderRouter };
/*
import express from "express";
import { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } from "./verifyToken.js";
import { Order } from "../models/Order.js";

const router = express.Router();

//CREATE
// TODO: have to (verifyToken)
router.post("/", async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    res.status(200).json({ status: "success", message: "order created!", data: savedOrder });
  } catch (err) {
    res.status(500).json({ status: "error", message: "server error" + err });
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({ status: "success", message: "order updated!", data: updatedOrder });
  } catch (err) {
    res.status(500).json({ status: "error", message: "server error" + err });
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({ status: "success", message: "order updated!", data: deletedOrder });
  } catch (err) {
    res.status(500).json({ status: "error", message: "server error" + err });
  }
});

// GET USER ORDERS
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json({ status: "success", message: "orders returned!", data: orders });
  } catch (err) {
    res.status(500).json({ status: "error", message: "server error" + err });
  }
});

// GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json({ status: "success", message: "orders returned!", data: orders });
  } catch (err) {
    res.status(500).json({ status: "error", message: "server error" + err });
  }
});

// GET MONTHLY INCOME
// TODO: have to (verifyTokenAndAdmin)
router.get("/income", async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { productId } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },

      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    res.status(200).json({ status: "success", message: "income returned!", data: income });
  } catch (err) {
    res.status(500).json({ status: "error", message: "server error" + err });
  }
});

export { router as orderRoute };
*/

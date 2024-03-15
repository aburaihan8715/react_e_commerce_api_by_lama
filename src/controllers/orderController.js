import { Order } from '../models/orderModel.js';

// ALIAS
// NOTE: if query same make alias else make features
const aliasNewOrders = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-createdAt';
  next();
};

// CREATE ORDER
const createOrder = async (req, res, next) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).json({
      status: 'success',
      data: savedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL ORDERS
const getAllOrders = async (req, res, next) => {
  try {
    // BUILD QUERY
    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Order.find(JSON.parse(queryStr));

    // 2) searching
    if (req.query.search) {
      const search = req.query.search || '';
      const searchRegexp = new RegExp(`.*${search}.*`, 'i');

      const queryBySearch = {
        $or: [
          { status: { $regex: searchRegexp } },
          { email: { $regex: searchRegexp } },
        ],
      };
      query = query.find(queryBySearch);
    }

    // 3) Sorting
    if (req.query.sort) {
      const sortedBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortedBy);
    } else {
      query = query.sort('-createdAt');
    }

    // 4) Field limiting
    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v -updatedAt');
    }

    // 5) pagination
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 100;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);

    if (req.query.page) {
      const numOrders = await User.countDocuments();
      if (skip >= numOrders)
        throw createError(404, 'This page does not exist!');
    }

    // EXECUTE QUERY
    const orders = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: orders.length,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// GET A ORDER
const getOrder = async (req, res, next) => {};

// UPDATE A ORDER
const updateOrder = async (req, res, next) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      status: 'success',
      data: updatedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE A ORDER
const deleteOrder = async (req, res, next) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: deletedOrder,
    });
  } catch (error) {
    next(error);
  }
};

// GET MY ORDERS
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json({
      status: 'success',
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// GET MONTHLY INCOME
const getMonthlyIncome = async (req, res, next) => {
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const prevMonth = new Date(date.setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      { $match: { createdAt: { $gte: prevMonth } } },
      {
        $project: {
          month: { $month: '$createdAt' },
          sales: '$amount',
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$sales' },
        },
      },
    ]);

    res.status(200).json({
      status: 'success',
      data: income,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createOrder,
  getAllOrders,
  getOrder,
  updateOrder,
  deleteOrder,
  getMyOrders,
  getMonthlyIncome,
  aliasNewOrders,
};

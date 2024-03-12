import { Product } from '../models/productModel.js';

// ALIAS
// NOTE: if query same make alias else make features
const aliasNewProducts = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-createdAt';
  next();
};

// CREATE
const createProduct = async (req, res, next) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(201).json({
      status: 'success',
      data: savedProduct,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL PRODUCT
const getAllProducts = async (req, res, next) => {
  try {
    // BUILD QUERY
    // 1A) Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields', 'search'];
    excludeFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    let query = Product.find(JSON.parse(queryStr));

    // 2) searching
    if (req.query.search) {
      const search = req.query.search || '';
      const searchRegexp = new RegExp(`.*${search}.*`, 'i');

      const queryBySearch = {
        $or: [
          { title: { $regex: searchRegexp } },
          { categories: { $regex: searchRegexp } },
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
      const numProducts = await Product.countDocuments();
      if (skip >= numProducts)
        throw createError(404, 'This page does not exist!');
    }

    // EXECUTE QUERY
    const products = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: products.length,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// GET PRODUCT
const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json({ status: 'success', data: product });
  } catch (error) {
    next(error);
  }
};

// UPDATE PRODUCT
const updateProduct = async (req, res, next) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      status: 'success',
      data: updatedProduct,
    });
  } catch (error) {
    next(error);
  }
};
// DELETE PRODUCT
const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({
      status: 'success',
      data: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
};

export {
  createProduct,
  getAllProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  aliasNewProducts,
};

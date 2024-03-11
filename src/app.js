import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import createError from 'http-errors';

import { userRouter } from './routes/userRoutes.js';
import { cartRouter } from './routes/cartRoutes.js';
import { orderRouter } from './routes/orderRoutes.js';
import { productRouter } from './routes/productRoutes.js';
import { authRouter } from './routes/authRotes.js';
import { stripeRouter } from './routes/stripeRoutes.js';

export const app = express();

// MIDDLEWARES
app.use(morgan('dev'));
app.use(express.json({ limit: '10kb' }));
app.use(cors());

// ROUTES
app.use('/api/v1/users', userRouter);
app.use('/api/v1/carts', cartRouter);
app.use('/api/v1/orders', orderRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/stripe', stripeRouter);

// HANDLE UNHANDLED ROUTES
app.all('*', (req, res, next) => {
  return next(
    createError(404, `Can not find ${req.originalUrl} on this server`)
  );
});

// HANDLE ERROR GLOBALLY
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = 'error';
  err.message = err.message || 'Something went wrong';

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});

// =============end===========

import mongoose from 'mongoose';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { mongodbAtlasUri } from '../../config/secret.js';
import { Product } from '../../models/productModel.js';
import { User } from '../../models/userModel.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

// READ PRODUCTS JSON FILE
const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
);

// IMPORT PRODUCTS DATA INTO DB
const importProductsData = async () => {
  try {
    await Product.create(products);
    console.log(`Data successfully loaded!`);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// DELETE ALL PRODUCTS DATA FROM COLLECTION
const deleteProductsData = async () => {
  try {
    await Product.deleteMany();
    console.log(`Data successfully deleted!`);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// READ USERS JSON FILE
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

// IMPORT USERS DATA INTO DB
const importUsersData = async () => {
  try {
    await User.create(users);
    console.log(`Data successfully loaded!`);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

// DELETE ALL USERS DATA FROM COLLECTION
const deleteUsersData = async () => {
  try {
    await User.deleteMany();
    console.log(`Data successfully deleted!`);
  } catch (error) {
    console.log(error);
  }
  process.exit();
};

if (process.argv[2] === '--importProductsData') {
  importProductsData();
} else if (process.argv[2] === '--deleteProductsData') {
  deleteProductsData();
} else if (process.argv[2] === '--importUsersData') {
  importUsersData();
} else if (process.argv[2] === '--deleteUsersData') {
  deleteUsersData();
}

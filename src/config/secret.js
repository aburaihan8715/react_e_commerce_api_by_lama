import 'dotenv/config';

const serverPort = process.env.SERVER_PORT || 5001;
const mongodbLocalUri = process.env.MONGODB_LOCAL_URI;
const mongodbAtlasUri = process.env.MONGODB_ATLAS_URI;
const jwtSecretForAccessToken = process.env.JWT_SECRET_FOR_ACCESS_TOKEN;
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

export {
  serverPort,
  mongodbLocalUri,
  jwtSecretForAccessToken,
  stripeSecretKey,
  mongodbAtlasUri,
};

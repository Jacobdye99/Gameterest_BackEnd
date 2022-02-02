import mongoose from "mongoose";

const db = mongoose.connect;
let MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb://127.0.0.1:27017/Gameterest';

export const initMongoServer = () => {
  try {
    db(MONGODB_URI).catch(error => {
      throw error
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error(error);
    throw error
  };
};

import logger from "../../../../../logger.js";
import config from "../../../../../config.js";
import mongoose from 'mongoose';

const DbConfig = {
    uri: config.MONGO_URI,
};

const connectDB = (async () => {
    try {
      await mongoose.connect(DbConfig.uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log("Connected !!")
      logger.info("MongoDB connected");
    } catch (error) {
      logger.error("Database connection failed!", error);
      console.log("Failed !!")
      process.exit(1);
    }
  })();

export default connectDB;

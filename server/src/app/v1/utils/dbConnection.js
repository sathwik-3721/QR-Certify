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
      logger.info("MongoDB connected");
    } catch (error) {
      logger.error("Database connection failed!", error);
      process.exit(1);
    }
  })();

export default connectDB;

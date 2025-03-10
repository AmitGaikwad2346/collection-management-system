const mongoose = require("mongoose");

const connectDB = async () => {
  const dbName = process.env.MONGO_DB || "collectionDB";
  const mongoURI =
    process.env.MONGO_URI + "/" + dbName ||
    `mongodb://mongo_db:27017/${dbName}`;
  console.log("Connecting to MongoDB:", mongoURI);

  try {
    await mongoose.connect(mongoURI, {
      autoIndex: true,
    });
    console.log(`MongoDB connected: ${mongoURI}`);
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;

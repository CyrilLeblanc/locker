import mongoose from "mongoose";

const USERNAME = process.env.MONGO_USERNAME;
const PASSWORD = process.env.MONGO_PASSWORD;
const HOST = process.env.MONGO_HOST;
const PORT = process.env.MONGO_PORT;
const DB_NAME = process.env.MONGO_DB_NAME;

mongoose.connect(`mongodb://${USERNAME}:${PASSWORD}@${HOST}:${PORT}/`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((error) => {
  console.error("Error connecting to MongoDB:", error);
});

const db = mongoose.connection;

export default db;
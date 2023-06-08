
import mongoose from "mongoose";
import ENV from "../config.js";

async function connect() {
  mongoose.set("strictQuery", true);

  try {
    await mongoose.connect(ENV.URL_MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    });

    console.log("Database Connected");
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw error;
  }
}

export default connect;

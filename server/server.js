import express from "express";
import cors from "cors";
import morgan from "morgan";
import connect from "./database/conn.js";
import router from "./router/route.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");
app.use(express.urlencoded({ extended: true }));

const PORT = 8080;

// API Routes
app.use("/api", router);

// Home Route
app.get("/", (req, res) => {
  res.status(201).json("home");
});

// Start the server only when a valid connection is established
connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Invalid database connection...");
  });

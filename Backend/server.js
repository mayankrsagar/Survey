import cors from "cors";
import { config } from "dotenv";
import express from "express";

import connectDB from "./db/config.js";
import errorHandler from "./middlewares/errorHandler.js";
import surveyRoutes from "./routes/surveyRoutes.js";
import userRoutes from "./routes/userRoutes.js";

config();
const app = express();
const PORT = process.env.PORT || 5000;

// global middlewares
app.use(cors());
app.use(express.json());

// DB
connectDB();

// routes

app.use("/", userRoutes);
app.use("/", surveyRoutes);

// 404 catcher
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// centralised error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

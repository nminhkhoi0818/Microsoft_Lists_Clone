import express from "express";
import bodyParser from "body-parser";
import listRoutes from "./routes/listRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";
import cors from "cors";
import { connect } from "./db";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());

app.disable("x-powered-by");

app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/lists", listRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

connect()
  .then(() => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error);
  });

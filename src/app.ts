import express from "express";
import bodyParser from "body-parser";
import listRoutes from "./routes/listRoutes";
import templateRoutes from "./routes/templateRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger";

const app = express();
app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/lists", listRoutes);
app.use("/api/templates", templateRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

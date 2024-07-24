import express from "express";
import bodyParser from "body-parser";
import listRoutes from "./routes/listRoutes";

const app = express();
app.use(bodyParser.json());

app.use("/api/lists", listRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

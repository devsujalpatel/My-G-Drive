import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

// routes

import fileRoutes from "./routes/file.routes.js"
import dirRoutes from "./routes/directory.routes.js"

app.use("/file", fileRoutes)
app.use("/folder", dirRoutes)


app.listen(4000, () => {
  console.log(`Server Started`);
});

import express from "express";
import userRoutes from "./routes/user.js";
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { buildAdminJs } from "./config/setup.js";

const app = express();
dotenv.config();

app.use(express.json());

//Routes
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/order", orderRoutes);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    await buildAdminJs(app)
    const port = process.env.PORT;

    app.listen(port, "0.0.0.0", (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`Server started on http://localhost:${port}/admin`);
      }
    });
  } catch (error) {
    console.error("error starting server ->", error);
  }
};

start();

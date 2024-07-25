const express = require("express");
const app = express();

const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect");

const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");

const prodCategoryRouter = require("./routes/prodCategoryRoute");

const bodyParser = require("body-parser");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
dotenv.config();

dbConnect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan("tiny"));

app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/prodCategory", prodCategoryRouter);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

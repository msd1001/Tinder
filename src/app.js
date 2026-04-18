const express = require("express");
const app = express();
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
require("./utils/cronjob.js");

// Backend should know about frontend domain
// and to set token inside cookie in browser we need to provide different options object (origin and credientials) in cors. part-01
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // credentials ki spelling etc correct hona chayiee nhi to error aayega
  }),
);
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(process.env.PORT, () => {
      console.log("Server is Successfully running at 7777....*");
    });
  })
  .catch((error) => {
    console.error("Database cannot be connected");
  });

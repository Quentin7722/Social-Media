const express = require("express");
const helmet = require("helmet");
const app = express();
const cors = require("cors");
const threadRoute = require("./routes/thread");
const userRoute = require("./routes/user");
const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
  });

app.use(cors());
app.use(limiter);
app.use(helmet());
app.use(express.json());


app.use("/user", userRoute);

app.use("/thread",threadRoute);

module.exports = app;
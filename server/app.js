const express = require("express");
const app = express();
const cors = require("cors");
const threadRoute = require("./routes/thread");
const userRoute = require("./routes/user");

app.use(cors());
app.use(express.json());


app.use("/user", userRoute);

app.use("/thread",threadRoute);

module.exports = app;
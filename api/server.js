const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
require("dotenv").config();
const fs = require("fs");
// app
const app = express();

//db
mongoose
  .connect(process.env.DATABASE, {})
  .then(() => console.log("DB connected"))
  .catch((err) => {
    console.log("no database connect");
    console.log("DB Error => ", err);
  });

//middleware
app.use(morgan("dev")); // color output
app.use(bodyParser.json({ limit: "2mb" }));

//routes middleware
fs.readdirSync("./routes").map((r) =>
  app.use("/api", require("./routes/" + r))
);
//route

//port
const port = process.env.port || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

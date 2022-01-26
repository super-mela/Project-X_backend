const express = require("express");
var bodyParser = require("body-parser");
var fileUpload = require("express-fileupload");
const cors = require("cors");
const app = express();
const path = require('path')

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use("/sourcefile", express.static(path.join(__dirname, 'photo/customer/profile')));
//import Route
app.use(cors());
const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");

//middelware
app.use("/api/user", authRoute);
app.use("/api/posts", postRoute);
// app.use(express.json());

const port = 9093;
app.listen(port, () => console.log("Server Running on port " + port));

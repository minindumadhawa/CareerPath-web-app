const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use("/",(req, res, next) => {
    res.send("It is Working");
})

mongoose.connect("mongodb+srv://admin:e6ZvsW0yABwfoCmd@cluster0.hohby0x.mongodb.net/")
.then(() => console.log("Connected to MongoDB"))
.then(() => {
    app.listen(5000);
})
.catch((err)=> console.log((err)));
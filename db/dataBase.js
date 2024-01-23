const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const url = process.env.DB_CONNECTION_STRING;
mongoose.connect(url);
const db = mongoose.connection;
var session;
db.on("error", () => {
    console.log("err");
});

db.once("open", async () => {
    session = await mongoose.startSession();
    console.log("Successful connection to Mongodb database");
});

module.exports = {db,session};

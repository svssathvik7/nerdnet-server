import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
const url = process.env.DB_CONNECTION_STRING;
mongoose.connect(url);
const db = mongoose.connection;
db.on("error",()=>{console.log("err")});
db.once("open",()=>{console.log("Successfull connection to Mongodb database")});
export default db;
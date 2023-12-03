import dotenv from "dotenv";
dotenv.config();
import db from "./db/dataBase.js";
import auth from "./routes/authentication.js";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/api/auth/",auth)

app.listen(3500,()=>{
    console.log("Server running!");
})
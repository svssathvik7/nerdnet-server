const dotenv = require("dotenv");
dotenv.config();
const db = require("./db/dataBase.js");
const auth = require("./routes/authentication.js");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth/", auth);

app.listen(3500, () => {
    console.log("Server running!");
});

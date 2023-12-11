const dotenv = require("dotenv");
dotenv.config();
const db = require("./db/dataBase.js");
const authRoute = require("./routes/authentication.js");
const postRoute = require("./routes/postRouting.js");
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth/", authRoute);
app.use("/api/posts",postRoute);

app.listen(3500, () => {
    console.log("Server running!");
});

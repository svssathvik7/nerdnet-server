const dotenv = require("dotenv");
dotenv.config();
const mongoose = require("mongoose");
const url = process.env.DB_CONNECTION_STRING;

let sessionPromise;
let db;

const initializeDb = async () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(url);
        db = mongoose.connection;

        db.on("error", (err) => {
            console.error("MongoDB connection error:", err);
            reject(err);
        });

        db.once("open", async () => {
            sessionPromise = mongoose.startSession();
            await sessionPromise;
            console.log("Successful connection to MongoDB database");
            resolve();
        });
    });
};

initializeDb();

module.exports = {
    db: () => db,
    getSession: () => sessionPromise,
};
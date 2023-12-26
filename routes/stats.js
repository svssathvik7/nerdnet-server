const express = require("express");
const router = express.Router();
const {sendAllUsers} = require("../controllers/statistics");

router.get("/getAllUserDetails/",sendAllUsers);

module.exports = router;
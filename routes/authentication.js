const express = require("express");
const userRegistration = require("../controllers/userRegistration.js");
const userValidation = require("../controllers/userValidation.js");
const router = express.Router();

router.post("/newUser", userRegistration);
router.post("/login", userValidation);

module.exports = router;

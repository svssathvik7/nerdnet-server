import express from "express";
import userRegistration from "../controllers/userRegistration.js";
import userValidation from "../controllers/userValidation.js";
const router = express.Router();
router.post("/newUser",userRegistration);
router.post("/login",userValidation);
export default router;
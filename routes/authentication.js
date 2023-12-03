import express from "express";
import userRegistration from "../controllers/userRegistration.js";
const router = express.Router();
router.post("/newUser",userRegistration);
export default router;
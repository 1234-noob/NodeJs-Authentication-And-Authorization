const express = require("express");
const {authMiddleware} = require("../middleware/auth-middleware")
const router = express.Router();
const {homeWelcome} = require("../controllers/home-controller")




router.get("/welcome",authMiddleware,homeWelcome)
 
module.exports = router;
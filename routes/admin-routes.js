const {adminDashboard} = require("../controllers/admin-controller")
const express = require("express");
const {authMiddleware} = require("../middleware/auth-middleware");
const { isAdminUser } = require("../middleware/admin-middleware");
const router = express.Router();

router.get("/admin-dashboard",authMiddleware,isAdminUser,adminDashboard)



module.exports = router
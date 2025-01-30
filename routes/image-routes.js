const express  = require("express");
const { authMiddleware} = require("../middleware/auth-middleware");
const {isAdminUser} = require("../middleware/admin-middleware");
const {uploadImage , fetchImages , imageDelete} = require("../controllers/image-controller");
const uploadMiddleware = require("../middleware/upload-middleware")
const router = express.Router();

//upload images url
router.post("/upload",authMiddleware,isAdminUser,uploadMiddleware.single("image"),uploadImage)


//to get all images

router.get("/",authMiddleware,fetchImages)


//delete image
router.delete("/:id",authMiddleware,isAdminUser,imageDelete)



module.exports = router 
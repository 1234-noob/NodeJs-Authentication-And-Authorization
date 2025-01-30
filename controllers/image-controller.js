const Image = require("../models/image");
const {uploadToCloudinary} = require("../helpers/cloudinaryHelper");
const fs  = require("fs");
const cloudinary = require("../config/cloudinary");

const uploadImage = async (req,res) => {
    try {
        //check if file is missing in req body
        if(!req.file){
            return res.status(400).json({
                success:false,
                message:"Image is required"
            })
        }
//upload to cloudinary 
const {url,publicId} = await uploadToCloudinary(req.file.path);
//store the img url and public id in Db
const newLyUploadedImage = await Image.create({
    url,
    publicId,
    uploadedBy: req.userInfo.userId,
})
//delete the file from local storage
fs.unlinkSync(req.file.path);
res.status(200).json({
    success:true,
    message:"Image uploaded successfully",
    image:newLyUploadedImage
})


    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong",
            data:error
        })
    }
}

//image fetcher controller

const fetchImages = async (req,res) => { 
    
    try {
        
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 2;
        const skip = (page -1) * limit;
        
        const sortBy = req.query.sortBy || "createdAt";
        const sortOrder = req.query.sortOrder || "asc" ? 1 : -1;
        const totalImages = await Image.countDocuments({});
        const totalPages = Math.ceil(totalImages/limit);
        const sortObj = {};
        sortObj[sortBy] = sortOrder;
      
        const images = await Image.find().sort(sortObj).skip(skip).limit(limit)
        if(images){
            res.status(200).json({
                success:true,
                currentPage:page,
                sortBy:sortBy,
                totalPages: totalPages,
                totalImages:totalImages,
                data:images,
                message:"Images fetched successfully",  })
        }
    } catch (error) {
        res.status(500).json({
            success:false,
            message:"Something went wrong",
            data:error
        })
    }

  }

//Delete image controller

const imageDelete = async (req,res) => {
    try{
        const getCurrentId = req.params.id;
        const userId = req.userInfo.userId;

        const image = await Image.findById(getCurrentId);
        if(!image){
            return res.status(400).json({
                success:false,
                message:"Image not found"
            })
        }
        //check if this image is uploaded by current user
        if(image.uploadedBy.toString() !== userId){
            return res.status(403).json({
                success:false,
                message:"You are not authorized to delete this image"
            })
        }
        //delete the image from cloudinary storage
        await cloudinary.uploader.destroy(image.publicId);

        //delete the image from db
        await Image.findByIdAndDelete(getCurrentId);
        res.status(200).json({
            success:true,
            message:"Image deleted successfully"
        })

        }
    
        


    
    catch(error){
        res.status(500).json({
            success:false,
            message:"Something went wrong",
            data:error
        })
    }
}


module.exports = {uploadImage , fetchImages , imageDelete}
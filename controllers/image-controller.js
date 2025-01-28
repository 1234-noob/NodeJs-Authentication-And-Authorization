const Image = require("../models/image");
const {uploadToCloudinary} = require("../helpers/cloudinaryHelper");
const fs  = require("fs");

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
        const images = await Image.find({})
        if(images){
            res.status(200).json({
                success:true,
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


module.exports = {uploadImage , fetchImages}
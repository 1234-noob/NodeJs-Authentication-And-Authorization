require("dotenv").config();
//import bcrypt 
//import jsonwebtoken
const bcrypt = require("bcrypt")
const User = require("../models/user");
const jwt = require("jsonwebtoken")

//register controller
const registerUser = async (req,res) =>{
  
    try {
        //extract user information from our request body    
        const {username,password,email,role} = req.body;
      

        //check if user already exists in our database
        const checkExistingUser = await User.findOne({
            $or:[{username},{email}]})
       if(checkExistingUser){
        return res.status(400).json({
            success:false,
            message:"User already exists! Please login"
        })
       }
       //hasing the password 
       const salt = await bcrypt.genSalt(10);
       const hashedPassword = await bcrypt.hash(password,salt);
       
       //creating a new user and saving DB
       const newlyCreatedUser = await User({
        username,
        email,
        password:hashedPassword,
        role : role || "user"
       })
       await newlyCreatedUser.save();

       if(newlyCreatedUser){
        res.status(201).json({
            success:true,
            message:"User registeration successful"
        })
       }else{
        res.status(400).json({
            success:false,
            message:"User registeration failed"
        })
       }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Some error occured! Please try again"

        })
    }
}

//login controller 

const loginUser = async (req,res) =>{
    try {
        //extract user info from request body
        const {username,password} = req.body;

        //check if username exist in our database
        const checkUserExistence = await User.findOne({username});
        
        if(!checkUserExistence){
            return res.status(400).json({
                success:false,
                message:"Username or password are invalid"
            })
        }
      

        //check if password is entered or not
        if(!password){
            return res.status(400).json({
                success:false,
                message:"Password is required"
            })
        }
        
        //check if password is correct or not

        const isPasswordCorrect = await bcrypt.compare(password,checkUserExistence.password);
        if(!isPasswordCorrect){
            return res.status(400).json({
                success:false,
                message:"Username or password are invalid"
            })
        }
        
        //creation of user token
        const accessToken = jwt.sign({
            userId: checkUserExistence._id,
            username: checkUserExistence.username,
            role: checkUserExistence.role

        },process.env.JWT_SECRET_KEY,{
            expiresIn:"60m",
            algorithm:"HS256"
        })

        res.status(200).json({
            message:"Login successful",
            success:true,
            accessToken
        })
        } catch (error) {
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Some error occured! Please try again"

        })
    }
}

module.exports = {registerUser,loginUser}
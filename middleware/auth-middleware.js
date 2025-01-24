//for decoding of token JWT is required
require("dotenv").config();
const jwt = require("jsonwebtoken");

const authMiddleware = (req,res,next) => {
    //getting token from header
    const authHeader = req.headers["authorization"];
  //Splitting token got from header
    const token = authHeader && authHeader.split(" ")[1];
    //Providing error if token is not provided
    if(!token){
        return res.status(401).json({
            success:false,
            message:"Access denied! No token provided. Please login to continue"
        })

    }
    //decoding the token
    try {

        const decodedTokenInfo = jwt.verify(token,process.env.JWT_SECRET_KEY); 
        //passing decode token info to request so it can be used in middleware
        req.userInfo = decodedTokenInfo;
        next();
        
    } catch (error) {
        return res.status(401).json({
            success:false,
            message:"Access denied! No token provided. Please login to continue",
            error
        })
        
    }
   
}




module.exports = {authMiddleware}
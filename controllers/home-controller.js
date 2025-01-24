const homeWelcome = async (req,res) =>{
    const{username,role,userId} = req.userInfo
    
    try {
        res.status(200).json({
            success:true,
            message:"Welcome to home page",
            user:{
                _id:userId,
                username,
                role
            }
        })
        
    } catch (e) {
        res.status(400).json({
            success:false,
            message:"Something went wrong",
            data:e
        })
        
    }
};

module.exports = {homeWelcome};
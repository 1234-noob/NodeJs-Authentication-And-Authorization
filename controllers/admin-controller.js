const adminDashboard = async (req,res) =>{
  
    
    try {
        res.status(200).json({
            success:true,
            message:"Welcome to Admin Dashboard",
            
        })
        
    } catch (e) {
        res.status(400).json({
            success:false,
            message:"Something went wrong",
            data:e
        })
        
    }
};

module.exports = {adminDashboard};
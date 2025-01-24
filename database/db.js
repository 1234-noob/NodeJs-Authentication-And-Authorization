require("dotenv").config();

const mongoose = require('mongoose');

const connectToDb = async () => {  
    try{
        await mongoose.connect(process.env.URI)
        .then(() =>{
            console.log("MongoDb connected sucessfully")
        })
        
    }
    catch(error) {
        console.log("MongoDb connection failed",error);
        process.exit(1)
        
}}


module.exports = connectToDb;
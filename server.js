require("dotenv").config();


const express = require("express");
const app = express();
const connectToDb = require("./database/db");

const authRoutes = require("./routes/auth-routes");
const homeRoutes = require("./routes/home-routes");
const adminRoutes = require("./routes/admin-routes");
const port = process.env.PORT || 3000;

//connecting to database
connectToDb();


//using middleware 
app.use(express.json());



//use of router
app.use("/api/auth",authRoutes);

//use of Home router
app.use("/api/home",homeRoutes);

//use of Admin router
app.use("/api/admin",adminRoutes);







app.listen(port, () =>{
    console.log(`Server is running on port ${port}`)
});
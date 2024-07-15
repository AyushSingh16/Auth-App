const mongoose = require('mongoose');

require("dotenv").config();

exports.connect = () =>{
    mongoose.connect((process.env.DATABASE_URL),{
        useNewUrlParser:true,
        useUnifiedTopology:true
    })
    .then(()=>{
        console.log("Database connected successfully!");
    })
    .catch((err)=>{
        console.log("Database connection issues");
        console.error(err);
        process.exit(1);
    });
}
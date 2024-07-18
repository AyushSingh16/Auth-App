// auth, isStudent, isAdmin

const jwt = require("jsonwebtoken");
require("dotenv").config();


exports.auth = async (req,res,next) => {                        
    
    try {
        
        //extract the jwt token             Can be extracted by 3 ways:header of jwt,cookie, req.body
        const token = req.body.token;       //req.body.token || cookie.token || jwt.header.token

        if(!token){
            return res.status(401).json({
                success:false,
                message:"Token missing",
            });
        }

        //verifying the token
        try {
          
            const payload = jwt.verify(token,process.env.JWT_SECRET); 
            console.log(payload);

            req.user = payload;          //to check the authenticity


        } catch(error){
            return res.status(401).json({
                success: false,
                message:"Token is invalid!", 
            });
        }

        next();

    } catch (error) {
            return res.status(401).json({
                success:false,
                message:"Something went wrong, while verifying the token!",
            });
    }

};




exports.isStudent = async (req,res,next) => {
    try {

        if(req.user.role !== "Student"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for student!",
            });
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role is not matching",
        });
    }
}


exports.isAdmin = async(req,res,next) => {
    try {
        if(req.user.role !== "Admin"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for Admin!",
            });
        }
        next();

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"User role is not matching",
        });
    }
}
const bcrypt = require("bcrypt");

const User = require("../models/user");

//signup route handler
exports.signup = async(req,res)=>{
    try{

        //fetching all the data from req body
        const {name,email,password,role}= req.body;

        //if user already exist
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists!", 
            });
        }

        //secure password
        let hashedPassword;
        try{

            //2 arguments are passed in hash function: 1) value to be hashed 2) number of rounds
            hashedPassword = await bcrypt.hash(password,10);

        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:"Error in Hashing Password!",
            });
        }
            // check how to apply retry strategy if the password failed at the first stage of hashing

        //create entry for user
        const user = await User.create({
            name,email,password:hashedPassword,role,
        });

        return res.status(200).json({
            success:true,
            message:"User created successfully",
        });

    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered! Please try again later.",
        });
    }
}
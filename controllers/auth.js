const bcrypt = require("bcrypt");

const User = require("../models/user");

const jwt = require("jsonwebtoken");

require("dotenv").config();

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


//login

exports.login = async (req,res) => {
    try{
        const {email,password} = req.body;

        //validation on email and password

        if(!email || !password)
        {
            return res.status(400).json({
                success:false,
                message:"Please fill all the details carefully!",
            });
        }

        //checking if user is registered or not ==> dbcall

        let user = await User.findOne({email});
         
        // if not a registered user
        if(!user){
            return res.status(401).json({
                success:false,
                message:'User is not registered!',
            });
        }

        const payload = {
            email:user.email,
            id:user._id,
            role:user.role,
        };

        //verify password and generate a JWT token
        if(await bcrypt.compare(password,user.password)){

            //if password match =>login
            let token = jwt.sign(payload,
                                process.env.JWT_SECRET,
                                {
                                    expiresIn:"2hrs",
                                });

            user.token = token;
            user.password = undefined;

            const options = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly:true,
            };

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user, 
                message:"User Logged In successfully!",
            });


        }
        else{

            //password do not match
            
            return res.status(403).json({
                success:false,
                message:"Password incorrect!",
            });
        }

    }
    catch(err)
    {
        console.log(err);
        return res.status(500).json({
            success:false,
            message:"Login failure!",
        });
    }
}
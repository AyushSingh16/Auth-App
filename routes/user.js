const express = require("express");
const router = express.Router();

const {login, signup} = require("../controllers/auth");
const {auth, isStudent, isAdmin} = require("../middlewares/auth");
// const { model } = require("mongoose");

router.post("/login",login);
router.post("/signup",signup);


//protected routes => can only be accessed by verified person

router.get("/test",auth,(req,res)=>{
    res.json({                                                  //auth will check if the person's entry is in db(authentication), isStudent will check the role
        success:true,
        message:"Welcome to the protected route for test!",
    });
});


router.get("/student", auth, isStudent, (req,res) => {          //path, middlewares, callback functions
    res.json({                                                  //auth will check if the person's entry is in db(authentication), isStudent will check the role
        success:true,
        message:"Welcome to the protected route for students!",
    });
});

router.get("/admin", auth, isAdmin, (req,res) => {
    res.json({                                                  //auth will check if the person's entry is in db(authentication), isStudent will check the role
        success:true,
        message:"Welcome to the protected route for admin!",
    });
});


module.exports = router;


 
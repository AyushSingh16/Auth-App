const express = require("express");
const router = express.Router();

const {login,signup} = require("../controllers/auth");
// const { model } = require("mongoose");

router.post("/login",login);
router.post("/signup",signup);


module.exports = router;


 
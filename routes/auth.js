const router = require('express').Router();
const User = require('../models/User');
const {registerValidation} = require('./validation');
const {loginValidation} = require('./validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register',async (req,res)=>{
    //Validate data entered by the user before registering them to the database
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message)
    
    //Check if user already in database
    const emailExist = await User.findOne({email:req.body.email});
    if(emailExist) return res.status(400).send('Email already exists');

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password,salt);

    //Create new User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    });
    //Save new User
    try{
        const savedUser = await user.save();
        res.send({user:user._id});
    }catch(err){
        res.status(400).send(err);
    }
});

router.post('/login',async(req,res)=>{

    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    
    //Email validation
    const user = await User.findOne({email:req.body.email});
    if(!user) return res.status(400).send('Email does not exist');

    //Password validation
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Incorrect password');

    //Create and assign a token
    const token = jwt.sign({_id:user._id},process.env.SECRET_TOKEN);
    res.header('auth-token',token).send(token);

    res.send('Logged in!');



});


module.exports = router;
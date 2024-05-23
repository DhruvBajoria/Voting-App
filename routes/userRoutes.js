const express = require('express');
const router = express.Router();
const User = require('./../models/user');
const {jwtAuthMiddleware,generateToken} = require('./../jwt');

router.post('/signup',async(req,res,)=>{
      try{
            const data = req.body;
            const newUser = new User(data);
            const response = await newUser.save();
            console.log('data Saved');
            const payload={
                  id:response.id
            }
            const token = generateToken(payload);
            // console.log("token is : ",token);
            res.status(201).json({response:response,token:token});
      }catch(err){
            console.log(err);
            res.status(500).json({error:"Internal Server Error"});
      }
});

//login

router.post('/login',async(req,res)=>{
      try{
            const {aadharCardNumber,password} = req.body;
            const user = await User.find({aadharCardNumber:aadharCardNumber});
            if(!user || !(await user.comparePassword(password)))
            return res.status(401).json({message:"Invalid aadhar or password"});

            const payload ={
                  id:user.id
            }
            const token = generate(payload);
            console.log('Token is :',token);
            res.status(200).json({token:token});
      }catch(err){
            console.log(err);
            res.status(500).json({error:"Internal Server Error"});
      }
});

router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
      try{
            const userData = req.user;
            console.log(userData);
            const userId = userData.user.id;
            const user = await User.findById(userId);
            res.status(200).json({user:user});

      }catch(err){
            console.log(err);
            res.status(500).json({error:"Internal Server Error"});
      }
});

router.put('/profile/password',async(req,res)=>{
      try{
            const userData = req.user;
            console.log(userData);
            const userId = userData.user.id;
            const {currentPassword, newPassword} = req.body;
            const user = await User.findById(userId);
      if(!(await user.comparePassword(currentPassword))){
            return res.status(401).json({error:"Invalid username o password"});
      }

      //update the password
      user.password = newPassword;
      await user.save();
      console.log("password updated");
      res.status(200).json({message:"Password Updated"});

      }catch(err){
            console.log(err);
            res.status(500).json({error:"Internal Server Error"});
      }
});

module.exports = router;
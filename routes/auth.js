const router=require('express').Router();
const User=require('../models/Users')
var bcrypt = require('bcryptjs');
/************************Register user */
router.post('/register',async(req,res,next)=>{
   try{
    let {username,email,password}=req.body;
    const object={username,email}
    object.password=await bcrypt.hash(password,10);
    const userSchema=new User(object);
    let user=await userSchema.save()
    res.status(201).json({
       success:true,
       user
    })
   }catch(err){
    res.status(500).json(err)
   }
})

/*********************user login  */
router.post('/login',async(req,res)=>{
   const {email,password}=req.body;
   try{
      let user=await User.findOne({email});
      !user&& res.status(404).json({
         success:false,
         msg:"user not found!"
      })
      let savedPassword=await bcrypt.compare(password,user.password)
      if(savedPassword){
         res.status(200).json({
            success:true,
            msg:"User login successfully!",
            user
         })
      }else{
         res.status(200).json({
            success:true,
            msg:"User creadientils not matched!"
         })
      }
   }catch(err){
      res.status(500).json(err)
   }
})






module.exports=router
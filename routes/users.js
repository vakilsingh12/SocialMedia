const router=require('express').Router();
const bcrypt=require('bcryptjs')
const User=require('../models/Users')

/*****************************update user */
router.put('/:id',async(req,res)=>{
    if(req.body.userId==req.params.id||req.body.isAdmin){
    if(req.body.password){
    try{
        let user=await User.findById(req.params.id);
        user.password=await bcrypt.hash(req.body.password,10)
        user.desc=req.body.desc;
        let newUser=await user.save(); 
        res.status(201).json({
            success:true,
            newUser
        })
    }catch(err){
        return res.status(500).json(err)
    }
    }
    }else{
        return res.status(400).json("You can update only your account")
    }
})

/**********************************delete user */
router.delete('/:id',async(req,res)=>{
    try{
        const deleteUser=await User.findByIdAndRemove(req.params.id);
        res.status(200).json({
            msg:'User deleted successfully!',
            deleteUser
        })
    }catch(err){
        return res.status(200).json(err)
    }
})
/**********************************get user */
router.get('/:id',async(req,res)=>{
    try{
       const user=await User.findById(req.params.id);
       const {password,updatedAt,...other}=user._doc
       res.status(200).json({
        success:true,
        other
       })
    }catch(err){
        return res.status(500).json(err)
    }
})

/********************************follow user */
router.put('/:id/follow',async(req,res)=>{
    if(req.body.userId!==req.params.id){
    try{
        const user=await User.findById(req.params.id);
        const Currentuser=await User.findById(req.body.userId); //curentuser follow kr rh hai user ko
        if(!user.followers.includes(req.body.userId)){
        await user.updateOne({$push:{followers:req.body.userId}})
        await Currentuser.updateOne({$push:{following:req.params.id}})
        res.status(201).json({
            success:true,
            msg:"User has been follwed"
        })
        }else{
            res.status(403).json("You alreday follow this user")
        }

    }catch(err){
        res.status(500).json(err)
    }
    }else{
        res.status(403).json("you cann't follow yourself")
    }
})
router.put('/:id/unfollow',async(req,res)=>{
    if(req.body.userId!==req.params.id){
    try{
        const user=await User.findById(req.params.id);
        const Currentuser=await User.findById(req.body.userId);
        if(user.followers.includes(req.body.userId)){
        await user.updateOne({$pull:{followers:req.body.userId}})
        await Currentuser.updateOne({$pull:{following:req.params.id}})
        res.status(201).json({
            success:true,
            msg:"User has been unfollwed"
        })
        }else{
            res.status(403).json("You alreday unfollow this user")
        }

    }catch(err){
        res.status(500).json(err)
    }
    }else{
        res.status(403).json("you cann't unfollow yourself")
    }
})
module.exports=router
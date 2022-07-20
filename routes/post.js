const router=require('express').Router();
const Post=require('../models/Post')
const User=require('../models/Users')
/*****************************create post */
router.post('/',async(req,res)=>{
    const newPost=new Post(req.body)
    try{
        let post=await newPost.save();
        res.status(201).json({
            success:true,
            post
        })
    }catch(err){
        res.status(500).json({
            success:false,
            err
        })
    } 
})
/***************************update  post */
router.put('/:id',async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(post.userId==req.body.userId){
        await post.updateOne({$set:req.body})
        res.status(200).json({
            success:true,
            msg:"Post hasbeen updated"
        })
        }else{
            return res.status(403).json("You can update only your post")
        }
    }catch(err){
        return res.status(500).json(err)
    }
})
/***************************delete post */
router.delete('/:id',async(req,res)=>{
    try{
        const post=await Post.findById(req.params.id);
        if(post.userId==req.body.userId){
        await post.deleteOne();
        res.status(200).json({
            success:true,
            msg:"Post hasbeen deleted"
        })
        }else{
            return res.status(403).json("You can delete only your post")
        }
    }catch(err){
        return res.status(500).json(err)
    }
})
/************************************like post and dislike the post */
router.put('/like/:id',async(req,res)=>{
    try{
     const post=await Post.findById(req.params.id);
     if(post.userId!==req.body.userId){
     if(!post.likes.includes(req.body.userId)){
        await post.updateOne({$push:{likes:req.body.userId}})
        res.status(200).json('The post hasbeen liked')
     }else{
        await post.updateOne({$pull:{likes:req.body.userId}})
        res.status(200).json('The post hasbeen disliked')
     }
    }else{
        res.status(200).json('The posted user Can not like the post')
    }
    }catch(err){
        return res.status(500).json(err)
    }
})
/*****************************************get post */
router.get('/:id',async(req,res)=>{
    try{
     const post=await Post.findById(req.params.id);
     return res.status(200).json({
        success:true,
        post
     })
    }catch(err){
        return res.status(500).json(err)
    }
})

/**************************timeline  */
router.get('/timeline/all',async(req,res)=>{ //jisko m follow kr rha hu uski post aa jaye
    try{
     const currentUser=await User.findById(req.body.userId);
     const userPosts=await Post.find({userId:currentUser._id})
     const friendPost=await Promise.all(
        currentUser.following.map(friendId=>{
          return Post.find({userId:friendId})
        })
     )
     let posts=userPosts.concat(...friendPost)
     return res.status(200).json({ 
        success:true,
        posts
     })
    }catch(err){
        return res.status(500).json(err)
    }
})
module.exports=router
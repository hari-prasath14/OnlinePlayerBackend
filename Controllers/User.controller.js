import { createToken } from "../Middleware/authMiddleware.js";
import userModel from "../Models/user.Schema.js";
import bcrypt from 'bcrypt'
import mongoose from "mongoose";



export const resgisterUser = async(req,res) =>{
    try 
    {
        const {emailId,userName,password} = req.body

        const oldUser = await userModel.findOne({emailId})
        if(oldUser)
        {
            return res.status(2).send({success : false,cause: 'email', message : "EmailId is already registered"})
        }

        const alreadyUsedUserName = await userModel.findOne({userName})
        if(alreadyUsedUserName)
        {
            return res.status(409).send({success : false,cause: 'username', message : "Username is already exist"})
        }
        
        
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = new userModel({emailId,userName,password : hashedPassword})
        await newUser.save()
        res.status(200).send({success : true, message : "Successfully registered", newUser})
        
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({success : false, message : "error in registering"})
    }
}

export const loginUser = async(req,res) =>{
    try 
    {
        const {emailIdOrUserName,password} = req.body
        
        if(!emailIdOrUserName )
        {
            return res.status(201).send({success : false,cause: 'user', message : "Please enter user Id"})
        }

        if(!password){
            return res.status(201).send({success : false,cause: 'password', message : "Please enter password"})

        }

     

       

        const user = await userModel.findOne({
            $or: [{ userName: emailIdOrUserName }, { emailId: emailIdOrUserName }]
        })
            
        if(!user)
        {
            return res.status(201).send({success : false,cause: 'user', message : "user not found"})
        }
       
        
        
        const passwordMatch = await bcrypt.compare(password, user.password)

        if(!passwordMatch){
            
            return res.status(201).send({success : false,cause: 'password', message : "your password is incorrect"})
        }

        const token = createToken(user._id)
        
        res.status(200).send({success : true, message : "Login successfully",user ,token})

    } 
    catch (error) {
        console.log(error);
        res.status(500).send({success : false, message : "error in login"})
    }
}

// export const getAllUsers = async(req,res) =>{
//     try 
//     {
//         const allUsers = await userModel.find().select('-password -__v')
//         res.status(200).send({success : true,allUsers})

//     } 
//     catch (error) 
//     {
//         console.log(error);
//         res.status(500).send({success : false, message : "error in login"})
//     }    
// }

export const addAndRemoveLikedSong = async(req,res) =>{
    try 
    {
        const {newlikedarray} = req.body
        const User = req.user
        const allUsers = await userModel.findByIdAndUpdate(User.id,{
            likedSongs : newlikedarray
        })
        res.status(200).send({success : true})

    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).send({success : false, message : "error in login"})
    }    
}

export const getLikedSongs = async(req,res) =>{
    try 
    {
        const User = req.user
        const userLikedSongs = await userModel.findById(User._id).select('likedSongs').populate({
            path: 'likedSongs',
            populate: {
                path: 'artist',
                model: 'userModel'
            }
        })
        res.status(200).send({success : true,userLikedSongs})

    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).send({success : false, message : "error in login"})
    }    
}




export const addLikedPlaylist = async(req,res) =>{
    try {
        const { playlistId } = req.body; 
        const userId = req.user._id; 

        const updatedUser = await userModel.findByIdAndUpdate(userId, {
            $push: { likedPlaylists: playlistId }
        }, { new: true });
        
        res.status(200).send({ success: true, updatedUser });
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error in liking playlist" });
    }
}

export const removeLikedPlaylist = async(req,res) =>{
    try {
        const { playlistId } = req.body; 
        const userId = req.user._id; 
        const updatedUser = await userModel.findByIdAndUpdate(userId, {
            $pull: { likedPlaylists: playlistId }
        }, { new: true }); 

        res.status(200).send({ success: true, updatedUser });
    } catch (error) {
        console.log(error);
        res.status(500).send({ success: false, message: "Error in removing liked playlist" });
    }
}


export const getLikedPlaylists = async(req,res) =>{
    try 
    {
        const User = req.user
        const LikedPlaylistId = await userModel.findById(User._id).select('likedPlaylists')


        // .populate({
        //     path: 'likedPlaylists',
        //     populate: {
        //         path: 'songs',
        //         model: 'songModel'
        //     }
        // })
        res.status(200).send({success : true,LikedPlaylistId})

    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).send({success : false, message : "error in login"})
    }    
}

export const getLikedPlaylistsWithDetails = async(req,res) =>{
    try 
    {
        const User = req.user
        const LikedPlaylistId = await userModel.findById(User._id).select('likedPlaylists').populate({
            path: 'likedPlaylists',
            populate: {
                path: 'songs',
                model: 'songModel'
            }
        })
        res.status(200).send({success : true,LikedPlaylistId})

    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).send({success : false, message : "error in login"})
    }    
}
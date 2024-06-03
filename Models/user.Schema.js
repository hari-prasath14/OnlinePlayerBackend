import mongoose, { Types } from "mongoose";

const userSchema = mongoose.Schema({
    emailId:{
        type : String,
        required : true
    },
    userName:{
        type : String,
        required : true
    },
    password:{
        type : String,
        required : true
    },
    likedSongs:[   
    {
            type: mongoose.Types.ObjectId,
            ref: 'songModel'
    }],

    likedPlaylists:[
        {
            type: mongoose.Types.ObjectId,
            ref: 'playlistModel'
    }],
    subscribedArtists:{
        type : String,
        default : ""
    }

},{timestamps : true})


const userModel = mongoose.model('userModel',userSchema)

export default userModel
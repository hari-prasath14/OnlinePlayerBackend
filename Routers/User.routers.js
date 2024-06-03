import express from "express";
import {addAndRemoveLikedSong, addLikedPlaylist, getLikedPlaylists, getLikedPlaylistsWithDetails, getLikedSongs, loginUser, removeLikedPlaylist, resgisterUser } from "../Controllers/User.controller.js";
import { verifyToken } from "../Middleware/authMiddleware.js";

const router = express.Router()

router.post('/register-user',resgisterUser)
router.post('/login', loginUser)
router.post('/addorremovelikes', verifyToken,addAndRemoveLikedSong)
router.get('/getlikedsongs', verifyToken,getLikedSongs)
router.post('/addlikedplaylist',verifyToken,addLikedPlaylist)
router.post('/removelikedplaylist',verifyToken,removeLikedPlaylist)
router.get('/getlikedplaylist',verifyToken,getLikedPlaylists)
router.get('/getlikedplaylistwithdetails',verifyToken,getLikedPlaylistsWithDetails)

export default router

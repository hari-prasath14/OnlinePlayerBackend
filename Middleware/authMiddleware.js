import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../Models/user.Schema.js";

dotenv.config()

export const createToken = (id) => {
    const token = jwt.sign({id}, process.env.SECRETKEY)
    return token
}



export const verifyToken = async (req, res, next) => {

    const token = req.header('Authorization')

    if (token) 
    {
        try 
        {


            const decoded = jwt.verify(token, process.env.SECRETKEY)
            
            
            const user = await User.findById(decoded.id)



            if (user) {
                req.user = user

                next()
            }
            else {
                res.status(400).send({ success: false, message: "Please login again" })

            }

        }
        catch (error) 
        {
            return res.status(200).send({ success: false,message: "Invalid Token, Please login again", "err": error })
        }
    }
    
    else 
    {
        return res.status(200).send({  success: false,message: "no token ,Please Login Again" })
    }


}


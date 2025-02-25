import { User } from "../models/user.model"
import errResponse from "../utils/errResponse"
import jwt from "jsonwebtoken"

export const authMiddleware = async (req:any,res:any,next:any)=>{

    try {
        
          const {token}    = req.cookies
          const JWT_SECRET = process.env.JWT_SECRET as any 
      //  const token = req.header("Authorization").split[" "] req.header("Authorization") gives single header req.headers give all headers 

          if(!token){
            throw new errResponse("Unauthenticated",400)
          }

          const {_id} : any = jwt.verify(token,JWT_SECRET)

          if(!_id){
            throw new errResponse("Unauthenticated",400)
          }

          const user: any = await User.findById(_id)

          if(!user){
            throw new errResponse("User not found",400)
          }

          req.user = user
          next()
        
    } catch (error) {

        next(error)
    }

}

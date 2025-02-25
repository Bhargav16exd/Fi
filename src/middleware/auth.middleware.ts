import { User } from "../models/user.model"
import errResponse from "../utils/errResponse"
import jwt from "jsonwebtoken"

export const authMiddleware = async (req:any,res:any,next:any)=>{

    try {
        
          let {token} :any =""  
          const JWT_SECRET = process.env.JWT_SECRET as any 

          if(req.cookie?.token){
            token = req.cookies.token
          }
          else{
            token = req.header("Authorization").split(" ")[1]
          }
      
          if(!token){
            throw new errResponse("Unauthenticated",400)
          }

          const {id} : any = jwt.verify(token,JWT_SECRET)

          if(!id){
            throw new errResponse("Unauthenticated",400)
          }

          const user: any = await User.findById(id)

          if(!user){
            throw new errResponse("User not found",400)
          }

          req.user = user
          next()
        
    } catch (error) {

        next(error)
    }

}

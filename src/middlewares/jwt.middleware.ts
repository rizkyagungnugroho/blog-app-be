import { NextFunction, Request, Response } from "express"
import {TokenExpiredError, verify} from "jsonwebtoken";
import { ApiError } from "../utils/api-error";

export class JwtMiddleware {
    verifyToken= (secretKey: string) => {
        return (req: Request, res: Response, next: NextFunction) => {
            const token =  req.headers.authorization?.split("")[1];

            if(!token){
                throw new ApiError("No token provide", 401);
            }

            verify(token, secretKey, (err, payload) => {
                if(err) {
                    if(err instanceof TokenExpiredError){
                        throw new ApiError("Token expired",401);
                    
                    }else {
                        throw new ApiError("invalid Token",401);
                    }
                }

                res.locals.user=payload;
                next()
            });
        };
    };
}
import { sign, SignOptions } from "jsonwebtoken";

export class TokenService {
    generateToken = (payload: object, secretKey:string, option: SignOptions) => {
        return sign(payload,secretKey,option)
    };
}
import { Request, Response, NextFunction } from "express";
import { injectable } from "tsyringe";
import { AuthService } from "./auth.service";

@injectable()
export class AuthController {
  constructor(private authService: AuthService) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.login(req.body);
      res.status(201).send(result);
    } catch (error) {
      next(error);
    }
  };
}

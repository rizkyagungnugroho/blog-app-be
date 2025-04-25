import { Router } from "express";
import { injectable } from "tsyringe";
import { BlogController } from "./blog.controller";

@injectable()
export class BlogRouter {
  private router: Router;
  private blogController: BlogController;

  constructor(blogController: BlogController) {
    this.router = Router();
    this.blogController = blogController;
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/", this.blogController.getBlogs);
  };

  getRouter() {
    return this.router;
  }
}

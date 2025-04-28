import { Router } from "express";
import { injectable } from "tsyringe";
import { BlogController } from "./blog.controller";
import { JwtMiddleware } from "../../middlewares/jwt.middleware";
import { UploaderMiddleware } from "../../middlewares/uploader.middleware";
import { JWT_SECRET_KEY } from "../../config";
import { validateBody } from "../../middlewares/validation.middleware";
import { createBlogDTO } from "./dto/create-blog.dto";

@injectable()
export class BlogRouter {
  private router: Router;

  constructor(
    private blogController: BlogController,
    private jwtMiddleWare: JwtMiddleware,
    private uploaderMiddleware: UploaderMiddleware
  ) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get("/", this.blogController.getBlogs);
    this.router.get("/:slug", this.blogController.getBlogBySlug);

    this.router.post(
      "/",
      this.jwtMiddleWare.verifyToken(JWT_SECRET_KEY!),
      this.uploaderMiddleware.upload().fields([{ name: "thumbnail", maxCount: 1 }]),
      this.uploaderMiddleware.fileFilter([
        "image/jpeg",
        "image/avif",
        "image/png",
      ]),
      validateBody(createBlogDTO),
      this.blogController.createBlog
    );
  };

  getRouter() {
    return this.router;
  }
}

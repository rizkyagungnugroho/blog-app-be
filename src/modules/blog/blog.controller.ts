import { NextFunction, Response, Request } from "express";
import { injectable } from "tsyringe";
import { BlogService } from "./blog.service";
import { GetBlogsDTO } from "./dto/get-blogs.dto";
import { plainToInstance } from "class-transformer";
import { ApiError } from "../../utils/api-error";

@injectable()
export class BlogController {
  constructor(private blogService: BlogService) {}

  getBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = plainToInstance(GetBlogsDTO, req.query);
      const result = await this.blogService.getBlogs(query);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
  getBlogBySlug = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.blogService.getBlogBySlug(req.params.slug);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };


  createBlog = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const thumbnail = files.thumbnail?.[0];
      if (!thumbnail) throw new ApiError("Thumbnail is required", 400);

      const result = await this.blogService.createBlog(
        req.body,
        thumbnail,
        res.locals.user.id
      );

      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}

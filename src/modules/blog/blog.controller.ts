import { NextFunction, Response, Request } from "express";
import { injectable } from "tsyringe";
import { BlogService } from "./blog.service";
import { GetBlogsDTO } from "./dto/get-blogs.dto";
import { plainToInstance } from "class-transformer";

@injectable()
export class BlogController {
  private blogService: BlogService;

  constructor(BlogService: BlogService) {
    this.blogService = BlogService;
  }

  getBlogs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const query = plainToInstance(GetBlogsDTO,req.query);
      const result= await this.blogService.getBlogs(query);
      res.status(200).send(result);
    } catch (error) {
      next(error);
    }
  };
}
 
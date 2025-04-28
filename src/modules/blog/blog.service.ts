import { PrismaService } from "../prisma/prisma.service";
import { injectable } from "tsyringe";
import { GetBlogsDTO } from "./dto/get-blogs.dto";
import { Prisma } from "../../generated/prisma";
import { createBlogDTO } from "./dto/create-blog.dto";
import { CloudinaryService } from "../cloudinary/cloudinary.service";
import { ApiError } from "../../utils/api-error";
import { generateSlug } from "../../utils/generateUtils";

@injectable()
export class BlogService {
  private prisma: PrismaService;
  private cloudinaryService: CloudinaryService

  constructor(prismaService: PrismaService, CloudinaryService: CloudinaryService ) {
    this.prisma = prismaService;
    this.cloudinaryService= CloudinaryService;
  }

  getBlogs = async (query: GetBlogsDTO) => {
    const { page, take, sortBy, sortOrder, search } = query;

    const whereClause: Prisma.BlogWhereInput = {
      deletedAt: null,
    };

    if (search) {
      whereClause.title = {
        contains: search,
        mode: "insensitive", // typo fix
      };
    }

    const blogs = await this.prisma.blog.findMany({
      where: whereClause,
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * take,
      take,
      include: {user: {omit: {password: true }}}
    });

    const count = await this.prisma.blog.count({ where: whereClause });

    return {
      data: blogs,
      meta: {
        page,
        take,
        total: count,
      },
    };
  };

  createBlog= async (
    body: createBlogDTO,
    thumbnail: Express.Multer.File,
    authUserId: number
  ) => {

    const {title} = body;

    const blog= await this.prisma.blog.findFirst({
      where: {title},
    });

    if(blog) {
      throw new ApiError("Title already in use",400);
    }

    const slug= generateSlug(title);

    const {secureUrl} = await this.cloudinaryService.upload(thumbnail);

    return await this.prisma.blog.create({
      data:{
        ...body,
        thumbnail: secureUrl,
        userId: authUserId,
        slug
      },
    });
  };

};

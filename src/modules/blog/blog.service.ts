import { PrismaService } from "../prisma/prisma.service";
import { injectable } from "tsyringe";
import { GetBlogsDTO } from "./dto/get-blogs.dto";
import { Prisma } from "../../generated/prisma";

@injectable()
export class BlogService {
  private prisma: PrismaService;

  constructor(prismaService: PrismaService) {
    this.prisma = prismaService;
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
}

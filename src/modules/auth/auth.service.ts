import { injectable } from "tsyringe";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDTO } from "./dto/register.dto";
import { ApiError } from "../../utils/api-error";
import { PasswordService } from "./password.service";
import { LoginDTO } from "./dto/login.dto";
import { TokenService } from "./token.service";
import { JWT_SECRET_KEY } from "../../config";

@injectable()
export class AuthService {
  private prisma: PrismaService;
  private passwordService: PasswordService;
  private tokenService: TokenService;

  constructor(PrismaClient: PrismaService, PassswordService: PasswordService, TokenService: TokenService) {
    this.prisma = PrismaClient;
    this.passwordService = PassswordService;
    this.tokenService= TokenService;
  }

  register = async (body: RegisterDTO) => {
    const { name, email, password } = body;

    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError("email already exist", 401);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    const newUser = await this.prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
      omit: {
        password: true,
      },
    });

    return newUser;
  };

  login = async (body: LoginDTO) => {
    const { email, password } = body;

    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!existingUser) {
      throw new ApiError("User not found", 401);
    }

    const isPasswordValid = await this.passwordService.comparePassword(
      password,
      existingUser.password
    );

    if (!isPasswordValid) {
      throw new ApiError("Invalid credential", 400);
    }

    const accesToken=this.tokenService.generateToken(
      {id:existingUser.id}, // Payload: data yang akan dimasukkan ke dalam token, dalam hal ini ID user
      JWT_SECRET_KEY!, // Secret key untuk menandatangani token (pastikan aman dan tidak kosong)
      {expiresIn: "2h"} // Opsi: token akan kedaluwarsa dalam 2 jam
      
    );

    const {password: pw, ...userWithoutPassword}= existingUser;

    return {...userWithoutPassword, accesToken};
  };
}
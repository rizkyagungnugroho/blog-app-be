import { injectable } from "tsyringe";
import { PrismaService } from "../prisma/prisma.service";
import { RegisterDTO } from "./dto/register.dto";
import { ApiError } from "../../utils/api-error";
import { PasswordService } from "./password.service";
import { LoginDTO } from "./dto/login.dto";
import { TokenService } from "./token.service";
import {
  BASE_URL_FE,
  JWT_SECRET_KEY,
  JWT_SECRET_KEY_FORGOT_PASSWORD,
} from "../../config";
import { ForgotPasswordDTO } from "./dto/forgot-password.dto";
import { MailService } from "../mail/mail.service";
import { ResetPasswordDTO } from "./dto/reset-password.dto";

@injectable()
export class AuthService {
  private prisma: PrismaService;
  private passwordService: PasswordService;
  private tokenService: TokenService;
  private mailService: MailService;

  constructor(
    prisma: PrismaService,
    passwordService: PasswordService,
    tokenService: TokenService,
    mailService: MailService
  ) {
    this.prisma = prisma;
    this.passwordService = passwordService;
    this.tokenService = tokenService;
    this.mailService = mailService;
  }

  register = async (body: RegisterDTO) => {
    const { name, email, password } = body;

    const existingUser = await this.prisma.user.findFirst({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError("Email already exists", 401);
    }

    const hashedPassword = await this.passwordService.hashPassword(password);

    const newUser = await this.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const { password: _, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
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
      throw new ApiError("Invalid credentials", 400);
    }

    const accessToken = this.tokenService.generateToken(
      { id: existingUser.id },
      JWT_SECRET_KEY!,
      { expiresIn: "2h" }
    );

    const { password: _, ...userWithoutPassword } = existingUser;
    return { ...userWithoutPassword, accessToken };
  };

  forgotPassword = async (body: ForgotPasswordDTO) => {
    const { email } = body;

    const user = await this.prisma.user.findFirst({
      where: { email },
    });

    if (!user) {
      throw new ApiError("Invalid email address", 400);
    }

    const token = this.tokenService.generateToken(
      { id: user.id },
      JWT_SECRET_KEY_FORGOT_PASSWORD!,
      { expiresIn: "1h" }
    );

    const link = `${BASE_URL_FE}/reset-password/${token}`;

    await this.mailService.sendEmail(
      email,
      "Link Reset Password",
      "forgot-password",
      { name: user.name, resetLink: link, expiryTime: 1 }
    );

    return { message: "Send email success" };
  };

  resetPassword = async (body: ResetPasswordDTO, AuthUserId: number) => {
    const user= await this.prisma.user.findFirst({
      where: {id: AuthUserId},
    })

    if(!user) {
      throw new ApiError("Account not found", 400);
    }

    const hashedPassword= await this.passwordService.hashPassword(
      body.password
    );

    await this.prisma.user.update({
      where: {id:AuthUserId},
      data:{ password: hashedPassword},
    });

    return {message:"Reset Password succes"};
  }
}

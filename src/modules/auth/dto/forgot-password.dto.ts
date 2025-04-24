import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class ForgotPasswordDTO {


  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;


}

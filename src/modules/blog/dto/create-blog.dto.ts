import { IsEmail, IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class createBlogDTO {
  @IsNotEmpty()
  @IsString()
  readonly title!: string;
  
  @IsNotEmpty()
  @IsString()
  readonly description!: string;

  @IsNotEmpty()
  @IsString()
  readonly content!: string;

  @IsNotEmpty()
  @IsString()
  readonly category!: string;
  
  
  

}

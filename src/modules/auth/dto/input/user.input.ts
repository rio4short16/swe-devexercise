import { IsEmail, IsNotEmpty, IsString, ValidateNested } from 'class-validator';

export class RegisterUserInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class LoginUserInput {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

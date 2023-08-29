import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCredentialsInput {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @IsString()
  newPassword: string;
}

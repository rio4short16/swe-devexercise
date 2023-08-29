import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTodoInput {
  @IsNotEmpty()
  @IsString()
  task: string;

  @IsNotEmpty()
  @IsNumber()
  priorityLevel: number;
}

export class UpdateTodoInput {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  task: string;

  @IsNotEmpty()
  @IsNumber()
  priorityLevel: number;
}

export class DeleteTodoInput {
  @IsNotEmpty()
  @IsString()
  id: string;
}

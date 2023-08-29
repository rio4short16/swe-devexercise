import { User } from '@prisma/client';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { GenericResponse } from '@common/decorators/generic-response.decorator';
import { UserAuthGuard } from '@common/guards/user-auth.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { GenericResponseDto } from '@common/dto/generic-response.dto';
import { TodoService } from '../services/todo.service';
import { TodoMapper } from '../dto/mapper/todo.mapper';
import { TodoOutput } from '../dto/output/todo.output';

import {
  CreateTodoInput,
  DeleteTodoInput,
  UpdateTodoInput,
} from '../dto/input/todo.input';

@Controller('todo')
@UseGuards(UserAuthGuard)
@GenericResponse()
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getAllTodosByUserId(
    @CurrentUser() user: User,
  ): Promise<GenericResponseDto<TodoOutput[]>> {
    const todos = await this.todoService.getAllTodosByUserId(user?.id);
    return {
      data: TodoMapper.displayAll(todos),
    };
  }

  @Post('create')
  async createTodo(
    @CurrentUser() user: User,
    @Body() body: CreateTodoInput,
  ): Promise<GenericResponseDto<TodoOutput>> {
    const todo = await this.todoService.createTodo(user?.id, body);
    return {
      data: TodoMapper.displayOne(todo),
    };
  }

  @Patch('update')
  async updateTodo(
    @CurrentUser() user: User,
    @Body() body: UpdateTodoInput,
  ): Promise<GenericResponseDto<TodoOutput>> {
    const todo = await this.todoService.updateTodo(user?.id, body);
    return {
      data: TodoMapper.displayOne(todo),
    };
  }

  @Delete('delete')
  async deleteTodo(
    @CurrentUser() user: User,
    @Body() body: DeleteTodoInput,
  ): Promise<GenericResponseDto<string>> {
    return {
      data: await this.todoService.deleteTodo(user?.id, body),
    };
  }
}

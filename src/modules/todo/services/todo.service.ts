import { Todo } from '@prisma/client';
import { DatabaseService } from '@common/database/database.service';

import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';

import {
  CreateTodoInput,
  DeleteTodoInput,
  UpdateTodoInput,
} from '../dto/input/todo.input';

@Injectable()
export class TodoService {
  constructor(
    private readonly prisma: DatabaseService,
    private readonly i18n: I18nService,
  ) {}

  async findOneById(id: string): Promise<Todo> {
    return await this.prisma.todo.findUnique({
      where: { id },
    });
  }

  async findAll(): Promise<Todo[]> {
    return await this.prisma.todo.findMany({
      orderBy: {
        dateCreated: 'desc',
      },
    });
  }

  async getAllTodosByUserId(userId: string): Promise<Todo[]> {
    return await this.prisma.todo.findMany({
      where: {
        userId,
      },
      orderBy: {
        dateCreated: 'desc',
      },
    });
  }

  async createTodo(userId: string, data: CreateTodoInput): Promise<Todo> {
    return await this.prisma.todo.create({
      data: {
        ...data,
        userId,
        dateCreated: new Date(),
      },
    });
  }

  async updateTodo(userId: string, data: UpdateTodoInput): Promise<Todo> {
    const todo = await this.findOneById(data?.id);

    /* It will throw a NotFoundError once the todo record is not existing 
    from the database and its userId is not the same with the current user id */
    if (!todo || todo?.userId !== userId) {
      throw new NotFoundException(this.i18n.translate('todo.NOT_FOUND'));
    }

    return await this.prisma.todo.update({
      where: {
        id: todo?.id,
      },
      data: {
        task: data?.task,
        priorityLevel: data?.priorityLevel,
      },
    });
  }

  async deleteTodo(userId: string, data: DeleteTodoInput): Promise<string> {
    const todo = await this.findOneById(data?.id);

    /* It will throw a NotFoundError once the todo record is not existing 
    from the database and its userId is not the same with the current user id */
    if (!todo || todo?.userId !== userId) {
      throw new NotFoundException(this.i18n.translate('todo.NOT_FOUND'));
    }

    await this.prisma.todo.delete({
      where: {
        id: todo?.id,
      },
    });

    return 'Deleted successfully!';
  }
}

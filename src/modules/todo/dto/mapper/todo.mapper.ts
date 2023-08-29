import { Todo } from '@prisma/client';
import { TodoOutput } from '../output/todo.output';
import { UserMapper } from '@modules/user/dto/mapper/user.mapper';

export class TodoMapper {
  static displayOne(todo: Todo | any): TodoOutput {
    if (!todo) return undefined;

    return {
      id: todo?.id,
      task: todo?.task,
      priorityLevel: todo?.priorityLevel,
      dateCreated: todo?.dateCreated,
      lastUpdated: todo?.lastUpdated,
      user: todo?.user ? UserMapper.displayOne(todo?.user) : undefined,
    };
  }

  static displayAll(data: any[]): TodoOutput[] {
    if (!data || data.length <= 0) return [];

    return data.map((val) => this.displayOne(val));
  }
}

import { Module } from '@nestjs/common';
import { TodoController } from './controllers/todo.controller';
import { TodoService } from './services/todo.service';

@Module({
  imports: [],
  controllers: [TodoController],
  providers: [TodoService],
  exports: [TodoService],
})
export class TodoModule {}

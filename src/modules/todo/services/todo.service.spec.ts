import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { I18nService } from 'nestjs-i18n';
import { DeepMockProxy } from 'jest-mock-extended';

import { DatabaseService } from '@common/database/database.service';

import { PrismaClient, Todo } from '@prisma/client';
import { TodoService } from './todo.service';

describe('TodoService', () => {
  let service: TodoService;
  let prisma: DeepMockProxy<PrismaClient>;
  let i18n: I18nService;

  const mockPrisma = {
    todo: {
      findMany: () => Promise.resolve([]),
      findOne: () => Promise.resolve(MOCK_TODO),
      create: () => Promise.resolve(MOCK_TODO),
      update: () => Promise.resolve(MOCK_TODO),
      delete: () => Promise.resolve(MOCK_TODO),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        DatabaseService,
        {
          provide: I18nService,
          useValue: {
            translate: jest.fn(),
          },
        },
      ],
    })
      .overrideProvider(DatabaseService)
      .useValue(mockPrisma)
      .compile();

    service = module.get(TodoService);
    prisma = module.get(DatabaseService);
    i18n = module.get(I18nService);
  });

  it('TodoService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('DatabaseService should be defined', () => {
    expect(DatabaseService).toBeDefined();
  });

  it('I18nService should be defined', () => {
    expect(i18n).toBeDefined();
  });

  describe('getAllTodosByUserId execution', () => {
    it('should be defined', () => {
      expect(service.getAllTodosByUserId).toBeDefined();
    });

    it('will return all the tasks by the given userId', async () => {
      jest.spyOn(service, 'getAllTodosByUserId').mockResolvedValue([MOCK_TODO]);
      expect(
        await service.getAllTodosByUserId('cllrmsby90000kb6orfobo3ps'),
      ).toEqual([MOCK_TODO]);
    });
  });

  describe('createTodo execution', () => {
    it('should be defined', () => {
      expect(service.createTodo).toBeDefined();
    });

    it('will create task', async () => {
      jest.spyOn(service, 'createTodo').mockResolvedValue(MOCK_TODO);

      expect(
        await service.createTodo(MOCK_TODO.userId, {
          task: 'Study about NestJS',
          priorityLevel: 3,
        }),
      ).toEqual(MOCK_TODO);
    });
  });

  describe('updateTodo execution', () => {
    it('should be defined', () => {
      expect(service.updateTodo).toBeDefined();
    });

    it('throw an error if the given taskId is not existing from the database', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);

      try {
        await service.updateTodo(MOCK_TODO.userId, {
          id: MOCK_TODO.id,
          task: MOCK_TODO.task,
          priorityLevel: MOCK_TODO.priorityLevel,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('will update a task if there are no more conflicts', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(MOCK_TODO);
      jest.spyOn(service, 'updateTodo').mockResolvedValue(MOCK_TODO);

      expect(
        await service.updateTodo(MOCK_TODO.userId, {
          id: MOCK_TODO.id,
          task: MOCK_TODO.task,
          priorityLevel: MOCK_TODO.priorityLevel,
        }),
      ).toEqual(MOCK_TODO);
    });
  });
  describe('deleteTodo execution', () => {
    it('should be defined', () => {
      expect(service.deleteTodo).toBeDefined();
    });

    it('throw an error if the given taskId is not existing from the database', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);

      try {
        await service.deleteTodo(MOCK_TODO.userId, {
          id: MOCK_TODO.id,
        });
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('will delete a task if there are no more conflicts', async () => {
      const successMessage = 'Deleted successfully!';
      jest.spyOn(service, 'findOneById').mockResolvedValue(MOCK_TODO);
      jest.spyOn(service, 'deleteTodo').mockResolvedValue(successMessage);

      expect(
        await service.deleteTodo(MOCK_TODO.userId, {
          id: MOCK_TODO.id,
        }),
      ).toEqual(successMessage);
    });
  });
});

const MOCK_TODO = {
  id: 'cllrmsby90000kb6orfobo3ps',
  userId: 'cllvv4eqy0000kbdwlxt23e84',
  task: 'Eat my breakfast',
  priorityLevel: 3,
  dateCreated: new Date(),
  lastUpdated: new Date(),
};

// https://stackoverflow.com/questions/70228893/testing-a-nestjs-service-that-uses-prisma-without-actually-accessing-the-databas

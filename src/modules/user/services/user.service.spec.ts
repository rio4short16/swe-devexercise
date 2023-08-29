import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { I18nService } from 'nestjs-i18n';
import { DeepMockProxy } from 'jest-mock-extended';

import { UserService } from './user.service';
import { PrismaClient } from '@prisma/client';
import { DatabaseService } from '@common/database/database.service';
import { BcryptProvider } from '@common/providers/bcrypt.provider';

describe('UserService', () => {
  let service: UserService;
  let prisma: DeepMockProxy<PrismaClient>;
  let i18n: I18nService;

  const mockPrisma = {
    user: {
      findMany: () => Promise.resolve([]),
      findOne: () => Promise.resolve(MOCK_USER),
      create: () => Promise.resolve(MOCK_USER),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        DatabaseService,
        {
          provide: BcryptProvider,
          useValue: {
            generateHash: jest.fn(),
            validateHash: jest.fn(),
          },
        },
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
      //   .useValue(mockDeep<PrismaClient>())
      .compile();

    service = module.get(UserService);
    prisma = module.get(DatabaseService);
    i18n = module.get(I18nService);
  });

  it('UserService should be defined', () => {
    expect(service).toBeDefined();
  });

  it('DatabaseService should be defined', () => {
    expect(DatabaseService).toBeDefined();
  });

  it('I18nService should be defined', () => {
    expect(i18n).toBeDefined();
  });

  describe('fetchUserById execution', () => {
    it('should be defined', () => {
      expect(service.fetchUserById).toBeDefined();
    });

    it('throw an error if user is not found from the database.', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(null);
      try {
        await service.fetchUserById('cllrmsby90000kb6orfobo3ps');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });

    it('will user if there are no conflicts', async () => {
      jest.spyOn(service, 'findOneById').mockResolvedValue(MOCK_USER);
      expect(await service.fetchUserById('cllrmsby90000kb6orfobo3ps')).toEqual(
        MOCK_USER,
      );
    });
  });

  describe('createUser execution', () => {
    it('should be defined', () => {
      expect(service.createUser).toBeDefined();
    });

    it('will create user if there are no conflicts', async () => {
      expect(
        await service.createUser({
          email: 'rcarpio.webdev@gmail.com',
          password: '12345',
        }),
      ).toEqual(MOCK_USER);
    });
  });
});

const MOCK_USER = {
  id: 'cllrmsby90000kb6orfobo3ps',
  email: 'rcarpio.webdev@gmail.com',
  password: '12345',
  isActive: true,
  dateCreated: new Date(),
  lastUpdated: new Date(),
};

// https://stackoverflow.com/questions/70228893/testing-a-nestjs-service-that-uses-prisma-without-actually-accessing-the-databas

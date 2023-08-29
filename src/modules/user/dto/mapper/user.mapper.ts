import { User } from '@prisma/client';
import { UserOutput } from '../output/user.output';

export class UserMapper {
  static displayOne(user: User): UserOutput {
    if (!user) return undefined;

    return {
      id: user?.id,
      email: user?.email,
      isActive: user?.isActive,
      dateCreated: user?.dateCreated,
      lastUpdated: user?.lastUpdated,
    };
  }

  static displayAll(data: any[]): UserOutput[] {
    if (!data || data.length <= 0) return [];

    return data.map((val) => this.displayOne(val));
  }
}

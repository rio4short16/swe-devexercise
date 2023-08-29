import { compareSync, genSaltSync, hashSync } from 'bcrypt';

export class BcryptProvider {
  static generateHash(str: string): string {
    const salt = genSaltSync(10);
    const hashed = hashSync(str, salt);
    return hashed;
  }

  static validateHash(password: string, hashedPassword: string): boolean {
    return compareSync(password, hashedPassword);
  }
}

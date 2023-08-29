import { UserOutput } from '@modules/user/dto/output/user.output';

export class TodoOutput {
  id: string;
  task: string;
  priorityLevel: number;
  dateCreated?: Date;
  lastUpdated?: Date;
  user?: UserOutput;
}

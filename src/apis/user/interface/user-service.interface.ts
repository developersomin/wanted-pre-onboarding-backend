import { User } from '../entity/user.entity';

export interface IUserServiceIsApply {
  user: User;
}

export interface IUserServiceFindOne {
  userId: string;
}

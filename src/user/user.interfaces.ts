import { UserEmail } from '../email/email.types';

export type IUser = {
  id: string;
  name: string;
  status: Status;
  birthdate?: Date | null;
  emails?: UserEmail[];
};

export enum Status {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export type IAddUser = Omit<IUser, 'id'>;

export type UserId = IUser['id'];

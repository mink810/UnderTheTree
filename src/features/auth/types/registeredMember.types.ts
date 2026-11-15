import { MockMemberStatus } from '../data/loginUsers.mock';

export type RegisteredMember = {
  userId: string;
  password: string;
  email: string;
  phone: string;
  marketingOptIn: boolean;
  status: MockMemberStatus;
  createdAt: string;
};

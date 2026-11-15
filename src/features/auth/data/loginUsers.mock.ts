export type MockMemberStatus = 'active' | 'suspended' | 'withdrawn';

export type MockMember = {
  userId: string;
  password: string;
  status: MockMemberStatus;
  suspendReason?: string;
};

/** 로컬 목 로그인 계정 (demo / demo1234) */
export const MOCK_MEMBERS: MockMember[] = [
  {
    userId: 'demo',
    password: 'demo1234',
    status: 'active',
  },
  {
    userId: 'suspended',
    password: 'demo1234',
    status: 'suspended',
    suspendReason: '신고 누적으로 이용이 정지되었어요.',
  },
  {
    userId: 'withdrawn',
    password: 'demo1234',
    status: 'withdrawn',
  },
];

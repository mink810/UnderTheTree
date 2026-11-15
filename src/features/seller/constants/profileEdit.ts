export const PROFILE_MAX_PHOTOS = 8;
export const PROFILE_MAX_IMAGE_BYTES = 5 * 1024 * 1024;
export const PROFILE_INTRO_MIN = 10;
export const PROFILE_INTRO_MAX = 500;

export const MBTI_TYPES = [
  'ISTJ',
  'ISFJ',
  'INFJ',
  'INTJ',
  'ISTP',
  'ISFP',
  'INFP',
  'INTP',
  'ESTP',
  'ESFP',
  'ENFP',
  'ENTP',
  'ESTJ',
  'ESFJ',
  'ENFJ',
  'ENTJ',
] as const;

export type MbtiType = (typeof MBTI_TYPES)[number];
